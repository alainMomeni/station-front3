// src/components/modals/ProduitFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import type { ProduitCatalogueComplet, CategorieProduit } from '../../types/catalogue'; // Adapter chemin
import Spinner from '../Spinner'; // Adapter chemin

interface ProduitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (produitData: ProduitCatalogueComplet) => Promise<void>; // Retourne une promesse pour gérer le 'saving'
  produitInitial?: ProduitCatalogueComplet | null;
  categories: CategorieProduit[]; // Pour le select de catégorie
}

const ProduitFormModal: React.FC<ProduitFormModalProps> = ({ isOpen, onClose, onSave, produitInitial, categories }) => {
  const getInitialState = (): ProduitCatalogueComplet => ({
    id: produitInitial?.id || '', // Garder l'ID si modification, sinon vide pour création (Directus générera l'ID)
    nom: produitInitial?.nom || '',
    reference: produitInitial?.reference || '',
    description: produitInitial?.description || '',
    categorieId: produitInitial?.categorieId || '',
    typeProduit: produitInitial?.typeProduit || 'boutique',
    uniteMesure: produitInitial?.uniteMesure || 'Unité',
    prixAchatStandard: produitInitial?.prixAchatStandard || 0,
    prixVenteActuel: produitInitial?.prixVenteActuel || 0,
    seuilAlerteStock: produitInitial?.seuilAlerteStock || 0,
    estActif: produitInitial?.estActif !== undefined ? produitInitial.estActif : true, // Actif par défaut
    // imageUrls: produitInitial?.imageUrls || [], // Gestion images plus complexe, omise pour simplifier
  });

  const [formData, setFormData] = useState<ProduitCatalogueComplet>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(getInitialState()); // Reset form data when produitInitial changes (or modal opens/closes)
    setError(null);
  }, [isOpen, produitInitial]);


  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox'; // Pour 'estActif'
    // @ts-ignore <-- Pour calmer TS sur le type de e.target.checked pour HTMLSelect/TextArea
    const val = isCheckbox ? e.target.checked : value;

    setFormData(prev => ({ ...prev, [name]: val }));
    setError(null);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) })); // Garder '' pour permettre la suppression avant de taper un nouveau nombre
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.nom.trim() || !formData.typeProduit || !formData.uniteMesure) {
        setError("Les champs Nom, Type de produit et Unité de mesure sont requis.");
        return;
    }
    if (formData.prixVenteActuel < 0 || (formData.prixAchatStandard && formData.prixAchatStandard < 0)) {
        setError("Les prix ne peuvent pas être négatifs.");
        return;
    }

    setIsSaving(true);
    try {
        await onSave(formData); // onSave est asynchrone
        // La fermeture se fera dans la page parente après succès de onSave
    } catch (saveError: any) {
        setError(saveError.message || "Erreur lors de l'enregistrement.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-purple-700">
            {produitInitial?.id ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200" aria-label="Fermer"><FiX className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="nom" className={labelClass}>Nom du Produit <span className="text-red-500">*</span></label><input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} className={inputClass} required /></div>
                <div><label htmlFor="reference" className={labelClass}>Référence/SKU</label><input type="text" name="reference" id="reference" value={formData.reference || ''} onChange={handleChange} className={inputClass} /></div>
            </div>
            
            <div><label htmlFor="description" className={labelClass}>Description</label><textarea name="description" id="description" rows={2} value={formData.description || ''} onChange={handleChange} className={inputClass}></textarea></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="categorieId" className={labelClass}>Catégorie</label>
                    <select name="categorieId" id="categorieId" value={formData.categorieId || ''} onChange={handleChange} className={inputClass + " cursor-pointer"}>
                        <option value="">-- Aucune --</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="typeProduit" className={labelClass}>Type de Produit <span className="text-red-500">*</span></label>
                    <select name="typeProduit" id="typeProduit" value={formData.typeProduit} onChange={handleChange} className={inputClass + " cursor-pointer"} required>
                        <option value="boutique">Boutique</option>
                        <option value="lubrifiant">Lubrifiant</option>
                        <option value="carburant">Carburant</option>
                        <option value="accessoire">Accessoire</option>
                        <option value="service">Service</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div><label htmlFor="uniteMesure" className={labelClass}>Unité Mesure <span className="text-red-500">*</span></label><input type="text" name="uniteMesure" id="uniteMesure" value={formData.uniteMesure} onChange={handleChange} className={inputClass} placeholder="Ex: Litre, Unité, Pack..." required /></div>
                 <div><label htmlFor="prixAchatStandard" className={labelClass}>Prix Achat Std. (HT)</label><input type="number" name="prixAchatStandard" id="prixAchatStandard" value={formData.prixAchatStandard || ''} onChange={handleNumericChange} className={inputClass} step="0.01" /></div>
                 <div><label htmlFor="prixVenteActuel" className={labelClass}>Prix Vente Actuel (TTC) <span className="text-red-500">*</span></label><input type="number" name="prixVenteActuel" id="prixVenteActuel" value={formData.prixVenteActuel || ''} onChange={handleNumericChange} className={inputClass} step="0.01" required/></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label htmlFor="seuilAlerteStock" className={labelClass}>Seuil Alerte Stock</label><input type="number" name="seuilAlerteStock" id="seuilAlerteStock" value={formData.seuilAlerteStock || ''} onChange={handleNumericChange} className={inputClass} step="1" min="0"/></div>
                <div className="flex items-center pt-6">
                    <input type="checkbox" name="estActif" id="estActif" checked={formData.estActif} onChange={handleChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                    <label htmlFor="estActif" className="ml-2 block text-sm text-gray-900">Produit Actif (disponible à la vente)</label>
                </div>
            </div>

           {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 flex items-start text-sm">
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50 min-w-[120px]">
              {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2 h-5 w-5" /> Enregistrer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProduitFormModal;