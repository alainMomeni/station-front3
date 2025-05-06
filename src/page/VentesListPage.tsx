import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import DashboardLayout from '../layouts/DashboardLayout';
import { FiPlus, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Dummy data type and sample data
interface Vente {
  id: string;
  produit: string;
  quantite: string; // Assuming string for display like '200 L'
  status: 'active' | 'inactive'; // Example status
}

const dummyVentes: Vente[] = [
  { id: 'Vent-1001', produit: 'Super', quantite: '200 L', status: 'active' },
  { id: 'Vent-1002', produit: 'Deo Max 15L', quantite: '100L', status: 'active' },
  { id: 'Vent-1003', produit: 'Gazoil', quantite: '3', status: 'active' },
  // ... add more dummy data as needed
];

const VentesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 40; // Example total pages

  // Placeholder functions for actions
  const handleModify = (id: string) => alert(`Modifier vente: ${id}`);
  const handleDeactivate = (id: string) => alert(`Désactiver vente: ${id}`);
  const handleDelete = (id: string) => alert(`Supprimer vente: ${id}`);
  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
          // Add logic to fetch data for the new page
      }
  };

  // Filtering based on search (simple example)
  const filteredVentes = dummyVentes.filter(vente =>
      vente.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vente.produit.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <DashboardLayout>
       <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
              Liste des ventes
          </h1>
           {/* Use Link for navigation instead of button */}
          <Link
             to="/ventes/nouveau" // Route for the new sale form
             className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
          >
             <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
             Nouveau
          </Link>
       </div>

      {/* Main Content Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Card Header / Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
           <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Toutes les ventes</h2>
              {/* Active filter indicator (simple example) */}

           </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-56">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm shadow-sm"
              />
            </div>
            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                className="appearance-none w-full md:w-auto block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                defaultValue="Nouveau"
              >
                <option>Trier Par : Nouveau</option>
                <option>Trier Par : Ancien</option>
                <option>Trier Par : Nom</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom du produit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantitée vendues
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVentes.map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vente.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.produit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vente.quantite}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                     {/* Modify Button */}
                     <button
                        onClick={() => handleModify(vente.id)}
                        className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out"
                    >
                        Modifier
                    </button>
                    {/* Deactivate Button */}
                    <button
                        onClick={() => handleDeactivate(vente.id)}
                        className="px-3 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                    >
                        Désactiver
                    </button>
                     {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(vente.id)}
                        className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                    >
                        Supprimer
                    </button>
                  </td>
                </tr>
              ))}
               {/* Add a row for when there's no data */}
                {filteredVentes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center px-6 py-4 text-sm text-gray-500">
                      Aucune vente trouvée.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
           <p className="text-sm text-gray-700">
             De <span className="font-medium">{(currentPage - 1) * 8 + 1}</span> à <span className="font-medium">{Math.min(currentPage * 8, 256000)}</span> sur <span className="font-medium">256k</span> {/* Using '8' based on image text, adjust page size as needed */}
           </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <span className="sr-only">Previous</span>
                <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
             </button>
             {/* Page Numbers (simplified example) */}
            {[1, 2, 3, 4].map(page => ( // Example: Render first few pages
                 <button
                     key={page}
                     onClick={() => handlePageChange(page)}
                     aria-current={currentPage === page ? 'page' : undefined}
                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                 >
                     {page}
                 </button>
            ))}
             <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
            <button // Example last page number
                 onClick={() => handlePageChange(totalPages)}
                 className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50`}
             >
                {totalPages}
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                 disabled={currentPage === totalPages}
                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <span className="sr-only">Next</span>
                <FiChevronRight className="h-5 w-5" aria-hidden="true" />
             </button>
          </nav>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VentesListPage;