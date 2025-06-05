// src/components/modals/UtilisateurFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiUser, FiMail, FiPhone, FiKey, FiUsers, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import type { UtilisateurSysteme, RoleType } from '../../types/personnel'; // Adapter
import { menuConfig } from '../../config/menuConfig'; // Pour obtenir la liste des rôles
import Spinner from '../Spinner';

interface UtilisateurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UtilisateurSysteme, motDePasse?: string) => Promise<void>; // motDePasse seulement si création/reset
  utilisateurInitial?: UtilisateurSysteme | null;
  isCreationMode: boolean;
}

// Extraire les rôles de menuConfig pour les options du select
const rolesDisponibles: { value: RoleType; label: string }[] = Object.keys(menuConfig).map(roleKey => ({
    value: roleKey as RoleType,
    label: roleKey.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}));


const UtilisateurFormModal: React.FC<UtilisateurFormModalProps> = ({ isOpen, onClose, onSave, utilisateurInitial, isCreationMode }) => {
  const getInitialState = (): UtilisateurSysteme => ({
    id: utilisateurInitial?.id || '', // L'ID sera vide pour la création (généré par Directus)
    prenom: utilisateurInitial?.prenom || '',
    nom: utilisateurInitial?.nom || '',
    email: utilisateurInitial?.email || '',
    telephone: utilisateurInitial?.telephone || '',
    roles: utilisateurInitial?.roles || [rolesDisponibles[0]?.value || 'pompiste'], // Premier rôle par défaut
    statutCompte: utilisateurInitial?.statutCompte || 'actif',
  });

  const [formData, setFormData] = useState<UtilisateurSysteme>(getInitialState());
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
        setMotDePasse('');
        setConfirmationMotDePasse('');
        setError(null);
    }
  }, [isOpen, utilisateurInitial]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRolesChange = (selectedRole: RoleType) => {
    setFormData((prev: UtilisateurSysteme) => {
        const rolesActuels = prev.roles.includes(selectedRole)
            ? prev.roles.filter(r => r !== selectedRole)
            : [...prev.roles, selectedRole];
        // S'assurer qu'il y a au moins un rôle sélectionné si on le permet. Pour la démo, 1 rôle suffit.
        // Pour Directus, vous passerez un array de string des IDs de rôles.
        return { ...prev, roles: rolesActuels.length > 0 ? rolesActuels : [selectedRole]}; // Simple sélection ici
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim()) {
        setError("Prénom, Nom et Email sont requis.");
        return;
    }
    if (isCreationMode || motDePasse) { // Valider MDP si création ou si un nouveau MDP est saisi
        if (motDePasse.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        if (motDePasse !== confirmationMotDePasse) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
    }
    if (formData.roles.length === 0) {
        setError("Au moins un rôle doit être assigné.");
        return;
    }

    setIsSaving(true);
    try {
      // Pour Directus, l'ID n'est pas envoyé à la création. Le MDP est envoyé uniquement si changé.
      const dataToSave = { ...formData };
      // Fix: Make id optional in the interface or handle it properly
      if (isCreationMode && dataToSave.id === '') {
        // Create a new object without the id property instead of deleting it
        const { id, ...dataWithoutId } = dataToSave;
        await onSave(dataWithoutId as UtilisateurSysteme, (isCreationMode || motDePasse) ? motDePasse : undefined);
      } else {
        await onSave(dataToSave, (isCreationMode || motDePasse) ? motDePasse : undefined);
      }
    } catch (saveError: any) {
      setError(saveError.message || "Erreur lors de l'enregistrement.");
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
            {isCreationMode ? 'Créer un Nouvel Utilisateur' : `Modifier Utilisateur: ${utilisateurInitial ? `${utilisateurInitial.prenom} ${utilisateurInitial.nom}` : ''}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX className="h-6 w-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="prenom" className={labelClass}><FiUser className="inline mr-1"/>Prénom <span className="text-red-500">*</span></label><input type="text" name="prenom" id="prenom" value={formData.prenom} onChange={handleChange} className={inputClass} required /></div>
                <div><label htmlFor="nom" className={labelClass}><FiUser className="inline mr-1"/>Nom <span className="text-red-500">*</span></label><input type="text" name="nom" id="nom" value={formData.nom} onChange={handleChange} className={inputClass} required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label htmlFor="email" className={labelClass}><FiMail className="inline mr-1"/>Email (Identifiant) <span className="text-red-500">*</span></label><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} required /></div>
                 <div><label htmlFor="telephone" className={labelClass}><FiPhone className="inline mr-1"/>Téléphone</label><input type="tel" name="telephone" id="telephone" value={formData.telephone || ''} onChange={handleChange} className={inputClass} /></div>
            </div>
            
            <div>
                <label className={labelClass}><FiUsers className="inline mr-1"/>Rôle(s) <span className="text-red-500">*</span></label>
                <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {rolesDisponibles.filter(r => r.value !== 'gerant' || (utilisateurInitial?.id === 'gerant_principal_id_special' || isCreationMode ) ) // Ne pas permettre de s'auto-assigner Gérant facilement sauf si admin, ou premier gérant
                    .map(roleOpt => (
                        <label key={roleOpt.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" 
                                   checked={formData.roles.includes(roleOpt.value)}
                                   onChange={() => handleRolesChange(roleOpt.value)}
                                   className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{roleOpt.label}</span>
                        </label>
                    ))}
                </div>
                {formData.roles.length === 0 && <p className="text-xs text-red-500 mt-1">Veuillez assigner au moins un rôle.</p>}
            </div>
            
            {/* Champs Mot de Passe (conditionnel) */}
            {(isCreationMode || utilisateurInitial?.id) && ( // Show for creation or if editing (to allow password change)
                <fieldset className="border rounded-md p-3">
                    <legend className="text-xs font-medium text-gray-600 px-1">{isCreationMode ? "Définir Mot de Passe" : "Changer Mot de Passe (laisser vide pour ne pas changer)"}</legend>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="relative">
                            <label htmlFor="motDePasse" className={labelClass}><FiKey className="inline mr-1"/>Mot de Passe {isCreationMode && <span className="text-red-500">*</span>}</label>
                            <input type={showPassword ? "text" : "password"} name="motDePasse" id="motDePasse" value={motDePasse} onChange={e=>setMotDePasse(e.target.value)} className={inputClass} placeholder={isCreationMode ? "Minimum 6 caractères" : "Nouveau mot de passe..."} />
                            <button type="button" onClick={() => setShowPassword(s=>!s)} className="absolute right-2 top-9 p-1 text-gray-500 hover:text-gray-700">
                                {showPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmationMotDePasse" className={labelClass}><FiKey className="inline mr-1"/>Confirmer MDP {isCreationMode && <span className="text-red-500">*</span>}</label>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmationMotDePasse" id="confirmationMotDePasse" value={confirmationMotDePasse} onChange={e=>setConfirmationMotDePasse(e.target.value)} className={inputClass} />
                             <button type="button" onClick={() => setShowConfirmPassword(s=>!s)} className="absolute right-2 top-9 p-1 text-gray-500 hover:text-gray-700">
                                {showConfirmPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                            </button>
                        </div>
                    </div>
                </fieldset>
            )}
            
            <div>
                <label htmlFor="statutCompte" className={labelClass}>Statut du Compte</label>
                <select name="statutCompte" id="statutCompte" value={formData.statutCompte} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif (Suspendu)</option>
                    <option value="bloque">Bloqué</option>
                </select>
            </div>

           {error && ( <div className="p-3 rounded-md bg-red-50 text-red-700 flex items-start text-sm"><FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {error}</div>)}

          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
            <button type="submit" disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
              {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2 h-5 w-5" /> Enregistrer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UtilisateurFormModal;