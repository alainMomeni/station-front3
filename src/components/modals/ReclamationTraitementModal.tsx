// src/components/modals/ReclamationTraitementModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiMessageSquare, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import type { ReclamationClient, StatutReclamation, TypeReclamation, PrioriteReclamation, ActionReclamation } from '../../types/reclamations';
import { format, parseISO } from 'date-fns';
import Spinner from '../Spinner';
import { v4 as uuidv4 } from 'uuid';

interface ReclamationTraitementModalProps {
  isOpen: boolean;
  onClose: () => void;
  reclamationInitial: ReclamationClient | null;
  onSave: (data: ReclamationClient, actionsAAjouter?: ActionReclamation[]) => Promise<void>;
  isCreationMode: boolean;
  // employesDisponibles?: { id: string; nom: string }[]; // Pour assignation
}

// Réutiliser ces options (elles pourraient être importées d'un fichier partagé)
const typeReclamationOptionsModal: { value: TypeReclamation; label: string }[] = [
    {value: 'qualite_carburant', label: 'Qualité Carburant'}, {value: 'erreur_paiement', label: 'Erreur de Paiement'},
    {value: 'service_client', label: 'Service Client'}, {value: 'equipement', label: 'Équipement Station'},
    {value: 'produit_boutique', label: 'Produit Boutique'}, {value: 'autre', label: 'Autre'},
];
const statutReclamationOptionsModal: { value: StatutReclamation; label: string }[] = [
    {value: 'nouvelle', label: 'Nouvelle'}, {value: 'en_cours', label: 'En Cours de Traitement'},
    {value: 'en_attente_client', label: 'En Attente Réponse Client'}, {value: 'resolue', label: 'Résolue'},
    {value: 'cloturee', label: 'Clôturée (Archivée)'}, {value: 'rejetee', label: 'Rejetée'},
];
const prioriteReclamationOptionsModal: { value: PrioriteReclamation; label: string }[] = [
    {value: 'basse', label: 'Basse'}, {value: 'moyenne', label: 'Moyenne'},
    {value: 'haute', label: 'Haute'}, {value: 'critique', label: 'Critique'},
];


const ReclamationTraitementModal: React.FC<ReclamationTraitementModalProps> = ({ 
    isOpen, onClose, reclamationInitial, onSave, isCreationMode 
}) => {

  const getInitialFormData = (): Partial<ReclamationClient> => {
    if (isCreationMode || !reclamationInitial) {
        return {
            dateSoumission: new Date().toISOString(),
            nomClient: '',
            typeReclamation: 'autre',
            descriptionDetaillee: '',
            priorite: 'moyenne',
            statut: 'nouvelle',
            historiqueActions: [],
        };
    }
    return { ...reclamationInitial };
  };
  
  const [formData, setFormData] = useState<Partial<ReclamationClient>>(getInitialFormData());
  const [nouvelleActionTexte, setNouvelleActionTexte] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(isOpen) {
        setFormData(getInitialFormData());
        setNouvelleActionTexte('');
        setError(null);
    }
  }, [isOpen, reclamationInitial, isCreationMode]);


  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nomClient?.trim() || !formData.descriptionDetaillee?.trim()) {
        setError("Nom du client et description sont requis.");
        return;
    }
    setIsSaving(true);
    
    let actionsAAjouter: ActionReclamation[] = [];
    if (nouvelleActionTexte.trim() && !isCreationMode) {
        actionsAAjouter.push({
            id: uuidv4(),
            dateAction: new Date().toISOString(),
            auteurNom: "Gérant (Connecté)", // À remplacer par le nom de l'utilisateur connecté
            actionEffectuee: nouvelleActionTexte.trim(),
            nouveauStatut: formData.statut, // Capture le statut au moment de l'action
            ancienStatut: reclamationInitial?.statut,
        });
    }

    const dataPourSauvegarde: ReclamationClient = {
        // S'assurer que tous les champs obligatoires de ReclamationClient sont là
        id: formData.id || '', // Si création, l'ID sera généré dans le onSave de la page parente
        dateSoumission: formData.dateSoumission || new Date().toISOString(),
        nomClient: formData.nomClient || '',
        contactClientEmail: formData.contactClientEmail,
        contactClientTelephone: formData.contactClientTelephone,
        typeReclamation: formData.typeReclamation!, // Exclamation car on a un default ou validation
        descriptionDetaillee: formData.descriptionDetaillee!,
        priorite: formData.priorite!,
        statut: formData.statut!,
        assigneANom: formData.assigneANom,
        solutionApportee: formData.solutionApportee,
        dateCloture: (formData.statut === 'cloturee' || formData.statut === 'resolue' || formData.statut === 'rejetee') && !formData.dateCloture 
                     ? new Date().toISOString() 
                     : formData.dateCloture,
        historiqueActions: formData.historiqueActions || [], // Doit être initialisé
        // clientId, assigneAId, dateResolutionSouhaitee, piecesJointes sont optionnels ou gérés plus tard
    };

    try {
      await onSave(dataPourSauvegarde, actionsAAjouter);
    } catch(e:any) {
        setError(e.message || "Erreur sauvegarde");
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-xs font-medium text-gray-600 mb-0.5";
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-1.5 px-2.5 focus:ring-purple-500 focus:border-purple-500";


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-5 w-full max-w-3xl transform max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center">
            <FiMessageSquare className="mr-2"/> 
            {isCreationMode ? 'Enregistrer une Nouvelle Réclamation' : `Traitement Réclamation: ${reclamationInitial?.id || ''}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-1 custom-scrollbar-thin space-y-3.5 text-sm">
            {/* Infos Client */}
            <fieldset className="border rounded p-3 pt-1">
                <legend className="text-xs font-medium px-1 text-gray-500">Informations Client</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><label htmlFor="nomClient" className={labelClass}>Nom du Client <span className="text-red-500">*</span></label><input type="text" name="nomClient" value={formData.nomClient || ''} onChange={handleChange} className={inputClass} /></div>
                    <div><label htmlFor="contactClientTelephone" className={labelClass}>Téléphone</label><input type="tel" name="contactClientTelephone" value={formData.contactClientTelephone || ''} onChange={handleChange} className={inputClass} /></div>
                    <div className="md:col-span-2"><label htmlFor="contactClientEmail" className={labelClass}>Email</label><input type="email" name="contactClientEmail" value={formData.contactClientEmail || ''} onChange={handleChange} className={inputClass} /></div>
                </div>
            </fieldset>
            
            {/* Infos Réclamation */}
            <fieldset className="border rounded p-3 pt-1">
                <legend className="text-xs font-medium px-1 text-gray-500">Détails de la Réclamation</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div><label htmlFor="dateSoumission" className={labelClass}>Date Soumission</label><input type="datetime-local" name="dateSoumission" value={formData.dateSoumission ? format(parseISO(formData.dateSoumission), "yyyy-MM-dd'T'HH:mm") : ''} onChange={handleChange} className={inputClass} readOnly={!isCreationMode}/></div>
                    <div>
                        <label htmlFor="typeReclamation" className={labelClass}>Type <span className="text-red-500">*</span></label>
                        <select name="typeReclamation" value={formData.typeReclamation || ''} onChange={handleChange} className={`${inputClass} cursor-pointer`}> {typeReclamationOptionsModal.slice(1).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
                    </div>
                     <div>
                        <label htmlFor="priorite" className={labelClass}>Priorité <span className="text-red-500">*</span></label>
                        <select name="priorite" value={formData.priorite || ''} onChange={handleChange} className={`${inputClass} cursor-pointer`}> {prioriteReclamationOptionsModal.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
                    </div>
                </div>
                <div className="mt-2.5"><label htmlFor="descriptionDetaillee" className={labelClass}>Description <span className="text-red-500">*</span></label><textarea name="descriptionDetaillee" value={formData.descriptionDetaillee || ''} onChange={handleChange} rows={3} className={inputClass}></textarea></div>
            </fieldset>

            {/* Traitement et Actions (visible si pas en création) */}
            {!isCreationMode && reclamationInitial && (
            <fieldset className="border rounded p-3 pt-1 bg-purple-50/30">
                <legend className="text-xs font-medium px-1 text-purple-600">Traitement Interne</legend>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="statut" className={labelClass}>Nouveau Statut <span className="text-red-500">*</span></label>
                        <select name="statut" value={formData.statut || ''} onChange={handleChange} className={`${inputClass} cursor-pointer font-medium`}> {statutReclamationOptionsModal.slice(1).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} </select>
                    </div>
                    <div>
                        <label htmlFor="assigneANom" className={labelClass}>Assigné à</label>
                        <input type="text" name="assigneANom" value={formData.assigneANom || ''} onChange={handleChange} className={inputClass} placeholder="Nom employé/service"/>
                         {/* Pourrait être un select si employesDisponibles est passé en prop */}
                    </div>
                 </div>
                <div className="mt-2.5">
                    <label htmlFor="nouvelleActionTexte" className={`${labelClass} flex items-center`}><FiEdit2 className="mr-1.5"/>Nouvelle Action / Commentaire</label>
                    <textarea name="nouvelleActionTexte" value={nouvelleActionTexte} onChange={e => setNouvelleActionTexte(e.target.value)} rows={2} className={inputClass} placeholder="Décrire l'action entreprise, la réponse donnée, etc."></textarea>
                </div>
                {formData.statut === 'resolue' || formData.statut === 'cloturee' || formData.statut === 'rejetee' ? (
                 <div className="mt-2.5"><label htmlFor="solutionApportee" className={labelClass}>Solution / Motif Clôture/Rejet</label><textarea name="solutionApportee" value={formData.solutionApportee || ''} onChange={handleChange} rows={2} className={inputClass}></textarea></div>
                ) : null}

                {/* Historique des actions */}
                {formData.historiqueActions && formData.historiqueActions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-purple-200">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Historique:</p>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto text-xs custom-scrollbar-thin pr-1">
                            {formData.historiqueActions.slice().reverse().map(act => ( // Afficher les plus récentes en premier
                                <div key={act.id} className="p-1.5 bg-white/70 rounded border border-gray-200">
                                    <span className="font-medium text-purple-700">{act.auteurNom}</span> ({format(parseISO(act.dateAction), 'dd/MM/yy HH:mm')}): {act.actionEffectuee}
                                    {act.nouveauStatut && <span className="ml-1 text-gray-500">(Statut: {act.nouveauStatut})</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </fieldset>
            )}
           {error && (<div className="mt-2 p-2 rounded-md bg-red-50 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1.5"/> {error}</div>)}
        </form>

        <div className="mt-5 pt-4 border-t flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
          <button type="button" onClick={handleSubmit} disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
            {isSaving ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/> {isCreationMode ? 'Enregistrer Réclamation' : 'Mettre à Jour'}</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReclamationTraitementModal;