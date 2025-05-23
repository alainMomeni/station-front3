// src/page/chefDePiste/SaisieIndexChefDePistePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiSave, FiChevronsLeft, FiChevronsRight, FiAlertCircle, FiDroplet, FiEdit2, FiBarChart2, FiCopy } from 'react-icons/fi';
import QuartSelectorWidget, { type QuartTravail } from '../../components/widgets/QuartSelectorWidget';
import { format, startOfDay, addDays, subDays } from 'date-fns'; // Ajout pour la gestion de date
import { fr } from 'date-fns/locale';


interface CuvePourSaisieIndex {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  dernierIndexFinConnu?: number;
  unite: string;
  indexDebutQuart: string;
  indexFinQuart: string;
  indexFinTheorique?: number;
}

// --- Données Mock Dynamiques pour les Quarts basé sur la Date ---
const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  return [
    { id: `matin_${dateIsoSuffix}`, libelle: `(07h-15h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'en_cours' : (date < new Date() ? 'termine' : 'planifie')},
    { id: `soir_${dateIsoSuffix}`, libelle: `(15h-23h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >=15 ? 'en_cours' : (date < new Date() || (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >= 23) ? 'termine' : 'planifie') },
    { id: `nuit_${dateIsoSuffix}`, libelle: `(23h-07h) - ${dateStr} au ${format(addDays(date,1), 'dd/MM/yyyy')}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, dateFin: `${format(addDays(date,1), 'yyyy-MM-dd')}T07:00:00Z`, statut: (date < subDays(new Date(),1)) ? 'termine' : 'planifie' }, // Simplifié
  ];
};

const fetchCuvesPourQuartEtDate = async (quartId: string | null, date: Date): Promise<CuvePourSaisieIndex[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!quartId) return [];
  
  // Simuler que les données des cuves changent légèrement chaque jour/quart pour la démo
  const seed = date.getDate() + (quartId.includes('matin') ? 1 : quartId.includes('soir') ? 2 : 3);
  const variation = (index: number) => parseFloat((index + (seed * (Math.random() - 0.5) * 10)).toFixed(2));

  let cuvesData: Omit<CuvePourSaisieIndex, 'indexFinTheorique'>[] = [
    { id: 'cuve1', nomCuve: 'Cuve Principale 1', typeCarburant: 'Essence SP95', dernierIndexFinConnu: variation(123450.25), unite: 'L', indexDebutQuart: variation(123450.25).toString(), indexFinQuart: '' },
    { id: 'cuve2', nomCuve: 'Cuve Diesel A', typeCarburant: 'Diesel', dernierIndexFinConnu: variation(88760.90), unite: 'L', indexDebutQuart: variation(88760.90).toString(), indexFinQuart: '' },
    { id: 'cuve3', nomCuve: 'Réserve SP98', typeCarburant: 'Essence SP98', dernierIndexFinConnu: variation(55000.00), unite: 'L', indexDebutQuart: variation(55000.00).toString(), indexFinQuart: '' },
  ];

  // Pour un quart terminé, on peut simuler que les index de fin ont été saisis
  const quartSelectionne = generateDummyQuartsPourDate(date).find(q => q.id === quartId);
  if (quartSelectionne?.statut === 'termine') {
      cuvesData = cuvesData.map(c => {
          const debut = parseFloat(c.indexDebutQuart);
          return { ...c, indexFinQuart: variation(debut + 200 + Math.random()*100).toString() };
      });
  }


  return cuvesData.map(cuve => {
    let indexFinTheorique: number | undefined = undefined;
    const indexDebutNum = parseFloat(cuve.indexDebutQuart);
    if (!isNaN(indexDebutNum)) {
        let volumeVenduTheoriqueSimule = 0;
        if (cuve.indexFinQuart && !isNaN(parseFloat(cuve.indexFinQuart))) {
            const volumeVenduPhysique = parseFloat(cuve.indexFinQuart) - indexDebutNum;
            volumeVenduTheoriqueSimule = volumeVenduPhysique * (1 + (Math.random() - 0.5) * 0.05); // Ecart simulé +/- 2.5%
        } else {
            volumeVenduTheoriqueSimule = 150 + Math.random() * 150; // Simule une vente entre 150L et 300L
        }
        indexFinTheorique = indexDebutNum + volumeVenduTheoriqueSimule;
    }
    return {
        ...cuve,
        indexFinTheorique: indexFinTheorique ? parseFloat(indexFinTheorique.toFixed(2)) : undefined,
    };
  });
};
// ------------------------

const SaisieIndexChefDePistePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
  const [quartActifId, setQuartActifId] = useState<string | null>(null);

  const [cuves, setCuves] = useState<CuvePourSaisieIndex[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Global loading for date/quart changes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notesGenerales, setNotesGenerales] = useState('');
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Charger les quarts quand la date change
  useEffect(() => {
    setIsLoading(true);
    const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
    setQuartsDuJour(nouveauxQuarts);
    
    // Tenter de pré-sélectionner un quart (ex: 'en_cours' ou le premier)
    const quartEnCours = nouveauxQuarts.find(q => q.statut === 'en_cours');
    const premierQuart = nouveauxQuarts.length > 0 ? nouveauxQuarts[0].id : null;
    setQuartActifId(quartEnCours ? quartEnCours.id : premierQuart);
    // Le chargement des cuves sera déclenché par le useEffect dépendant de quartActifId (et selectedDate)
  }, [selectedDate]);

  // Charger les données des cuves quand le quartActifId OU selectedDate change
  useEffect(() => {
    const loadDataCuves = async () => {
      if (!quartActifId || !selectedDate) {
        setCuves([]);
        setIsLoading(false); // Assurer que le loading s'arrête
        return;
      }
      setIsLoading(true); // Commence le chargement pour les cuves
      setSubmitStatus(null);
      setNotesGenerales('');

      try {
        const fetchedCuves = await fetchCuvesPourQuartEtDate(quartActifId, selectedDate);
        const cuvesAvecPreRemplissage = fetchedCuves.map(cuve => ({
          ...cuve,
          indexDebutQuart: cuve.indexDebutQuart || cuve.dernierIndexFinConnu?.toString() || '',
        }));
        setCuves(cuvesAvecPreRemplissage);
      } catch (error) {
        console.error("Erreur de chargement des cuves:", error);
        setSubmitStatus({ type: 'error', message: "Erreur chargement données cuves."});
      }
      setIsLoading(false); // Fin du chargement global (date et cuves)
    };

    loadDataCuves();
  }, [quartActifId, selectedDate]); // Dépend de selectedDate et quartActifId

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value));
    if (!isNaN(newDate.getTime())) { // Vérifier si la date est valide
        setSelectedDate(newDate);
    }
  };
  
  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const handleQuartSelectionChange = (selectedId: string) => {
    setQuartActifId(selectedId);
  };

  const handleIndexChange = (cuveId: string, field: 'indexDebutQuart' | 'indexFinQuart', value: string) => {
    // ... (inchangé)
    setCuves(prevCuves =>
      prevCuves.map(cuve =>
        cuve.id === cuveId ? { ...cuve, [field]: value } : cuve
      )
    );
    setSubmitStatus(null);
  };

  const validateSaisies = (): boolean => {
    // ... (inchangé)
    for (const cuve of cuves) {
      const debut = parseFloat(cuve.indexDebutQuart);
      const fin = parseFloat(cuve.indexFinQuart);

      if (cuve.indexDebutQuart.trim() === '' || cuve.indexFinQuart.trim() === '') {
        setSubmitStatus({ type: 'error', message: `Saisir les deux index pour ${cuve.nomCuve}.` });
        return false;
      }
      if (isNaN(debut) || isNaN(fin)) {
        setSubmitStatus({ type: 'error', message: `Index pour ${cuve.nomCuve} invalides.` });
        return false;
      }
      if (fin <= debut) {
        setSubmitStatus({ type: 'error', message: `Pour ${cuve.nomCuve}, fin > début.` });
        return false;
      }
    }
    setSubmitStatus(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // ... (inchangé, sauf pour le console.log qui pourrait inclure la date)
    e.preventDefault();
    if (!validateSaisies() || !quartActifId) {
      if (!quartActifId) setSubmitStatus({type: 'error', message: 'Sélectionner un quart.'});
      return;
    }
    setIsSubmitting(true);
    const quartSoumis = quartsDuJour.find(q => q.id === quartActifId);
    console.log("Données soumises:", {
      dateSelectionnee: format(selectedDate, 'yyyy-MM-dd'),
      quart: quartSoumis?.libelle || quartActifId,
      notes: notesGenerales,
      // ... saisiesCuves
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus({ type: 'success', message: `Index pour '${quartSoumis?.libelle}' du ${format(selectedDate, 'dd/MM/yyyy')} enregistrés.` });
    setIsSubmitting(false);
  };

  const isQuartActuelModifiable = () => {
    const quart = quartsDuJour.find(q => q.id === quartActifId);
    // Un quart est modifiable s'il est 'en_cours' ou 'planifie' ET que la date sélectionnée n'est pas passée trop loin
    // ou est aujourd'hui. Pour la démo, on se base sur le statut simulé du quart.
    if (!quart) return false;
    // Cas où le quart est 'terminé' (ex: un quart de la veille affiché pour aujourd'hui à cause de dateDebut/dateFin chevauchant minuit)
    if (quart.statut === 'termine' && new Date(quart.dateFin) < startOfDay(new Date())) return false;
    return quart?.statut === 'en_cours' || quart?.statut === 'planifie';
  };
  
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
  const readOnlyInputClass = "mt-1 block w-full border-gray-200 bg-gray-100 rounded-md shadow-sm py-2 px-3 sm:text-sm cursor-not-allowed";

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          Saisie Index Cuves
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Date Picker */}
            <div className="flex items-center w-full sm:w-auto">
                <button onClick={() => setSelectedDate(prev => subDays(prev, 1))} className="p-2.5 rounded-l-md border border-r-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour précédent" disabled={isSubmitting || isLoading}>
                    <FiChevronsLeft size={18}/>
                </button>
                <input
                    type="date"
                    value={inputDateValue}
                    onChange={handleDateInputChange}
                    disabled={isSubmitting || isLoading}
                    className="p-2 border-y border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-full text-center"
                    style={{minWidth: '140px'}}
                />
                <button onClick={() => setSelectedDate(prev => addDays(prev, 1))} className="p-2.5 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour suivant" disabled={isSubmitting || isLoading}>
                     <FiChevronsRight size={18}/>
                </button>
            </div>
            {/* Quart Selector */}
            <div className="w-full sm:w-auto md:min-w-[280px]">
                <QuartSelectorWidget
                    quartsDisponibles={quartsDuJour}
                    quartSelectionneId={quartActifId}
                    onQuartChange={handleQuartSelectionChange}
                    disabled={isSubmitting || isLoading || quartsDuJour.length === 0}
                    label="Quart de travail"
                />
            </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {isLoading && (<div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>)}
        
        {!isLoading && !quartActifId && quartsDuJour.length > 0 && (
             <p className="text-center text-gray-500 py-10">Sélectionnez un quart pour commencer.</p>
        )}
        {!isLoading && quartsDuJour.length === 0 && (
             <p className="text-center text-gray-500 py-10">Aucun quart défini pour le {format(selectedDate, 'dd MMMM yyyy', {locale: fr})}.</p>
        )}
        
        {!isLoading && quartActifId && (
            <>
                {/* ... (message 'Saisissez les index...' et 'submitStatus' inchangés) ... */}
                <p className="text-sm text-gray-600 mb-6">
                    {isQuartActuelModifiable()
                    ? "Saisissez les index physiques pour le quart sélectionné. L'index de fin théorique est calculé par le système."
                    : "Consultation des index pour un quart terminé. Modification non permise."}
                </p>
                {submitStatus && (
                <div className={`p-3 rounded-md mb-6 flex items-start ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{submitStatus.message}</p>
                </div>
                )}


                <div className="space-y-8">
                {cuves.map((cuve) => {
                    // ... (calculs de volumePhysique et ecartIndexFin inchangés) ...
                    const debutPhys = parseFloat(cuve.indexDebutQuart);
                    const finPhys = parseFloat(cuve.indexFinQuart);
                    const finTheo = cuve.indexFinTheorique;
                    let ecartIndexFin: number | undefined;
                    let volumePhysique: number | undefined;

                    if (!isNaN(debutPhys) && !isNaN(finPhys) && finPhys > debutPhys) {
                        volumePhysique = finPhys - debutPhys;
                    }
                    if (!isNaN(finPhys) && finTheo !== undefined) {
                        ecartIndexFin = finPhys - finTheo;
                    }

                    return (
                    <div key={cuve.id} className={`p-4 border rounded-lg transition-shadow ${isQuartActuelModifiable() ? 'border-gray-300 hover:shadow-md' : 'border-gray-200 bg-gray-50'}`}>
                        {/* ... (affichage des champs pour la cuve inchangé) ... */}
                        <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                            <FiDroplet className="mr-2 h-5 w-5 text-purple-500" />
                            {cuve.nomCuve} - <span className="text-gray-600 font-normal text-base">{cuve.typeCarburant}</span>
                        </h3>
                        {/* Ligne pour Index Début et Fin Physiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-3">
                            <div>
                                <label htmlFor={`debut-${cuve.id}`} className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <FiChevronsLeft className="mr-2 h-4 w-4 text-gray-500" /> Index Début Quart (Phys.) <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id={`debut-${cuve.id}`} value={cuve.indexDebutQuart}
                                    onChange={(e) => handleIndexChange(cuve.id, 'indexDebutQuart', e.target.value)}
                                    placeholder={cuve.dernierIndexFinConnu ? `Précédent: ${cuve.dernierIndexFinConnu.toFixed(2)}` : 'Ex: 123450.00'}
                                    step="0.01" className={`${inputClass} ${!isQuartActuelModifiable() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    required readOnly={!isQuartActuelModifiable()}
                                />
                            </div>
                            <div>
                                <label htmlFor={`fin-${cuve.id}`} className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <FiChevronsRight className="mr-2 h-4 w-4 text-gray-500" /> Index Fin Quart (Phys.) <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id={`fin-${cuve.id}`} value={cuve.indexFinQuart}
                                    onChange={(e) => handleIndexChange(cuve.id, 'indexFinQuart', e.target.value)}
                                    placeholder="Ex: 124000.00" step="0.01"
                                    className={`${inputClass} ${!isQuartActuelModifiable() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    required readOnly={!isQuartActuelModifiable()}
                                />
                            </div>
                        </div>
                        {/* Ligne pour Index Fin Théorique et Écart */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor={`theo-${cuve.id}`} className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <FiBarChart2 className="mr-2 h-4 w-4 text-gray-500" /> Index Fin Théorique (Syst.)
                                </label>
                                <input type="text" id={`theo-${cuve.id}`} 
                                       value={cuve.indexFinTheorique !== undefined ? cuve.indexFinTheorique.toFixed(2) : 'N/A'} 
                                       className={readOnlyInputClass} readOnly 
                                />
                            </div>
                            <div>
                                <label htmlFor={`ecart-${cuve.id}`} className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <FiCopy className="mr-2 h-4 w-4 text-gray-500" /> Écart Index Fin (Phys. - Théo.)
                                </label>
                                <input type="text" id={`ecart-${cuve.id}`} 
                                       value={ecartIndexFin !== undefined ? `${ecartIndexFin.toFixed(2)} ${cuve.unite}` : 'N/A'} 
                                       className={`${readOnlyInputClass} ${ecartIndexFin && ecartIndexFin < 0 ? 'text-red-600' : ecartIndexFin && ecartIndexFin > 0 ? 'text-yellow-600' : 'text-green-600'}`} 
                                       readOnly 
                                />
                            </div>
                        </div>
                        
                        {volumePhysique !== undefined && (
                            <div className="mt-3 p-2 bg-purple-50 rounded-md text-sm text-purple-700">
                                Volume physique sortie (selon index): <span className="font-semibold">{volumePhysique.toFixed(2)} {cuve.unite}</span>
                            </div>
                        )}
                    </div>
                    );
                })}
                 {cuves.length === 0 && !isLoading && (
                     <p className="text-center text-gray-500 py-5">Aucune cuve à afficher pour ce quart/date.</p>
                 )}
                </div>

                {/* ... (Notes et bouton Enregistrer inchangés) ... */}
                {cuves.length > 0 && (
                    <>
                        <div className="mt-8 pt-6 border-t border-gray-200">
                        <label htmlFor="notesGenerales" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FiEdit2 className="mr-2 h-4 w-4 text-gray-500" /> Notes (Relevé de Quart)
                        </label>
                        <textarea id="notesGenerales" rows={3} value={notesGenerales}
                            onChange={(e) => setNotesGenerales(e.target.value)}
                            placeholder="Incidents, observations..."
                            className={`${inputClass} ${!isQuartActuelModifiable() ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            readOnly={!isQuartActuelModifiable()}
                        ></textarea>
                        </div>
                        {isQuartActuelModifiable() && (
                            <div className="mt-8 text-right">
                            <button type="submit" disabled={isSubmitting || isLoading}
                                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[180px]">
                                {isSubmitting ? <Spinner size="sm" color="text-white" /> : ( <> <FiSave className="-ml-1 mr-2 h-5 w-5" /> Enregistrer Index </>) }
                            </button>
                            </div>
                        )}
                    </>
                )}
            </>
        )}
      </form>
    </DashboardLayout>
  );
};

export default SaisieIndexChefDePistePage;