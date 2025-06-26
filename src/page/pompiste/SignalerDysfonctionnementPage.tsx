// src/page/pompiste/SignalerDysfonctionnementPage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiSend, FiTool } from 'react-icons/fi';

// Types et Mocks
// Note: Il serait bon de centraliser ce type dans `types/maintenance.ts` si ce n'est pas déjà fait.
interface DysfonctionnementFormData {
    typeEquipement: string;
    localisation: string;
    descriptionProbleme: string;
    priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
    photo?: File | null;
}

// Écosystème et UI Kit
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Alert } from '../../components/ui/Alert';
import { FileUpload } from '../../components/ui/FileUpload';

// Options pour le Select de priorité
const prioriteOptions = [
    { value: 'moyenne', label: 'Moyenne (Impact modéré)' },
    { value: 'basse', label: 'Basse (Peut attendre)' },
    { value: 'haute', label: 'Haute (Important)' },
    { value: 'critique', label: 'Critique (Bloquant / Urgent)' },
];


const SignalerDysfonctionnementPage: React.FC = () => {
    // --- États ---
    const getInitialState = (): DysfonctionnementFormData => ({
        typeEquipement: '',
        localisation: '',
        descriptionProbleme: '',
        priorite: 'moyenne',
        photo: null,
    });

    const [formData] = useState<DysfonctionnementFormData>(getInitialState());
    const [isSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // --- Handlers ---
    const handleChange = () => { /*...*/ };
    const handleFileSelect = () => { /*...*/ };
    const handleSubmit = async () => { /*...*/ };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiTool className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Signaler un Dysfonctionnement</h1>
                        <p className="text-gray-600">Créez un ticket de maintenance pour tout problème matériel.</p>
                    </div>
                </div>

                 <Card title="Formulaire de Signalement Matériel" icon={FiTool}>
                    <form onSubmit={handleSubmit}>
                         <div className="p-6 space-y-6">
                             {submitMessage && (
                                <Alert variant={submitMessage.type} title="Notification" dismissible onDismiss={() => setSubmitMessage(null)}>
                                    {submitMessage.text}
                                </Alert>
                            )}

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Type d'équipement*" name="typeEquipement" value={formData.typeEquipement} onChange={handleChange} placeholder="Ex: Pompe N°2, TPE..." required />
                                <Input label="Localisation exacte*" name="localisation" value={formData.localisation} onChange={handleChange} placeholder="Ex: Piste 1, Caisse principale..." required />
                            </div>
                            
                            <Select label="Niveau de priorité*" name="priorite" value={formData.priorite} onChange={handleChange} options={prioriteOptions} required/>
                            
                            <Textarea label="Description du problème*" name="descriptionProbleme" value={formData.descriptionProbleme} onChange={handleChange} rows={5} placeholder="Décrivez les symptômes..." required/>
                            
                            <FileUpload label="Joindre une Photo (Optionnel)" selectedFile={formData.photo ?? null} onFileSelect={handleFileSelect} accept="image/*"/>
                        </div>
                        
                         <div className="p-6 border-t flex justify-end">
                             <Button type="submit" loading={isSubmitting} size="lg" variant="warning" leftIcon={<FiSend />}>
                                Envoyer le Signalement
                             </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default SignalerDysfonctionnementPage;