// src/page/chefDePiste/SignalementEcartsChefDePistePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiAlertOctagon, FiEdit2, FiDroplet, FiDollarSign, FiUpload, FiPaperclip, FiX, FiAlertCircle } from 'react-icons/fi'; // Ajout des icônes manquantes FiCalendar, FiSave etc.
import { type QuartTravail } from '../../components/widgets/QuartSelectorWidget';
import { format, startOfDay, addDays, subDays } from 'date-fns';
// Assurez-vous que 'fr' est bien exporté depuis 'date-fns/locale' ou utilisez un autre chemin si nécessaire.
// Si vous n'avez pas `fr` directement, il faut peut-être faire: import { fr } from 'date-fns/locale/fr';


// --- Interfaces ---
interface CuveInfo { id: string; nomCuve: string; typeCarburant: string; unite: string; indexFinTheoriqueSysteme?: number; }
interface CaisseInfo { id: string; libelle: string; montantTheoriqueEspecesSysteme?: number; }
type TypeEcart = '' | 'index_cuve' | 'caisse_especes';

interface SignalementEcartFormData {
  typeEcart: TypeEcart;
  cuveConcerneeId: string;
  indexFinPhysiqueReleve: string;
  caisseConcerneeId: string;
  montantReelCompteEspeces: string;
  causePresumee: string;
  justificatif?: File | null;
  // Champs auto-calculés ou lus
  valeurTheoriqueSysteme: string; // Peut être index ou montant
  ecartCalcule: string;          // Peut être volume ou montant
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
const dummyCuves: CuveInfo[] = [
  { id: 'cuve1', nomCuve: 'Cuve Principale 1', typeCarburant: 'Essence SP95', unite: 'L' },
  { id: 'cuve2', nomCuve: 'Cuve Diesel A', typeCarburant: 'Diesel', unite: 'L' },
  { id: 'cuve3', nomCuve: 'Réserve SP98', typeCarburant: 'Essence SP98', unite: 'L'},
];
const dummyCaisses: CaisseInfo[] = [
  { id: 'caisse_station_01', libelle: 'Caisse Station Principale' },
  { id: 'caisse_boutique_01', libelle: 'Caisse Boutique'},
];

// Simuler la récupération de la valeur théorique - CORRECTION ICI
const fetchValeurTheorique = async (typeEcart: TypeEcart, itemId: string, quartId: string | null, selectedDate: Date): Promise<number | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!itemId || !quartId || !selectedDate) return undefined; // Ajouté selectedDate pour la complétude même si non utilisé dans ce mock
    // En réel, requête API basée sur typeEcart, itemId, quartId et selectedDate
    if (typeEcart === 'index_cuve') {
        if (itemId === 'cuve1') return 123700.50;
        if (itemId === 'cuve2') return 89150.75;
        return parseFloat((55000 + Math.random()*200).toFixed(2));
    }
    if (typeEcart === 'caisse_especes') {
        if (itemId === 'caisse_station_01') return 785250;
        if (itemId === 'caisse_boutique_01') return 127500;
        return parseFloat((100000 + Math.random()*50000).toFixed(0));
    }
    return undefined;
};
// --------------------

const formatValue = (value: number | string | undefined, unite: string = ''): string => {
    if (value === undefined || value === null || value === '') return 'N/A';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(2)}${unite ? ' ' + unite : ''}`;
};
const formatXAF = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null || amount === '') return 'N/A';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(num);
};


const SignalementEcartsChefDePistePage: React.FC = () => {
  const [selectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
  const [quartActifId, setQuartActifId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SignalementEcartFormData>({
    typeEcart: '', cuveConcerneeId: '', indexFinPhysiqueReleve: '',
    caisseConcerneeId: '', montantReelCompteEspeces: '',
    causePresumee: '', valeurTheoriqueSysteme: '', ecartCalcule: '', justificatif: null, // Assurer que justificatif est bien initialisé
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingTheorique, setIsFetchingTheorique] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
    setQuartsDuJour(nouveauxQuarts);
    const quartEnCours = nouveauxQuarts.find(q => q.statut === 'en_cours');
    setQuartActifId(quartEnCours ? quartEnCours.id : (nouveauxQuarts.length > 0 ? nouveauxQuarts[0].id : null));
    setIsLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    setFormData(prev => ({
        ...prev,
        cuveConcerneeId: '', indexFinPhysiqueReleve: '',
        caisseConcerneeId: '', montantReelCompteEspeces: '',
        valeurTheoriqueSysteme: '', ecartCalcule: '', causePresumee: '', justificatif: null
    }));
    setIsFetchingTheorique(false);
  }, [formData.typeEcart, quartActifId, selectedDate]);

  useEffect(() => {
    const chargerEtCalculer = async () => {
        if (!quartActifId || !selectedDate || !formData.typeEcart) {
            setFormData(prev => ({ ...prev, valeurTheoriqueSysteme: '', ecartCalcule: ''}));
            return;
        }

        let itemId = '';
        let valeurPhysiqueStr = '';
        let uniteEcart = '';

        if (formData.typeEcart === 'index_cuve') {
            if (!formData.cuveConcerneeId) { setFormData(prev => ({ ...prev, valeurTheoriqueSysteme: '', ecartCalcule: ''})); return; }
            itemId = formData.cuveConcerneeId;
            valeurPhysiqueStr = formData.indexFinPhysiqueReleve;
            const cuve = dummyCuves.find(c => c.id === itemId);
            uniteEcart = cuve?.unite || '';
        } else if (formData.typeEcart === 'caisse_especes') {
            if (!formData.caisseConcerneeId) { setFormData(prev => ({ ...prev, valeurTheoriqueSysteme: '', ecartCalcule: ''})); return; }
            itemId = formData.caisseConcerneeId;
            valeurPhysiqueStr = formData.montantReelCompteEspeces;
            uniteEcart = 'XAF';
        } else {
            return; // Should not happen if typeEcart is validated
        }

        setIsFetchingTheorique(true);
        const theorique = await fetchValeurTheorique(formData.typeEcart, itemId, quartActifId, selectedDate);
        setIsFetchingTheorique(false);
        
        const valeurPhysiqueNum = parseFloat(valeurPhysiqueStr);
        let ecartStr = 'N/A';

        if (theorique !== undefined) {
            setFormData(prev => ({ ...prev, valeurTheoriqueSysteme: theorique.toString() }));
            if (!isNaN(valeurPhysiqueNum)) {
                const ecartNum = valeurPhysiqueNum - theorique;
                ecartStr = formData.typeEcart === 'caisse_especes' ? formatXAF(ecartNum) : formatValue(ecartNum, uniteEcart);
            }
        } else {
             setFormData(prev => ({ ...prev, valeurTheoriqueSysteme: 'N/A'}));
        }
        setFormData(prev => ({ ...prev, ecartCalcule: ecartStr }));
    };
    
    chargerEtCalculer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.typeEcart, formData.cuveConcerneeId, formData.caisseConcerneeId, formData.indexFinPhysiqueReleve, formData.montantReelCompteEspeces, quartActifId, selectedDate]); // Attention aux dépendances ici, en particulier valeurPhysiqueStr
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({ ...prev, justificatif: e.target.files && e.target.files[0] ? e.target.files[0] : null }));};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitStatus(null);
  };

  const handleSubmitSignalement = async () => {
    if (!quartActifId) { setSubmitStatus({ type: 'error', message: "Quart non sélectionné."}); return; }
    if (!formData.typeEcart) { setSubmitStatus({ type: 'error', message: "Type d'écart non sélectionné."}); return; }
    if (formData.typeEcart === 'index_cuve' && (!formData.cuveConcerneeId || !formData.indexFinPhysiqueReleve)) { setSubmitStatus({ type: 'error', message: "Infos cuve/index manquantes."}); return; }
    if (formData.typeEcart === 'caisse_especes' && (!formData.caisseConcerneeId || !formData.montantReelCompteEspeces)) { setSubmitStatus({ type: 'error', message: "Infos caisse/montant manquantes."}); return; }
    if (!formData.causePresumee) { setSubmitStatus({type: 'error', message: "Veuillez préciser la cause présumée."}); return;}

    setIsSubmitting(true);
    setSubmitStatus(null);
    const quartSel = quartsDuJour.find(q=> q.id === quartActifId);
    console.log("Signalement Écart:", {
        date: format(selectedDate, 'yyyy-MM-dd'),
        quart: quartSel?.libelle,
        ...formData,
        justificatif: formData.justificatif?.name,
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus({ type: 'success', message: "Signalement d'écart enregistré." });
    setFormData({ typeEcart: '', cuveConcerneeId: '', indexFinPhysiqueReleve: '', caisseConcerneeId: '', montantReelCompteEspeces: '', causePresumee: '', valeurTheoriqueSysteme: '', ecartCalcule: '', justificatif: null });
    setIsSubmitting(false);
  };

  const selectedUnite = useMemo(() => {
    if (formData.typeEcart === 'index_cuve' && formData.cuveConcerneeId) {
        return dummyCuves.find(c => c.id === formData.cuveConcerneeId)?.unite || '';
    }
    return '';
  }, [formData.typeEcart, formData.cuveConcerneeId]);
  
  const inputClass = "w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500";
  const readOnlyClass = "w-full text-sm p-2 border-gray-200 bg-gray-100 rounded-md cursor-not-allowed";

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Signaler un Écart (Index ou Caisse)
        </h1>
      </div>

      {isLoading && (<div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>)}

      {!isLoading && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
             {!quartActifId ? (
                <p className="text-center text-gray-500 py-10">Veuillez sélectionner un jour et un quart.</p>
            ) : (
            <form onSubmit={(e) => {e.preventDefault(); handleSubmitSignalement();}} className="space-y-6">
                <div>
                    <label htmlFor="typeEcart" className="block text-sm font-medium text-gray-700 mb-1">Type d'écart à signaler <span className="text-red-500">*</span></label>
                    <select id="typeEcart" name="typeEcart" value={formData.typeEcart} onChange={handleChange} 
                            className={`${inputClass} cursor-pointer`} required>
                        <option value="" disabled>-- Choisir un type --</option>
                        <option value="index_cuve">Écart sur Index Cuve</option>
                        <option value="caisse_especes">Écart sur Espèces en Caisse</option>
                    </select>
                </div>

                {formData.typeEcart === 'index_cuve' && (
                    <div className="p-4 border border-purple-200 rounded-md bg-purple-50/30 space-y-4">
                        <h3 className="text-md font-semibold text-purple-700 flex items-center"><FiDroplet className="mr-2"/>Détails Écart Index Cuve</h3>
                        <div>
                            <label htmlFor="cuveConcerneeId" className="block text-xs font-medium text-gray-600 mb-0.5">Cuve Concernée <span className="text-red-500">*</span></label>
                            <select id="cuveConcerneeId" name="cuveConcerneeId" value={formData.cuveConcerneeId} onChange={handleChange} 
                                    className={`${inputClass} cursor-pointer`} required>
                                <option value="" disabled>-- Sélectionner Cuve --</option>
                                {dummyCuves.map(cuve => <option key={cuve.id} value={cuve.id}>{cuve.nomCuve} ({cuve.typeCarburant})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="indexFinPhysiqueReleve" className="block text-xs font-medium text-gray-600 mb-0.5">Index Fin Physique <span className="text-red-500">*</span></label>
                                <input type="number" step="0.01" id="indexFinPhysiqueReleve" name="indexFinPhysiqueReleve" value={formData.indexFinPhysiqueReleve} onChange={handleChange} className={inputClass} required placeholder={`0.00 ${selectedUnite}`}/>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">Index Fin Théorique (Syst.)</label>
                                <input type="text" value={isFetchingTheorique ? "Chargement..." : formatValue(formData.valeurTheoriqueSysteme, selectedUnite)} className={readOnlyClass} readOnly />
                            </div>
                        </div>
                    </div>
                )}

                {formData.typeEcart === 'caisse_especes' && (
                    <div className="p-4 border border-green-200 rounded-md bg-green-50/30 space-y-4">
                        <h3 className="text-md font-semibold text-green-700 flex items-center"><FiDollarSign className="mr-2"/>Détails Écart Caisse</h3>
                        <div>
                            <label htmlFor="caisseConcerneeId" className="block text-xs font-medium text-gray-600 mb-0.5">Caisse Concernée <span className="text-red-500">*</span></label>
                            <select id="caisseConcerneeId" name="caisseConcerneeId" value={formData.caisseConcerneeId} onChange={handleChange} 
                                    className={`${inputClass} cursor-pointer`} required>
                                <option value="" disabled>-- Sélectionner Caisse --</option>
                                {dummyCaisses.map(caisse => <option key={caisse.id} value={caisse.id}>{caisse.libelle}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="montantReelCompteEspeces" className="block text-xs font-medium text-gray-600 mb-0.5">Montant Réel Compté <span className="text-red-500">*</span></label>
                                <input type="number" step="1" id="montantReelCompteEspeces" name="montantReelCompteEspeces" value={formData.montantReelCompteEspeces} onChange={handleChange} className={inputClass} required placeholder="0 XAF"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">Montant Théorique (Syst.)</label>
                                <input type="text" value={isFetchingTheorique ? "Chargement..." : formatXAF(formData.valeurTheoriqueSysteme)} className={readOnlyClass} readOnly />
                            </div>
                        </div>
                    </div>
                )}

                {formData.typeEcart && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Écart Constaté (Physique - Théorique)</label>
                            <input type="text" value={formData.ecartCalcule} 
                                className={`${readOnlyClass} ${(formData.ecartCalcule && formData.ecartCalcule !=='N/A' && parseFloat(formData.ecartCalcule.replace(/[^\d.-]/g, '')) < 0) ? 'text-red-600 font-semibold' : (formData.ecartCalcule && formData.ecartCalcule !=='N/A' && parseFloat(formData.ecartCalcule.replace(/[^\d.-]/g, '')) > 0 ? 'text-yellow-600 font-semibold' : 'text-green-600 font-semibold') }`} readOnly />
                        </div>
                        <div>
                            <label htmlFor="causePresumee" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                               <FiEdit2 className="mr-2 h-4 w-4 text-gray-500" /> Cause Présumée / Observations <span className="text-red-500">*</span>
                            </label>
                            <textarea id="causePresumee" name="causePresumee" value={formData.causePresumee} onChange={handleChange} 
                                      rows={3} placeholder="Décrivez la cause possible ou les actions entreprises..." className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="justificatif" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                               <FiUpload className="mr-2 h-4 w-4 text-gray-500"/> Joindre un Justificatif (Optionnel)
                            </label>
                            <input type="file" id="justificatif" name="justificatif" onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"/>
                            {formData.justificatif && (
                                <div className="mt-2 text-xs text-gray-600 flex items-center">
                                    <FiPaperclip className="mr-1 h-3 w-3"/> {formData.justificatif.name} ({ (formData.justificatif.size / 1024).toFixed(1) } Ko)
                                    <button type="button" onClick={() => setFormData(prev => ({...prev, justificatif: null}))} className="ml-2 text-red-500 hover:text-red-700"><FiX size={14}/></button>
                                </div>
                            )}
                        </div>
                        {submitStatus && (
                            <div className={`p-3 rounded-md flex items-start text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                {submitStatus.message}
                            </div>
                        )}
                        <div className="pt-5 text-right">
                            <button type="submit" disabled={isSubmitting || isLoading || isFetchingTheorique}
                                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 min-w-[180px]">
                                {isSubmitting ? <Spinner size="sm" color="text-white" /> : (<><FiAlertOctagon className="-ml-1 mr-2 h-5 w-5" />Envoyer Signalement</>)}
                            </button>
                        </div>
                    </>
                )}
            </form>
            )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SignalementEcartsChefDePistePage;