// src/components/modals/CategorieFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import type { CategorieProduit } from '../../types/catalogue'; // Adapter chemin
import Spinner from '../Spinner'; // Adapter chemin


interface CategorieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categorieData: Pick<CategorieProduit, 'id' | 'nom' | 'description' | 'typeProduitAssocie'>) => Promise<void>;
  categorieInitial?: CategorieProduit | null;
}

const CategorieFormModal: React.FC<CategorieFormModalProps> = ({ isOpen, onClose, onSave, categorieInitial }) => {
  const getInitialState = () => ({
    id: categorieInitial?.id || '',
    nom: categorieInitial?.nom || '',
    description: categorieInitial?.description || '',
    typeProduitAssocie: categorieInitial?.typeProduitAssocie || 'boutique',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setFormData(getInitialState());
    setError(null);
  }, [isOpen, categorieInitial]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nom.trim()) {
        setError("Le nom de la catégorie est requis.");
        return;
    }
    setIsSaving(true);
    try {
        await onSave(formData);
    } catch (saveError: any) {
        setError(saveError.message || "Erreur lors de l'enregistrement.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";


  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-purple-700">
            {categorieInitial?.id ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200"><FiX className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="nomCat" className={labelClass}>Nom Catégorie <span className="text-red-500">*</span></label><input type="text" name="nom" id="nomCat" value={formData.nom} onChange={handleChange} className={inputClass} required /></div>
          <div>
              <label htmlFor="typeProduitAssocie" className={labelClass}>Type de Produits Associé <span className="text-red-500">*</span></label>
              <select name="typeProduitAssocie" id="typeProduitAssocie" value={formData.typeProduitAssocie} onChange={handleChange} className={inputClass + " cursor-pointer"} required>
                  <option value="boutique">Boutique</option>
                  <option value="lubrifiant">Lubrifiant</option>
                  <option value="carburant">Carburant</option>
                  <option value="accessoire">Accessoire</option>
                  <option value="service">Service</option>
                  <option value="autre">Autre</option>
              </select>
          </div>
          <div><label htmlFor="descriptionCat" className={labelClass}>Description (Optionnel)</label><textarea name="description" id="descriptionCat" rows={2} value={formData.description} onChange={handleChange} className={inputClass}></textarea></div>
          
          {error && (<div className="p-2 rounded-md bg-red-50 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-2 h-4 w-4"/> {error}</div>)}

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50 min-w-[110px]">
                {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2 h-4 w-4" /> Enregistrer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategorieFormModal;