// src/components/modals/ClientFormModal.tsx
import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiUser, FiBriefcase, FiMail, FiPhone, FiMapPin, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import type { ClientData, TypeClient, ClientParticulier, ClientProfessionnel } from '../../types/clients'; // Adapter chemin
import Spinner from '../Spinner'; // Adapter chemin

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: ClientData) => Promise<void>;
  clientInitial?: ClientData | null;
  isCreationMode: boolean;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ 
    isOpen, onClose, onSave, clientInitial, isCreationMode 
}) => {
  
  const getInitialFormData = (): Partial<ClientData> => {
    if (clientInitial) return { ...clientInitial };
    return { // Valeurs par défaut pour la création
        typeClient: 'particulier',
        nomAffichage: '',
        statutCompte: 'actif',
        email: '',
        telephone: '',
        adresse: '',
        // Champs Particulier
        prenom: '',
        nomFamille: '',
        // Champs Professionnel
        raisonSociale: '',
        limiteCredit: 0,
        soldeActuelCredit: 0, // Initialement 0 pour un nouveau client pro
    } as Partial<ClientData>;
  };

  const [formData, setFormData] = useState<Partial<ClientData>>(getInitialFormData());
  const [clientType, setClientType] = useState<TypeClient>(clientInitial?.typeClient || 'particulier');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        const initialData = getInitialFormData();
        setFormData(initialData);
        setClientType(initialData.typeClient || 'particulier');
        setError(null);
    }
  }, [isOpen, clientInitial]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number | string[] = value;
    if(name === 'limiteCredit' || name === 'soldeActuelCredit') {
        finalValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    setError(null);
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as TypeClient;
    setClientType(newType);
    setFormData(prev => ({
        // Garder les champs communs, réinitialiser les champs spécifiques
        id: prev.id, // important si modification
        nomAffichage: prev.nomAffichage, // ou recalculer en fonction de nom/prénom/raisonSociale
        email: prev.email,
        telephone: prev.telephone,
        adresse: prev.adresse,
        statutCompte: prev.statutCompte || 'actif',
        typeClient: newType,
        // Réinitialiser spécifiquement si on change de type
        ...(newType === 'particulier' ? { prenom:'', nomFamille:'', immatriculations: []} : {}),
        ...(newType === 'professionnel' ? { raisonSociale:'', limiteCredit:0, soldeActuelCredit:0 } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    let nomAffichageCalc = '';
    if (clientType === 'particulier') {
      if (!(formData as Partial<ClientParticulier>).nomFamille?.trim()) {
        setError("Le nom de famille est requis pour un particulier.");
        return;
      }
      nomAffichageCalc = `${(formData as Partial<ClientParticulier>).prenom || ''} ${(formData as Partial<ClientParticulier>).nomFamille}`.trim();
    } else { // professionnel
      if (!(formData as Partial<ClientProfessionnel>).raisonSociale?.trim()) {
        setError("La raison sociale est requise pour un professionnel.");
        return;
      }
      nomAffichageCalc = (formData as Partial<ClientProfessionnel>).raisonSociale!;
    }

    const finalData: ClientData = {
        ...getInitialFormData(), // Pour s'assurer que tous les champs ont une valeur par défaut si non remplis
        ...formData,
        typeClient: clientType,
        nomAffichage: nomAffichageCalc,
        id: formData.id || '' // S'assurer que id est toujours une string (vide si création)
    } as ClientData; // Assert type pour satisfaire TypeScript

    setIsSaving(true);
    try {
      await onSave(finalData);
    } catch (saveError: any) {
      setError(saveError.message || "Erreur lors de l'enregistrement du client.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";

  return (
     <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl transform max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-3 border-b">
          <h3 className="text-xl font-semibold text-purple-700">
            {isCreationMode ? 'Ajouter un Nouveau Client' : `Modifier Client: ${clientInitial?.nomAffichage || ''}`}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"><FiX size={22}/></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar-thin space-y-4">
            <div>
                <label htmlFor="typeClient" className={labelClass}>Type de Client <span className="text-red-500">*</span></label>
                <select name="typeClient" id="typeClient" value={clientType} onChange={handleClientTypeChange} className={`${inputClass} cursor-pointer`}>
                    <option value="particulier">Particulier</option>
                    <option value="professionnel">Professionnel / Entreprise</option>
                </select>
            </div>

            {clientType === 'particulier' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div><label htmlFor="prenom" className={labelClass}><FiUser className="inline mr-1"/>Prénom</label><input type="text" name="prenom" id="prenom" value={(formData as Partial<ClientParticulier>).prenom || ''} onChange={handleChange} className={inputClass}/></div>
                    <div><label htmlFor="nomFamille" className={labelClass}><FiUser className="inline mr-1"/>Nom <span className="text-red-500">*</span></label><input type="text" name="nomFamille" id="nomFamille" value={(formData as Partial<ClientParticulier>).nomFamille || ''} onChange={handleChange} className={inputClass} required/></div>
                </div>
            )}

            {clientType === 'professionnel' && (
                <div className="animate-fadeIn">
                    <label htmlFor="raisonSociale" className={labelClass}><FiBriefcase className="inline mr-1"/>Raison Sociale <span className="text-red-500">*</span></label>
                    <input type="text" name="raisonSociale" id="raisonSociale" value={(formData as Partial<ClientProfessionnel>).raisonSociale || ''} onChange={handleChange} className={inputClass} required />
                
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div><label htmlFor="nomContactPrincipal" className={labelClass}>Nom Contact Principal</label><input type="text" name="nomContactPrincipal" id="nomContactPrincipal" value={(formData as Partial<ClientProfessionnel>).nomContactPrincipal || ''} onChange={handleChange} className={inputClass} /></div>
                        <div><label htmlFor="limiteCredit" className={labelClass}><FiCreditCard className="inline mr-1"/>Limite de Crédit (XAF)</label><input type="number" name="limiteCredit" id="limiteCredit" value={(formData as Partial<ClientProfessionnel>).limiteCredit || 0} onChange={handleChange} className={inputClass} step="1000" min="0"/></div>
                    </div>
                 </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                 <div><label htmlFor="email" className={labelClass}><FiMail className="inline mr-1"/>Email</label><input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className={inputClass}/></div>
                 <div><label htmlFor="telephone" className={labelClass}><FiPhone className="inline mr-1"/>Téléphone</label><input type="tel" name="telephone" id="telephone" value={formData.telephone || ''} onChange={handleChange} className={inputClass}/></div>
            </div>
            
            <div><label htmlFor="adresse" className={labelClass}><FiMapPin className="inline mr-1"/>Adresse</label><textarea name="adresse" id="adresse" value={formData.adresse || ''} onChange={handleChange} rows={2} className={inputClass}></textarea></div>

            <div>
                <label htmlFor="statutCompte" className={labelClass}>Statut du Compte</label>
                <select name="statutCompte" id="statutCompte" value={formData.statutCompte || 'actif'} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="prospect">Prospect</option>
                    {clientType === 'professionnel' && <option value="bloque">Bloqué (Crédit)</option>}
                </select>
            </div>
            
           {error && (<div className="mt-2 p-2 rounded-md bg-red-50 text-red-600 text-sm flex items-center"><FiAlertCircle className="mr-1.5"/> {error}</div>)}
        </form>

        <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="btn-secondary-sm">Annuler</button>
            <button type="button" onClick={handleSubmit} disabled={isSaving} className="btn-primary-sm inline-flex items-center justify-center min-w-[120px]">
              {isSaving ? <Spinner size="sm" color="text-white" /> : <><FiSave className="mr-2"/> Enregistrer Client</>}
            </button>
        </div>
      </div>
    </div>
  );
};
export default ClientFormModal;