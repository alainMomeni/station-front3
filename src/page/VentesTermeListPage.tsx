import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiPlus, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';

interface VenteTerme {
  id: string;
  client: string; // Added client field
  produit: string;
  quantite: string;
  montantTotal: string; // Added total amount
  dateEcheance: string; // Due date
  status: 'En attente' | 'Payée' | 'En retard';
}

const dummyVentesTerme: VenteTerme[] = [
  { id: 'VT-001', client: 'Client Alpha', produit: 'Gazoil', quantite: '500 L', montantTotal: 'XAF 300.000', dateEcheance: '2024-08-15', status: 'En attente' },
  { id: 'VT-002', client: 'Entreprise Beta', produit: 'Super SP98', quantite: '1000 L', montantTotal: 'XAF 700.000', dateEcheance: '2024-07-30', status: 'En attente' },
  { id: 'VT-003', client: 'Société Gamma', produit: 'Deo Max 15L', quantite: '50 Unités', montantTotal: 'XAF 150.000', dateEcheance: '2024-07-20', status: 'Payée' },
];

const VentesTermeListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Example

  // Placeholder actions - customize as needed
  const handleDelete = (id: string) => alert(`Supprimer Vente à Terme: ${id}`);

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
      }
  };

  const filteredVentes = dummyVentesTerme.filter(vente =>
    vente.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vente.produit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: VenteTerme['status']) => {
    switch (status) {
        case 'En attente': return 'bg-yellow-100 text-yellow-800';
        case 'Payée': return 'bg-green-100 text-green-800';
        case 'En retard': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  function handleViewDetails(_id: string): void {
    throw new Error('Function not implemented.');
  }

  function handleEditVente(_id: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Liste des Ventes à Terme
        </h1>
        <Link
          to="/ventes/terme/nouveau" // Route for new credit sale form
          className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 focus:outline-none  shadow-sm"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nouveau
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filters (search, sort) - similar to VentesListPage */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
             <h2 className="text-lg font-semibold text-gray-700 mb-1">Toutes les ventes à terme</h2>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-56">
                {/* ... search input JSX ... */}
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Rechercher (client, produit)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm shadow-sm"
              />
            </div>
             {/* Sort */}
            <div className="relative w-full md:w-auto">
               {/* ... sort select JSX ... */}
                <select
                className="appearance-none w-full md:w-auto block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                defaultValue="Echeance"
              >
                <option>Trier Par : Échéance</option>
                <option>Trier Par : Client</option>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVentes.map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.produit} ({vente.quantite})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.montantTotal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(vente.dateEcheance).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(vente.status)}`}>
                        {vente.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                     <button onClick={() => handleViewDetails(vente.id)} className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out" title="Voir détails"><FiEye size={16}/></button>
                     <button onClick={() => handleEditVente(vente.id)} className="text-purple-600 hover:text-purple-900 transition duration-150 ease-in-out" title="Modifier"><FiEdit size={16}/></button>
                     <button onClick={() => handleDelete(vente.id)} className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out" title="Supprimer"><FiTrash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filteredVentes.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-4">Aucune vente à terme trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination ... similar to VentesListPage ... */}
         <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
           {/* ... Pagination JSX ... */}
            <p className="text-sm text-gray-700">
             De <span className="font-medium">{(currentPage - 1) * 8 + 1}</span> à <span className="font-medium">{Math.min(currentPage * 8, dummyVentesTerme.length)}</span> sur <span className="font-medium">{dummyVentesTerme.length}</span>
           </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
             {/* ... (Previous, Next, Page Numbers) */}
               <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <FiChevronLeft className="h-5 w-5" />
             </button>
            {[...Array(Math.ceil(dummyVentesTerme.length / 8) || 1).keys()].map(page => ( // Dynamic page numbers
                 <button
                     key={page + 1}
                     onClick={() => handlePageChange(page + 1)}
                     aria-current={currentPage === (page + 1) ? 'page' : undefined}
                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === (page + 1) ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                 >
                     {page + 1}
                 </button>
            ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage * 8 >= dummyVentesTerme.length}
                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <FiChevronRight className="h-5 w-5" />
             </button>
          </nav>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VentesTermeListPage;