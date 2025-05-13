// src/page/caissier/SignalerDysfonctionnementCaissePage.tsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout'; // Ajuster chemin
import Spinner from '../../components/Spinner'; // Ajuster chemin
import { FiSend, FiTool, FiAlertCircle, FiMapPin, FiType, FiCamera } from 'react-icons/fi';

interface DysfonctionnementCaisseFormData {
    typeEquipement: string; // TPE, Imprimante Ticket, Scanner, Ordinateur Caisse, Tiroir-Caisse, etc.
    localisation: string;   // Caisse 1, Zone Service Client, etc.
    descriptionProbleme: string;
    priorite: 'basse' | 'moyenne' | 'haute';
    photo?: File | null;
    dateSignalement: string;
    caissierId: string;
}

const SignalerDysfonctionnementCaissePage: React.FC = () => {
    const [formData, setFormData] = useState<DysfonctionnementCaisseFormData>({
        typeEquipement: '',
        localisation: 'Caisse Principale', // Pré-remplir si souvent la même
        descriptionProbleme: '',
        priorite: 'moyenne',
        photo: null,
        dateSignalement: new Date().toISOString().slice(0,16), // datetime-local
        caissierId: 'CAISSIER_001_JEAN_C' // Simulé
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
        } else {
            setFormData(prev => ({ ...prev, photo: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.typeEquipement || !formData.descriptionProbleme) {
            setSubmitMessage({type: 'error', text: "Veuillez préciser le type d'équipement et décrire le problème."});
            return;
        }
        setIsSubmitting(true);
        setSubmitMessage(null);
        console.log('Dysfonctionnement Caisse Signalé:', {
            ...formData,
            photo: formData.photo?.name
        });

        // TODO: Appel API Directus pour enregistrer le signalement
        // (vers une collection `signalements_dysfonctionnement_caisse` ou une collection générale avec un champ type)
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler latence

        setSubmitMessage({ type: 'success', text: 'Dysfonctionnement signalé avec succès. Le service de maintenance sera informé.'});
        setFormData({
            typeEquipement: '',
            localisation: 'Caisse Principale',
            descriptionProbleme: '',
            priorite: 'moyenne',
            photo: null,
            dateSignalement: new Date().toISOString().slice(0,16),
            caissierId: 'CAISSIER_001_JEAN_C'
        });
        setIsSubmitting(false);
    };


    return (
        <DashboardLayout>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
                Signaler un Dysfonctionnement (Caisse/Boutique)
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date et Heure du Signalement */}
                     <div>
                        <label htmlFor="dateSignalement" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           Date et Heure <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="dateSignalement"
                            id="dateSignalement"
                            value={formData.dateSignalement}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Type d'équipement */}
                    <div>
                        <label htmlFor="typeEquipement" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           <FiTool className="mr-2 h-4 w-4 text-gray-500" /> Type d'équipement/service <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="typeEquipement"
                            id="typeEquipement"
                            value={formData.typeEquipement}
                            onChange={handleChange}
                            placeholder="Ex: TPE, Imprimante reçus, Scanner codes-barres, PC Caisse..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        />
                    </div>

                     {/* Localisation */}
                    <div>
                        <label htmlFor="localisation" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           <FiMapPin className="mr-2 h-4 w-4 text-gray-500" /> Localisation exacte <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="localisation"
                            id="localisation"
                            value={formData.localisation}
                            onChange={handleChange}
                            placeholder="Ex: Caisse Principale, Caisse 2, Zone libre-service..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        />
                    </div>


                    {/* Description du Problème */}
                    <div>
                        <label htmlFor="descriptionProbleme" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           <FiAlertCircle className="mr-2 h-4 w-4 text-gray-500" /> Description du problème <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="descriptionProbleme"
                            name="descriptionProbleme"
                            rows={4}
                            value={formData.descriptionProbleme}
                            onChange={handleChange}
                            placeholder="Décrivez le plus précisément possible le dysfonctionnement observé..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>

                     {/* Priorité */}
                    <div>
                        <label htmlFor="priorite" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <FiType className="mr-2 h-4 w-4 text-gray-500"/> Niveau de priorité <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="priorite"
                            name="priorite"
                            value={formData.priorite}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                            required
                        >
                            <option value="moyenne">Moyenne (Impact modéré)</option>
                            <option value="basse">Basse (Peut attendre)</option>
                            <option value="haute">Haute (Critique / Urgent)</option>
                        </select>
                    </div>


                    {/* Photo (Optionnel) */}
                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                           <FiCamera className="mr-2 h-4 w-4 text-gray-500" /> Photo (Optionnel)
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

                    {/* Message de soumission */}
                    {submitMessage && (
                         <div className={`p-3 rounded-md flex items-start ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{submitMessage.text}</p>
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
                                    Envoyer Signalement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default SignalerDysfonctionnementCaissePage;