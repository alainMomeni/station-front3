import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Ajout de useNavigate pour l'édition
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi'; // Ajout FiEdit, FiTrash2 et suppression FiPrinter

// Interface VenteDirecte (ajustée si nécessaire)
interface VenteDirecte {
  id: string;
  date: string;
  produit: string;
  quantite: number;
  unite: string;
  prixUnitaire: number;
  montantTotal: number;
  modePaiement: 'Espèces' | 'Carte' | 'Mobile Money' | 'Autre';
  pompiste: string;
  pompe: string;
  client?: string;
  remise?: number;
}

const dummyVentesDirectes: VenteDirecte[] = [
  { id: 'VD-001', date: new Date(Date.now() - 3600000 * 2).toISOString(), produit: 'Super SP95', quantite: 25.5, unite: 'L', prixUnitaire: 750, montantTotal: 19125, modePaiement: 'Carte', pompiste: 'Natalya', pompe: 'P01' },
  { id: 'VD-002', date: new Date(Date.now() - 3600000 * 1).toISOString(), produit: 'Diesel', quantite: 40, unite: 'L', prixUnitaire: 700, montantTotal: 28000, modePaiement: 'Espèces', pompiste: 'Jean', pompe: 'P03', client: 'Mr. Diallo' },
  { id: 'VD-003', date: new Date().toISOString(), produit: 'Huile Moteur XYZ', quantite: 1, unite: 'Unité', prixUnitaire: 5000, montantTotal: 4500, modePaiement: 'Mobile Money', pompiste: 'Natalya', pompe: 'Caisse', remise: 500 },
  { id: 'VD-004', date: new Date(Date.now() - 3600000 * 5).toISOString(), produit: 'Gazoil', quantite: 15, unite: 'L', prixUnitaire: 700, montantTotal: 10500, modePaiement: 'Espèces', pompiste: 'Amina', pompe: 'P04' },
  // Ajoutons quelques ventes pour mieux voir la pagination
  { id: 'VD-005', date: new Date(Date.now() - 3600000 * 6).toISOString(), produit: 'Super SP95', quantite: 30, unite: 'L', prixUnitaire: 750, montantTotal: 22500, modePaiement: 'Espèces', pompiste: 'Ali', pompe: 'P02' },
  { id: 'VD-006', date: new Date(Date.now() - 3600000 * 7).toISOString(), produit: 'Diesel', quantite: 50, unite: 'L', prixUnitaire: 700, montantTotal: 35000, modePaiement: 'Carte', pompiste: 'Fatou', pompe: 'P01', client: 'Entreprise Z' },
];


const VentesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // **Réduit pour que la pagination s'affiche avec les données actuelles**

  // Fonctions Placeholder pour les actions
  const handleViewDetails = (id: string) => alert(`Voir détails Vente: ${id}.`);
  const handleEditVente = (id: string) => {
    // Normalement, vous naviguerez vers un formulaire pré-rempli
    // Pour cet exemple, nous allons simuler une navigation
    // navigate(`/ventes/modifier/${id}`); // Exemple de route de modification
    alert(`Modifier Vente: ${id}. Navigation vers la page de modification non implémentée.`);
  };
  const handleDeleteVente = (id: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la vente ${id} ?`)) {
        alert(`Supprimer Vente: ${id}. Logique de suppression non implémentée.`);
        // Ici, vous appelleriez votre API et mettriez à jour l'état local
    }
  };

  // Filtrage simple
  const filteredVentes = dummyVentesDirectes.filter(vente =>
    vente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.pompiste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vente.client && vente.client.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Logique de pagination
  const totalPages = Math.ceil(filteredVentes.length / itemsPerPage);
  const paginatedVentes = filteredVentes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Liste des Ventes Directes
        </h1>
        <Link
          to="/ventes/nouveau"
          className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Nouveau
        </Link>
      </div>

      {/* Content Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filters / Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div><h2 className="text-lg font-semibold text-gray-700 mb-1">Historique des Ventes</h2></div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                     className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
            </div>
             {/* Sort */}
            <div className="relative w-full md:w-auto">
               {/* ... sort select JSX ... */}
                <select
                className="appearance-none w-full md:w-auto block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                defaultValue="Echeance"
              >
                <option>Trier Par : Date/Heure</option>
                <option>Trier Par : Paiement</option>
                <option>Trier Par : Montant</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiChevronDown className="h-4 w-4" />
              </div>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVentes.map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(vente.date).toLocaleString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.produit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{vente.quantite} {vente.unite}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-right">{formatCurrency(vente.montantTotal)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.modePaiement}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                     <button onClick={() => handleViewDetails(vente.id)} className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out" title="Voir détails"><FiEye size={16}/></button>
                     <button onClick={() => handleEditVente(vente.id)} className="text-purple-600 hover:text-purple-900 transition duration-150 ease-in-out" title="Modifier"><FiEdit size={16}/></button>
                     <button onClick={() => handleDeleteVente(vente.id)} className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out" title="Supprimer"><FiTrash2 size={16}/></button>
                  </td>
                </tr>
              ))}
               {filteredVentes.length === 0 && (
                  <tr><td colSpan={7} className="text-center px-6 py-10 text-sm text-gray-500">Aucune vente directe trouvée.</td></tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
             <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Précédent
                    </button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Suivant
                    </button>
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
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Précédent</span>
                                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {/* Génération des numéros de page */}
                            {[...Array(totalPages).keys()].map(pageNumber => (
                                <button
                                    key={pageNumber + 1}
                                    onClick={() => handlePageChange(pageNumber + 1)}
                                    aria-current={currentPage === pageNumber + 1 ? 'page' : undefined}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        currentPage === pageNumber + 1
                                        ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNumber + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Suivant</span>
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

export default VentesListPage;