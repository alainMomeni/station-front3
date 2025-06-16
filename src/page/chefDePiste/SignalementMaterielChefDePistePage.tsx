// src/page/chefDePiste/SignalementMaterielChefDePistePage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiTool, FiSend, FiUser } from 'react-icons/fi';

// Types et Données Mock (inchangés)
import type { SignalementMaterielFormData } from '../../types/maintenance';
const getChefDePisteConnecte = () => ({ id: 'CDP_001_AMINA_C', nomComplet: 'Amina C.' });

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Alert } from '../../components/ui/Alert';
import { FileUpload } from '../../components/ui/FileUpload'; // On réutilise notre composant !


// Options pour le sélecteur de priorité
const prioriteOptions = [
    { value: 'moyenne', label: 'Moyenne (Impact modéré)' },
    { value: 'basse', label: 'Basse (Mineur, non bloquant)' },
    { value: 'haute', label: 'Haute (Impact important)' },
    { value: 'critique', label: 'Critique (Arrêt des opérations / Danger)' },
];


const SignalementMaterielChefDePistePage: React.FC = () => {
    // --- États ---
    const getInitialState = (): SignalementMaterielFormData => ({
        typeEquipement: '',
        localisation: '',
        descriptionProbleme: '',
        priorite: 'moyenne',
        photo: null,
        dateSignalement: new Date().toISOString().slice(0, 16),
        rapporteurId: getChefDePisteConnecte().id,
        rapporteurNom: getChefDePisteConnecte().nomComplet,
        statutTicket: 'ouvert',
    });
    
    const [formData, setFormData] = useState<SignalementMaterielFormData>(getInitialState());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // --- Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSubmitMessage(null);
    };

    const handleFileSelect = (file: File | null) => {
        setFormData(prev => ({ ...prev, photo: file }));
        setSubmitMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ... Logique de validation et soumission ...
        if (!formData.typeEquipement || !formData.localisation || !formData.descriptionProbleme) {
            setSubmitMessage({ type: 'error', text: "Veuillez remplir les champs obligatoires." });
            return;
        }
        setIsSubmitting(true);
        console.log("Envoi du signalement:", formData);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitMessage({ type: 'success', text: "Signalement matériel envoyé avec succès." });
        setFormData(getInitialState());
        setIsSubmitting(false);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiTool className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Signaler un Problème Matériel</h1>
                        <p className="text-gray-600">Créez un ticket de maintenance pour tout dysfonctionnement constaté.</p>
                    </div>
                </div>

                {submitMessage && (
                    <Alert variant={submitMessage.type} title="Notification" dismissible onDismiss={() => setSubmitMessage(null)}>
                        {submitMessage.text}
                    </Alert>
                )}

                <Card title="Détails du Signalement" icon={FiTool}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Date et Heure du Constat*" type="datetime-local" name="dateSignalement" value={formData.dateSignalement} onChange={handleChange} required />
                            <Input label="Type d'équipement*" name="typeEquipement" value={formData.typeEquipement} onChange={handleChange} placeholder="Ex: Pompe SP95 N°2, TPE..." required />
                            <Input label="Localisation exacte*" name="localisation" value={formData.localisation} onChange={handleChange} placeholder="Ex: Piste 1, Boutique, Local technique..." required />
                            <Select label="Niveau de priorité*" name="priorite" value={formData.priorite} onChange={handleChange} options={prioriteOptions} required/>
                            
                            <div className="md:col-span-2">
                                <Textarea label="Description détaillée du problème*" name="descriptionProbleme" value={formData.descriptionProbleme} onChange={handleChange} rows={5} placeholder="Décrivez les symptômes, l'impact sur les opérations..." required/>
                            </div>
                            
                             <div className="md:col-span-2">
                                 <FileUpload label="Joindre une Photo (Optionnel)" selectedFile={formData.photo} onFileSelect={handleFileSelect} accept="image/*"/>
                             </div>

                             <div className="md:col-span-2">
                                 <Input label="Signalé par" value={formData.rapporteurNom} leftIcon={<FiUser />} readOnly disabled />
                             </div>
                        </div>

                        <div className="p-6 pt-0 flex justify-end">
                            <Button type="submit" loading={isSubmitting} size="lg" leftIcon={<FiSend />}>
                                Envoyer le Signalement
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default SignalementMaterielChefDePistePage;