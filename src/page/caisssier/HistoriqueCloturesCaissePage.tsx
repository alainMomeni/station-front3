// src/page/caissier/HistoriqueCloturesCaissePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiChevronLeft, FiChevronRight, FiEye, FiArchive } from 'react-icons/fi';

// --- INTERFACES (Basées sur votre dernier code fourni) ---
interface ProductStockSummaryItem {
    idProduit: string;
    nomProduit: string;
    specification?: string;
    uniteProduit: string;
    categorie: string;
    quantiteOuverture: number;
    quantiteVendue: number;
    stockTheoriqueFin: number;
    valeurTheoriqueVentes: number;
    ventesEspeces: number;
    ventesCarte: number;
    ventesMobile: number;
    seuilMinimum: number;
    statutStock: 'Rupture' | 'Stock Faible' | 'OK';
}

interface ClotureCaisseData {
    id: string;
    dateHeureCloture: string;
    fondDeCaisseInitial: number;
    totalVentesEspeces: number;
    totalVentesCarte: number;
    totalVentesMobile: number;
    totalAutresEncaissements: number;
    totalDecaissements: number;
    montantTheoriqueCaisse: number;
    montantReelCompte: number;
    ecartConstatate: number;
    caissierNom: string; // Conservé pour le passage au modal ou si la page évolue pour un admin
    shiftId?: string;
    notesEcart?: string;
    productSummaries?: ProductStockSummaryItem[];
}

const dummyCloturesAvecProductSummaries: ClotureCaisseData[] = [
    {
        id: 'CLO001', dateHeureCloture: new Date(Date.now() - 86400000 * 1).toISOString(), fondDeCaisseInitial: 50000,
        totalVentesEspeces: 350000, totalVentesCarte: 200000, totalVentesMobile: 150000, totalAutresEncaissements: 0, totalDecaissements: 10000,
        montantTheoriqueCaisse: 740000, montantReelCompte: 739500, ecartConstatate: -500,
        caissierNom: 'Jean C.', shiftId: 'SHIFT001', notesEcart: 'Petit écart, possible erreur rendu monnaie.'

    },
    {
        id: 'CLO002', dateHeureCloture: new Date(Date.now() - 86400000 * 2).toISOString(), fondDeCaisseInitial: 50000,
        totalVentesEspeces: 420000, totalVentesCarte: 250000, totalVentesMobile: 180000, totalAutresEncaissements: 5000, totalDecaissements: 0,
        montantTheoriqueCaisse: 905000, montantReelCompte: 905000, ecartConstatate: 0,
        caissierNom: 'Jean C.', shiftId: 'SHIFT002'

    },
    {
        id: 'CLO003', dateHeureCloture: new Date(Date.now() - 86400000 * 3).toISOString(), fondDeCaisseInitial: 60000,
        totalVentesEspeces: 300000, totalVentesCarte: 150000, totalVentesMobile: 100000, totalAutresEncaissements: 2000, totalDecaissements: 5000,
        montantTheoriqueCaisse: 607000, montantReelCompte: 607500, ecartConstatate: 500,
        caissierNom: 'Aisha K.', shiftId: 'SHIFT003', notesEcart: 'Excédent mineur.'

    },
];


// --- PAGE PRINCIPALE ---
const HistoriqueCloturesCaissePage: React.FC = () => {
    const [clotures, setClotures] = useState<ClotureCaisseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ dateDebut: '', dateFin: '' }); // Retrait de caissierNomFiltre ici pour le caissier actuel
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Peut être ajusté

    // Correction: Déclaration complète du state avec destructuration correcte
    const [, setSelectedCloture] = useState<ClotureCaisseData | null>(null);
    
    // Ajout de la fonction manquante pour fermer le modal

    const CAISSIER_CONNECTE_NOM = 'Jean C.'; // Simulé: à remplacer par la logique d'authentification

    useEffect(() => {
        setIsLoading(true);
        // Filtrage pour le caissier connecté se fait ici directement
        const dataDuCaissierConnecte = dummyCloturesAvecProductSummaries.filter(
            c => c.caissierNom === CAISSIER_CONNECTE_NOM
        );

        setTimeout(() => {
            setClotures(dataDuCaissierConnecte.sort((a,b) => new Date(b.dateHeureCloture).getTime() - new Date(a.dateHeureCloture).getTime()));
            setIsLoading(false);
        }, 500);
    }, [CAISSIER_CONNECTE_NOM]); // On dépend du caissier connecté pour recharger si besoin (rare pour cette vue)

    const filteredClotures = useMemo(() => {
        return clotures.filter(cloture => {
            const dateCloture = new Date(cloture.dateHeureCloture);
            const dateDebutOk = !filters.dateDebut || dateCloture.getTime() >= new Date(filters.dateDebut + "T00:00:00.000Z").getTime();
            const dateFinOk = !filters.dateFin || dateCloture.getTime() <= new Date(filters.dateFin + "T23:59:59.999Z").getTime();
            return dateDebutOk && dateFinOk;
        });
    }, [clotures, filters.dateDebut, filters.dateFin]);

    const paginatedClotures = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredClotures.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredClotures, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredClotures.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);

    const handleViewDetails = (clotureData: ClotureCaisseData) => {
        console.log(`Afficher les détails pour la clôture ID: ${clotureData.id}.`);
        console.log("Données associées:", JSON.stringify(clotureData.productSummaries, null, 2));
        setSelectedCloture(clotureData);
        // Quand le vrai modal sera implémenté, il recevra `selectedCloture`
        // et utilisera `selectedCloture.productSummaries`
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                    <FiArchive className="inline-block mr-2 mb-1 h-5 w-5" />Mes Clôtures de Caisse
                </h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Filtrer par période</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                        <label htmlFor="dateDebut" className="block text-xs font-medium text-gray-700 mb-1">Date de début</label>
                        <input type="date" name="dateDebut" id="dateDebut" value={filters.dateDebut} onChange={handleFilterChange}
                               className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-xs" />
                    </div>
                    <div>
                        <label htmlFor="dateFin" className="block text-xs font-medium text-gray-700 mb-1">Date de fin</label>
                        <input type="date" name="dateFin" id="dateFin" value={filters.dateFin} onChange={handleFilterChange}
                               className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-xs" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date Clôture</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Total Ventes Espèces</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Total Ventes Carte</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Total Ventes Mobile</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Théorique Caisse</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Réel Compté</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Écart</th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedClotures.length > 0 ? paginatedClotures.map(cloture => (
                                    <tr key={cloture.id} className="hover:bg-purple-50/30 transition-colors duration-150">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(cloture.dateHeureCloture).toLocaleString('fr-FR', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-green-600">{formatXAF(cloture.totalVentesEspeces)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-blue-600">{formatXAF(cloture.totalVentesCarte)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-orange-600">{formatXAF(cloture.totalVentesMobile)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">{formatXAF(cloture.montantTheoriqueCaisse)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">{formatXAF(cloture.montantReelCompte)}</td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-right font-semibold ${
                                            cloture.ecartConstatate < 0 ? 'text-red-600' :
                                            cloture.ecartConstatate > 0 ? 'text-green-600' : 'text-gray-700'
                                        }`}>
                                            {formatXAF(cloture.ecartConstatate)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleViewDetails(cloture)}
                                                className="text-purple-600 hover:text-purple-800 transition duration-150 p-1 rounded-full hover:bg-purple-100"
                                                title="Voir détails de la clôture">
                                                <FiEye size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={8} className="text-center px-6 py-10 text-gray-500 italic">Aucune clôture de caisse ne correspond aux critères sélectionnés.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                             <div className="flex-1 flex justify-between sm:hidden">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Précédent</button>
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Suivant</button>
                             </div>
                             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs text-gray-700">
                                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' '}à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredClotures.length)}</span>
                                        {' '}sur <span className="font-medium">{filteredClotures.length}</span> résultats
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> <FiChevronLeft className="h-4 w-4" /> </button>
                                        {[...Array(totalPages).keys()].map(page => (
                                            <button key={page + 1} onClick={() => handlePageChange(page + 1)} aria-current={currentPage === page + 1 ? 'page' : undefined}
                                                className={`relative inline-flex items-center px-3 py-1.5 border text-xs font-medium ${ currentPage === page + 1 ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                                {page + 1}
                                            </button>
                                        ))}
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> <FiChevronRight className="h-4 w-4" /> </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Le Modal sera ré-implémenté ici ultérieurement en utilisant `selectedCloture` et `handleCloseModal`
                Exemple:
                {selectedCloture && (
                    <NomDeVotreFuturModalTableau
                        clotureData={selectedCloture} // Il prendra selectedCloture.productSummaries
                        onClose={handleCloseModal}
                    />
                )}
            */}
        </DashboardLayout>
    );
};

export default HistoriqueCloturesCaissePage;