// src/components/modals/DepenseFormModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiX, FiAlertCircle, FiPaperclip, FiCalendar, FiDollarSign, FiTag, FiType } from 'react-icons/fi';
import type { DepenseData, CategorieDepense, ModePaiementDepense } from '../../types/finance'; // Adapter chemin
import Spinner from '../Spinner'; // Adapter chemin

interface DepenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (depense: Omit<DepenseData, 'id' | 'enregistreParId' | 'pieceJointeUrl' | 'pieceJointeNom' | 'categorieNom'>, pieceJointeFichier?: File | null) => Promise<void>;
  depenseInitiale?: DepenseData | null;
  categoriesDepense: CategorieDepense[];
}

const modesPaiementOptions: { value: ModePaiementDepense, label: string }[] = [
    { value: 'especes', label: 'Espèces' },
    { value: 'virement_bancaire', label: 'Virement Bancaire' },
    { value: 'cheque', label: 'Chèque' },
    { value: 'carte_entreprise', label: 'Carte Entreprise' },
    { value: 'mobile_money_entreprise', label: 'Mobile Money (Entr.)' },
    { value: 'autre', label: 'Autre' },
];

const DepenseFormModal: React.FC<DepenseFormModalProps> = ({ 
    isOpen, onClose, onSave, depenseInitiale, categoriesDepense 
}) => {
  const getInitialState = (): Omit<DepenseData, 'id' | 'enregistreParId' | 'pieceJointeUrl' | 'pieceJointeNom' | 'categorieNom'> => ({
    dateDepense: depenseInitiale?.dateDepense || new Date().toISOString().split('T')[0],
    description: depenseInitiale?.description || '',
    montant: depenseInitiale?.montant || 0,
    categorieId: depenseInitiale?.categorieId || '',
    fournisseurBeneficiaire: depenseInitiale?.fournisseurBeneficiaire || '',
    modePaiement: depenseInitiale?.modePaiement || 'especes',
    referencePaiement: depenseInitiale?.referencePaiement || '',
    notes: depenseInitiale?.notes || '',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [pieceJointe, setPieceJointe] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
        setPieceJointe(null); // Reset file on open
        if(fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
        setError(null);
    }
  }, [isOpen, depenseInitiale]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'montant' ? parseFloat(value) || 0 : value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPieceJointe(e.target.files[0]);
    } else {
      setPieceJointe(null);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.description.trim() || formData.montant <= 0 || !formData.categorieId || !formData.dateDepense) {
        setError("Date, Description, Montant (>0) et Catégorie sont requis.");
        return;
    }
    setIsSaving(true);
    try {
        await onSave(formData, pieceJointe); // onSave gère l'upload si 'pieceJointe' est fourni
    } catch (saveError: any) {
        setError(saveError.message || "Erreur lors de l'enregistrement de la dépense.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform max-h-[90vh] overflow-y-auto custom-scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-3 border-b">
          <h3 className="text-xl font-semibold text-purple-700">
            {depenseInitiale?.id ? 'Modifier la Dépense' : 'Nouvelle Dépense'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="dateDepense" className={`${labelClass} flex items-center`}><FiCalendar className="mr-1.5"/>Date <span className="text-red-500">*</span></label><input type="date" name="dateDepense" id="dateDepense" value={formData.dateDepense} onChange={handleChange} className={inputClass} required /></div>
                <div><label htmlFor="montant" className={`${labelClass} flex items-center`}><FiDollarSign className="mr-1.5"/>Montant (XAF) <span className="text-red-500">*</span></label><input type="number" name="montant" id="montant" value={formData.montant || ''} onChange={handleChange} className={inputClass} step="1" min="1" required /></div>
            </div>
            
            <div><label htmlFor="description" className={`${labelClass} flex items-center`}><FiType className="mr-1.5"/>Description <span className="text-red-500">*</span></label><input type="text" name="description" id="description" value={formData.description} onChange={handleChange} className={inputClass} placeholder="Ex: Achat papier imprimante, Réparation pompe N°3" required /></div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="categorieId" className={`${labelClass} flex items-center`}><FiTag className="mr-1.5"/>Catégorie <span className="text-red-500">*</span></label>
                    <select name="categorieId" id="categorieId" value={formData.categorieId} onChange={handleChange} className={`${inputClass} cursor-pointer`} required>
                        <option value="" disabled>-- Sélectionner --</option>
                        {categoriesDepense.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="modePaiement" className={`${labelClass} flex items-center`}>Mode de Paiement <span className="text-red-500">*</span></label>
                    <select name="modePaiement" id="modePaiement" value={formData.modePaiement} onChange={handleChange} className={`${inputClass} cursor-pointer`} required>
                        {modesPaiementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="fournisseurBeneficiaire" className={labelClass}>Fournisseur / Bénéficiaire</label><input type="text" name="fournisseurBeneficiaire" id="fournisseurBeneficiaire" value={formData.fournisseurBeneficiaire} onChange={handleChange} className={inputClass} placeholder="Optionnel" /></div>
                <div><label htmlFor="referencePaiement" className={labelClass}>Référence Paiement/Facture</label><input type="text" name="referencePaiement" id="referencePaiement" value={formData.referencePaiement} onChange={handleChange} className={inputClass} placeholder="N° Facture, etc."/></div>
            </div>

            <div><label htmlFor="notes" className={labelClass}>Notes complémentaires</label><textarea name="notes" id="notes" rows={2} value={formData.notes} onChange={handleChange} className={inputClass}></textarea></div>
            
            <div>
                <label htmlFor="pieceJointe" className={`${labelClass} flex items-center`}><FiPaperclip className="mr-1.5"/>Pièce Jointe (Facture/Reçu)</label>
                <input type="file" name="pieceJointe" id="pieceJointe" onChange={handleFileChange} ref={fileInputRef}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"/>
                {depenseInitiale?.pieceJointeNom && !pieceJointe && <p className="text-xs text-gray-500 mt-1">Actuel: {depenseInitiale.pieceJointeNom} (Choisir un nouveau fichier pour remplacer)</p>}
                {pieceJointe && <p className="text-xs text-gray-500 mt-1">Nouveau: {pieceJointe.name}</p>}
            </div>


           {error && ( <div className="p-3 rounded-md bg-red-50 text-red-700 flex items-start text-sm"><FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {error}</div>)}

          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50 min-w-[120px]">
              {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2 h-5 w-5" /> Enregistrer Dépense</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default DepenseFormModal;