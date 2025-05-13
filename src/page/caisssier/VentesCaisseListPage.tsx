// src/page/caissier/VentesCaisseListPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'; // Adapter chemin
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

// --- Données Mock spécifiques ---
const produitsBoutique = [ // On a besoin des noms ici aussi
    { id: 'boutique1', nom: 'Huile Moteur XYZ (1L)', prix: 5000, unite: 'Unité' },
    { id: 'boutique2', nom: 'Filtre à air ABC', prix: 7500, unite: 'Unité' },
    { id: 'boutique3', nom: 'Boisson Gazeuse', prix: 500, unite: 'Unité' },
    { id: 'boutique4', nom: 'Essuie-glace TUV', prix: 12000, unite: 'Paire' },
    { id: 'boutique5', nom: 'Lave-glace (5L)', prix: 3500, unite: 'Bidon' },
];
const dummyVentesCaisse: any[] = [ // Contient produitId
  { id: 'VC-001', date: new Date(Date.now() - 3600000 * 1).toISOString(), produitId: 'boutique3', quantite: 2, unite: 'Unité', prixUnitaire: 500, montantTotal: 1000, modePaiement: 'Espèces', caissier: 'Jean C.', pointDeVente: 'Caisse Principale' },
  { id: 'VC-002', date: new Date().toISOString(), produitId: 'boutique1', quantite: 1, unite: 'Unité', prixUnitaire: 5000, montantTotal: 5000, modePaiement: 'Carte', caissier: 'Jean C.', pointDeVente: 'Caisse Principale' },
  { id: 'VC-003', date: new Date(Date.now() - 3600000 * 3).toISOString(), produitId: 'boutique5', quantite: 1, unite: 'Bidon', prixUnitaire: 3500, montantTotal: 3000, modePaiement: 'Mobile Money', caissier: 'Aisha K.', pointDeVente: 'Caisse 2', remise: 500 },
  // Ajouter d'autres ventes pour tester la pagination
  { id: 'VC-004', date: new Date(Date.now() - 3600000 * 4).toISOString(), produitId: 'boutique2', quantite: 1, unite: 'Unité', prixUnitaire: 7500, montantTotal: 7500, modePaiement: 'Carte', caissier: 'Jean C.', pointDeVente: 'Caisse Principale' },
  { id: 'VC-005', date: new Date(Date.now() - 3600000 * 5).toISOString(), produitId: 'boutique3', quantite: 4, unite: 'Unité', prixUnitaire: 500, montantTotal: 2000, modePaiement: 'Espèces', caissier: 'Aisha K.', pointDeVente: 'Caisse 2' },
];
// -----------------------------

// Interface pour les ventes affichées (avec nom du produit)
interface VenteCaisseDisplay extends Omit<any, 'produitId'> { // Omit peut varier selon votre vraie interface
    produitNom: string;
}

const VentesCaisseListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Ajuster pour voir la pagination

  // --- Logique pour joindre le nom du produit ---
  const ventesCaisseAffichees: VenteCaisseDisplay[] = dummyVentesCaisse.map(vente => {
      const produit = produitsBoutique.find(p => p.id === vente.produitId);
      return {
          ...vente,
          produitNom: produit ? produit.nom : 'Produit Inconnu'
      };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Trier après mapping

  // Fonctions CRUD Placeholder
  const handleViewDetails = (id: string) => alert(`Voir détails Vente Boutique: ${id}.`);
  const handleEditVente = (id: string) => {
      // navigate(`/caisse/ventes/modifier/${id}`); // Route de modification caisse
      alert(`Modifier Vente Boutique: ${id}. Logique non implémentée.`);
  };
  const handleDeleteVente = (id: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vente boutique ${id} ?`)) {
        alert(`Supprimer Vente Boutique: ${id}. Logique non implémentée.`);
        // TODO: Appel API Directus et mise à jour état local
    }
  };

  // Filtrage sur les données affichées (incluant nom produit)
  const filteredVentes = ventesCaisseAffichees.filter(vente =>
    vente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.produitNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.caissier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vente.client && vente.client.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Logique de pagination (sur filteredVentes)
  const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);
  const paginatedVentes = filteredVentes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Formatage devise (peut être un util)
   const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
   };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Liste des Ventes Boutique
        </h1>
         {/* Lien vers le nouveau formulaire caisse */}
        <Link
          to="/caisse/ventes/nouveau"
          className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 shadow-sm"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Nouveau
        </Link>
      </div>

      {/* Content Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filters / Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div><h2 className="text-lg font-semibold text-gray-700 mb-1">Historique des Ventes Boutique</h2></div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" placeholder="Rechercher (ID, Produit, Caissier...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Vente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit Vendu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caissier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVentes.map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(vente.date).toLocaleString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.produitNom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{vente.quantite} {vente.unite}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">{formatCurrency(vente.montantTotal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.modePaiement}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vente.caissier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                     <button onClick={() => handleViewDetails(vente.id)} className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out" title="Voir détails"><FiEye size={16}/></button>
                     <button onClick={() => handleEditVente(vente.id)} className="text-purple-600 hover:text-purple-900 transition duration-150 ease-in-out" title="Modifier"><FiEdit size={16}/></button>
                     <button onClick={() => handleDeleteVente(vente.id)} className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out" title="Supprimer"><FiTrash2 size={16}/></button>
                  </td>
                </tr>
              ))}
               {filteredVentes.length === 0 && (
                  <tr><td colSpan={8} className="text-center px-6 py-10 text-sm text-gray-500">Aucune vente boutique trouvée.</td></tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Adaptée du code précédent VentesListPage) */}
        {totalPages > 1 && (
             <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                    {/* ... Boutons mobile Précédent/Suivant ... */}
                     <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="..."> Précédent </button>
                     <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="..."> Suivant </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                            {' '}à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredVentes.length)}</span>
                            {' '}sur <span className="font-medium">{filteredVentes.length}</span> ventes
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {[...Array(totalPages).keys()].map(pageNumber => (
                                <button key={pageNumber + 1} onClick={() => handlePageChange(pageNumber + 1)} aria-current={currentPage === pageNumber + 1 ? 'page' : undefined}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${ currentPage === pageNumber + 1 ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
                                    {pageNumber + 1}
                                </button>
                            ))}
                             <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VentesCaisseListPage;