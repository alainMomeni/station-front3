// src/page/caissier/VentesTermeCaisseListPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'; // Adapter chemin
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiCheckSquare, FiTrash2 } from 'react-icons/fi'; // Actions: Voir, Payer, Supprimer

// --- Données Mock Spécifiques ---
const produitsBoutique = [ // Pour obtenir le nom du produit
    { id: 'boutique1', nom: 'Huile Moteur XYZ (1L)' },
    { id: 'boutique2', nom: 'Filtre à air ABC' },
    { id: 'boutique3', nom: 'Boisson Gazeuse' },
    { id: 'boutique4', nom: 'Essuie-glace TUV' },
    { id: 'boutique5', nom: 'Lave-glace (5L)' },
];
const dummyVentesTermeCaisse: any[] = [
    { id: 'VTC-001', client: 'Garage Moderne', produitId: 'boutique2', quantite: 5, unite: 'Unité', montantTotal: 37500, dateEcheance: '2024-08-20', status: 'En attente', caissier: 'Jean C.'},
    { id: 'VTC-002', client: 'Transport Express', produitId: 'boutique4', quantite: 10, unite: 'Paire', montantTotal: 120000, dateEcheance: '2024-07-31', status: 'En attente', caissier: 'Jean C.' },
    { id: 'VTC-003', client: 'Société Gamma', produitId: 'boutique1', quantite: 2, unite: 'Unité', montantTotal: 10000, dateEcheance: '2024-07-15', status: 'Payée', caissier: 'Aisha K.' },
     // Ajouter pour pagination
    { id: 'VTC-004', client: 'Particulier Alpha', produitId: 'boutique5', quantite: 1, unite: 'Bidon', montantTotal: 3500, dateEcheance: '2024-08-10', status: 'En retard', caissier: 'Jean C.' },
];
// ------------------------------

// Interface pour l'affichage
interface VenteTermeCaisseDisplay extends Omit<any, 'produitId'> {
    produitNom: string;
    status: 'En attente' | 'Payée' | 'En retard';
}

// Styles Badge Statut (peut être centralisé)
const getStatusBadgeClass = (status: VenteTermeCaisseDisplay['status']) => {
    switch (status) {
        case 'En attente': return 'bg-yellow-100 text-yellow-800';
        case 'Payée': return 'bg-green-100 text-green-800';
        case 'En retard': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
// Format devise (peut être centralisé)
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);


const VentesTermeCaisseListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Pour voir pagination

   // Joindre nom produit et trier
   const ventesTermeCaisseAffichees: VenteTermeCaisseDisplay[] = dummyVentesTermeCaisse.map(vente => {
       const produit = produitsBoutique.find(p => p.id === vente.produitId);
       return {
           ...vente,
           produitNom: produit ? produit.nom : 'Inconnu'
       };
   }).sort((a, b) => new Date(b.dateEcheance).getTime() - new Date(a.dateEcheance).getTime()); // Trier par échéance descendante

  // Fonctions CRUD Placeholder
  const handleViewDetails = (id: string) => alert(`Voir détails Vente à Terme Boutique: ${id}`);
  const handleMarkAsPaid = (id: string) => alert(`Marquer Vente Terme Boutique ${id} comme payée. Logique non implémentée.`);
  const handleDeleteVente = (id: string) => {
    if(window.confirm(`Supprimer la vente à terme boutique ${id} ?`)) {
       alert(`Supprimer Vente Terme Boutique: ${id}. Logique non implémentée.`);
    }
  };

  // Filtrage
  const filteredVentes = ventesTermeCaisseAffichees.filter(vente =>
    vente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.produitNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);
  const paginatedVentes = filteredVentes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
      }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Liste des Ventes à Terme (Boutique)
        </h1>
        {/* Lien vers le formulaire terme caisse */}
        <Link
          to="/caisse/ventes/terme/nouveau"
          className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 shadow-sm"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Nouveau
        </Link>
      </div>

      {/* Content Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div><h2 className="text-lg font-semibold text-gray-700 mb-1">Suivi des Crédits Boutique</h2></div>
           <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
               {/* Search */}
                <div className="relative w-full md:w-56">
                    <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type="text" placeholder="Rechercher (Client, Produit...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                         className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                {/* Sort Dropdown (optional) */}
                {/* ... */}
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
             <thead className="bg-gray-50">
               <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit (Qté)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
             </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVentes.map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.client}</td>
                   {/* Afficher Produit(Qté) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.produitNom} ({vente.quantite} {vente.unite})</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">{formatCurrency(vente.montantTotal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(vente.dateEcheance).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vente.status)}`}>
                        {vente.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button onClick={() => handleViewDetails(vente.id)} className="text-blue-600 hover:text-blue-900" title="Voir"><FiEye size={16}/></button>
                    {(vente.status === 'En attente' || vente.status === 'En retard') && (
                         <button onClick={() => handleMarkAsPaid(vente.id)} className="text-green-600 hover:text-green-900" title="Marquer Payé"><FiCheckSquare size={16}/></button>
                    )}
                    <button onClick={() => handleDeleteVente(vente.id)} className="text-red-600 hover:text-red-900" title="Supprimer"><FiTrash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filteredVentes.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-500">Aucune vente à terme boutique trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination (Identique à VentesCaisseListPage) */}
         {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                {/* ... (code pagination complet ici) ... */}
                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                         <p className="text-sm text-gray-700"> Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredVentes.length)}</span> sur <span className="font-medium">{filteredVentes.length}</span> ventes </p>
                    </div>
                    <div>
                         <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> <FiChevronLeft className="h-5 w-5"/> </button>
                             {[...Array(totalPages).keys()].map(page => ( <button key={page + 1} onClick={() => handlePageChange(page + 1)} aria-current={currentPage === page + 1 ? 'page' : undefined} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page + 1 ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}> {page + 1} </button> ))}
                             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> <FiChevronRight className="h-5 w-5"/> </button>
                        </nav>
                    </div>
                </div>
                 {/* ... (ajouter le bloc sm:hidden pour mobile si besoin) ... */}
             </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VentesTermeCaisseListPage;