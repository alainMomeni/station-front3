// src/page/gerant/GerantVentesCreditPage.tsx (VERSION CORRIGÉE)
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiDollarSign, FiFilter, FiSearch, FiFileText, FiEdit3, FiEye, FiUsers, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

// ... (imports inchangés)
import type { ClientProfessionnel, TransactionCredit } from '../../types/ventes';
import { dummyClientsPro, dummyTransactionsCreditNonFacturees } from '../../_mockData/ventesCredit';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card'; // Utilise maintenant la version corrigée
import { Input } from '../../components/ui/Input';
import { Table, type Column } from '../../components/ui/Table';
import StatutCompteBadge from '../../components/clients/StatutCompteBadge';

type ActiveTab = 'comptesClients' | 'transactionsNonFacturees';

// Les colonnes et la logique restent identiques...
const getClientColumns = (onDetails: (c: ClientProfessionnel) => void, onEdit: (c: ClientProfessionnel) => void, onFacture: (c: ClientProfessionnel) => void): Column<ClientProfessionnel>[] => [
    { key: 'nom', title: 'Nom Entreprise', dataIndex: 'nomEntreprise', render: v => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'solde', title: 'Solde Actuel', align: 'right', render: (_, r) => <span className="font-semibold text-orange-600">{r.soldeActuel.toLocaleString()} XAF</span> },
    { key: 'limite', title: 'Limite Crédit', align: 'right', render: (_, r) => r.limiteCredit.toLocaleString() + ' XAF' },
    { key: 'dispo', title: 'Crédit Dispo.', align: 'right', render: (_, r) => <span className={`font-medium ${(r.limiteCredit - r.soldeActuel) < 0 ? 'text-red-600' : 'text-green-600'}`}>{ (r.limiteCredit - r.soldeActuel).toLocaleString() } XAF</span> },
    { key: 'statut', title: 'Statut', align: 'center', render: (_, r) => <StatutCompteBadge statut={r.statutCompte} /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, r) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onDetails(r)} title="Détails Compte"><FiEye/></Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(r)} title="Gérer Client"><FiEdit3/></Button>
            <Button variant="ghost" size="sm" onClick={() => onFacture(r)} title="Générer Facture"><FiFileText className="text-green-600"/></Button>
        </div>
    )}
];
const getTransactionColumns = (): Column<TransactionCredit>[] => [
    { key: 'date', title: 'Date', render: (_, t) => format(new Date(t.dateTransaction), 'dd/MM/yyyy HH:mm')},
    { key: 'client', title: 'Client', dataIndex: 'clientNom', render: v => <span className="font-medium">{v}</span> },
    { key: 'desc', title: 'Description', dataIndex: 'description' },
    { key: 'montant', title: 'Montant', align: 'right', render: (_, t) => <span className="font-semibold">{t.montant.toLocaleString()} XAF</span> },
];

// ====== SOUS-COMPOSANT CORRIGÉ ======
const ControlsSection: FC<{ activeTab: ActiveTab, setActiveTab: (tab: ActiveTab) => void, onAdd: () => void, transactionsCount: number }> = ({ activeTab, setActiveTab, onAdd, transactionsCount }) => (
     <Card> {/* Appel correct, sans title ni icon */}
        <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex space-x-2">
                <Button variant={activeTab === 'comptesClients' ? 'primary' : 'secondary'} onClick={() => setActiveTab('comptesClients')} leftIcon={<FiUsers />}>Comptes Clients</Button>
                <Button variant={activeTab === 'transactionsNonFacturees' ? 'primary' : 'secondary'} onClick={() => setActiveTab('transactionsNonFacturees')} leftIcon={<FiDollarSign />}>
                    Transactions à facturer ({transactionsCount})
                </Button>
            </div>
            {activeTab === 'comptesClients' && <Button variant="success" onClick={onAdd}>Ajouter un Client</Button>}
        </div>
    </Card>
);
// Le reste de la page (FilterClient, GerantVentesCreditPage) est déjà correct et n'a pas besoin de modification.
// Je le laisse pour la complétude du fichier.
const FilterClient: FC<{ searchTerm: string, setSearchTerm: (s: string) => void }> = ({ searchTerm, setSearchTerm }) => (
    <Card icon={FiFilter} title="Filtres">
        <div className="p-6">
            <Input label="Rechercher un client" placeholder="Nom de l'entreprise..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />} rightIcon={searchTerm ? <FiX className="cursor-pointer" onClick={() => setSearchTerm('')}/> : undefined} />
        </div>
    </Card>
);

const GerantVentesCreditPage: React.FC = () => {
    // Les états et la logique restent identiques
    const [activeTab, setActiveTab] = useState<ActiveTab>('comptesClients');
    const [clientsPro, setClientsPro] = useState<ClientProfessionnel[]>([]);
    const [transactionsCredit, setTransactionsCredit] = useState<TransactionCredit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTermClient, setSearchTermClient] = useState('');
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setClientsPro(dummyClientsPro);
            setTransactionsCredit(dummyTransactionsCreditNonFacturees);
            setIsLoading(false);
        }, 800);
    }, []);
    const filteredClientsPro = useMemo(() => clientsPro.filter(c => c.nomEntreprise.toLowerCase().includes(searchTermClient.toLowerCase())), [clientsPro, searchTermClient]);
    const handleVoirDetails = (client: ClientProfessionnel) => alert(`Affichage des détails pour ${client.nomEntreprise}`);
    const handleGererClient = (client: ClientProfessionnel) => alert(`Édition des infos pour ${client.nomEntreprise}`);
    const handleGenererFacture = (client: ClientProfessionnel) => alert(`Génération de facture pour ${client.nomEntreprise}`);
    const handleAjouterClient = () => alert("Ouverture du formulaire d'ajout de client pro");
    const clientColumns = getClientColumns(handleVoirDetails, handleGererClient, handleGenererFacture);
    const transactionColumns = getTransactionColumns();
    
    // Rendu
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiDollarSign className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestion des Ventes à Crédit</h1>
                        <p className="text-gray-600">Suivez les comptes clients professionnels et les transactions à facturer.</p>
                    </div>
                </div>

                <ControlsSection activeTab={activeTab} setActiveTab={setActiveTab} onAdd={handleAjouterClient} transactionsCount={transactionsCredit.length} />

                {activeTab === 'comptesClients' && (
                    <FilterClient searchTerm={searchTermClient} setSearchTerm={setSearchTermClient} />
                )}
                
                <Card title={activeTab === 'comptesClients' ? `Comptes Clients (${filteredClientsPro.length})` : `Transactions Non Facturées (${transactionsCredit.length})`} icon={activeTab === 'comptesClients' ? FiUsers : FiFileText}>
                    {isLoading ? <div className="p-12 flex justify-center"><Spinner /></div> :
                        activeTab === 'comptesClients' ?
                            <Table<ClientProfessionnel> columns={clientColumns} data={filteredClientsPro} emptyText="Aucun client trouvé." /> :
                            <Table<TransactionCredit> columns={transactionColumns} data={transactionsCredit} emptyText="Aucune transaction à facturer."/>
                    }
                </Card>
            </div>
        </>
    );
};

export default GerantVentesCreditPage;