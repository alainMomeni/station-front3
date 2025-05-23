// src/page/chefDePiste/SuiviPresencesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiClock, FiSave, FiAlertCircle, FiEdit2, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import QuartSelectorWidget, { type QuartTravail } from '../../components/widgets/QuartSelectorWidget';
import { format, startOfDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Interfaces ---
interface Employe {
  id: string;
  nomComplet: string;
  rolePrevU: 'pompiste' | 'caissier' | 'polyvalent'; // Rôle pour lequel il était affecté
  posteLibelle: string; // Libellé du poste pour lequel il était affecté
}

type StatutPresence = 'present' | 'absent_justifie' | 'absent_non_justifie' | 'retard' | 'non_defini';

interface SuiviPresenceEmploye extends Employe {
  statut: StatutPresence;
  heureArriveeReelle?: string; // Format HH:mm
  heureDepartReelle?: string;  // Format HH:mm
  motifAbsenceRetard?: string;
}

// Fonctions Mock (similaires à AffectationPersonnelPage, à adapter pour les données de présence)
const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  // ... (Identique à celle dans SaisieIndexChefDePistePage)
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  return [
    { id: `matin_${dateIsoSuffix}`, libelle: `(07h-15h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'en_cours' : (date < new Date() ? 'termine' : 'planifie')},
    { id: `soir_${dateIsoSuffix}`, libelle: `(15h-23h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >=15 ? 'en_cours' : (date < new Date() || (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >= 23) ? 'termine' : 'planifie') },
    { id: `nuit_${dateIsoSuffix}`, libelle: `(23h-07h) - ${dateStr} au ${format(addDays(date,1), 'dd/MM/yyyy')}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, dateFin: `${format(addDays(date,1), 'yyyy-MM-dd')}T07:00:00Z`, statut: (date < subDays(new Date(),1)) ? 'termine' : 'planifie' },
  ];
};

// Simule la récupération du personnel AFFECTÉ à ce quart et de leur statut de présence si déjà enregistré
const fetchPersonnelAffecteEtPresence = async (quartId: string | null, date: Date): Promise<SuiviPresenceEmploye[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  if (!quartId) return [];

  // Dans une vraie app, ceci viendrait des affectations et des enregistrements de présence de Directus
  const affectationsPourCeQuartSimule: {employeId: string, nomComplet: string, role: 'pompiste' | 'caissier' | 'polyvalent', poste: string}[] = [
    { employeId: 'emp1', nomComplet: 'Natalya P.', role: 'pompiste', poste: 'Pompes 1 & 2' },
    { employeId: 'emp2', nomComplet: 'Jean C.', role: 'caissier', poste: 'Caisse Principale'},
    { employeId: 'emp5', nomComplet: 'Moussa D.', role: 'polyvalent', poste: 'Pompes 3 & 4' },
  ];
  
  // Simuler des statuts de présence déjà existants pour un quart terminé (ex: Nuit précédente)
  if (quartId.includes('nuit') && date < startOfDay(new Date())) {
    return affectationsPourCeQuartSimule.map((aff, index) => ({
        ...aff,
        id: aff.employeId,
        rolePrevU: aff.role,
        posteLibelle: aff.poste,
        statut: index === 0 ? 'present' : 'absent_justifie',
        heureArriveeReelle: index === 0 ? '22:55' : undefined,
        heureDepartReelle: index === 0 ? '07:05' : undefined,
        motifAbsenceRetard: index !== 0 ? 'Malade - Certificat fourni' : '',
    }));
  }

  return affectationsPourCeQuartSimule.map(aff => ({
    id: aff.employeId,
    nomComplet: aff.nomComplet,
    rolePrevU: aff.role,
    posteLibelle: aff.poste,
    statut: 'non_defini', // Par défaut, ou charger le statut enregistré depuis Directus
    heureArriveeReelle: '',
    heureDepartReelle: '',
    motifAbsenceRetard: '',
  }));
};
// --------------------

const SuiviPresencesPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
  const [quartActifId, setQuartActifId] = useState<string | null>(null);

  const [personnelPourSuivi, setPersonnelPourSuivi] = useState<SuiviPresenceEmploye[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
    setQuartsDuJour(nouveauxQuarts);
    const quartEnCours = nouveauxQuarts.find(q => q.statut === 'en_cours');
    const premierQuart = nouveauxQuarts.length > 0 ? nouveauxQuarts[0].id : null;
    setQuartActifId(quartEnCours ? quartEnCours.id : premierQuart);
  }, [selectedDate]);

  useEffect(() => {
    const loadPersonnelPourSuivi = async () => {
      if (!quartActifId || !selectedDate) {
        setPersonnelPourSuivi([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setSubmitStatus(null);
      try {
        const fetchedPersonnel = await fetchPersonnelAffecteEtPresence(quartActifId, selectedDate);
        setPersonnelPourSuivi(fetchedPersonnel);
      } catch (error) {
        console.error("Erreur de chargement du personnel et des présences:", error);
        setSubmitStatus({ type: 'error', message: "Erreur de chargement des données." });
      }
      setIsLoading(false);
    };
    loadPersonnelPourSuivi();
  }, [quartActifId, selectedDate]);
  
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value));
    if (!isNaN(newDate.getTime())) { setSelectedDate(newDate); }
  };
  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const handleQuartSelectionChange = (selectedId: string) => {
    setQuartActifId(selectedId);
  };

  const handlePresenceChange = (employeId: string, field: keyof SuiviPresenceEmploye, value: string | StatutPresence) => {
    setPersonnelPourSuivi(prev =>
      prev.map(emp => (emp.id === employeId ? { ...emp, [field]: value } : emp))
    );
    setSubmitStatus(null);
  };

  const isQuartModifiablePourPresence = () => {
    const quart = quartsDuJour.find(q => q.id === quartActifId);
    if (!quart) return false;
    // Permettre modification si en cours, planifié, ou terminé récemment (ex: dans les dernières 24h pour corrections)
    return quart.statut === 'en_cours' || quart.statut === 'planifie' || (quart.statut === 'termine' && new Date(quart.dateFin) > subDays(new Date(), 1));
  };

  const handleSubmitPresences = async () => {
    if (!quartActifId) {
      setSubmitStatus({type: 'error', message: 'Veuillez sélectionner un quart.'});
      return;
    }
    // Validation optionnelle (ex: si absent, motif est-il requis ?)
    setIsSubmitting(true);
    setSubmitStatus(null);
    const quartSelectionne = quartsDuJour.find(q => q.id === quartActifId);
    console.log("Présences à enregistrer:", {
        date: format(selectedDate, 'yyyy-MM-dd'),
        quart: quartSelectionne?.libelle || quartActifId,
        presences: personnelPourSuivi
    });

    // TODO: Envoyer à Directus.
    // Pour chaque 'SuiviPresenceEmploye' dans personnelPourSuivi:
    // - Créer/Mettre à jour un item dans une collection 'enregistrements_presence'.
    // - Cet item lierait l'employe_id, quart_id (ou référence au planning), statut, heures, motif.
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus({type: 'success', message: `Présences pour le quart '${quartSelectionne?.libelle}' enregistrées.`});
    setIsSubmitting(false);
  };
  

  const statutPresenceOptions: { value: StatutPresence; label: string }[] = [
    { value: 'non_defini', label: '-- Sélectionner Statut --'},
    { value: 'present', label: 'Présent(e)' },
    { value: 'absent_justifie', label: 'Absent(e) (Justifié)' },
    { value: 'absent_non_justifie', label: 'Absent(e) (Non Justifié)' },
    { value: 'retard', label: 'En Retard' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Suivi des Présences
        </h1>
        {/* Sélecteurs de Date et de Quart (identiques à SaisieIndex) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
             <div className="flex items-center w-full sm:w-auto">
                <button onClick={() => setSelectedDate(prev => subDays(prev, 1))} className="p-2.5 rounded-l-md border border-r-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour précédent" disabled={isSubmitting || isLoading}>
                    <FiChevronsLeft size={18}/>
                </button>
                <input type="date" value={inputDateValue} onChange={handleDateInputChange} disabled={isSubmitting || isLoading}
                    className="p-2 border-y border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-full text-center" style={{minWidth: '140px'}} />
                <button onClick={() => setSelectedDate(prev => addDays(prev, 1))} className="p-2.5 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour suivant" disabled={isSubmitting || isLoading}>
                     <FiChevronsRight size={18}/>
                </button>
            </div>
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

      {isLoading && (<div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>)}
      
      {!isLoading && !quartActifId && quartsDuJour.length > 0 && (
         <p className="text-center text-gray-500 py-10 bg-white p-6 rounded-lg shadow">Sélectionnez un quart pour voir le personnel affecté.</p>
      )}
      {!isLoading && quartsDuJour.length === 0 && (
         <p className="text-center text-gray-500 py-10 bg-white p-6 rounded-lg shadow">Aucun quart défini pour le {format(selectedDate, 'dd MMMM yyyy', {locale: fr})}.</p>
      )}

      {!isLoading && quartActifId && personnelPourSuivi.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Aucun personnel n'est affecté à ce quart ou les données ne sont pas encore disponibles.</p>
          </div>
      )}

      {!isLoading && quartActifId && personnelPourSuivi.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            {submitStatus && (
                <div className={`p-3 rounded-md mb-6 flex items-start text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    {submitStatus.message}
                </div>
            )}
            <div className="space-y-6">
                {personnelPourSuivi.map(emp => (
                <div key={emp.id} className={`p-4 border rounded-lg ${!isQuartModifiablePourPresence() ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:shadow-sm'}`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                    <div>
                        <h3 className="text-md font-semibold text-purple-700">{emp.nomComplet}</h3>
                        <p className="text-xs text-gray-500">{emp.posteLibelle} ({emp.rolePrevU})</p>
                    </div>
                    <select
                        value={emp.statut}
                        onChange={(e) => handlePresenceChange(emp.id, 'statut', e.target.value as StatutPresence)}
                        disabled={!isQuartModifiablePourPresence() || isSubmitting}
                        className={`mt-2 sm:mt-0 w-full sm:w-auto text-sm pl-3 pr-8 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none ${!isQuartModifiablePourPresence() || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer border-gray-300'}`}
                    >
                        {statutPresenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    </div>
                    
                    {(emp.statut === 'present' || emp.statut === 'retard') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 flex items-center"><FiClock className="mr-1"/>Heure Arrivée Réelle</label>
                        <input type="time" value={emp.heureArriveeReelle} 
                            onChange={e => handlePresenceChange(emp.id, 'heureArriveeReelle', e.target.value)}
                            disabled={!isQuartModifiablePourPresence() || isSubmitting}
                            className={`w-full text-sm p-1.5 border rounded-md ${!isQuartModifiablePourPresence() || isSubmitting ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />
                        </div>
                        <div>
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 flex items-center"><FiClock className="mr-1"/>Heure Départ Réelle</label>
                        <input type="time" value={emp.heureDepartReelle}
                            onChange={e => handlePresenceChange(emp.id, 'heureDepartReelle', e.target.value)}
                            disabled={!isQuartModifiablePourPresence() || isSubmitting}
                            className={`w-full text-sm p-1.5 border rounded-md ${!isQuartModifiablePourPresence() || isSubmitting ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />
                        </div>
                    </div>
                    )}
                    {(emp.statut.startsWith('absent_') || emp.statut === 'retard') && (
                    <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-0.5 flex items-center"><FiEdit2 className="mr-1"/>Motif / Justification</label>
                        <textarea value={emp.motifAbsenceRetard}
                            onChange={e => handlePresenceChange(emp.id, 'motifAbsenceRetard', e.target.value)}
                            rows={2} placeholder="Préciser le motif..."
                            disabled={!isQuartModifiablePourPresence() || isSubmitting}
                            className={`w-full text-sm p-1.5 border rounded-md ${!isQuartModifiablePourPresence() || isSubmitting ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-300'}`} />
                    </div>
                    )}
                </div>
                ))}
            </div>
             {isQuartModifiablePourPresence() && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                    <button
                        onClick={handleSubmitPresences}
                        disabled={isSubmitting || isLoading}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[180px]"
                    >
                    {isSubmitting ? <Spinner size="sm" color="text-white"/> : (
                        <><FiSave className="-ml-1 mr-2 h-5 w-5"/>Enregistrer les Présences</>
                    )}
                    </button>
                </div>
            )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SuiviPresencesPage;