// src/page/pompiste/HistoriqueQuartsPompistePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { 
    FiChevronLeft, FiChevronRight, FiEye, FiArchive, FiFilter // Ajout de FiDollarSign
} from 'react-icons/fi';

// --- INTERFACES POUR L'HISTORIQUE DES QUARTS POMPISTE ---
interface IndexParPompeCuve {
  idPompeCuve: string; // Peut être un ID combiné ou nom "Pompe P01 - SP95"
  nomCarburant: string;
  indexDebut: number;
  indexFin: number;
  volumeVendu: number;
}

interface SyntheseQuartData {
  id: string; // Identifiant unique du résumé de quart
  pompisteNom: string; // Simulé pour l'instant, viendrait du contexte utilisateur
  dateHeureDebut: string; // ISOString
  dateHeureFin: string;   // ISOString
  pompesGerees: string[]; // ex: ['P01', 'P02']
  indexDetailsParPompe?: IndexParPompeCuve[]; // Détail optionnel si on ouvre un modal
  totalVolumeCarburantVenduLitres: number;
  totalValeurVenduXAF: number; // Nouveau
  totalVentesEspeces: number;   // Nouveau
  totalVentesCarte: number;     // Nouveau
  totalVentesMobile: number;    // Nouveau
  notesQuart?: string;
}

// --- DONNÉES MOCK POUR HISTORIQUE QUARTS POMPISTE ---
// Simuler des quarts pour le pompiste 'Natalya'
const dummySynthesesQuart: SyntheseQuartData[] = [
  {
    id: 'QUART_N_001', pompisteNom: 'Natalya',
    dateHeureDebut: new Date(Date.now() - 86400000 * 1 - 3600000 * 8).toISOString(), // Hier, de 7h à 15h
    dateHeureFin: new Date(Date.now() - 86400000 * 1).toISOString(),
    pompesGerees: ['P01', 'P02'],
    totalVolumeCarburantVenduLitres: 1850.75,
    totalValeurVenduXAF: 1275000,
    totalVentesEspeces: 750000,
    totalVentesCarte: 375000,
    totalVentesMobile: 150000,
    indexDetailsParPompe: [
        { idPompeCuve: 'P01-SP95', nomCarburant: 'SP95', indexDebut: 123450.25, indexFin: 123900.50, volumeVendu: 450.25 },
        { idPompeCuve: 'P02-Diesel', nomCarburant: 'Diesel', indexDebut: 88760.90, indexFin: 89500.90, volumeVendu: 740.00 },
        { idPompeCuve: 'P01-SP98', nomCarburant: 'SP98', indexDebut: 55000.00, indexFin: 55120.00, volumeVendu: 120.00 },
        { idPompeCuve: 'P02-DieselB', nomCarburant: 'Diesel Extra', indexDebut: 70000.00, indexFin: 70540.50, volumeVendu: 540.50 },
    ],
    notesQuart: 'Pompe P02 un peu lente sur le Diesel Extra.'
  },
  {
    id: 'QUART_N_002', pompisteNom: 'Natalya',
    dateHeureDebut: new Date(Date.now() - 86400000 * 2 - 3600000 * 8).toISOString(),
    dateHeureFin: new Date(Date.now() - 86400000 * 2).toISOString(),
    pompesGerees: ['P01', 'P03'],
    totalVolumeCarburantVenduLitres: 2105.30,
    totalValeurVenduXAF: 1450000,
    totalVentesEspeces: 850000,
    totalVentesCarte: 425000,
    totalVentesMobile: 175000,
  },
  {
    id: 'QUART_N_003', pompisteNom: 'Natalya',
    dateHeureDebut: new Date(Date.now() - 86400000 * 3 - 3600000 * 8).toISOString(),
    dateHeureFin: new Date(Date.now() - 86400000 * 3).toISOString(),
    pompesGerees: ['P02', 'P04'],
    totalVolumeCarburantVenduLitres: 1975.00,
    totalValeurVenduXAF: 1350000,
    totalVentesEspeces: 800000,
    totalVentesCarte: 400000,
    totalVentesMobile: 150000,
    notesQuart: 'Client important servi sur P04 (Société ABC).'
  },
    // Pour d'autres pompistes, si on voulait simuler une vue admin plus tard
  {
    id: 'QUART_J_001', pompisteNom: 'Jean', // Autre pompiste pour tester les filtres (si on les ajoutait)
    dateHeureDebut: new Date(Date.now() - 86400000 * 1 - 3600000 * 8).toISOString(),
    dateHeureFin: new Date(Date.now() - 86400000 * 1).toISOString(),
    pompesGerees: ['P03', 'P04'],
    totalVolumeCarburantVenduLitres: 1750.00,
    totalValeurVenduXAF: 1200000,
    totalVentesEspeces: 700000,
    totalVentesCarte: 300000,
    totalVentesMobile: 200000,
  },
];

// Modal de Détails (simplifié pour cet exemple)
const QuartDetailModal: React.FC<{ quart: SyntheseQuartData | null; onClose: () => void }> = ({ quart, onClose }) => {
    if (!quart) return null;

    const formatLitresDisplay = (litres: number) => litres.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' L';
    const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    }).format(amount);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl transform" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-700">
                        Détails du Quart - {quart.id}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200" aria-label="Fermer">
                        X
                    </button>
                </div>
                <div className="space-y-3 text-sm">
                    <p><strong>Pompiste:</strong> {quart.pompisteNom}</p>
                    <p><strong>Début:</strong> {new Date(quart.dateHeureDebut).toLocaleString('fr-FR')}</p>
                    <p><strong>Fin:</strong> {new Date(quart.dateHeureFin).toLocaleString('fr-FR')}</p>
                    <p><strong>Pompes Gérées:</strong> {quart.pompesGerees.join(', ')}</p>
                    <p><strong>Volume Total Vendu:</strong> <span className="font-semibold text-blue-600">{formatLitresDisplay(quart.totalVolumeCarburantVenduLitres)}</span></p>
                    <p><strong>Valeur Totale:</strong> <span className="font-semibold text-green-600">{formatXAF(quart.totalValeurVenduXAF)}</span></p>
                    <p><strong>Espèces:</strong> <span className="font-semibold text-green-600">{formatXAF(quart.totalVentesEspeces)}</span></p>
                    <p><strong>Carte:</strong> <span className="font-semibold text-blue-600">{formatXAF(quart.totalVentesCarte)}</span></p>
                    <p><strong>Mobile:</strong> <span className="font-semibold text-orange-600">{formatXAF(quart.totalVentesMobile)}</span></p>
                    {quart.notesQuart && <p><strong>Notes:</strong> <pre className="whitespace-pre-wrap font-sans bg-gray-50 p-2 rounded text-xs">{quart.notesQuart}</pre></p>}

                    {quart.indexDetailsParPompe && quart.indexDetailsParPompe.length > 0 && (
                        <div className="mt-4 pt-3 border-t">
                            <h4 className="font-semibold text-gray-700 mb-2">Détail des Index :</h4>
                            <div className="max-h-60 overflow-y-auto space-y-1 pr-1 text-xs">
                                {quart.indexDetailsParPompe.map(detail => (
                                    <div key={detail.idPompeCuve} className="p-2 bg-purple-50/50 rounded border border-purple-200">
                                        <p className="font-medium text-purple-800">{detail.idPompeCuve} ({detail.nomCarburant})</p>
                                        <div className="grid grid-cols-3 gap-1">
                                            <span>Début: {detail.indexDebut.toFixed(2)}</span>
                                            <span>Fin: {detail.indexFin.toFixed(2)}</span>
                                            <span className="font-semibold">Vendu: {formatLitresDisplay(detail.volumeVendu)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700">Fermer</button>
                </div>
            </div>
        </div>
    );
};


// --- PAGE PRINCIPALE ---
const HistoriqueQuartsPompistePage: React.FC = () => {
    const [synthesesQuart, setSynthesesQuart] = useState<SyntheseQuartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ dateDebut: '', dateFin: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuart, setSelectedQuart] = useState<SyntheseQuartData | null>(null);
    const itemsPerPage = 10;

    // SIMULER LE POMPISTE CONNECTÉ
    const POMPISTE_CONNECTE_NOM = 'Natalya';

    useEffect(() => {
        setIsLoading(true);
        // TODO: Remplacer par un appel API réel à Directus (filtrer côté backend par pompisteId)
        // Pour la démo, on filtre les données mock
        const dataDuPompisteConnecte = dummySynthesesQuart.filter(
            sq => sq.pompisteNom === POMPISTE_CONNECTE_NOM
        );

        setTimeout(() => {
            setSynthesesQuart(dataDuPompisteConnecte.sort((a,b) => new Date(b.dateHeureDebut).getTime() - new Date(a.dateHeureDebut).getTime()));
            setIsLoading(false);
        }, 500);
    }, [POMPISTE_CONNECTE_NOM]); // Relancer si le pompiste change (pas applicable ici mais bonne pratique)

    const filteredSyntheses = useMemo(() => {
        return synthesesQuart.filter(sq => {
            const dateDebutQuart = new Date(sq.dateHeureDebut);
            const dateDebutOk = !filters.dateDebut || dateDebutQuart.getTime() >= new Date(filters.dateDebut + "T00:00:00.000Z").getTime();
            // On filtre sur le début du quart. Si on voulait filtrer sur une plage incluant la fin du quart, il faudrait ajuster la logique
            const dateFinOk = !filters.dateFin || dateDebutQuart.getTime() <= new Date(filters.dateFin + "T23:59:59.999Z").getTime();
            return dateDebutOk && dateFinOk;
        });
    }, [synthesesQuart, filters.dateDebut, filters.dateFin]);

    const paginatedSyntheses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSyntheses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSyntheses, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredSyntheses.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const formatLitres = (amount: number) => 
        `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
    const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    }).format(amount);

    const handleViewDetails = (quartData: SyntheseQuartData) => {
        setSelectedQuart(quartData);
    };

    const handleCloseModal = () => {
        setSelectedQuart(null);
    }

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                    <FiArchive className="inline-block mr-2 mb-1 h-5 w-5" />Mes Quarts de Travail
                </h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                  <FiFilter className="mr-2 h-4 w-4" /> Filtrer par période de début de quart
                </h3>
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
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Ventes</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Pompes</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Vendu (L)
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"> Valeur Totale
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Total Ventes Espèces
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Total Ventes Carte
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Total Ventes Mobile
                                    </th>
                                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedSyntheses.length > 0 ? paginatedSyntheses.map(sq => (
                                    <tr key={sq.id} className="hover:bg-purple-50/30 transition-colors duration-150">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {new Date(sq.dateHeureFin).toLocaleString('fr-FR', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-xs">
                                            {sq.pompesGerees.map(p => <span key={p} className="inline-block bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded mr-1 mb-1">{p}</span>)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-blue-600">
                                            {formatLitres(sq.totalVolumeCarburantVenduLitres)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-700">
                                            {formatXAF(sq.totalValeurVenduXAF)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-green-600">
                                            {formatXAF(sq.totalVentesEspeces)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-blue-600">
                                            {formatXAF(sq.totalVentesCarte)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-orange-600">
                                            {formatXAF(sq.totalVentesMobile)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleViewDetails(sq)}
                                                className="text-purple-600 hover:text-purple-800 transition duration-150 p-1 rounded-full hover:bg-purple-100"
                                                title="Voir détails du quart">
                                                <FiEye size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={8} className="text-center px-6 py-10 text-gray-500 italic">Aucun historique de quart ne correspond aux critères.</td></tr>
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
                                        {' '}à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredSyntheses.length)}</span>
                                        {' '}sur <span className="font-medium">{filteredSyntheses.length}</span> quarts
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

            {/* Modal de détails */}
            {selectedQuart && (
                <QuartDetailModal
                    quart={selectedQuart}
                    onClose={handleCloseModal}
                />
            )}
        </DashboardLayout>
    );
};

export default HistoriqueQuartsPompistePage;