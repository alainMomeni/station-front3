// src/page/caissier/StockBoutiquePage.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout'; // Ajuster chemin
import { FiSearch, FiAlertTriangle, FiXCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

// --- Interface Étendue pour le Stock Boutique avec Prix pour Valorisation ---
interface StockItemBoutiqueValued {
    id: string;
    nom: string;
    categorie?: string;
    unite: string;
    stockOuverture: number;
    ventesDuJour: number;
    stockActuelReel: number; // Stock physique (résultat du dernier comptage/inventaire)
    prixUnitaireVente: number; // Pour calculer la valeur du stock au prix de vente
    seuilMinimum: number;
    ventesEspeces: number;
    ventesCarteBancaire: number;
    ventesMobileMoney: number;
    // Dérivés :
    stockTheoriqueCloture?: number;
    valeurTheoriqueCloture?: number; // Stock Théorique * Prix Vente
    valeurActuelleReelle?: number;   // Stock Actuel Réel * Prix Vente
    ecartValeurStock?: number;      // Différence entre les deux valeurs ci-dessus
    statusStockPhysique?: StockStatus; // Basé sur stockActuelReel vs seuilMinimum
}

// --- Données Mock Étendues avec prix de vente (Complétées et avec des cas variés) ---
const dummyStockBoutique: StockItemBoutiqueValued[] = [
    { 
        id: 'boutique1', 
        nom: 'Huile Moteur Super H (1L)', 
        stockOuverture: 20, 
        ventesDuJour: 5, 
        stockActuelReel: 15, 
        prixUnitaireVente: 5500, 
        seuilMinimum: 8, 
        unite: 'Unité', 
        categorie: 'Lubrifiants',
        ventesEspeces: 3500,
        ventesCarteBancaire: 1500,
        ventesMobileMoney: 500
    },
    { 
        id: 'boutique2', 
        nom: 'Filtre à Air ProClean', 
        stockOuverture: 12, 
        ventesDuJour: 4, 
        stockActuelReel: 8, 
        prixUnitaireVente: 7200, 
        seuilMinimum: 5, 
        unite: 'Unité', 
        categorie: 'Pièces',
        ventesEspeces: 5000,
        ventesCarteBancaire: 1200,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique3', 
        nom: 'Soda Cola Pétillant 33cl', 
        stockOuverture: 60, 
        ventesDuJour: 15, 
        stockActuelReel: 45, 
        prixUnitaireVente: 500, 
        seuilMinimum: 24, 
        unite: 'Canette', 
        categorie: 'Boissons',
        ventesEspeces: 7500,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique4', 
        nom: 'Essuie-Glace VisionMax (Paire)', 
        stockOuverture: 7, 
        ventesDuJour: 4, 
        stockActuelReel: 2, 
        prixUnitaireVente: 12500, 
        seuilMinimum: 5, 
        unite: 'Paire', 
        categorie: 'Accessoires',
        ventesEspeces: 50000,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique5', 
        nom: 'Lave-Glace ExpertClean (5L)', 
        stockOuverture: 5, 
        ventesDuJour: 5, 
        stockActuelReel: 0, 
        prixUnitaireVente: 3800, 
        seuilMinimum: 2, 
        unite: 'Bidon', 
        categorie: 'Entretien',
        ventesEspeces: 19000,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique6', 
        nom: 'Chips CroustiSel BBQ', 
        stockOuverture: 30, 
        ventesDuJour: 12, 
        stockActuelReel: 18, 
        prixUnitaireVente: 750, 
        seuilMinimum: 12, 
        unite: 'Sachet', 
        categorie: 'Snacks',
        ventesEspeces: 9000,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique7', 
        nom: 'Café Intense (Gobelet)', 
        stockOuverture: 20, 
        ventesDuJour: 15, 
        stockActuelReel: 6, 
        prixUnitaireVente: 350, 
        seuilMinimum: 10, 
        unite: 'Unité', 
        categorie: 'Boissons',
        ventesEspeces: 5250,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique8', 
        nom: 'Carte SIM DataPass 5Go', 
        stockOuverture: 25, 
        ventesDuJour: 3, 
        stockActuelReel: 22, 
        prixUnitaireVente: 5000, 
        seuilMinimum: 5, 
        unite: 'Unité', 
        categorie: 'Services',
        ventesEspeces: 15000,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique9', 
        nom: 'Déodorant FraîcheurMax', 
        stockOuverture: 10, 
        ventesDuJour: 1, 
        stockActuelReel: 10, 
        prixUnitaireVente: 2500, 
        seuilMinimum: 3, 
        unite: 'Unité', 
        categorie: 'Hygiène',
        ventesEspeces: 2500,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
    { 
        id: 'boutique10', 
        nom: 'Chargeur Tél. Rapide USB-C', 
        stockOuverture: 8, 
        ventesDuJour: 0, 
        stockActuelReel: 8, 
        prixUnitaireVente: 6000, 
        seuilMinimum: 3, 
        unite: 'Unité', 
        categorie: 'Accessoires Elec.',
        ventesEspeces: 0,
        ventesCarteBancaire: 0,
        ventesMobileMoney: 0
    },
];
// -----------------------------------------

type StockStatus = 'OK' | 'Stock Faible' | 'Rupture';

// Composant StatusIndicator
const StatusIndicator: React.FC<{ status: StockStatus }> = ({ status }) => {
    let classes = "inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-medium ";
    let icon = null;
    let text = status;

    switch (status) {
        case 'OK': classes += "bg-green-100 text-green-700"; icon = <FiCheckCircle className="mr-1 h-2.5 w-2.5"/>; text = "OK"; break;
        case 'Stock Faible': classes += "bg-yellow-100 text-yellow-700"; icon = <FiAlertTriangle className="mr-1 h-2.5 w-2.5"/>; text = "Stock Faible"; break;
        case 'Rupture': classes += "bg-red-100 text-red-700"; icon = <FiXCircle className="mr-1 h-2.5 w-2.5"/>; text = "Rupture"; break;
    }
    return <span className={classes} title={`Statut du stock physique : ${status}`}>{icon}{text}</span>;
};

// Composant EcartValeurIndicator

// Page principale
const StockBoutiquePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | StockStatus>('all');
    const [filterEcartValeur] = useState<'all' | 'avecEcartPositif' | 'avecEcartNegatif' | 'sansEcart'>('all');

    const formatXAF = (amount: number | undefined ) => {
        if (amount === undefined) return '-';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits:0, maximumFractionDigits:0 }).format(amount);
    }

    const allProcessedStockWithValues = useMemo(() => {
        return dummyStockBoutique.map(item => {
            const stockTheoriqueCloture = item.stockOuverture - item.ventesDuJour;
            const valeurTheoriqueCloture = stockTheoriqueCloture * item.prixUnitaireVente;
            const valeurActuelleReelle = item.stockActuelReel * item.prixUnitaireVente;
            const ecartValeurStock = valeurActuelleReelle - valeurTheoriqueCloture;
            let statusStockPhysique: StockStatus;
            if (item.stockActuelReel <= 0) statusStockPhysique = 'Rupture';
            else if (item.stockActuelReel <= item.seuilMinimum) statusStockPhysique = 'Stock Faible';
            else statusStockPhysique = 'OK';
            return { ...item, stockTheoriqueCloture, valeurTheoriqueCloture, valeurActuelleReelle, ecartValeurStock, statusStockPhysique };
        });
    }, []);

    const totals = useMemo(() => {
        return allProcessedStockWithValues.reduce((acc, item) => {
            acc.valeurTheoriqueCloture += item.valeurTheoriqueCloture || 0;
            acc.totalEspeces += item.ventesEspeces || 0;
            acc.totalCarte += item.ventesCarteBancaire || 0;
            acc.totalMobile += item.ventesMobileMoney || 0;
            return acc;
        }, { 
            valeurTheoriqueCloture: 0,
            totalEspeces: 0,
            totalCarte: 0,
            totalMobile: 0
        });
    }, [allProcessedStockWithValues]);

    const filteredAndSortedStock = useMemo(() => {
        return allProcessedStockWithValues
            .filter(item => {
                const termLower = searchTerm.toLowerCase();
                const nameMatch = item.nom.toLowerCase().includes(termLower);
                const categoryMatch = item.categorie?.toLowerCase().includes(termLower) ?? false;
                const statusMatch = filterStatus === 'all' || item.statusStockPhysique === filterStatus;
                let ecartMatch = true;
                if (filterEcartValeur === 'avecEcartPositif') ecartMatch = (item.ecartValeurStock || 0) > 0;
                else if (filterEcartValeur === 'avecEcartNegatif') ecartMatch = (item.ecartValeurStock || 0) < 0;
                else if (filterEcartValeur === 'sansEcart') ecartMatch = (item.ecartValeurStock || 0) === 0;
                return (nameMatch || categoryMatch) && statusMatch && ecartMatch;
            })
            .sort((a, b) => {
                const statusOrder = { 'Rupture': 0, 'Stock Faible': 1, 'OK': 2 };
                if (statusOrder[a.statusStockPhysique!] !== statusOrder[b.statusStockPhysique!]) {
                    return statusOrder[a.statusStockPhysique!] - statusOrder[b.statusStockPhysique!];
                }
                return (a.ecartValeurStock || 0) - (b.ecartValeurStock || 0);
            });
    }, [allProcessedStockWithValues, searchTerm, filterStatus, filterEcartValeur]);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                    Stock (Boutique)
                </h1>
                 <Link to="/signalements/ecart-caisse"
                     className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 shadow-sm">
                    <FiAlertTriangle className="-ml-1 mr-2 h-5 w-5" /> Signaler un Écart / Problème
                 </Link>
            </div>

             <div className="mb-6 p-4 rounded-md bg-blue-50 border border-blue-200 text-blue-800 flex items-start">
                 <FiInfo className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                 <p className="text-sm">
                     Utilisez le bouton ci-dessus pour signaler les écarts financiers significatifs.
                </p>
             </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                        <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input type="text" placeholder="Rechercher produit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="statusFilter" className="sr-only">Filtrer par statut stock</label>
                        <select id="statusFilter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="appearance-none w-full block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer" >
                            <option value="all">Tous les Statuts Stock</option>
                            <option value="Stock Faible">Stock Faible</option>
                            <option value="Rupture">En Rupture</option>
                            <option value="OK">Stock OK</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Produit</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Cat.</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Ouv. (Qté)</th>
                                <th className="px-2 py-3 text-center font-medium text-red-600 uppercase tracking-wider whitespace-nowrap">Ventes (Qté)</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">StkThéo.Fin(Qté)</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Val.Théo.Ventes(XAF)</th>
                                <th className="px-2 py-3 text-center font-medium text-green-600 uppercase tracking-wider whitespace-nowrap">Espèces(XAF)</th>
                                <th className="px-2 py-3 text-center font-medium text-blue-600 uppercase tracking-wider whitespace-nowrap">Carte(XAF)</th>
                                <th className="px-2 py-3 text-center font-medium text-orange-600 uppercase tracking-wider whitespace-nowrap">Mobile(XAF)</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Seuil Min(Qté)</th>
                                <th className="px-2 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Statut Stock</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedStock.length > 0 ? (
                                filteredAndSortedStock.map((item) => (
                                    <tr key={item.id} className={`${
                                        item.statusStockPhysique === 'Rupture' 
                                            ? 'bg-red-50' 
                                            : item.statusStockPhysique === 'Stock Faible' 
                                                ? 'bg-yellow-50' 
                                                : ''
                                    } hover:bg-gray-100`}>
                                        <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{item.nom} <span className='text-xxs text-gray-400'>({item.unite})</span></td>
                                        <td className="px-2 py-2 whitespace-nowrap text-gray-500 text-center hidden sm:table-cell">{item.categorie || '-'}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-gray-500 text-center">{item.stockOuverture}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-red-500 text-center font-medium">{item.ventesDuJour > 0 ? `-${item.ventesDuJour}`: '-'}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 text-center font-semibold">{item.stockTheoriqueCloture}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-gray-500 text-center">{formatXAF(item.valeurTheoriqueCloture)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-green-600 text-center font-medium">{formatXAF(item.ventesEspeces)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-blue-600 text-center font-medium">{formatXAF(item.ventesCarteBancaire)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-orange-600 text-center font-medium">{formatXAF(item.ventesMobileMoney)}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-gray-500 text-center">{item.seuilMinimum}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-center">
                                             <StatusIndicator status={item.statusStockPhysique!} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={11} className="text-center px-6 py-10 text-gray-500 italic">
                                    Aucun produit ne correspond aux critères.
                                </td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100">
                            <tr className="font-semibold text-gray-700">
                                <td colSpan={5} className="px-3 py-3 text-right uppercase">Total Valeur :</td>
                                <td className="px-2 py-3 text-center">{formatXAF(totals.valeurTheoriqueCloture)}</td>
                                <td className="px-2 py-3 text-center text-green-600">{formatXAF(totals.totalEspeces)}</td>
                                <td className="px-2 py-3 text-center text-blue-600">{formatXAF(totals.totalCarte)}</td>
                                <td className="px-2 py-3 text-center text-orange-600">{formatXAF(totals.totalMobile)}</td>
                                <td className="px-2 py-3 text-center"></td>
                                <td className="px-2 py-3 text-center"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StockBoutiquePage;