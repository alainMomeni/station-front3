// src/page/gerant/GerantPerfPersonnelPage.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiUserCheck, FiCalendar, FiEye, FiUsers } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { RecapPerformanceEmploye, EmployeSimple } from '../../types/personnel'; // Adapter chemin
// --- Données Mock ---
// Réutiliser dummyEmployesSimples de GerantVentesPersonnelPage ou le redéfinir
const dummyEmployesPourPerf: EmployeSimple[] = [
  { id: 'emp1', nomComplet: 'Natalya P.', rolePrincipal: 'pompiste' as const },
  { id: 'emp2', nomComplet: 'Jean C.', rolePrincipal: 'caissier' as const },
  { id: 'emp3', nomComplet: 'Ali K.', rolePrincipal: 'pompiste' as const },
  { id: 'emp5', nomComplet: 'Moussa D.', rolePrincipal: 'polyvalent' as const },
];

const fetchRecapPerformancePersonnel = async (
  dateDebut: string,
  dateFin: string,
  employeIdFiltre?: string
): Promise<RecapPerformanceEmploye[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Fetching performance pour période ${dateDebut} à ${dateFin}, employé: ${employeIdFiltre}`);

  let employesAAnalyser = employeIdFiltre 
    ? dummyEmployesPourPerf.filter(e => e.id === employeIdFiltre) 
    : dummyEmployesPourPerf;

  return employesAAnalyser.map(emp => {
    const nbQuarts = Math.floor(Math.random() * 15) + 5; // Entre 5 et 20 quarts sur la période
    const nbRetards = Math.floor(Math.random() * 3);
    const nbAbsJ = Math.floor(Math.random() * 2);
    const nbAbsNJ = Math.random() > 0.8 ? 1 : 0;
    const nbTransac = nbQuarts * (Math.floor(Math.random() * 20) + 10); // 10-30 transac/quart
    let caTotal = 0;
    let volTotal = 0;

    if(emp.rolePrincipal === 'pompiste' || emp.rolePrincipal === 'polyvalent') {
        caTotal = nbTransac * (Math.random() * 8000 + 3000); // Vente moyenne carburant
        volTotal = caTotal / (Math.random() * 100 + 750); // Prix moyen
    } else { // Caissier
        caTotal = nbTransac * (Math.random() * 1000 + 200); // Vente moyenne boutique
    }

    return {
      employeId: emp.id,
      nomComplet: emp.nomComplet,
      rolePrincipal: emp.rolePrincipal as "pompiste" | "caissier" | "polyvalent" | "chef_de_piste",
      rolesTenusSurPeriode: [emp.rolePrincipal.charAt(0).toUpperCase() + emp.rolePrincipal.slice(1)],
      nombreQuartsTravailles: nbQuarts,
      nombreRetards: nbRetards,
      nombreAbsencesJustifiees: nbAbsJ,
      nombreAbsencesNonJustifiees: nbAbsNJ,
      totalHeuresTravaillees: nbQuarts * 8, // Supposant 8h/quart
      chiffreAffairesTotal: parseFloat(caTotal.toFixed(0)),
      volumeTotalVendu: emp.rolePrincipal !== 'caissier' ? parseFloat(volTotal.toFixed(2)) : undefined,
      uniteVolume: emp.rolePrincipal !== 'caissier' ? 'L' as const : undefined,
      nombreTotalTransactions: nbTransac,
      venteMoyenneParTransaction: nbTransac > 0 ? parseFloat((caTotal/nbTransac).toFixed(0)) : 0,
    };
  }).sort((a,b) => b.chiffreAffairesTotal - a.chiffreAffairesTotal);
};

// TODO: Fonction pour fetcher le détail des quarts d'un employé (pour la V2 de cette page)
// const fetchDetailsQuartsEmploye = async (employeId: string, dateDebut: string, dateFin: string): Promise<DetailQuartTravailleEmploye[]> => { ... }
// --------------------

const GerantPerfPersonnelPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [filtreEmployeId, setFiltreEmployeId] = useState('');
  
  const [performances, setPerformances] = useState<RecapPerformanceEmploye[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Pour la vue détaillée (V2)
  // const [selectedEmployeDetails, setSelectedEmployeDetails] = useState<DetailQuartTravailleEmploye[] | null>(null);
  // const [isLoadingDetails, setIsLoadingDetails] = useState(false);


  useEffect(() => {
    const loadPerformances = async () => {
      setIsLoading(true);
      // setSelectedEmployeDetails(null); // Reset details si les filtres principaux changent
      try {
        const data = await fetchRecapPerformancePersonnel(dateDebut, dateFin, filtreEmployeId || undefined);
        setPerformances(data);
      } catch (error) {
        console.error("Erreur chargement performances personnel:", error);
      }
      setIsLoading(false);
    };
    loadPerformances();
  }, [dateDebut, dateFin, filtreEmployeId]);

  const handleVoirDetailsPerformance = (employeId: string) => {
    alert(`Affichage des détails de performance pour l'employé ${employeId} sur la période (À implémenter en V2).`);
    // Ici, on appellerait fetchDetailsQuartsEmploye et on afficherait une section ou un modal.
  };
  
  const formatCurrency = (val?: number) => val?.toLocaleString('fr-FR', {style:'currency', currency:'XAF', minimumFractionDigits:0}) || 'N/A';
  const formatVolume = (val?:number, unit?:string) => val?.toLocaleString('fr-FR', {maximumFractionDigits:0}) + ` ${unit || ''}` || 'N/A';
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-purple-500 focus:border-purple-500";


  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        <FiUserCheck className="inline-block mr-2 mb-1 h-6 w-6" /> Performance du Personnel
      </h1>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <label htmlFor="dateDebutPerf" className="block text-xs font-medium text-gray-600 mb-1"><FiCalendar className="inline mr-1"/>Période - Début</label>
                <input type="date" id="dateDebutPerf" value={dateDebut} onChange={e=>setDateDebut(e.target.value)} className={inputClass}/>
            </div>
            <div>
                <label htmlFor="dateFinPerf" className="block text-xs font-medium text-gray-600 mb-1"><FiCalendar className="inline mr-1"/>Période - Fin</label>
                <input type="date" id="dateFinPerf" value={dateFin} onChange={e=>setDateFin(e.target.value)} className={inputClass}/>
            </div>
            <div>
                <label htmlFor="filtreEmployeId" className="block text-xs font-medium text-gray-600 mb-1"><FiUsers className="inline mr-1"/>Employé</label>
                <select id="filtreEmployeId" value={filtreEmployeId} onChange={e=>setFiltreEmployeId(e.target.value)} className={`${inputClass} cursor-pointer`}>
                    <option value="">Tous les Employés</option>
                    {dummyEmployesPourPerf.map(emp => <option key={emp.id} value={emp.id}>{emp.nomComplet}</option>)}
                </select>
            </div>
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-20"><Spinner size="lg"/></div>}

      {!isLoading && performances.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">Aucune donnée de performance à afficher pour les critères.</div>
      )}

      {!isLoading && performances.length > 0 && (
          <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="th-class">Employé</th>
                            <th className="th-class text-center hidden md:table-cell">Quarts</th>
                            <th className="th-class text-center">Ponctualité (Ret./Abs.J/Abs.NJ)</th>
                            <th className="th-class text-right">CA Total Généré</th>
                            <th className="th-class text-right hidden sm:table-cell">Volume Vendu</th>
                            <th className="th-class text-right hidden md:table-cell">Transac.</th>
                            <th className="th-class text-right hidden lg:table-cell">Vente Moy./Trans.</th>
                            <th className="th-class text-center">Détails</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {performances.map(p => (
                        <tr key={p.employeId} className="hover:bg-purple-50/20">
                            <td className="px-3 py-2.5 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{p.nomComplet}</div>
                                <div className="text-xxs text-gray-500">{p.rolesTenusSurPeriode?.join(', ')}</div>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center hidden md:table-cell">{p.nombreQuartsTravailles}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center">
                                <span className={p.nombreRetards > 0 ? 'text-orange-600 font-semibold' : ''}>{p.nombreRetards}</span> / {' '}
                                <span className={p.nombreAbsencesJustifiees > 0 ? 'text-yellow-600' : ''}>{p.nombreAbsencesJustifiees}</span> / {' '}
                                <span className={p.nombreAbsencesNonJustifiees > 0 ? 'text-red-600 font-semibold' : ''}>{p.nombreAbsencesNonJustifiees}</span>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-semibold text-green-600">{formatCurrency(p.chiffreAffairesTotal)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right text-blue-600 hidden sm:table-cell">{formatVolume(p.volumeTotalVendu, p.uniteVolume)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right text-gray-600 hidden md:table-cell">{p.nombreTotalTransactions}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right text-gray-600 hidden lg:table-cell">{formatCurrency(p.venteMoyenneParTransaction)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center">
                                <button onClick={() => handleVoirDetailsPerformance(p.employeId)} className="text-purple-600 hover:text-purple-900" title="Voir détails performance et quarts">
                                    <FiEye size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
      )}
      {/* Zone pour afficher les détails de performance d'un employé (V2) */}
      {/* {selectedEmployeDetails && !isLoadingDetails && <div className="mt-6 bg-white p-4 rounded-lg shadow"> ... affichez les détails ... </div>} */}
      <style>{`
        .th-class { @apply px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
      `}</style>
    </DashboardLayout>
  );
};

export default GerantPerfPersonnelPage;