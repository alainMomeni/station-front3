// src/page/gerant/GerantVentesPersonnelPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { 
    FiBarChart2, FiChevronDown, FiChevronLeft, FiChevronRight, FiCalendar
} from 'react-icons/fi';
import QuartSelectorWidget, { type QuartTravail } from '../../components/widgets/QuartSelectorWidget'; // Adapter le chemin
import { format, startOfDay, addDays, subDays } from 'date-fns';
// Supposons que fr locale a été configurée globalement pour date-fns ou importée ici si besoin
// import { fr } from 'date-fns/locale'; 
import type { PerformanceVenteEmploye, EmployeSimple, VenteEmployeDetail } from '../../types/ventes'; // Adapter le chemin
import ModalDetailTransactionsEmploye from '../../components/modals/ModalDetailTransactionsEmploye'; // NOUVEL IMPORT

// --- Données Mock ---
const dummyEmployesSimples: EmployeSimple[] = [
  { id: 'emp1', nomComplet: 'Natalya P.', rolePrincipal: 'pompiste' },
  { id: 'emp2', nomComplet: 'Jean C.', rolePrincipal: 'caissier' },
  { id: 'emp3', nomComplet: 'Ali K.', rolePrincipal: 'pompiste' },
  { id: 'emp5', nomComplet: 'Moussa D.', rolePrincipal: 'polyvalent' },
];

const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  return [
    { id: `tous_${dateIsoSuffix}`, libelle: `Journée Complète - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T00:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T23:59:59Z`, statut: 'termine' },
    { id: `matin_${dateIsoSuffix}`, libelle: `07h-15h - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'en_cours' : (date < new Date() ? 'termine' : 'planifie')},
    { id: `soir_${dateIsoSuffix}`, libelle: `15h-23h - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >=15 ? 'en_cours' : (date < new Date() || (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >= 23) ? 'termine' : 'planifie') },
    { id: `nuit_${dateIsoSuffix}`, libelle: `23h-07h - ${dateStr} au ${format(addDays(date,1), 'dd/MM/yyyy')}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, dateFin: `${format(addDays(date,1), 'yyyy-MM-dd')}T07:00:00Z`, statut: (date < subDays(new Date(),1)) ? 'termine' : 'planifie' },
  ];
};

const fetchVentesParPersonnel = async (date: Date, quartId: string | null, employeIdFiltre: string | null): Promise<PerformanceVenteEmploye[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log(`Fetching ventes pour date: ${format(date, 'yyyy-MM-dd')}, quart: ${quartId}, employé: ${employeIdFiltre}`);
  
  let result: PerformanceVenteEmploye[] = [];
  const employesAyantTravaille = employeIdFiltre ? dummyEmployesSimples.filter(e => e.id === employeIdFiltre) : dummyEmployesSimples;

  employesAyantTravaille.forEach(emp => {
    if (Math.random() > 0.3 || (quartId && quartId.includes('tous'))) { 
      const isPompiste = emp.rolePrincipal === 'pompiste' || (emp.rolePrincipal === 'polyvalent' && Math.random() > 0.5);
      const nbTransactions = Math.floor(Math.random() * 15) + 5;
      let totalBrutCalcul = 0;
      
      const detailsTransactions: VenteEmployeDetail[] = [];
      for (let i = 0; i < nbTransactions; i++) {
        const heure = `${Math.floor(Math.random()*16 + 7).toString().padStart(2,'0')}:${Math.floor(Math.random()*60).toString().padStart(2,'0')}`;
        const qte = Math.floor(Math.random() * (isPompiste ? 30 : 3)) + 1;
        const prixUnitaire = isPompiste ? (Math.random() * 150 + 700) : (Math.random() * 2000 + 300);
        const montantLigneBrut = qte * prixUnitaire;
        const remiseLigne = Math.random() > 0.8 ? montantLigneBrut * 0.1 : 0;
        
        detailsTransactions.push({
          id: `tx_${emp.id}_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`, // ID plus unique
          heure: heure,
          produitService: isPompiste ? (Math.random() > 0.5 ? 'SP95' : 'Diesel') : `Produit Boutique ${String.fromCharCode(65+i)}`,
          quantite: qte,
          unite: isPompiste ? 'L' : 'Unité',
          montantBrut: parseFloat(montantLigneBrut.toFixed(0)),
          remise: parseFloat(remiseLigne.toFixed(0)),
          montantNet: parseFloat((montantLigneBrut - remiseLigne).toFixed(0)),
          modePaiement: ['Espèces', 'Carte', 'Mobile Money'][Math.floor(Math.random()*3)]
        });
        totalBrutCalcul += montantLigneBrut;
      }
      detailsTransactions.sort((a,b) => a.heure.localeCompare(b.heure));
      const totalRemisesGlobal = detailsTransactions.reduce((sum, tx) => sum + tx.remise, 0);

      result.push({
        employeId: emp.id,
        employeNom: emp.nomComplet,
        roleQuart: isPompiste ? 'pompiste' : 'caissier',
        posteLibelle: isPompiste ? `Pompes P0${Math.floor(Math.random()*4)+1}` : 'Caisse Principale',
        nombreTransactions: nbTransactions,
        totalVolumeVendu: isPompiste ? detailsTransactions.reduce((sum, tx) => sum + (tx.unite === 'L' ? tx.quantite : 0), 0) : undefined,
        uniteVolume: isPompiste ? 'L' : undefined,
        totalMontantBrutVentes: parseFloat(totalBrutCalcul.toFixed(0)),
        totalRemisesAccordees: parseFloat(totalRemisesGlobal.toFixed(0)),
        totalMontantNetEncaisse: parseFloat((totalBrutCalcul - totalRemisesGlobal).toFixed(0)),
        detailsTransactions: detailsTransactions,
      });
    }
  });
  return result.sort((a,b) => b.totalMontantNetEncaisse - a.totalMontantNetEncaisse);
};
// --------------------

const GerantVentesPersonnelPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
  const [selectedQuartId, setSelectedQuartId] = useState<string | null>(null);
  const [selectedEmployeId, setSelectedEmployeId] = useState<string | null>(null);
  
  const [ventesPersonnel, setVentesPersonnel] = useState<PerformanceVenteEmploye[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployePourDetail, setSelectedEmployePourDetail] = useState<PerformanceVenteEmploye | null>(null);

  useEffect(() => {
    const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
    setQuartsDuJour(nouveauxQuarts);
    const quartJourneeComplete = nouveauxQuarts.find(q => q.id.startsWith('tous_'));
    setSelectedQuartId(quartJourneeComplete ? quartJourneeComplete.id : (nouveauxQuarts.length > 0 ? nouveauxQuarts[0].id : null));
  }, [selectedDate]);

  useEffect(() => {
    const loadVentes = async () => {
      if (!selectedDate || !selectedQuartId) {
          setVentesPersonnel([]);
          return;
      }
      setIsLoading(true);
      try {
        const data = await fetchVentesParPersonnel(selectedDate, selectedQuartId, selectedEmployeId);
        setVentesPersonnel(data);
      } catch (error) {
        console.error("Erreur chargement ventes personnel:", error);
      }
      setIsLoading(false);
    };
    loadVentes();
  }, [selectedDate, selectedQuartId, selectedEmployeId]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value));
    if (!isNaN(newDate.getTime())) { setSelectedDate(newDate); }
  };
  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 });
  };
  const formatVolume = (volume: number | undefined, unite?: string) => {
    if (volume === undefined) return 'N/A';
    return `${volume.toLocaleString('fr-FR', {maximumFractionDigits:2})} ${unite || ''}`;
  };
  
  const totals = useMemo(() => {
      return ventesPersonnel.reduce((acc, curr) => {
          acc.transactions += curr.nombreTransactions;
          acc.volume += curr.totalVolumeVendu || 0;
          acc.montantNet += curr.totalMontantNetEncaisse;
          return acc;
      }, {transactions: 0, volume: 0, montantNet: 0});
  }, [ventesPersonnel]);

  const handleRowClick = (performance: PerformanceVenteEmploye) => {
    setSelectedEmployePourDetail(performance);
    setShowDetailModal(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
           Performance des Ventes par Employé
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="w-full sm:w-auto">
              <div className="flex items-center bg-white rounded-lg shadow-sm">
                <button 
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))} 
                  className="p-2.5 rounded-l-lg border border-r-0 border-gray-300 hover:bg-purple-50 disabled:opacity-50 text-gray-600 hover:text-purple-600 transition-all duration-200 hover:shadow-sm disabled:hover:bg-transparent"
                  aria-label="Jour précédent" 
                  disabled={isLoading}
                >
                  <FiChevronLeft className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
                <div className="relative">
                  <input 
                    type="date" 
                    value={inputDateValue} 
                    onChange={handleDateInputChange} 
                    disabled={isLoading} 
                    className="p-2 border-y border-gray-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm w-full text-center bg-white appearance-none outline-none transition-colors duration-200" 
                    style={{minWidth: '160px'}} 
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <FiCalendar className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))} 
                  className="p-2.5 rounded-r-lg border border-l-0 border-gray-300 hover:bg-purple-50 disabled:opacity-50 text-gray-600 hover:text-purple-600 transition-all duration-200 hover:shadow-sm disabled:hover:bg-transparent"
                  aria-label="Jour suivant" 
                  disabled={isLoading}
                >
                  <FiChevronRight className="h-4 w-4 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <QuartSelectorWidget
                quartsDisponibles={quartsDuJour}
                quartSelectionneId={selectedQuartId}
                onQuartChange={setSelectedQuartId}
                disabled={isLoading || quartsDuJour.length === 0}
                label="" // Label déjà au-dessus
              />
            </div>

            <div className="w-full sm:w-auto">
              <div className="relative group">
                <select 
                  id="filtreEmploye" 
                  value={selectedEmployeId || ''} 
                  onChange={e => setSelectedEmployeId(e.target.value || null)} 
                  disabled={isLoading}
                  className="
                    block w-full text-sm border border-gray-300 
                    rounded-lg shadow-sm py-2 px-3 pr-10
                    focus:ring-2 focus:ring-purple-500/20 
                    focus:border-purple-500 
                    disabled:bg-gray-50 disabled:cursor-not-allowed
                    cursor-pointer bg-white appearance-none 
                    transition-all duration-200
                    hover:border-purple-400
                    group-hover:border-purple-400 outline-none
                    min-w-[220px]
                  "
                >
                  <option value="">Tous les Employés</option>
                  {dummyEmployesSimples.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nomComplet}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-purple-500 transition-colors">
                  <FiChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center"><Spinner size="lg"/></div>
      )}
      
      {!isLoading && ventesPersonnel.length === 0 && (
          <div className="text-gray-500 flex flex-col items-center">
            <FiBarChart2 className="h-12 w-12 mb-4 text-gray-400" />
            <p>Aucune donnée de vente à afficher pour les critères sélectionnés.</p>
          </div>
      )}

      {!isLoading && ventesPersonnel.length > 0 && (
        <div className="bg-white rounded-lg p-0 md:p-4 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Employé</th>
                  <th className="px-3 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Rôle / Poste</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider">Nb. Trans.</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Volume Vendu</th>
                  <th className="px-3 py-3 text-right font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Total Net Encaissé</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventesPersonnel.map(perf => (
                  <tr key={perf.employeId} className="hover:bg-purple-100 cursor-pointer transition-colors duration-150" onClick={() => handleRowClick(perf)}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{perf.employeNom}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{perf.roleQuart} - {perf.posteLibelle || ''}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-500 hidden sm:table-cell">
                      {perf.roleQuart.charAt(0).toUpperCase() + perf.roleQuart.slice(1)}
                      {perf.posteLibelle && <span className="block text-xs text-gray-400">{perf.posteLibelle}</span>}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-gray-700">{perf.nombreTransactions}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-blue-600 font-medium">{formatVolume(perf.totalVolumeVendu, perf.uniteVolume)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-green-600 font-semibold">{formatCurrency(perf.totalMontantNetEncaisse)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-bold text-gray-700">
                  <td className="px-4 py-2 text-left uppercase" colSpan={2}>Totaux {selectedQuartId?.startsWith("tous_") ? "Journée" : "Quart"}</td>
                  <td className="px-3 py-2 text-center">{totals.transactions}</td>
                  <td className="px-3 py-2 text-center text-blue-700">{formatVolume(totals.volume)}</td>
                  <td className="px-3 py-2 text-center text-green-700">{formatCurrency(totals.montantNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="px-1 md:px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              Cliquez sur une ligne pour voir le détail des transactions.
            </p>
          </div>
        </div>
      )}

      <ModalDetailTransactionsEmploye 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        performanceEmploye={selectedEmployePourDetail}
      />
    </DashboardLayout>
  );
};

export default GerantVentesPersonnelPage;