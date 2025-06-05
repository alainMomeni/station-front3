// src/page/gerant/GerantGestionClientsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiUsers, FiPlusCircle, FiEdit, FiTrash2, FiSearch, FiFilter, FiEye, FiAlertCircle, FiX } from 'react-icons/fi';
import ClientFormModal from '../../components/modals/ClientFormModal'; // Import du modal
import type { ClientData, ClientProfessionnel, ClientParticulier, TypeClient, StatutClient, ClientRowData } from '../../types/clients'; // Adapter chemin
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// --- Données Mock ---
let dummyClientsData: ClientData[] = [ // `let` pour permettre la modification/suppression
  { id: uuidv4(), typeClient: 'professionnel', nomAffichage: 'Transport Express Plus', raisonSociale: 'Transport Express Plus', email: 'contact@transportexpress.com', telephone: '771234567', adresse: 'Km 4, Route de Rufisque', statutCompte: 'actif', limiteCredit: 5000000, soldeActuelCredit: 2350000, dateCreation: new Date(Date.now() - 86400000 * 120).toISOString(), derniereActiviteDate: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: uuidv4(), typeClient: 'particulier', nomAffichage: 'Awa Ndiaye', prenom: 'Awa', nomFamille: 'Ndiaye', email: 'awa.ndiaye@email.com', telephone: '789012345', statutCompte: 'actif', dateCreation: new Date(Date.now() - 86400000 * 90).toISOString(), derniereActiviteDate: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: uuidv4(), typeClient: 'professionnel', nomAffichage: 'BTP Construction S.A.', raisonSociale: 'BTP Construction S.A.', statutCompte: 'bloque', limiteCredit: 1000000, soldeActuelCredit: 1150000, dateCreation: new Date(Date.now() - 86400000 * 200).toISOString()},
  { id: uuidv4(), typeClient: 'particulier', nomAffichage: 'Moussa Fall', prenom: 'Moussa', nomFamille: 'Fall', telephone: '701122334', statutCompte: 'inactif', derniereActiviteDate: new Date(Date.now() - 86400000 * 180).toISOString()},
];
// --------------------

const GerantGestionClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isCreationModeModal, setIsCreationModeModal] = useState(true);
  const [clientEnEdition, setClientEnEdition] = useState<ClientData | null>(null);
  const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreTypeClient, setFiltreTypeClient] = useState<TypeClient | ''>('');
  const [filtreStatutClient, setFiltreStatutClient] = useState<StatutClient | ''>('');

  useEffect(() => {
    setIsLoading(true);
    // Simuler le chargement
    setTimeout(() => {
      setClients(dummyClientsData);
      setIsLoading(false);
    }, 500);
  }, []);

  const preparedClientData: ClientRowData[] = useMemo(() => {
      return clients
        .map(c => {
            let specificInfo = '';
            let soldeOuType = '';
            if(c.typeClient === 'professionnel') {
                specificInfo = (c as ClientProfessionnel).raisonSociale;
                soldeOuType = `${(c as ClientProfessionnel).soldeActuelCredit?.toLocaleString('fr-FR') || 0} XAF`;
            } else {
                specificInfo = `${(c as ClientParticulier).prenom || ''} ${(c as ClientParticulier).nomFamille || ''}`.trim();
                soldeOuType = "Particulier";
            }
            return {
                ...c,
                nomAffichage: c.nomAffichage || specificInfo, // Fallback
                contactInfo: `${c.telephone || ''}${c.telephone && c.email ? ' / ' : ''}${c.email || ''}` || '-',
                specificInfo: specificInfo,
                soldeOuType: soldeOuType
            };
        })
        .filter(c => 
          (c.nomAffichage.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (c.telephone && c.telephone.includes(searchTerm)))
        )
        .filter(c => filtreTypeClient === '' || c.typeClient === filtreTypeClient)
        .filter(c => filtreStatutClient === '' || c.statutCompte === filtreStatutClient)
        .sort((a, b) => a.nomAffichage.localeCompare(b.nomAffichage));
  }, [clients, searchTerm, filtreTypeClient, filtreStatutClient]);
  

  const handleOpenModalForCreate = () => {
    setActionStatus(null);
    setIsCreationModeModal(true);
    setClientEnEdition(null);
    setShowModal(true);
  };
  
  const handleOpenModalForEdit = (client: ClientData) => {
    setActionStatus(null);
    setIsCreationModeModal(false);
    setClientEnEdition(client);
    setShowModal(true);
  };

  const handleSaveClient = async (clientData: ClientData) => {
    // TODO: Appel API Directus
    console.log("Sauvegarde Client:", clientData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler latence

    if (!isCreationModeModal && clientEnEdition) { // Modification
      const updatedClient = { ...clientEnEdition, ...clientData };
      dummyClientsData = dummyClientsData.map(c => c.id === updatedClient.id ? updatedClient : c);
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
      setActionStatus({type: 'success', message: `Client "${updatedClient.nomAffichage}" mis à jour.`});
    } else { // Ajout
      const nouveauClient: ClientData = { ...clientData, id: uuidv4(), dateCreation: new Date().toISOString() };
      dummyClientsData = [nouveauClient, ...dummyClientsData];
      setClients(prev => [nouveauClient, ...prev]);
      setActionStatus({type: 'success', message: `Client "${nouveauClient.nomAffichage}" ajouté.`});
    }
    setShowModal(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    const clientNom = clients.find(c => c.id === clientId)?.nomAffichage;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${clientNom || clientId}" ? Cette action peut être irréversible.`)) {
      // TODO: API Call Directus pour suppression (ou archivage)
      console.log("Suppression client ID:", clientId);
      await new Promise(resolve => setTimeout(resolve, 500));
      dummyClientsData = dummyClientsData.filter(c => c.id !== clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setActionStatus({type:'success', message:`Client "${clientNom || clientId}" supprimé.`});
    }
  };

  const handleVoirDetailsClient = (clientId: string) => {
    alert(`Affichage de l'historique et détails pour client ID: ${clientId} (À implémenter)`);
    // Naviguer vers une page de détail: navigate(`/gerant/clients/${clientId}/details`);
  };

  const getStatutClientBadge = (statut: StatutClient) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      case 'bloque': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100';
    }
  };

  const thClass = "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm";
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";

  return (
    <DashboardLayout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                <FiUsers className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion des Clients
            </h1>
            <button onClick={handleOpenModalForCreate} className="btn-primary-sm inline-flex items-center shrink-0">
                <FiPlusCircle className="mr-2 h-4 w-4"/> Nouveau Client
            </button>
        </div>

        {actionStatus && (
            <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {actionStatus.message}
                <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"><FiX size={16}/></button>
            </div>
        )}

        {/* Filtres */}
        <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col lg:flex-row gap-3 items-center flex-wrap">
            <FiFilter className="h-5 w-5 text-gray-400 shrink-0 hidden lg:block"/>
            <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" placeholder="Rechercher (Nom, Email, Tél...)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputClass} pl-9 w-full`}/>
            </div>
            <select value={filtreTypeClient} onChange={e => setFiltreTypeClient(e.target.value as TypeClient | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                <option value="">Tous Types</option>
                <option value="particulier">Particulier</option>
                <option value="professionnel">Professionnel</option>
            </select>
            <select value={filtreStatutClient} onChange={e => setFiltreStatutClient(e.target.value as StatutClient | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                <option value="">Tous Statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="prospect">Prospect</option>
                <option value="bloque">Bloqué (Crédit)</option>
            </select>
        </div>

        <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className={thClass}>Client</th>
                            <th className={`${thClass} hidden md:table-cell`}>Contact Principal</th>
                            <th className={`${thClass} hidden sm:table-cell`}>Type / Solde Dû</th>
                            <th className={`${thClass} text-center`}>Statut</th>
                            <th className={`${thClass} hidden lg:table-cell`}>Dern. Activité</th>
                            <th className={`${thClass} text-center`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan={6} className="text-center py-10"><Spinner /></td></tr>
                    ) : preparedClientData.length > 0 ? preparedClientData.map(client => (
                        <tr key={client.id} className="hover:bg-purple-50/20">
                            <td className={`${tdClass} font-medium text-gray-900`}>
                                {client.nomAffichage}
                                {client.typeClient === 'professionnel' && <span className="block text-xxs text-purple-600">Professionnel</span>}
                                {client.typeClient === 'particulier' && <span className="block text-xxs text-blue-600">Particulier</span>}
                            </td>
                            <td className={`${tdClass} text-gray-500 hidden md:table-cell`}>
                                {client.contactInfo}
                            </td>
                            <td className={`${tdClass} hidden sm:table-cell`}>
                                {client.typeClient === 'professionnel' ? 
                                    <span className={`font-semibold ${(client as unknown as ClientProfessionnel).soldeActuelCredit! > 0 ? 'text-orange-600' : 'text-gray-700'}`}>{client.soldeOuType}</span> :
                                    <span className="text-gray-500">{client.soldeOuType}</span>
                                }
                            </td>
                            <td className={`${tdClass} text-center`}>
                                <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClientBadge(client.statutCompte)}`}>
                                    {client.statutCompte.toUpperCase()}
                                </span>
                            </td>
                            <td className={`${tdClass} text-gray-500 hidden lg:table-cell`}>
                                {client.derniereActiviteDate ? format(new Date(client.derniereActiviteDate), 'dd/MM/yyyy') : '-'}
                            </td>
                            <td className={`${tdClass} text-center space-x-1.5 whitespace-nowrap`}>
                                <button onClick={() => handleVoirDetailsClient(client.id)} className="text-blue-600 hover:text-blue-800 p-1" title="Voir Détails & Historique"><FiEye size={16}/></button>
                                <button onClick={() => handleOpenModalForEdit(clients.find(c => c.id === client.id)!)} className="text-indigo-600 hover:text-indigo-800 p-1" title="Modifier Client"><FiEdit size={16}/></button>
                                <button onClick={() => handleDeleteClient(client.id)} className="text-red-500 hover:text-red-700 p-1" title="Supprimer Client"><FiTrash2 size={16}/></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Aucun client trouvé.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>

        <ClientFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSaveClient}
            clientInitial={clientEnEdition}
            isCreationMode={isCreationModeModal}
        />
    </DashboardLayout>
  );
};

export default GerantGestionClientsPage;