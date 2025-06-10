// src/components/modals/PompeFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiZap, FiHardDrive, FiHash, FiPlusCircle, FiTrash2, FiDroplet, FiCalendar } from 'react-icons/fi';
import type { Pompe, TypeCarburant, Cuve } from '../../types/equipements'; // Adapter
import Spinner from '../Spinner';
import { v4 as uuidv4 } from 'uuid';

interface PompeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pompe: Pompe) => Promise<void>;
  pompeInitial?: Pompe | null;
  isCreationMode: boolean;
  // Données nécessaires pour les sélecteurs
  typesCarburant: TypeCarburant[];
  cuves: Cuve[];
}

const PompeFormModal: React.FC<PompeFormModalProps> = ({ isOpen, onClose, onSave, pompeInitial, isCreationMode, typesCarburant, cuves }) => {
    
  const getInitialState = (): Partial<Pompe> => {
    if (pompeInitial) return { ...pompeInitial };
    return { // Pour création
        nom: '', statut: 'active', distributions: [{ id: uuidv4(), typeCarburantId: '', cuveId: '' }] // Commence avec une distribution
    };
  }

  const [formData, setFormData] = useState<Partial<Pompe>>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(isOpen) setFormData(getInitialState());
  }, [isOpen, pompeInitial]);
  
  if(!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDistributionChange = (distribId: string, field: 'typeCarburantId' | 'cuveId', value: string) => {
    setFormData(prev => ({
        ...prev,
        distributions: (prev.distributions || []).map(d => 
            d.id === distribId ? {...d, [field]: value} : d
        )
    }));
  };

  const addDistribution = () => {
    setFormData(prev => ({
        ...prev,
        distributions: [...(prev.distributions || []), { id: uuidv4(), typeCarburantId: '', cuveId: '' }]
    }));
  };
  const removeDistribution = (distribId: string) => {
    setFormData(prev => ({...prev, distributions: (prev.distributions || []).filter(d => d.id !== distribId)}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom?.trim()) {
        setError('Le nom de la pompe est requis.');
        return;
    }
    // Validation des distributions
    for(const d of formData.distributions || []){
        if(!d.typeCarburantId || !d.cuveId){
            setError('Veuillez compléter toutes les associations Carburant/Cuve pour chaque pistolet.');
            return;
        }
    }
    setError(null);
    setIsSaving(true);
    try {
        const finalData: Pompe = {
            id: formData.id || uuidv4(),
            nom: formData.nom!,
            modele: formData.modele,
            numeroSerie: formData.numeroSerie,
            dateInstallation: formData.dateInstallation,
            statut: formData.statut!,
            distributions: formData.distributions!,
        };
        await onSave(finalData);
    } catch (e: any) { setError(e.message || "Erreur de sauvegarde"); } 
    finally { setIsSaving(false); }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl transform max-h-[90vh] flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 mb-4 border-b">
                <h3 className="text-xl font-semibold text-purple-700"><FiZap className="inline mr-2"/> {isCreationMode ? 'Ajouter une Pompe' : 'Modifier la Pompe'}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><FiX size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar-thin space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label htmlFor="nom" className={labelClass}>Nom de la Pompe <span className="text-red-500">*</span></label><input type="text" id="nom" name="nom" value={formData.nom || ''} onChange={handleChange} className={inputClass} required/></div>
                    <div><label htmlFor="statut" className={labelClass}>Statut</label><select id="statut" name="statut" value={formData.statut} onChange={handleChange} className={`${inputClass} cursor-pointer`}> <option value="active">Active</option> <option value="inactive">Inactive</option> <option value="en_maintenance">En Maintenance</option> </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label htmlFor="modele" className={labelClass}>Modèle</label><input type="text" id="modele" name="modele" value={formData.modele || ''} onChange={handleChange} className={inputClass}/></div>
                    <div><label htmlFor="numeroSerie" className={labelClass}><FiHash className="inline"/> N° Série</label><input type="text" id="numeroSerie" name="numeroSerie" value={formData.numeroSerie || ''} onChange={handleChange} className={inputClass}/></div>
                    <div><label htmlFor="dateInstallation" className={labelClass}><FiCalendar className="inline"/> Date Installation</label><input type="date" id="dateInstallation" name="dateInstallation" value={formData.dateInstallation || ''} onChange={handleChange} className={inputClass}/></div>
                </div>
                <fieldset className="border rounded p-3 pt-1">
                    <legend className="text-xs font-medium px-1 text-gray-500">Pistolets / Distributions</legend>
                    <div className="space-y-3 mt-1">
                    {(formData.distributions || []).map((distrib, index) => (
                        <div key={distrib.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                            <p className="md:col-span-1 text-gray-600 font-medium">Pistolet {index+1}:</p>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500"><FiDroplet className="inline"/>Carburant</label>
                                <select value={distrib.typeCarburantId} onChange={e => handleDistributionChange(distrib.id, 'typeCarburantId', e.target.value)} className={`${inputClass} py-1.5`}>
                                    <option value="">Sélectionner...</option>
                                    {typesCarburant.map(tc => <option key={tc.id} value={tc.id}>{tc.nom}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500"><FiHardDrive className="inline"/>Tire de la Cuve</label>
                                 <select value={distrib.cuveId} onChange={e => handleDistributionChange(distrib.id, 'cuveId', e.target.value)} className={`${inputClass} py-1.5`}>
                                    <option value="">Sélectionner...</option>
                                    {cuves.filter(c => !distrib.typeCarburantId || c.typeCarburantId === distrib.typeCarburantId).map(cuve => <option key={cuve.id} value={cuve.id}>{cuve.nom}</option>)}
                                 </select>
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                {(formData.distributions?.length || 0) > 1 && <button type="button" onClick={()=>removeDistribution(distrib.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Retirer"><FiTrash2 size={14}/></button>}
                            </div>
                        </div>
                    ))}
                    </div>
                    <button type="button" onClick={addDistribution} className="btn-secondary-sm text-xs mt-3"><FiPlusCircle className="mr-1"/>Ajouter un pistolet</button>
                </fieldset>
                
                {error && (<p className="text-red-500 text-sm">{error}</p>)}

            </form>
             <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                 <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
                 <button type="submit" form="pompe-form" disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
                   {isSaving ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/>Enregistrer</>}
                 </button>
            </div>
        </div>
    </div>
  )
}
export default PompeFormModal;