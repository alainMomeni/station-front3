// src/components/modals/CuveFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiHardDrive } from 'react-icons/fi';
import type { Cuve, TypeCarburant } from '../../types/equipements'; // Adapter
import Spinner from '../Spinner';
import { v4 as uuidv4 } from 'uuid';

interface CuveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cuve: Cuve) => Promise<void>;
  cuveInitiale?: Cuve | null;
  isCreationMode: boolean;
  typesCarburantDisponibles: TypeCarburant[];
}

const CuveFormModal: React.FC<CuveFormModalProps> = ({ isOpen, onClose, onSave, cuveInitiale, isCreationMode, typesCarburantDisponibles }) => {

  const getInitialState = (): Partial<Cuve> => {
    if (cuveInitiale) return { ...cuveInitiale };
    return { // Pour création
        nom: '',
        typeCarburantId: '',
        capaciteMax: 20000,
        seuilAlerteBas: 4000,
        statut: 'operationnelle'
    };
  }

  const [formData, setFormData] = useState<Partial<Cuve>>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
        setError(null);
    }
  }, [isOpen, cuveInitiale]);
  
  if(!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['capaciteMax', 'seuilAlerteBas'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? (parseFloat(value) || 0) : value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nom?.trim() || !formData.typeCarburantId || !formData.capaciteMax || !formData.seuilAlerteBas) {
        setError('Tous les champs sont requis.');
        return;
    }
    if (formData.seuilAlerteBas >= formData.capaciteMax) {
        setError('Le seuil d\'alerte doit être inférieur à la capacité maximale.');
        return;
    }
    
    setIsSaving(true);
    try {
        const finalData: Cuve = {
            id: formData.id || uuidv4(),
            nom: formData.nom,
            typeCarburantId: formData.typeCarburantId,
            capaciteMax: formData.capaciteMax,
            seuilAlerteBas: formData.seuilAlerteBas,
            statut: formData.statut || 'operationnelle',
        };
        await onSave(finalData);
    } catch(e: any) {
        setError(e.message || 'Erreur lors de la sauvegarde.');
    } finally {
        setIsSaving(false);
    }
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg transform" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center pb-3 mb-4 border-b">
                <h3 className="text-xl font-semibold text-purple-700"><FiHardDrive className="inline mr-2"/> {isCreationMode ? 'Ajouter une Cuve' : 'Modifier la Cuve'}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><FiX size={20}/></button>
            </div>
             <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div><label htmlFor="nom" className={labelClass}>Nom de la Cuve <span className="text-red-500">*</span></label><input type="text" id="nom" name="nom" value={formData.nom || ''} onChange={handleChange} className={inputClass} required/></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="typeCarburantId" className={labelClass}>Type Carburant Stocké <span className="text-red-500">*</span></label>
                        <select id="typeCarburantId" name="typeCarburantId" value={formData.typeCarburantId || ''} onChange={handleChange} className={`${inputClass} cursor-pointer`} required>
                           <option value="">Sélectionner...</option>
                           {typesCarburantDisponibles.map(tc => <option key={tc.id} value={tc.id}>{tc.nom}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="statut" className={labelClass}>Statut</label>
                        <select id="statut" name="statut" value={formData.statut} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                           <option value="operationnelle">Opérationnelle</option>
                           <option value="maintenance">En Maintenance</option>
                           <option value="hors_service">Hors Service</option>
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label htmlFor="capaciteMax" className={labelClass}>Capacité Max (Litres) <span className="text-red-500">*</span></label><input type="number" id="capaciteMax" name="capaciteMax" value={formData.capaciteMax || ''} onChange={handleChange} min="0" className={inputClass} required/></div>
                    <div><label htmlFor="seuilAlerteBas" className={labelClass}>Seuil d'Alerte Bas (Litres) <span className="text-red-500">*</span></label><input type="number" id="seuilAlerteBas" name="seuilAlerteBas" value={formData.seuilAlerteBas || ''} onChange={handleChange} min="0" className={inputClass} required/></div>
                 </div>

                {error && (<p className="text-red-500 text-sm mt-2">{error}</p>)}
                
                <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                     <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
                     <button type="submit" disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
                       {isSaving ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/>Enregistrer</>}
                     </button>
                </div>
            </form>
        </div>
    </div>
  )
}
export default CuveFormModal;