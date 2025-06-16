import React, { useState } from 'react';
import Spinner from '../../components/Spinner'; // Import Spinner
import { FiSend, FiCalendar, FiEdit2, FiAlertCircle } from 'react-icons/fi';

interface AbsenceFormData {
    typeAbsence: '' | 'maladie' | 'conge_perso' | 'autre';
    dateDebut: string;
    dateFin: string;
    motif: string;
    justificatif?: File | null;
}

const SignalerAbsencePage: React.FC = () => {
    const [formData, setFormData] = useState<AbsenceFormData>({
        typeAbsence: '',
        dateDebut: '',
        dateFin: '',
        motif: '',
        justificatif: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, justificatif: e.target.files![0] }));
        } else {
            setFormData(prev => ({ ...prev, justificatif: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dateDebut || !formData.dateFin) {
             setSubmitMessage({ type: 'error', text: 'Veuillez sélectionner les dates de début et de fin.' });
             return;
        }
        if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
             setSubmitMessage({ type: 'error', text: 'La date de début ne peut pas être ultérieure à la date de fin.' });
             return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);
        console.log('Absence Signalée:', { ...formData, justificatif: formData.justificatif?.name });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitMessage({ type: 'success', text: 'Votre signalement d\'absence a été envoyé avec succès.' });
        setFormData({ typeAbsence: '', dateDebut: '', dateFin: '', motif: '', justificatif: null });
        setIsSubmitting(false);
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
                Signaler une Absence
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type d'absence */}
                    <div>
                        <label htmlFor="typeAbsence" className="block text-sm font-medium text-gray-700 mb-1">
                            Type d'absence <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="typeAbsence"
                            name="typeAbsence"
                            value={formData.typeAbsence}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm cursor-pointer"
                            required
                        >
                            <option value="" disabled>Choisir un type...</option>
                            <option value="maladie">Maladie</option>
                            <option value="conge_perso">Congé Personnel</option>
                            <option value="autre">Autre (préciser)</option>
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="dateDebut" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FiCalendar className="mr-2 h-4 w-4 text-gray-500"/>Date de début <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateDebut"
                                id="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="dateFin" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <FiCalendar className="mr-2 h-4 w-4 text-gray-500"/>Date de fin <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateFin"
                                id="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Motif */}
                    <div>
                        <label htmlFor="motif" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                           <FiEdit2 className="mr-2 h-4 w-4 text-gray-500" /> Motif / Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="motif"
                            name="motif"
                            rows={3}
                            value={formData.motif}
                            onChange={handleChange}
                            placeholder="Veuillez décrire brièvement la raison de votre absence..."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>

                     {/* Justificatif (Optionnel) */}
                    <div>
                        <label htmlFor="justificatif" className="block text-sm font-medium text-gray-700 mb-1">
                            Justificatif (Optionnel)
                        </label>
                        <input
                            type="file"
                            name="justificatif"
                            id="justificatif"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                        />
                         {formData.justificatif && (
                            <p className="text-xs text-gray-500 mt-1">Fichier sélectionné : {formData.justificatif.name}</p>
                        )}
                    </div>

                    {submitMessage && (
                        <div className={`p-3 rounded-md flex items-start ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <p className="text-sm">{submitMessage.text}</p>
                        </div>
                    )}

                    <div className="pt-2 text-right">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[220px]" // Adjusted min-width
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
        </>
    );
};

export default SignalerAbsencePage;