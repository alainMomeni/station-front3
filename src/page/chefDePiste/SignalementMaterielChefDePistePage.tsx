// src/page/chefDePiste/SignalementMaterielChefDePistePage.tsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiSend, FiAlertCircle, FiMapPin, FiType, FiCamera, FiCalendar } from 'react-icons/fi';

interface SignalementMaterielFormData {
  typeEquipement: string;
  localisation: string;
  descriptionProbleme: string;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  photo?: File | null;
  dateSignalement: string; // ISO String pour datetime-local
  rapporteurId: string; // ID du Chef de Piste
  rapporteurNom: string; // Nom du Chef de Piste (pour affichage)
  statutTicket?: 'ouvert' | 'en_cours' | 'resolu' | 'annule'; // Pour suivi futur
}

// Simuler l'utilisateur connecté (Chef de Piste)
const getChefDePisteConnecte = () => ({
    id: 'CDP_001_AMINA_C',
    nomComplet: 'Amina C.',
});


const SignalementMaterielChefDePistePage: React.FC = () => {
  const chefDePisteActuel = getChefDePisteConnecte();

  const getInitialFormData = (): SignalementMaterielFormData => ({
    typeEquipement: '',
    localisation: '',
    descriptionProbleme: '',
    priorite: 'moyenne',
    photo: null,
    dateSignalement: new Date().toISOString().slice(0, 16), // Précision à la minute
    rapporteurId: chefDePisteActuel.id,
    rapporteurNom: chefDePisteActuel.nomComplet,
    statutTicket: 'ouvert',
  });

  const [formData, setFormData] = useState<SignalementMaterielFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    } else {
      setFormData(prev => ({ ...prev, photo: null }));
    }
    setSubmitMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.typeEquipement.trim() || !formData.localisation.trim() || !formData.descriptionProbleme.trim()) {
        setSubmitMessage({type: 'error', text: "Veuillez remplir tous les champs obligatoires (équipement, localisation, description)."});
        return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const dataToSubmit = new FormData(); // Utiliser FormData pour l'upload de fichier
    dataToSubmit.append('type_equipement', formData.typeEquipement);
    dataToSubmit.append('localisation', formData.localisation);
    dataToSubmit.append('description_probleme', formData.descriptionProbleme);
    dataToSubmit.append('priorite', formData.priorite);
    dataToSubmit.append('date_signalement', new Date(formData.dateSignalement).toISOString()); // Convertir en ISO complet
    dataToSubmit.append('rapporteur_id', formData.rapporteurId); // Ou référence vers l'utilisateur
    dataToSubmit.append('statut_ticket', formData.statutTicket || 'ouvert');
    if (formData.photo) {
      dataToSubmit.append('photo_probleme', formData.photo, formData.photo.name);
    }
    
    console.log('Signalement Matériel (Chef de Piste):', { // Pour le débug, FormData est moins lisible
        typeEquipement: formData.typeEquipement,
        localisation: formData.localisation,
        descriptionProbleme: formData.descriptionProbleme,
        priorite: formData.priorite,
        dateSignalement: new Date(formData.dateSignalement).toISOString(),
        rapporteurId: formData.rapporteurId,
        statutTicket: formData.statutTicket,
        nomFichierPhoto: formData.photo?.name
    });


    // TODO: Appel API Directus pour enregistrer le signalement.
    // Créer un item dans une collection 'signalements_materiel'.
    // L'upload de 'photo_probleme' se fera via l'API Fichiers de Directus,
    // puis l'ID du fichier sera lié à l'item de signalement.
    // Ou, si le SDK Directus gère le multipart/form-data correctement, c'est plus simple.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler latence API

    setSubmitMessage({ type: 'success', text: 'Dysfonctionnement matériel signalé avec succès. Un ticket a été créé.'});
    setFormData(getInitialFormData()); // Réinitialiser avec le nom du rapporteur mis à jour
    setIsSubmitting(false);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
  const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer";


  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
         Signaler un Problème Matériel
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date et Heure du Signalement */}
          <div>
              <label htmlFor="dateSignalement" className={`${labelClass} flex items-center`}>
                  <FiCalendar className="mr-2 h-4 w-4 text-gray-400" /> Date et Heure du Constat <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                  type="datetime-local"
                  name="dateSignalement"
                  id="dateSignalement"
                  value={formData.dateSignalement}
                  onChange={handleChange}
                  className={inputClass}
                  required
              />
          </div>

          {/* Type d'équipement */}
          <div>
              <label htmlFor="typeEquipement" className={`${labelClass} flex items-center`}>
                  <FiType className="mr-2 h-4 w-4 text-gray-400" /> Type d'équipement/Installation <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                  type="text"
                  name="typeEquipement"
                  id="typeEquipement"
                  value={formData.typeEquipement}
                  onChange={handleChange}
                  placeholder="Ex: Pompe SP95 N°2, TPE Caisse 1, Manomètre Cuve Diesel..."
                  className={inputClass}
                  required
              />
          </div>

          {/* Localisation */}
          <div>
              <label htmlFor="localisation" className={`${labelClass} flex items-center`}>
                  <FiMapPin className="mr-2 h-4 w-4 text-gray-400" /> Localisation exacte <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                  type="text"
                  name="localisation"
                  id="localisation"
                  value={formData.localisation}
                  onChange={handleChange}
                  placeholder="Ex: Piste 1, Zone Caisse, Local Technique..."
                  className={inputClass}
                  required
              />
          </div>

          {/* Description du Problème */}
          <div>
              <label htmlFor="descriptionProbleme" className={`${labelClass} flex items-center`}>
                  <FiAlertCircle className="mr-2 h-4 w-4 text-gray-400" /> Description détaillée du problème <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                  id="descriptionProbleme"
                  name="descriptionProbleme"
                  rows={4}
                  value={formData.descriptionProbleme}
                  onChange={handleChange}
                  placeholder="Décrivez le dysfonctionnement, les symptômes, l'impact sur les opérations..."
                  className={inputClass}
                  required
              ></textarea>
          </div>

          {/* Priorité */}
          <div>
              <label htmlFor="priorite" className={`${labelClass} flex items-center`}>
                  <FiType className="mr-2 h-4 w-4 text-gray-400"/> Niveau de priorité estimé <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                  id="priorite"
                  name="priorite"
                  value={formData.priorite}
                  onChange={handleChange}
                  className={selectClass}
                  required
              >
                  <option value="moyenne">Moyenne (Impact modéré, à traiter prochainement)</option>
                  <option value="basse">Basse (Mineur, non bloquant)</option>
                  <option value="haute">Haute (Impact important, traitement rapide requis)</option>
                  <option value="critique">Critique (Arrêt des opérations, danger potentiel)</option>
              </select>
          </div>

          {/* Photo (Optionnel) */}
          <div>
              <label htmlFor="photo" className={`${labelClass} flex items-center`}>
                  <FiCamera className="mr-2 h-4 w-4 text-gray-400" /> Photo du problème (Optionnel)
              </label>
              <input
                  type="file"
                  name="photo"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
              />
              {formData.photo && (
                  <p className="text-xs text-gray-500 mt-1">Fichier sélectionné : {formData.photo.name}</p>
              )}
          </div>
          
          {/* Rapporteur (Info) */}
           <div>
              <label className={`${labelClass} flex items-center`}>
                 Chef de Piste Rapporteur
              </label>
              <input
                  type="text"
                  value={formData.rapporteurNom}
                  readOnly
                  className={`${inputClass} bg-gray-100 cursor-not-allowed`}
              />
          </div>


          {/* Message de soumission */}
          {submitMessage && (
                <div className={`p-3 rounded-md flex items-start text-sm ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  {submitMessage.text}
              </div>
          )}

          {/* Bouton Envoyer */}
          <div className="pt-2 text-right">
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
              >
                  {isSubmitting ? (
                      <Spinner size="sm" color="text-white" />
                  ) : (
                      <>
                          <FiSend className="-ml-1 mr-2 h-5 w-5" />
                          Envoyer le Signalement
                      </>
                  )}
              </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SignalementMaterielChefDePistePage;