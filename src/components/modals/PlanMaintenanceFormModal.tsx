// src/components/modals/PlanMaintenanceFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiClipboard, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import type { PlanMaintenance, Equipement, FrequenceMaintenance } from '../../types/maintenance';
import Spinner from '../Spinner';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface PlanMaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanMaintenance) => Promise<void>;
  planInitial?: PlanMaintenance | null;
  equipementsDisponibles: Equipement[];
}

const frequenceOptions: { value: FrequenceMaintenance; label: string }[] = [
    { value: 'hebdomadaire', label: 'Hebdomadaire'}, { value: 'mensuel', label: 'Mensuel'},
    { value: 'trimestriel', label: 'Trimestriel'}, { value: 'semestriel', label: 'Semestriel'},
    { value: 'annuel', label: 'Annuel'},
];

const PlanMaintenanceFormModal: React.FC<PlanMaintenanceFormModalProps> = ({ isOpen, onClose, onSave, planInitial, equipementsDisponibles }) => {
    
  const getInitialState = (): Partial<PlanMaintenance> => {
    if(planInitial) return {...planInitial};
    return {
        id: '',
        nomPlan: '',
        descriptionTaches: '',
        ciblesIds: [],
        frequence: 'mensuel',
        dateDebutCycle: format(new Date(), 'yyyy-MM-dd'),
        estActif: true,
        assigneParDefautA: '',
    };
  }
  
  const [formData, setFormData] = useState<Partial<PlanMaintenance>>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
      if(isOpen) {
          setFormData(getInitialState());
          setError(null);
      }
  }, [isOpen, planInitial]);


  if(!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    setError(null);
  };
  
  const handleCiblesChange = (equipementId: string) => {
    setFormData(prev => {
        const ciblesActuelles = prev.ciblesIds || [];
        const newCibles = ciblesActuelles.includes(equipementId)
            ? ciblesActuelles.filter(id => id !== equipementId)
            : [...ciblesActuelles, equipementId];
        return { ...prev, ciblesIds: newCibles };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nomPlan?.trim() || !formData.dateDebutCycle || (formData.ciblesIds || []).length === 0) {
        setError("Nom du plan, au moins un équipement cible et la date de début sont requis.");
        return;
    }
    setIsSaving(true);
    try {
        const ciblesNoms = (formData.ciblesIds || []).map(id => equipementsDisponibles.find(eq => eq.id === id)?.nom).filter(Boolean).join(', ');
        const dataToSave: PlanMaintenance = {
            id: formData.id || uuidv4(),
            nomPlan: formData.nomPlan,
            descriptionTaches: formData.descriptionTaches || '',
            ciblesIds: formData.ciblesIds || [],
            ciblesNoms,
            frequence: formData.frequence!,
            dateDebutCycle: formData.dateDebutCycle,
            estActif: formData.estActif !== undefined ? formData.estActif : true,
            assigneParDefautA: formData.assigneParDefautA,
            // prochaineEcheance sera calculé par le backend
        };
        await onSave(dataToSave);
    } catch(e: any) {
        setError(e.message || 'Erreur lors de la sauvegarde du plan.');
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";


  return (
     <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl transform max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-3 border-b">
          <h3 className="text-xl font-semibold text-purple-700 flex items-center">
            <FiClipboard className="mr-2"/> 
            {planInitial?.id ? 'Modifier le Plan de Maintenance' : 'Créer un Nouveau Plan de Maintenance'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX size={22}/></button>
        </div>

         <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar-thin space-y-4 text-sm">
            <div><label htmlFor="nomPlan" className={labelClass}>Titre du Plan <span className="text-red-500">*</span></label><input type="text" name="nomPlan" value={formData.nomPlan || ''} onChange={handleChange} className={inputClass} required/></div>
            <div><label htmlFor="descriptionTaches" className={labelClass}>Description des Tâches</label><textarea name="descriptionTaches" value={formData.descriptionTaches || ''} onChange={handleChange} rows={3} className={inputClass}/></div>
            
            <fieldset className="border p-2 rounded-md">
                <legend className="text-xs font-medium text-gray-600 px-1">Équipements Ciblés <span className="text-red-500">*</span></legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1 max-h-40 overflow-y-auto custom-scrollbar-thin p-1">
                    {equipementsDisponibles.map(eq => (
                        <label key={eq.id} className="flex items-center space-x-2 p-1.5 border rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox"
                                   checked={(formData.ciblesIds || []).includes(eq.id)}
                                   onChange={() => handleCiblesChange(eq.id)}
                                   className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                            <span className="text-xs">{eq.nom}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="frequence" className={labelClass}><FiRefreshCw className="inline mr-1"/>Fréquence</label>
                    <select id="frequence" name="frequence" value={formData.frequence} onChange={handleChange} className={`${inputClass} cursor-pointer`}> {frequenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} </select>
                 </div>
                 <div>
                    <label htmlFor="dateDebutCycle" className={labelClass}><FiCalendar className="inline mr-1"/>Date de la Première Intervention <span className="text-red-500">*</span></label>
                    <input type="date" id="dateDebutCycle" name="dateDebutCycle" value={formData.dateDebutCycle} onChange={handleChange} className={inputClass} required/>
                 </div>
             </div>
             
             <div><label htmlFor="assigneParDefautA" className={labelClass}>Assigné à (par défaut)</label><input type="text" name="assigneParDefautA" value={formData.assigneParDefautA || ''} onChange={handleChange} className={inputClass} placeholder="Nom du technicien ou de l'entreprise"/></div>

              <div className="pt-2"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" name="estActif" checked={formData.estActif !== undefined ? formData.estActif : true} onChange={(e) => setFormData(p => ({...p, estActif: e.target.checked}))} className="h-4 w-4"/><span className="text-sm">Activer ce plan de maintenance</span></label></div>

             {error && (<div className="mt-2 p-2 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>)}
        </form>

        <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
          <button type="button" onClick={handleSubmit} disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
            {isSaving ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/> Sauvegarder Plan</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanMaintenanceFormModal;