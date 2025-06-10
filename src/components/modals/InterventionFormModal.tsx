// src/components/modals/InterventionFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import type { InterventionMaintenance, Equipement, TypeIntervention, StatutIntervention, PrioriteIntervention } from '../../types/maintenance';
import Spinner from '../Spinner';
import { v4 as uuidv4 } from 'uuid';

interface InterventionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (intervention: InterventionMaintenance) => Promise<void>;
  interventionInitial?: InterventionMaintenance | null;
  isCreationMode: boolean;
  equipementsDisponibles: Equipement[];
}

const typeInterventionOptions: { value: TypeIntervention; label: string }[] = [
    { value: 'preventive', label: 'Préventive (Planifiée)' }, { value: 'curative', label: 'Curative (Suite à panne)' },
];
const statutInterventionOptions: { value: StatutIntervention; label: string }[] = [
    { value: 'planifiee', label: 'Planifiée'}, { value: 'en_cours', label: 'En Cours'}, 
    { value: 'terminee', label: 'Terminée'}, { value: 'annulee', label: 'Annulée'}, 
    { value: 'en_attente_pieces', label: 'En Attente de Pièces'},
];
const prioriteInterventionOptions: { value: PrioriteIntervention; label: string }[] = [
    { value: 'basse', label: 'Basse'}, { value: 'moyenne', label: 'Moyenne'}, 
    { value: 'haute', label: 'Haute'}, { value: 'urgente', label: 'Urgente'},
];

const InterventionFormModal: React.FC<InterventionFormModalProps> = ({ 
    isOpen, onClose, onSave, interventionInitial, isCreationMode, equipementsDisponibles
}) => {
  const getInitialState = (): Partial<InterventionMaintenance> => {
    if (interventionInitial) return { ...interventionInitial };
    return { // Valeurs par défaut pour la création
        dateCreation: new Date().toISOString(),
        equipementId: '',
        typeIntervention: 'curative',
        descriptionProblemeTache: '',
        priorite: 'moyenne',
        statut: 'planifiee',
        assigneA: '',
        rapportIntervention: '',
    };
  };

  const [formData, setFormData] = useState<Partial<InterventionMaintenance>>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState());
      setError(null);
    }
  }, [isOpen, interventionInitial]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.equipementId || !formData.descriptionProblemeTache?.trim()) {
        setError("L'équipement concerné et la description de la tâche sont requis.");
        return;
    }
    setIsSaving(true);
    try {
      // Construction de l'objet complet avec des valeurs par défaut
      const dataToSave: InterventionMaintenance = {
        id: formData.id || uuidv4(),
        dateCreation: formData.dateCreation || new Date().toISOString(),
        equipementId: formData.equipementId,
        equipementNom: equipementsDisponibles.find(eq => eq.id === formData.equipementId)?.nom || 'Inconnu',
        typeIntervention: formData.typeIntervention!,
        descriptionProblemeTache: formData.descriptionProblemeTache!,
        priorite: formData.priorite!,
        statut: formData.statut!,
        ...formData, // inclure les champs optionnels
      };
      await onSave(dataToSave);
    } catch (saveError: any) {
        setError(saveError.message || "Erreur lors de la sauvegarde.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform max-h-[90vh] overflow-y-auto custom-scrollbar-thin" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-3 border-b">
          <h3 className="text-xl font-semibold text-purple-700">
            {isCreationMode ? 'Créer un Ticket de Maintenance' : `Ticket N°: ${interventionInitial?.id}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="equipementId" className={labelClass}>Équipement Concerné <span className="text-red-500">*</span></label>
                    <select id="equipementId" name="equipementId" value={formData.equipementId || ''} onChange={handleChange} className={`${inputClass} cursor-pointer`} required>
                        <option value="">-- Sélectionner Équipement --</option>
                        {equipementsDisponibles.map(eq => <option key={eq.id} value={eq.id}>{eq.nom} ({eq.categorie})</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="typeIntervention" className={labelClass}>Type d'Intervention</label>
                    <select id="typeIntervention" name="typeIntervention" value={formData.typeIntervention} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                        {typeInterventionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="descriptionProblemeTache" className={labelClass}>Description Tâche / Problème Constaté <span className="text-red-500">*</span></label>
                <textarea id="descriptionProblemeTache" name="descriptionProblemeTache" value={formData.descriptionProblemeTache} onChange={handleChange} rows={3} className={inputClass} required/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label htmlFor="priorite" className={labelClass}>Priorité</label>
                    <select id="priorite" name="priorite" value={formData.priorite} onChange={handleChange} className={`${inputClass} cursor-pointer`}> {prioriteInterventionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} </select>
                 </div>
                 <div>
                    <label htmlFor="statut" className={labelClass}>Statut</label>
                    <select id="statut" name="statut" value={formData.statut} onChange={handleChange} className={`${inputClass} cursor-pointer`}> {statutInterventionOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} </select>
                 </div>
                 <div>
                    <label htmlFor="assigneA" className={labelClass}>Assigné à</label>
                    <input type="text" id="assigneA" name="assigneA" value={formData.assigneA || ''} onChange={handleChange} className={inputClass} placeholder="Technicien / Sté"/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dateInterventionPrevue" className={labelClass}><FiCalendar className="inline mr-1"/>Date Intervention Prévue</label>
                    <input type="date" id="dateInterventionPrevue" name="dateInterventionPrevue" value={formData.dateInterventionPrevue || ''} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="dateInterventionReelle" className={labelClass}><FiCalendar className="inline mr-1"/>Date Intervention Réelle</label>
                    <input type="date" id="dateInterventionReelle" name="dateInterventionReelle" value={formData.dateInterventionReelle || ''} onChange={handleChange} className={inputClass} />
                </div>
            </div>
             <div>
                <label htmlFor="rapportIntervention" className={labelClass}>Rapport d'Intervention / Actions Menées</label>
                <textarea id="rapportIntervention" name="rapportIntervention" value={formData.rapportIntervention || ''} onChange={handleChange} rows={3} className={inputClass} placeholder="Décrire les travaux effectués, les pièces changées..."></textarea>
            </div>
           
           {error && (<div className="p-2 rounded-md bg-red-50 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1.5"/> {error}</div>)}

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
            <button type="submit" disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
              {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2"/> {isCreationMode ? 'Créer Ticket' : 'Sauvegarder'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InterventionFormModal;