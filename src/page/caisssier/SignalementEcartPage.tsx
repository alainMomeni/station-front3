// src/page/SignalementEcartPage.tsx (Adapter si vous le mettez dans page/caissier/)
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiSend, FiDollarSign, FiAlertCircle, FiEdit2, FiCalendar } from 'react-icons/fi';

interface EcartCaisseFormData {
    montantAttendu: string;
    montantReel: string;
    ecartCalcule: string; // Read-only, calculé
    notes: string;
    dateSignalement: string; // Date et heure
    shiftId?: string; // Optionnel, pour lier à un quart spécifique
    caissierId: string; // Qui signale
}

const SignalementEcartPage: React.FC = () => {
    const [formData, setFormData] = useState<EcartCaisseFormData>({
        montantAttendu: '',
        montantReel: '',
        ecartCalcule: '',
        notes: '',
        dateSignalement: new Date().toISOString().slice(0, 16), // Format datetime-local
        caissierId: 'CAISSIER_001_JEAN_C' // Simulé - à remplacer par l'ID de l'utilisateur connecté
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Mettre à jour l'écart calculé quand montantAttendu ou montantReel change
    useEffect(() => {
        const attendu = parseFloat(formData.montantAttendu);
        const reel = parseFloat(formData.montantReel);

        if (!isNaN(attendu) && !isNaN(reel)) {
            const ecart = reel - attendu;
            setFormData(prev => ({ ...prev, ecartCalcule: ecart.toFixed(0) })); // XAF
        } else {
            setFormData(prev => ({ ...prev, ecartCalcule: '' }));
        }
    }, [formData.montantAttendu, formData.montantReel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.montantAttendu || !formData.montantReel) {
             setSubmitMessage({ type: 'error', text: 'Veuillez renseigner le montant attendu et le montant réel.' });
             return;
        }
        if (formData.notes.trim() === '' && parseFloat(formData.ecartCalcule) !== 0) {
            if(!window.confirm("L'écart n'est pas nul et aucune note n'a été fournie. Voulez-vous continuer ?")) {
                return;
            }
        }


        setIsSubmitting(true);
        setSubmitMessage(null);
        console.log('Signalement Écart Caisse:', {
             ...formData,
             ecartCalcule: parseFloat(formData.ecartCalcule), // S'assurer que c'est un nombre
             montantAttendu: parseFloat(formData.montantAttendu),
             montantReel: parseFloat(formData.montantReel),
        });

        // TODO: Appel API Directus pour sauvegarder le signalement
        // (Collection: signalements_ecart_caisse par exemple)
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler latence API

        setSubmitMessage({ type: 'success', text: 'Votre signalement d\'écart de caisse a été envoyé avec succès.' });
        // Réinitialiser le formulaire après succès
        setFormData({
            montantAttendu: '',
            montantReel: '',
            ecartCalcule: '',
            notes: '',
            dateSignalement: new Date().toISOString().slice(0, 16),
            caissierId: 'CAISSIER_001_JEAN_C' // Garder l'ID caissier ou recharger
        });
        setIsSubmitting(false);
    };

    // Helper pour formater le montant XAF
    const formatXAF = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(num)) return '';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits:0 }).format(num);
    };

    return (
        <DashboardLayout>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
                Signaler un Écart de Caisse
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date et Heure du Signalement */}
                    <div>
                        <label htmlFor="dateSignalement" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiCalendar className="mr-2 h-4 w-4 text-gray-500" /> Date et Heure du Signalement <span className="text-red-500">*</span>
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

                    {/* Montants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="montantAttendu" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FiDollarSign className="mr-2 h-4 w-4 text-gray-500" /> Montant Attendu en Caisse <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="montantAttendu"
                                id="montantAttendu"
                                value={formData.montantAttendu}
                                onChange={handleChange}
                                placeholder="Ex: 550000"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                step="1" // Permet des nombres entiers XAF
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="montantReel" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FiDollarSign className="mr-2 h-4 w-4 text-gray-500" /> Montant Réel Compté <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="montantReel"
                                id="montantReel"
                                value={formData.montantReel}
                                onChange={handleChange}
                                placeholder="Ex: 549500"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                step="1"
                                required
                            />
                        </div>
                    </div>

                    {/* Écart Calculé (Read-only) */}
                    <div>
                        <label htmlFor="ecartCalcule" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           Écart Constaté
                        </label>
                        <input
                            type="text"
                            name="ecartCalcule"
                            id="ecartCalcule"
                            value={formData.ecartCalcule ? formatXAF(formData.ecartCalcule) : '0 XAF'}
                            readOnly
                            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm font-semibold ${
                                parseFloat(formData.ecartCalcule) < 0 ? 'text-red-600' : parseFloat(formData.ecartCalcule) > 0 ? 'text-green-600' : 'text-gray-700'
                            }`}
                        />
                        {parseFloat(formData.ecartCalcule) !== 0 && parseFloat(formData.ecartCalcule) && (
                           <p className={`text-xs mt-1 ${parseFloat(formData.ecartCalcule) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                               {parseFloat(formData.ecartCalcule) < 0 ? 'Manquant en caisse' : 'Excédent en caisse'}
                           </p>
                        )}
                    </div>

                    {/* Notes / Justifications */}
                    <div>
                        <label htmlFor="notes" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           <FiEdit2 className="mr-2 h-4 w-4 text-gray-500" /> Notes / Explication de l'écart
                           {parseFloat(formData.ecartCalcule) !== 0 && parseFloat(formData.ecartCalcule) && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Expliquez la raison possible de l'écart (erreur de rendu monnaie, paiement non enregistré, etc.)..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required={parseFloat(formData.ecartCalcule) !== 0 && !isNaN(parseFloat(formData.ecartCalcule))} // Requis si écart non nul
                        ></textarea>
                    </div>

                    {/* Message de soumission */}
                    {submitMessage && (
                        <div className={`p-3 rounded-md flex items-start ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{submitMessage.text}</p>
                        </div>
                    )}

                    {/* Bouton d'envoi */}
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

export default SignalementEcartPage;