// src/page/gerant/GerantVentesCreditPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiUsers, FiFileText, FiDollarSign, FiSearch, FiEdit3, FiEye, FiFilter, FiX } from 'react-icons/fi';
import type { ClientProfessionnel, TransactionCredit } from '../../types/ventes';
import { format } from 'date-fns';

// --- Données Mock ---
const dummyClientsPro: ClientProfessionnel[] = [
  { id: 'CLI001', nomEntreprise: 'Transport Express Plus', limiteCredit: 5000000, soldeActuel: 2350000, statutCompte: 'actif', derniereFactureDate: '2024-06-30', derniereFactureMontant: 2100000 },
  { id: 'CLI002', nomEntreprise: 'BTP Construction S.A.', limiteCredit: 10000000, soldeActuel: 9850000, statutCompte: 'bloque', derniereFactureDate: '2024-06-30', derniereFactureMontant: 4500000 },
  { id: 'CLI003', nomEntreprise: 'AgroDistrib & Co', limiteCredit: 2000000, soldeActuel: 750000, statutCompte: 'actif' },
  { id: 'CLI004', nomEntreprise: 'Services Logistiques Généraux', limiteCredit: 3000000, soldeActuel: 0, statutCompte: 'actif', derniereFactureDate: '2024-07-15', derniereFactureMontant: 1200000 },
];

const dummyTransactionsCreditNonFacturees: TransactionCredit[] = [
  { id: 'TRCR001', clientId: 'CLI001', clientNom: 'Transport Express Plus', dateTransaction: '2024-07-10T10:30:00Z', description: 'Diesel - BC2034', montant: 450000, estFacturee: false },
  { id: 'TRCR002', clientId: 'CLI003', clientNom: 'AgroDistrib & Co', dateTransaction: '2024-07-12T14:15:00Z', description: 'SP95 - Pompiste A', montant: 120000, estFacturee: false },
  { id: 'TRCR003', clientId: 'CLI001', clientNom: 'Transport Express Plus', dateTransaction: '2024-07-15T09:00:00Z', description: 'Lubrifiants - HVX10', montant: 85000, estFacturee: false },
  { id: 'TRCR004', clientId: 'CLI002', clientNom: 'BTP Construction S.A.', dateTransaction: '2024-07-16T11:00:00Z', description: 'Diesel - Gros volume', montant: 1250000, estFacturee: false },
  { id: 'TRCR005', clientId: 'CLI003', clientNom: 'AgroDistrib & Co', dateTransaction: '2024-07-18T16:45:00Z', description: 'Articles Boutique Divers', montant: 35000, estFacturee: false },
];
// --------------------

type ActiveVentesCreditTab = 'comptesClients' | 'transactionsNonFacturees';

const GerantVentesCreditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveVentesCreditTab>('comptesClients');
  const [clientsPro, setClientsPro] = useState<ClientProfessionnel[]>([]);
  const [transactionsCredit, setTransactionsCredit] = useState<TransactionCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTermClient, setSearchTermClient] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setClientsPro(dummyClientsPro);
      setTransactionsCredit(dummyTransactionsCreditNonFacturees.filter(t => !t.estFacturee));
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredClientsPro = useMemo(() => {
    return clientsPro.filter(c => c.nomEntreprise.toLowerCase().includes(searchTermClient.toLowerCase()));
  }, [clientsPro, searchTermClient]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 });
  };

  const handleGererLimites = (client: ClientProfessionnel) => {
      alert(`Gestion des limites pour ${client.nomEntreprise}. Redirection ou modal à implémenter.`);
  };
  
  const handleGenererFacture = (client: ClientProfessionnel) => {
      alert(`Génération de facture pour ${client.nomEntreprise}. Sélection des transactions et création de facture à implémenter.`);
  };
   const handleVoirDetailsCompte = (client: ClientProfessionnel) => {
    alert(`Affichage des détails du compte et de l'historique des transactions pour ${client.nomEntreprise} (page/modal à implémenter).`);
  };

  const thClass = "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm";

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Gestion des Ventes à Crédit
        </h1>
      </div>

      {/* Onglets */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('comptesClients')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'comptesClients' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiUsers className="inline mr-1.5 h-4 w-4" /> Comptes Clients Professionnels
          </button>
          <button onClick={() => setActiveTab('transactionsNonFacturees')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactionsNonFacturees' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiDollarSign className="inline mr-1.5 h-4 w-4" /> Transactions Non Facturées ({transactionsCredit.length})
          </button>
        </nav>
      </div>

      {/* Section de recherche pour l'onglet Comptes Clients */}
      {activeTab === 'comptesClients' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-500">
              <FiFilter className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">Filtres</span>
            </div>
            
            <div className="relative flex-grow sm:flex-grow-0 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-150" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher un client..." 
                value={searchTermClient} 
                onChange={e => setSearchTermClient(e.target.value)} 
                className="
                  block w-full sm:w-72 pl-10 pr-4 py-2
                  text-sm text-gray-900 
                  border border-gray-300 rounded-lg
                  bg-white shadow-sm
                  transition-all duration-150
                  placeholder-gray-400
                  focus:ring-2 focus:ring-purple-500/20 
                  focus:border-purple-500
                  hover:border-purple-400
                  outline-none
                "
              />
              {searchTermClient && (
                <button
                  onClick={() => setSearchTermClient('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenu des onglets */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          {activeTab === 'comptesClients' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thClass}>Nom Entreprise</th>
                    <th className={`${thClass} text-right`}>Solde Actuel</th>
                    <th className={`${thClass} text-right hidden sm:table-cell`}>Limite Crédit</th>
                    <th className={`${thClass} text-right hidden md:table-cell`}>Crédit Dispo.</th>
                    <th className={`${thClass} text-center`}>Statut</th>
                    <th className={thClass}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClientsPro.map(client => {
                    const creditDisponible = client.limiteCredit - client.soldeActuel;
                    const statutCouleur = client.statutCompte === 'bloque' || creditDisponible < 0 ? 'text-red-600' :
                      client.soldeActuel > client.limiteCredit * 0.8 ? 'text-yellow-600' : 'text-green-600';
                    return (
                      <tr key={client.id} className="hover:bg-purple-50/20">
                        <td className={`${tdClass} font-medium text-gray-900`}>{client.nomEntreprise}</td>
                        <td className={`${tdClass} text-right font-semibold ${client.soldeActuel > 0 ? 'text-orange-600' : 'text-gray-700'}`}>{formatCurrency(client.soldeActuel)}</td>
                        <td className={`${tdClass} text-right hidden sm:table-cell`}>{formatCurrency(client.limiteCredit)}</td>
                        <td className={`${tdClass} text-right hidden md:table-cell font-medium ${statutCouleur}`}>{formatCurrency(creditDisponible)}</td>
                        <td className={`${tdClass} text-center`}>
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${client.statutCompte === 'actif' ? 'bg-green-100 text-green-800' :
                              client.statutCompte === 'bloque' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {client.statutCompte?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                        <td className={`${tdClass} space-x-2 whitespace-nowrap`}>
                          <button onClick={() => handleVoirDetailsCompte(client)} className="text-blue-600 hover:text-blue-800" title="Détails Compte"><FiEye size={16} /></button>
                          <button onClick={() => handleGererLimites(client)} className="text-indigo-600 hover:text-indigo-800" title="Gérer Limites/Infos Client"><FiEdit3 size={16} /></button>
                          <button onClick={() => handleGenererFacture(client)} className="text-green-600 hover:text-green-800" title="Générer Facture"><FiFileText size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredClientsPro.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Aucun client professionnel trouvé pour votre recherche ou aucun client défini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transactionsNonFacturees' && (
            <div>
              <h2 className="text-md font-semibold text-gray-700 mb-3">Transactions à Crédit Non Facturées</h2>
              {transactionsCredit.length === 0 ? (
                <p className="text-gray-500 italic">Aucune transaction à crédit non facturée pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className={thClass}>Date</th>
                        <th className={thClass}>Client</th>
                        <th className={thClass}>Description</th>
                        <th className={`${thClass} text-right`}>Montant</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactionsCredit.map(tx => (
                        <tr key={tx.id} className="hover:bg-purple-50/20">
                          <td className={tdClass}>{format(new Date(tx.dateTransaction), 'dd/MM/yyyy HH:mm')}</td>
                          <td className={`${tdClass} font-medium`}>{tx.clientNom}</td>
                          <td className={tdClass}>{tx.description}</td>
                          <td className={`${tdClass} text-right font-semibold`}>{formatCurrency(tx.montant)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GerantVentesCreditPage;