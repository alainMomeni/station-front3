// src/page/caissier/StockBoutiquePage.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'; // Ajuster chemin
import { FiSearch, FiAlertTriangle, FiXCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

// --- Données Mock pour le Stock Boutique ---
// Dans une vraie application, ceci viendrait de Directus
interface StockItemBoutique {
    id: string;
    nom: string;
    stockActuel: number;
    seuilMinimum: number;
    unite: string;
    categorie?: string; // Optionnel
}

const dummyStockBoutique: StockItemBoutique[] = [
    { id: 'boutique1', nom: 'Huile Moteur XYZ (1L)', stockActuel: 15, seuilMinimum: 10, unite: 'Unité', categorie: 'Lubrifiants' },
    { id: 'boutique2', nom: 'Filtre à air ABC', stockActuel: 8, seuilMinimum: 5, unite: 'Unité', categorie: 'Pièces' },
    { id: 'boutique3', nom: 'Boisson Gazeuse 33cl', stockActuel: 45, seuilMinimum: 24, unite: 'Unité', categorie: 'Boissons' },
    { id: 'boutique4', nom: 'Essuie-glace TUV', stockActuel: 3, seuilMinimum: 5, unite: 'Paire', categorie: 'Accessoires' }, // Stock faible
    { id: 'boutique5', nom: 'Lave-glace (5L)', stockActuel: 0, seuilMinimum: 2, unite: 'Bidon', categorie: 'Entretien' },   // Rupture
    { id: 'boutique6', nom: 'Snack Chips Paprika', stockActuel: 18, seuilMinimum: 12, unite: 'Unité', categorie: 'Snacks' },
    { id: 'boutique7', nom: 'Café Gobelet', stockActuel: 6, seuilMinimum: 10, unite: 'Unité', categorie: 'Boissons' }, // Stock faible
    { id: 'boutique8', nom: 'Carte SIM Prépayée', stockActuel: 25, seuilMinimum: 5, unite: 'Unité', categorie: 'Services' },
];
// -----------------------------------------

// Type pour le statut dérivé
type StockStatus = 'En Stock' | 'Stock Faible' | 'Rupture';

// Composant pour l'indicateur de statut visuel
const StatusIndicator: React.FC<{ status: StockStatus }> = ({ status }) => {
    switch (status) {
        case 'Stock Faible':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="Le stock est inférieur ou égal au seuil minimum">
                    <FiAlertTriangle className="mr-1 h-3 w-3" /> Faible
                </span>
            );
        case 'Rupture':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title="Aucun article en stock">
                    <FiXCircle className="mr-1 h-3 w-3" /> Rupture
                </span>
            );
        case 'En Stock':
        default:
            return (
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" title="Stock suffisant">
                     <FiCheckCircle className="mr-1 h-3 w-3"/> OK
                 </span>
            );
    }
};

const StockBoutiquePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | StockStatus>('all');

    // Calcul du statut et filtrage
    const filteredStock = useMemo(() => {
        return dummyStockBoutique
            .map(item => {
                let status: StockStatus;
                if (item.stockActuel <= 0) {
                    status = 'Rupture';
                } else if (item.stockActuel <= item.seuilMinimum) {
                    status = 'Stock Faible';
                } else {
                    status = 'En Stock';
                }
                return { ...item, status }; // Ajoute le statut calculé à l'objet
            })
            .filter(item => {
                // Filtrage par nom/catégorie (simple)
                const termLower = searchTerm.toLowerCase();
                const nameMatch = item.nom.toLowerCase().includes(termLower);
                const categoryMatch = item.categorie?.toLowerCase().includes(termLower) ?? false;
                // Filtrage par statut
                const statusMatch = filterStatus === 'all' || item.status === filterStatus;

                return (nameMatch || categoryMatch) && statusMatch;
            })
             // Optionnel: trier pour mettre Rupture et Faible en premier
             .sort((a, b) => {
                const statusOrder = { 'Rupture': 0, 'Stock Faible': 1, 'En Stock': 2 };
                return statusOrder[a.status] - statusOrder[b.status];
            });
    }, [searchTerm, filterStatus]);

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                    État du Stock Boutique (Informatif)
                </h1>
                {/* Lien pour Signaler */}
                 <Link
                     to="/signalements/ecart-caisse" // Ou une route spécifique si besoin "/signalements/stock"
                     className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 shadow-sm"
                 >
                    <FiAlertTriangle className="-ml-1 mr-2 h-5 w-5" /> Signaler un Écart / Problème
                 </Link>
            </div>

            {/* Carte Informative */}
             <div className="mb-6 p-4 rounded-md bg-blue-50 border border-blue-200 text-blue-800 flex items-start">
                <FiInfo className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                 <p className="text-sm">
                    Cette vue affiche les niveaux de stock théoriques. Les quantités réelles peuvent varier. Utilisez le bouton ci-dessus pour signaler toute anomalie constatée (manquant, produit périmé, etc.). Aucune modification n'est possible depuis cette interface.
                </p>
             </div>

            {/* Card pour le contenu */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Filtres */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
                    <div className="relative w-full md:w-64">
                         <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                         <input
                            type="text"
                            placeholder="Rechercher produit / catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                         <label htmlFor="statusFilter" className="sr-only">Filtrer par statut</label>
                         <select
                            id="statusFilter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as 'all' | StockStatus)}
                             className="appearance-none w-full md:w-auto block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                         >
                            <option value="all">Tous les Statuts</option>
                            <option value="Stock Faible">Stock Faible Uniquement</option>
                            <option value="Rupture">En Rupture Uniquement</option>
                             <option value="En Stock">En Stock</option>
                         </select>
                    </div>
                     {/* TODO: Bouton Refresh optionnel ici ? */}
                </div>

                 {/* Table des Stocks */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Catégorie</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actuel</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Seuil Min.</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStock.length > 0 ? (
                                filteredStock.map((item) => (
                                    <tr key={item.id} className={`${item.status === 'Rupture' ? 'bg-red-50' : item.status === 'Stock Faible' ? 'bg-yellow-50' : ''} hover:bg-gray-50`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{item.categorie || '-'}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold ${item.status !== 'En Stock' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {item.stockActuel} <span className='text-xs text-gray-500'>{item.unite}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center hidden md:table-cell">{item.seuilMinimum}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                             <StatusIndicator status={item.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center px-6 py-10 text-sm text-gray-500 italic">
                                        Aucun produit trouvé correspondant aux filtres.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> {/* Fin card contenu */}

        </DashboardLayout>
    );
};

export default StockBoutiquePage;