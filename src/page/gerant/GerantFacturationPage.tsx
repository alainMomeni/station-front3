// src/page/gerant/GerantVentesCreditPage.tsx (ou GerantFacturationPage.tsx)

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {  FiUsers, FiFileText, FiDollarSign, FiAlertCircle, FiEdit3, FiEye, FiX } from 'react-icons/fi';
import type { ClientProfessionnel, TransactionCredit, FactureClient, ClientPourFacturation } from '../../types/facturation'; // Adapter
import { format, subDays } from 'date-fns'; // subDays ici au lieu de startOfDay pour une période
import GenererFactureModal from '../../components/modals/GenererFactureModal'; // <= NOUVEL IMPORT
import { v4 as uuidv4 } from 'uuid';


// --- Données Mock ---
let dummyClientsProData: ClientProfessionnel[] = [
  { id: 'CLI001', nomEntreprise: 'Transport Express Plus', limiteCredit: 5000000, soldeActuel: 2350000, statutCompte: 'actif', derniereFactureDate: '2024-06-30', derniereFactureMontant: 2100000 },
  { id: 'CLI002', nomEntreprise: 'BTP Construction S.A.', limiteCredit: 10000000, soldeActuel: 9850000, statutCompte: 'bloque', derniereFactureDate: '2024-06-30', derniereFactureMontant: 4500000 },
  { id: 'CLI003', nomEntreprise: 'AgroDistrib & Co', limiteCredit: 2000000, soldeActuel: 750000, statutCompte: 'actif' },
  { id: 'CLI004', nomEntreprise: 'Services Logistiques Généraux', limiteCredit: 3000000, soldeActuel: 0, statutCompte: 'actif', derniereFactureDate: '2024-07-15', derniereFactureMontant: 1200000 },
];

let dummyTransactionsCreditData: TransactionCredit[] = [
  { id: 'TRCR001', clientId: 'CLI001', clientNom: 'Transport Express Plus', dateTransaction: format(subDays(new Date(), 18), 'yyyy-MM-dd HH:mm:ss'), description: 'Diesel - BC2034', montant: 450000, estFacturee: false },
  { id: 'TRCR002', clientId: 'CLI003', clientNom: 'AgroDistrib & Co', dateTransaction: format(subDays(new Date(), 16), 'yyyy-MM-dd HH:mm:ss'), description: 'SP95 - Pompiste A', montant: 120000, estFacturee: false },
  { id: 'TRCR003', clientId: 'CLI001', clientNom: 'Transport Express Plus', dateTransaction: format(subDays(new Date(), 13),'yyyy-MM-dd HH:mm:ss'), description: 'Lubrifiants - HVX10', montant: 85000, estFacturee: false },
  { id: 'TRCR004', clientId: 'CLI002', clientNom: 'BTP Construction S.A.', dateTransaction: format(subDays(new Date(), 12),'yyyy-MM-dd HH:mm:ss'), description: 'Diesel - Gros volume', montant: 1250000, estFacturee: false },
  { id: 'TRCR005', clientId: 'CLI003', clientNom: 'AgroDistrib & Co', dateTransaction: format(subDays(new Date(), 10),'yyyy-MM-dd HH:mm:ss'), description: 'Articles Boutique Divers', montant: 35000, estFacturee: false },
  { id: 'TRCR006', clientId: 'CLI001', clientNom: 'Transport Express Plus', dateTransaction: format(subDays(new Date(), 5),'yyyy-MM-dd HH:mm:ss'), description: 'SP98 Camion Bleu', montant: 220000, estFacturee: false },
  { id: 'TRCR007', clientId: 'CLI004', clientNom: 'Services Logistiques Généraux', dateTransaction: format(subDays(new Date(), 22),'yyyy-MM-dd HH:mm:ss'), description: 'Diesel Livraison X', montant: 1200000, estFacturee: true, factureId:"FACT_PREV_001" }, // Une transaction déjà facturée
];

// Simuler une collection de factures
let dummyFacturesClientData: FactureClient[] = [];
// --------------------

type ActiveVentesCreditTab = 'comptesClients' | 'transactionsNonFacturees' | 'historiqueFactures'; // Ajout onglet historique

const GerantVentesCreditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveVentesCreditTab>('comptesClients');
  const [clientsPro, setClientsPro] = useState<ClientPourFacturation[]>([]);
  const [transactionsCredit, setTransactionsCredit] = useState<TransactionCredit[]>([]);
  const [facturesEmises, setFacturesEmises] = useState<FactureClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTermClient] = useState('');
  const [showFacturationModal, setShowFacturationModal] = useState(false);
  const [clientPourFacturation, setClientPourFacturation] = useState<ClientProfessionnel | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const clientsAvecMontantNonFacture: ClientPourFacturation[] = dummyClientsProData.map(client => {
        const montantNonFacture = dummyTransactionsCreditData
          .filter(tx => tx.clientId === client.id && !tx.estFacturee)
          .reduce((sum, tx) => sum + tx.montant, 0);
        return { ...client, montantNonFacture };
      });
      setClientsPro(clientsAvecMontantNonFacture);
      setTransactionsCredit(dummyTransactionsCreditData.filter(t => !t.estFacturee));
      setFacturesEmises(dummyFacturesClientData); // Charger les factures simulées
      setIsLoading(false);
    }, 800);
  }, []); // Charger une seule fois au montage

  const refreshDataPostFacturation = () => {
    // Simuler la mise à jour après qu'une facture ait été générée
    const clientsAvecMontantNonFacture: ClientPourFacturation[] = dummyClientsProData.map(client => {
        const montantNonFacture = dummyTransactionsCreditData
          .filter(tx => tx.clientId === client.id && !tx.estFacturee)
          .reduce((sum, tx) => sum + tx.montant, 0);
        // Potentiellement aussi mettre à jour soldeActuel, derniereFactureDate etc.
        return { ...client, montantNonFacture, soldeActuel: client.soldeActuel /* ou recalculé */ };
      });
      setClientsPro(clientsAvecMontantNonFacture);
      setTransactionsCredit(dummyTransactionsCreditData.filter(t => !t.estFacturee));
      setFacturesEmises(dummyFacturesClientData); // Recharger la liste des factures
  };

  const filteredClientsPro = useMemo(() => { /* ... (inchangé) ... */
    return clientsPro.filter(c => c.nomEntreprise.toLowerCase().includes(searchTermClient.toLowerCase()));
  }, [clientsPro, searchTermClient]);

  const formatCurrency = (amount: number | undefined) => { /* ... (inchangé) ... */ 
    if (amount === undefined) return 'N/A';
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 });
  };

  const handleGererLimites = (_client: ClientPourFacturation) => {/* ... */};
  
  const handleOpenFacturationModal = (client: ClientProfessionnel) => {
      setClientPourFacturation(client);
      setShowFacturationModal(true);
      setActionStatus(null);
  };

  const handleFactureGeneree = async (
    factureData: Omit<FactureClient, 'id' | 'urlPdf' | 'dateCreation'>, 
    transactionsSelectionneesIds: string[]
  ) => {
    console.log("Facture à générer pour Directus:", factureData);
    console.log("Transactions à marquer comme facturées:", transactionsSelectionneesIds);

    // TODO: Logique Directus:
    // 1. Créer l'item FactureClient dans Directus, récupérer son ID.
    // 2. Mettre à jour chaque TransactionCredit dans Directus: estFacturee = true, factureId = nouvelIdFacture.
    // 3. Mettre à jour le ClientProfessionnel: soldeActuel, derniereFactureDate, derniereFactureMontant.
    // 4. Potentiellement générer et stocker un PDF de la facture dans Directus Files et lier son URL.
    
    // Simulation de succès:
    const nouvelleFacture: FactureClient = {
        ...factureData,
        id: `FACT-${uuidv4().slice(0,6)}`,
        dateCreation: new Date().toISOString(),
        // urlPdf: `/path/to/simulated/facture_${factureData.numeroFacture}.pdf`
    };
    dummyFacturesClientData = [nouvelleFacture, ...dummyFacturesClientData]; // Ajouter à la liste mock
    dummyTransactionsCreditData = dummyTransactionsCreditData.map(tx => 
        transactionsSelectionneesIds.includes(tx.id) 
        ? {...tx, estFacturee: true, factureId: nouvelleFacture.id }
        : tx
    );
    // Mettre à jour le client (simplifié pour la démo)
    dummyClientsProData = dummyClientsProData.map(c => c.id === clientPourFacturation?.id ? {
        ...c,
        soldeActuel: c.soldeActuel - nouvelleFacture.montantTTC, // Diminuer solde car c'est ce que le client doit maintenant payer SUR cette facture
        derniereFactureDate: nouvelleFacture.dateFacture,
        derniereFactureMontant: nouvelleFacture.montantTTC
    } : c)


    setActionStatus({type: 'success', message: `Facture ${nouvelleFacture.numeroFacture} générée pour ${clientPourFacturation?.nomEntreprise}.`});
    setShowFacturationModal(false);
    setClientPourFacturation(null);
    refreshDataPostFacturation(); // Recharger les données pour refléter les changements
  };

  const handleVoirDetailsCompte = (_client: ClientPourFacturation) => {/* ... */};
  const thClass = "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm";

  if (isLoading) { /* ... (inchangé) ... */ }
  
  return (
    <DashboardLayout>
      {/* ... (Titre et bouton "Nouvelle Vente à Crédit" inchangés, mais peut-être que "Nouvelle Vente" ne se fait pas d'ici directement) ... */}
       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Facturation & Suivi Crédits Clients
        </h1>
      </div>

      {actionStatus && (
            <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {actionStatus.message}
                 <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"> <FiX size={16}/> </button>
            </div>
       )}

      {/* Onglets */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          <button onClick={() => setActiveTab('comptesClients')} className={`tab-button ${activeTab === 'comptesClients' && 'tab-active'}`}>
            <FiUsers className="tab-icon" /> Comptes Clients ({filteredClientsPro.length})
          </button>
          <button onClick={() => setActiveTab('transactionsNonFacturees')} className={`tab-button ${activeTab === 'transactionsNonFacturees' && 'tab-active'}`}>
            <FiDollarSign className="tab-icon" /> Transactions à Facturer ({transactionsCredit.filter(tx => !tx.estFacturee).length})
          </button>
          <button onClick={() => setActiveTab('historiqueFactures')} className={`tab-button ${activeTab === 'historiqueFactures' && 'tab-active'}`}>
            <FiFileText className="tab-icon" /> Historique des Factures ({facturesEmises.length})
          </button>
        </nav>
      </div>
    
      {activeTab === 'comptesClients' && ( /* ... (Tableau des clients pro, ajout du montantNonFacture) ... */ 
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="mb-4 flex items-center gap-3">
                {/* ... (input de recherche inchangé) ... */}
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className={thClass}>Nom Entreprise</th>
                        <th className={`${thClass} text-right`}>Solde Dû Actuel</th>
                        <th className={`${thClass} text-right`}>Montant Non Facturé</th>
                        <th className={`${thClass} text-right hidden sm:table-cell`}>Limite Crédit</th>
                        <th className={`${thClass} text-center`}>Statut</th>
                        <th className={thClass}>Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredClientsPro.map(client => (
                    <tr key={client.id} className="hover:bg-purple-50/20">
                        <td className={`${tdClass} font-medium text-gray-900`}>{client.nomEntreprise}</td>
                        <td className={`${tdClass} text-right font-semibold ${client.soldeActuel > 0 ? 'text-orange-600' : 'text-gray-700'}`}>{formatCurrency(client.soldeActuel)}</td>
                        <td className={`${tdClass} text-right font-medium ${client.montantNonFacture > 0 ? 'text-blue-600' : 'text-gray-700'}`}>{formatCurrency(client.montantNonFacture)}</td>
                        <td className={`${tdClass} text-right hidden sm:table-cell`}>{formatCurrency(client.limiteCredit)}</td>
                        <td className={`${tdClass} text-center`}>{/* Statut Badge */}</td>
                        <td className={`${tdClass} space-x-2 whitespace-nowrap`}>
                            <button onClick={() => handleVoirDetailsCompte(client)} className="text-blue-600 hover:text-blue-800" title="Détails Compte"><FiEye size={16}/></button>
                            <button onClick={() => handleGererLimites(client)} className="text-indigo-600 hover:text-indigo-800" title="Gérer Limites/Infos Client"><FiEdit3 size={16}/></button>
                            <button onClick={() => handleOpenFacturationModal(client)} className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed" title="Générer Facture" disabled={client.montantNonFacture <= 0}>
                                <FiFileText size={16}/>
                            </button>
                        </td>
                    </tr>
                ))}
                {/* ... (message si aucun client) ... */}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'transactionsNonFacturees' && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* Tableau des transactions non facturées à implémenter */}
        </div>
      )}

      {/* NOUVEL ONGLET : Historique des Factures */}
      {activeTab === 'historiqueFactures' && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Historique des Factures Émises</h2>
          {facturesEmises.length === 0 ? (
            <p className="text-gray-500 italic">Aucune facture n'a été générée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thClass}>N° Facture</th>
                    <th className={thClass}>Client</th>
                    <th className={thClass}>Date Facture</th>
                    <th className={`${thClass} text-right`}>Montant TTC</th>
                    <th className={`${thClass} text-center`}>Statut Paiement</th>
                    <th className={thClass}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturesEmises.sort((a,b) => new Date(b.dateFacture).getTime() - new Date(a.dateFacture).getTime()).map(fact => (
                    <tr key={fact.id} className="hover:bg-purple-50/20">
                      <td className={`${tdClass} font-medium`}>{fact.numeroFacture}</td>
                      <td className={tdClass}>{fact.clientNom}</td>
                      <td className={tdClass}>{format(new Date(fact.dateFacture + 'T00:00:00'), 'dd/MM/yyyy')}</td>
                      <td className={`${tdClass} text-right font-semibold`}>{formatCurrency(fact.montantTTC)}</td>
                      <td className={`${tdClass} text-center`}>
                         <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            fact.statutPaiement === 'payee' ? 'bg-green-100 text-green-800' : 
                            fact.statutPaiement === 'partiellement_payee' ? 'bg-yellow-100 text-yellow-800' :
                            fact.statutPaiement === 'en_retard' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {fact.statutPaiement.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className={`${tdClass} space-x-1 whitespace-nowrap`}>
                        <button className="text-blue-600 hover:text-blue-800 text-xs p-1" title="Voir PDF"><FiEye/></button>
                        {fact.statutPaiement !== 'payee' && fact.statutPaiement !== 'annulee' && (
                            <button className="text-green-600 hover:text-green-800 text-xs p-1" title="Enregistrer Paiement"><FiDollarSign/></button>
                        )}
                        {/* <button className="text-orange-500 hover:text-orange-700 text-xs p-1" title="Envoyer Rappel"><FiBell/></button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <GenererFactureModal 
        isOpen={showFacturationModal}
        onClose={() => { setShowFacturationModal(false); setClientPourFacturation(null); }}
        client={clientPourFacturation}
        transactionsAInclureInitiales={transactionsCredit.filter(tx => !tx.estFacturee && tx.clientId === clientPourFacturation?.id)}
        onFactureGeneree={handleFactureGeneree}
      />
        <style>{`
            .tab-button {
                @apply whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center;
            }
            .tab-icon {
                @apply mr-1.5 h-4 w-4;
            }
            .tab-active {
                @apply border-purple-500 text-purple-600;
            }
            .tab-button:not(.tab-active) {
                @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300;
            }
      `}</style>
    </DashboardLayout>
  );
};

export default GerantVentesCreditPage;