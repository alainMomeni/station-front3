// src/page/gerant/GerantFacturationPage.tsx (FINAL, COMPLET ET COHÉRENT)
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiUsers, FiFileText, FiDollarSign, FiFilter, FiSearch, FiEdit3, FiEye, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

// Types et Données Mock (supposés corrects)
import type { ClientPourFacturation, TransactionCredit, FactureClient } from '../../types/facturation';
import { dummyClientsProData, dummyTransactionsCreditData, dummyFacturesClientData } from '../../_mockData/facturation';

// Écosystème de l'application
import Spinner from '../../components/Spinner';

// Composants UI et métier
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, type Column } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import StatutCompteBadge from '../../components/clients/StatutCompteBadge';
import StatutPaiementBadge from '../../components/facturation/StatutPaiementBadge';
import GenererFactureModal from '../../components/modals/GenererFactureModal';

type ActiveTab = 'comptesClients' | 'transactionsNonFacturees' | 'historiqueFactures';

// --- Définitions des colonnes pour les Tables (externalisées pour la clarté) ---
const getClientColumns = (onDetails: (c: ClientPourFacturation) => void, onEdit: (c: ClientPourFacturation) => void, onFacture: (c: ClientPourFacturation) => void): Column<ClientPourFacturation>[] => [
    { key: 'nom', title: 'Nom Entreprise', dataIndex: 'nomEntreprise', render: v => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'solde', title: 'Solde Dû', align: 'right', render: (_, r) => <span className="font-semibold text-orange-600">{r.soldeActuel.toLocaleString()} XAF</span> },
    { key: 'non_facture', title: 'À Facturer', align: 'right', render: (_, r) => <span className="font-medium text-blue-600">{r.montantNonFacture.toLocaleString()} XAF</span>},
    { key: 'limite', title: 'Limite Crédit', align: 'right', render: (_, r) => r.limiteCredit.toLocaleString() + ' XAF' },
    { key: 'statut', title: 'Statut', align: 'center', render: (_, r) => <StatutCompteBadge statut={r.statutCompte} /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, r) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onDetails(r)} title="Détails"><FiEye/></Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(r)} title="Gérer"><FiEdit3/></Button>
            <Button variant="ghost" size="sm" onClick={() => onFacture(r)} title="Facturer" disabled={r.montantNonFacture <= 0}><FiFileText className={r.montantNonFacture > 0 ? "text-green-600" : ""}/></Button>
        </div>
    )}
];
const getTransactionColumns = (): Column<TransactionCredit>[] => [
    { key: 'date', title: 'Date', render: (_, t) => format(new Date(t.dateTransaction), 'dd/MM/yyyy HH:mm')},
    { key: 'client', title: 'Client', dataIndex: 'clientNom', render: v => <span className="font-medium">{v}</span> },
    { key: 'desc', title: 'Description', dataIndex: 'description' },
    { key: 'montant', title: 'Montant', align: 'right', render: (_, t) => <span className="font-semibold">{t.montant.toLocaleString()} XAF</span> },
];
const getFactureColumns = (): Column<FactureClient>[] => [
     { key: 'num', title: 'N° Facture', dataIndex: 'numeroFacture', render: v => <span className="font-semibold text-gray-800">{v}</span> },
     { key: 'client', title: 'Client', dataIndex: 'clientNom' },
     { key: 'date', title: 'Date', render: (_, r) => format(new Date(r.dateFacture), 'dd/MM/yyyy') },
     { key: 'montant', title: 'Montant TTC', align: 'right', render: (_, r) => <span className="font-semibold">{r.montantTTC.toLocaleString()} XAF</span> },
     { key: 'statut', title: 'Statut Paiement', dataIndex: 'statutPaiement', align: 'center', render: v => <StatutPaiementBadge statut={v} /> }
];

// --- Sous-composant pour les filtres ---
const FilterClient: FC<{ searchTerm: string, setSearchTerm: (s: string) => void }> = ({ searchTerm, setSearchTerm }) => (
    <Card icon={FiFilter} title="Rechercher un client">
        <div className="p-6">
             <Input placeholder="Nom de l'entreprise..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch/>} rightIcon={searchTerm ? <FiX className="cursor-pointer" onClick={() => setSearchTerm('')}/> : undefined} />
        </div>
    </Card>
);

// --- Page Principale ---
const GerantFacturationPage: React.FC = () => {
    // États
    const [activeTab, setActiveTab] = useState<ActiveTab>('comptesClients');
    const [clientsPro, setClientsPro] = useState<ClientPourFacturation[]>([]);
    const [transactionsCredit, setTransactionsCredit] = useState<TransactionCredit[]>([]);
    const [facturesEmises, setFacturesEmises] = useState<FactureClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTermClient, setSearchTermClient] = useState('');
    const [showFacturationModal, setShowFacturationModal] = useState(false);
    const [clientPourFacturation, setClientPourFacturation] = useState<ClientPourFacturation | null>(null);
    const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    
    // Hooks de données
     useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const clientsAvecMontantNonFacture: ClientPourFacturation[] = dummyClientsProData.map(client => ({
                 ...client,
                montantNonFacture: dummyTransactionsCreditData.filter(tx => tx.clientId === client.id && !tx.estFacturee).reduce((sum, tx) => sum + tx.montant, 0),
            }));
            setClientsPro(clientsAvecMontantNonFacture);
            setTransactionsCredit(dummyTransactionsCreditData);
            setFacturesEmises(dummyFacturesClientData);
            setIsLoading(false);
        }, 800);
    }, []);

    // Données memoized pour le rendu
    const filteredClientsPro = useMemo(() => clientsPro.filter(c => c.nomEntreprise.toLowerCase().includes(searchTermClient.toLowerCase())), [clientsPro, searchTermClient]);
    const transactionsNonFacturees = useMemo(() => transactionsCredit.filter(tx => !tx.estFacturee).sort((a,b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime()), [transactionsCredit]);
    const sortedFactures = useMemo(() => [...facturesEmises].sort((a,b) => new Date(b.dateFacture).getTime() - new Date(a.dateFacture).getTime()), [facturesEmises]);
    
    // Handlers
    const handleVoirDetails = (client: ClientPourFacturation) => alert(`Détails pour ${client.nomEntreprise}`);
    const handleEditerClient = (client: ClientPourFacturation) => alert(`Édition de ${client.nomEntreprise}`);
    const handleOpenFacturationModal = (client: ClientPourFacturation) => { setClientPourFacturation(client); setShowFacturationModal(true); };
    const handleSaveFacture = async (factureData: any, transactionsIds: string[]) => {
        // Logique de sauvegarde simulée
        console.log("Sauvegarde Facture:", {factureData, transactionsIds});
        setShowFacturationModal(false);
        setActionStatus({ type: 'success', message: `Facture pour ${factureData.clientNom} générée.`});
        // Ici, il faudrait mettre à jour l'état global (ou refetch)
    };
    
    // Création dynamique des colonnes
    const clientColumns = getClientColumns(handleVoirDetails, handleEditerClient, handleOpenFacturationModal);
    const transactionColumns = getTransactionColumns();
    const factureColumns = getFactureColumns();

    // --- Rendu de la page ---
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiDollarSign className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Facturation & Suivi Crédits</h1>
                        <p className="text-gray-600">Gérez les comptes, les transactions et l'historique des factures.</p>
                    </div>
                </div>

                {actionStatus && <Alert variant={actionStatus.type} title="Notification" dismissible onDismiss={() => setActionStatus(null)}>{actionStatus.message}</Alert>}
<Card>
    <div className="p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2"> {/* `gap-2` est mieux que `space-x-2` quand les éléments peuvent aller à la ligne */}
            <Button 
                variant={activeTab === 'comptesClients' ? 'primary' : 'secondary'} 
                onClick={() => setActiveTab('comptesClients')} 
                leftIcon={<FiUsers/>}
            >
                Clients ({filteredClientsPro.length})
            </Button>
            <Button 
                variant={activeTab === 'transactionsNonFacturees' ? 'primary' : 'secondary'} 
                onClick={() => setActiveTab('transactionsNonFacturees')} 
                leftIcon={<FiDollarSign/>}
            >
                À Facturer ({transactionsNonFacturees.length})
            </Button>
            <Button 
                variant={activeTab === 'historiqueFactures' ? 'primary' : 'secondary'} 
                onClick={() => setActiveTab('historiqueFactures')} 
                leftIcon={<FiFileText/>}
            >
                Historique ({facturesEmises.length})
            </Button>
        </div>
    </div>
</Card>

                {activeTab === 'comptesClients' && (
                    <FilterClient searchTerm={searchTermClient} setSearchTerm={setSearchTermClient} />
                )}
                
                {isLoading ? <div className="p-12 flex justify-center"><Spinner /></div> : (
                  <Card title={
                        activeTab === 'comptesClients' ? 'Liste des Comptes Clients' :
                        activeTab === 'transactionsNonFacturees' ? 'Transactions à Facturer' :
                        'Historique des Factures'
                      }
                      icon={
                        activeTab === 'comptesClients' ? FiUsers :
                        activeTab === 'transactionsNonFacturees' ? FiDollarSign :
                        FiFileText
                      }>

                        {activeTab === 'comptesClients' && (
                           <Table<ClientPourFacturation> columns={clientColumns} data={filteredClientsPro} emptyText="Aucun client trouvé."/>
                        )}

                        {activeTab === 'transactionsNonFacturees' && (
                           <Table<TransactionCredit> columns={transactionColumns} data={transactionsNonFacturees} emptyText="Aucune transaction à facturer."/>
                        )}
                        
                        {activeTab === 'historiqueFactures' && (
                            <Table<FactureClient> columns={factureColumns} data={sortedFactures} emptyText="Aucune facture dans l'historique."/>
                        )}

                  </Card>
                )}
            </div>

            <GenererFactureModal 
                isOpen={showFacturationModal}
                onClose={() => setShowFacturationModal(false)}
                client={clientPourFacturation}
                transactionsAInclureInitiales={transactionsCredit.filter(tx => !tx.estFacturee && tx.clientId === clientPourFacturation?.id)}
                onFactureGeneree={handleSaveFacture}
            />
        </>
    );
};

export default GerantFacturationPage;