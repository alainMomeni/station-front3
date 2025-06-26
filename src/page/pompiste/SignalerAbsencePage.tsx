// src/page/pompiste/SignalerAbsencePage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiSend, FiUserX } from 'react-icons/fi';

// Écosystème et UI Kit
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Alert } from '../../components/ui/Alert';
import { FileUpload } from '../../components/ui/FileUpload'; // On réutilise notre composant


interface AbsenceFormData {
    typeAbsence: '' | 'maladie' | 'conge_perso' | 'autre';
    dateDebut: string;
    dateFin: string;
    motif: string;
    justificatif?: File | null;
}

const typeAbsenceOptions = [
    { value: '', label: '-- Choisir un type --' },
    { value: 'maladie', label: 'Maladie' },
    { value: 'conge_perso', label: 'Congé Personnel' },
    { value: 'autre', label: 'Autre (préciser dans le motif)' },
];


const SignalerAbsencePage: React.FC = () => {
    // --- États ---
    const getInitialState = (): AbsenceFormData => ({
        typeAbsence: '',
        dateDebut: '',
        dateFin: '',
        motif: '',
        justificatif: null,
    });
    
    const [formData, setFormData] = useState<AbsenceFormData>(getInitialState());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // --- Handlers ---
    const handleChange = () => { /* ... */ };
    const handleFileSelect = () => { /* ... */ };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ... Logique de validation et soumission
        setIsSubmitting(true);
        console.log("Envoi du signalement d'absence:", formData);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitMessage({ type: 'success', text: "Signalement envoyé. Vous recevrez une notification de confirmation."});
        setFormData(getInitialState());
        setIsSubmitting(false);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiUserX className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Signaler une Absence</h1>
                        <p className="text-gray-600">Informez votre hiérarchie de votre absence prévue ou imprévue.</p>
                    </div>
                </div>

                <Card title="Formulaire de Signalement d'Absence" icon={FiUserX}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                             {submitMessage && (
                                <Alert variant={submitMessage.type} title="Notification" dismissible onDismiss={() => setSubmitMessage(null)}>
                                    {submitMessage.text}
                                </Alert>
                            )}

                             <Select label="Type d'absence*" name="typeAbsence" value={formData.typeAbsence} onChange={handleChange} options={typeAbsenceOptions} required />
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Date de début*" type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
                                <Input label="Date de fin*" type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} required />
                             </div>
                             
                             <Textarea label="Motif / Description*" name="motif" rows={4} value={formData.motif} onChange={handleChange} placeholder="Veuillez décrire brièvement la raison..." required/>
                             
                             <FileUpload label="Joindre un Justificatif (Optionnel)" selectedFile={formData.justificatif ?? null} onFileSelect={handleFileSelect} />
                        </div>

                        <div className="p-6 border-t flex justify-end">
                             <Button type="submit" loading={isSubmitting} size="lg" leftIcon={<FiSend />}>
                                Envoyer le Signalement
                             </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default SignalerAbsencePage;