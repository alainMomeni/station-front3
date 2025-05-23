// src/page/chefDePiste/SaisieCaissePhysiquePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import {  FiSave, FiAlertCircle, FiChevronsLeft, FiChevronsRight, FiClipboard, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import QuartSelectorWidget, { type QuartTravail } from '../../components/widgets/QuartSelectorWidget';
import { format, startOfDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Interfaces ---
interface CaissePourSaisie {
  id: string; // Ex: "caisse_principale", "caisse_boutique"
  libelle: string; // Ex: "Caisse Principale Station", "Caisse Boutique Annexe"
  caissierNomAffecte?: string; // Nom du caissier (si connu/pertinent pour cette vue)
  montantTheoriqueEspeces?: number; // Calculé par le système et fourni
  montantReelCompteEspeces: string; // Saisi par le Chef de Piste
  notesSpecifiquesCaisse?: string;
}

// Fonctions Mock
const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  return [
    { id: `matin_${dateIsoSuffix}`, libelle: `(07h-15h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'en_cours' : (date < new Date() ? 'termine' : 'planifie')},
    { id: `soir_${dateIsoSuffix}`, libelle: `(15h-23h) - ${dateStr}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`, dateFin: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, statut: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >=15 ? 'en_cours' : (date < new Date() || (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && new Date().getHours() >= 23) ? 'termine' : 'planifie') },
    { id: `nuit_${dateIsoSuffix}`, libelle: `(23h-07h) - ${dateStr} au ${format(addDays(date,1), 'dd/MM/yyyy')}`, dateDebut: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`, dateFin: `${format(addDays(date,1), 'yyyy-MM-dd')}T07:00:00Z`, statut: (date < subDays(new Date(),1)) ? 'termine' : 'planifie' },
  ];
};

const fetchCaissesPourQuartEtDate = async (quartId: string | null, date: Date): Promise<CaissePourSaisie[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  if (!quartId) return [];

  const dateSeed = date.getDate(); // Pour varier les montants par jour
  const quartSeed = quartId.includes('matin') ? 1000 : quartId.includes('soir') ? 2000 : 3000;

  // Simuler des caisses avec des montants théoriques et caissiers affectés
  let caissesData: CaissePourSaisie[] = [
    { 
      id: 'caisse_station_01', 
      libelle: 'Caisse Station Principale', 
      caissierNomAffecte: quartId.includes('matin') ? 'Jean C.' : 'Amina K.',
      montantTheoriqueEspeces: 750000 + dateSeed * 1000 + quartSeed + (Math.random()-0.5)*50000,
      montantReelCompteEspeces: '',
      notesSpecifiquesCaisse: '',
    },
    { 
      id: 'caisse_boutique_01', 
      libelle: 'Caisse Boutique', 
      caissierNomAffecte: quartId.includes('matin') ? 'Fatou S.' : 'Moussa D.',
      montantTheoriqueEspeces: 120000 + dateSeed * 500 + quartSeed + (Math.random()-0.5)*10000,
      montantReelCompteEspeces: '',
      notesSpecifiquesCaisse: '',
    },
  ];
  
  // Si c'est un quart terminé, on peut simuler des saisies existantes
   const quartSelectionne = generateDummyQuartsPourDate(date).find(q => q.id === quartId);
   if (quartSelectionne?.statut === 'termine') {
        caissesData = caissesData.map(c => {
            const theorique = c.montantTheoriqueEspeces || 0;
            // Introduire un petit écart ou une saisie exacte
            const variation = Math.random() < 0.7 ? 0 : (Math.random() - 0.5) * (theorique * 0.005); // 70% de chance d'être exact, sinon petit écart
            return { ...c, montantReelCompteEspeces: (theorique + variation).toFixed(0) };
        });
   }

  return caissesData;
};
// --------------------

const formatXAF = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null || amount === '') return 'N/A';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(num);
};

const SaisieCaissePhysiquePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
  const [quartActifId, setQuartActifId] = useState<string | null>(null);

  const [caissesPourSaisie, setCaissesPourSaisie] = useState<CaissePourSaisie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notesGeneralesChefPiste, setNotesGeneralesChefPiste] = useState('');
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
    setQuartsDuJour(nouveauxQuarts);
    const quartEnCours = nouveauxQuarts.find(q => q.statut === 'en_cours');
    setQuartActifId(quartEnCours ? quartEnCours.id : (nouveauxQuarts.length > 0 ? nouveauxQuarts[0].id : null));
  }, [selectedDate]);

  useEffect(() => {
    const loadCaissesData = async () => {
      if (!quartActifId || !selectedDate) {
        setCaissesPourSaisie([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setSubmitStatus(null);
      setNotesGeneralesChefPiste('');
      try {
        const fetchedCaisses = await fetchCaissesPourQuartEtDate(quartActifId, selectedDate);
        setCaissesPourSaisie(fetchedCaisses);
      } catch (error) {
        console.error("Erreur chargement données caisses:", error);
        setSubmitStatus({ type: 'error', message: "Erreur de chargement des caisses." });
      }
      setIsLoading(false);
    };
    loadCaissesData();
  }, [quartActifId, selectedDate]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value));
    if (!isNaN(newDate.getTime())) { setSelectedDate(newDate); }
  };
  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const handleQuartSelectionChange = (selectedId: string) => {
    setQuartActifId(selectedId);
  };

  const handleCaisseInputChange = (caisseId: string, field: keyof CaissePourSaisie, value: string) => {
    setCaissesPourSaisie(prev =>
      prev.map(c => (c.id === caisseId ? { ...c, [field]: value } : c))
    );
    setSubmitStatus(null);
  };

  const isSaisiePermise = () => {
    const quart = quartsDuJour.find(q => q.id === quartActifId);
    if (!quart) return false;
    // Typiquement à la fin d'un quart "en_cours" ou pour un quart "terminé" qui n'a pas encore été clôturé par un admin
    return quart.statut === 'en_cours' || (quart.statut === 'termine' && new Date(quart.dateFin) > subDays(new Date(), 1));
  };

  const handleSubmitSaisie = async () => {
    if (!quartActifId) {
      setSubmitStatus({type: 'error', message: "Veuillez sélectionner un quart."});
      return;
    }
    // Validation: au moins un montant saisi
    const auMoinsUneSaisie = caissesPourSaisie.some(c => c.montantReelCompteEspeces.trim() !== '' && !isNaN(parseFloat(c.montantReelCompteEspeces)));
    if (!auMoinsUneSaisie) {
        setSubmitStatus({type: 'error', message: "Veuillez saisir le montant compté pour au moins une caisse."});
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    const quartSelectionne = quartsDuJour.find(q => q.id === quartActifId);
    
    const saisiesAEnvoyer = caissesPourSaisie
        .filter(c => c.montantReelCompteEspeces.trim() !== '') // On n'envoie que celles où il y a eu une saisie
        .map(c => {
            const reel = parseFloat(c.montantReelCompteEspeces);
            const theorique = c.montantTheoriqueEspeces;
            let ecart: number | undefined = undefined;
            if (!isNaN(reel) && theorique !== undefined) {
                ecart = reel - theorique;
            }
            return {
                caisseId: c.id,
                libelleCaisse: c.libelle,
                caissierAffecte: c.caissierNomAffecte,
                montantTheorique: c.montantTheoriqueEspeces,
                montantReelSaisi: reel,
                ecartCalcule: ecart,
                notesSpecifiques: c.notesSpecifiquesCaisse,
            };
    });

    console.log("Saisie Montants Caisses Physiques:", {
      date: format(selectedDate, 'yyyy-MM-dd'),
      quart: quartSelectionne?.libelle || quartActifId,
      notesChefPiste: notesGeneralesChefPiste,
      detailsCaisses: saisiesAEnvoyer,
    });

    // TODO: Envoyer à Directus
    // Pour chaque saisie dans saisiesAEnvoyer, créer/mettre à jour un item dans
    // `enregistrements_caisse_physique` ou une collection de clôture de quart.
    // champs: date, quart_id, caisse_id, caissier_id, montant_theorique, montant_reel, ecart, notes_caisse, chef_piste_id, notes_chef_piste
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus({ type: 'success', message: `Montants pour les caisses du quart '${quartSelectionne?.libelle}' enregistrés.`});
    setIsSubmitting(false);
  };
  
  const inputClass = "w-full text-sm p-2 border rounded-md";

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Saisie Montants Physiques des Caisses
        </h1>
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
         <p className="text-center text-gray-500 py-10 bg-white p-6 rounded-lg shadow">Sélectionnez un quart.</p>
      )}
      {!isLoading && quartsDuJour.length === 0 && (
         <p className="text-center text-gray-500 py-10 bg-white p-6 rounded-lg shadow">Aucun quart pour {format(selectedDate, 'dd MMMM yyyy', {locale: fr})}.</p>
      )}

      {!isLoading && quartActifId && caissesPourSaisie.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Aucune caisse active à vérifier pour ce quart/date, ou les données ne sont pas chargées.</p>
        </div>
      )}
      
      {!isLoading && quartActifId && caissesPourSaisie.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-600 mb-6">
                {isSaisiePermise()
                ? "Saisissez le montant total des espèces comptées physiquement dans chaque caisse pour le quart sélectionné."
                : "Consultation des montants pour un quart verrouillé. Saisie non permise."}
            </p>
            {submitStatus && (
                <div className={`p-3 rounded-md mb-6 flex items-start text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    {submitStatus.message}
                </div>
            )}
            <div className="space-y-6">
                {caissesPourSaisie.map(caisse => {
                    const reel = parseFloat(caisse.montantReelCompteEspeces);
                    const theorique = caisse.montantTheoriqueEspeces;
                    let ecart: number | undefined;
                    let ecartColor = 'text-gray-700';
                    if (!isNaN(reel) && theorique !== undefined) {
                        ecart = reel - theorique;
                        if (ecart < 0) ecartColor = 'text-red-600 font-semibold';
                        else if (ecart > 0) ecartColor = 'text-yellow-600 font-semibold';
                        else ecartColor = 'text-green-600 font-semibold';
                    }

                    return (
                    <div key={caisse.id} className={`p-4 border rounded-lg ${!isSaisiePermise() ? 'bg-gray-50 border-gray-200' : 'border-gray-300 hover:shadow-sm'}`}>
                        <h3 className="text-md font-semibold text-purple-700 mb-1">{caisse.libelle}</h3>
                        {caisse.caissierNomAffecte && <p className="text-xs text-gray-500 mb-3">Caissier(ère) : {caisse.caissierNomAffecte}</p>}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">Théorique Espèces (Syst.)</label>
                                <input type="text" value={formatXAF(caisse.montantTheoriqueEspeces)} 
                                    className="w-full text-sm p-2 border-gray-200 bg-gray-100 rounded-md cursor-not-allowed" readOnly />
                            </div>
                            <div>
                                <label htmlFor={`reel-${caisse.id}`} className="block text-xs font-medium text-gray-600 mb-0.5">Réel Compté Espèces (Chef P.) <span className="text-red-500">*</span></label>
                                <input type="number" id={`reel-${caisse.id}`}
                                    value={caisse.montantReelCompteEspeces}
                                    onChange={e => handleCaisseInputChange(caisse.id, 'montantReelCompteEspeces', e.target.value)}
                                    step="1" placeholder="0"
                                    disabled={!isSaisiePermise() || isSubmitting}
                                    className={`${inputClass} ${!isSaisiePermise() || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
                                    required={isSaisiePermise()} // Requis seulement si modifiable
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">Écart Constaté</label>
                                <div className={`w-full text-sm p-2 border rounded-md flex items-center ${!ecart ? 'bg-gray-100 border-gray-200' : ecart === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200' }`}>
                                   <span className={ecartColor}> {formatXAF(ecart)}</span>
                                   {ecart !== undefined && ecart !== 0 && (
                                        ecart < 0 ? <FiTrendingDown className="ml-auto h-4 w-4 text-red-500"/> : <FiTrendingUp className="ml-auto h-4 w-4 text-yellow-500"/>
                                   )}
                                </div>
                            </div>
                        </div>
                        {isSaisiePermise() && (
                             <div>
                                <label htmlFor={`notes-${caisse.id}`} className="block text-xs font-medium text-gray-600 mb-0.5">Notes sur cette caisse (Optionnel)</label>
                                <input type="text" id={`notes-${caisse.id}`}
                                    value={caisse.notesSpecifiquesCaisse}
                                    onChange={e => handleCaisseInputChange(caisse.id, 'notesSpecifiquesCaisse', e.target.value)}
                                    placeholder="Ex: différence de XAF due à..."
                                    disabled={!isSaisiePermise() || isSubmitting}
                                    className={`${inputClass} ${!isSaisiePermise() || isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`} />
                            </div>
                        )}
                    </div>
                    );
                })}
            </div>

            {isSaisiePermise() && caissesPourSaisie.length > 0 && (
            <>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <label htmlFor="notesGeneralesChefPiste" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FiClipboard className="mr-2 h-4 w-4 text-gray-500" /> Notes Générales (Chef de Piste)
                    </label>
                    <textarea id="notesGeneralesChefPiste" rows={3} value={notesGeneralesChefPiste}
                        onChange={e => setNotesGeneralesChefPiste(e.target.value)}
                        placeholder="Observations globales sur les encaissements du quart..."
                        disabled={isSubmitting}
                        className={`${inputClass} border-gray-300`} />
                </div>
                <div className="mt-8 text-right">
                    <button
                        onClick={handleSubmitSaisie}
                        disabled={isSubmitting || isLoading}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[180px]"
                    >
                    {isSubmitting ? <Spinner size="sm" color="text-white"/> : (
                        <><FiSave className="-ml-1 mr-2 h-5 w-5"/>Enregistrer Saisies Caisses</>
                    )}
                    </button>
                </div>
            </>
            )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SaisieCaissePhysiquePage;