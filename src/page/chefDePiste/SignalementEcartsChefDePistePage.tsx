// src/page/chefDePiste/SignalementEcartsChefDePistePage.tsx (FINAL & COHÉRENT)
import React, { useState, useMemo } from 'react';
import { FiAlertOctagon, FiEdit2, FiSave, FiFilter, FiDroplet, FiDollarSign } from 'react-icons/fi';
import { format, startOfDay, parseISO } from 'date-fns';

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Textarea } from '../../components/ui/Textarea';
import { StatCard } from '../../components/ui/StatCard'; // Add this import
import Spinner from '../../components/Spinner';
import { generateDummyQuartsPourDate } from '../../_mockData/saisies';
import { FileUpload } from '../../components/ui/FileUpload';

interface FormData {
    typeEcart: string;
    cuveConcerneeId?: string;
    indexFinPhysiqueReleve?: string;
    valeurTheoriqueSysteme?: string;
    ecartCalcule?: string;
    causePresumee: string;
    justificatif?: File | null;
    montantTheoriqueSysteme?: string;
    montantPhysiqueCompte?: string;
    ecartCalculeCaisse?: number;
}

const SignalementEcartsChefDePistePage: React.FC = () => {
    // États (la logique reste la même, juste la présentation change)
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [quartActifId, setQuartActifId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        typeEcart: '',
        causePresumee: '',
        justificatif: null,
        montantTheoriqueSysteme: '',
        montantPhysiqueCompte: '',
        ecartCalculeCaisse: 0
    });
    const [isLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const quartsDuJour = useMemo(() => 
        generateDummyQuartsPourDate(selectedDate), 
        [selectedDate]
    );

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(startOfDay(parseISO(e.target.value)));
        setQuartActifId(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitSignalement = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Logique d'envoi du signalement
        setIsSubmitting(false);
    };

    const getEcartClassName = (ecart: number | undefined) => {
        if (!ecart) return 'text-gray-700';
        return ecart > 0 ? 'text-green-600' : ecart < 0 ? 'text-red-600' : 'text-gray-700';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiAlertOctagon className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Signaler un Écart</h1>
                        <p className="text-gray-600">Documentez les écarts constatés sur les index ou les fonds de caisse.</p>
                    </div>
                </div>

                {submitStatus && <Alert variant={submitStatus.type} title="Notification">{submitStatus.message}</Alert>}
                
                <Card icon={FiFilter} title="Contexte du Signalement">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            type="date" 
                            label="Date de l'Observation" 
                            value={format(selectedDate, 'yyyy-MM-dd')}
                            onChange={handleDateChange}
                        />
                        <Select 
                            label="Quart de Travail Concerné" 
                            value={quartActifId || ''} 
                            onChange={(e) => setQuartActifId(e.target.value)}
                            options={[
                                { value: '', label: '-- Sélectionner un quart --' },
                                ...quartsDuJour.map(q => ({
                                    value: q.id,
                                    label: q.libelle
                                }))
                            ]}
                        />
                    </div>
                </Card>
                
                {isLoading ? <div className="p-20 flex justify-center"><Spinner /></div> : 
                 !quartActifId ? <Card><p className="p-12 text-center text-gray-500">Veuillez sélectionner une date et un quart.</p></Card> : (
                    <form onSubmit={handleSubmitSignalement} className="space-y-6">
                        <Card title="Nature de l'Écart" icon={FiEdit2}>
                             <div className="p-6">
                                <Select label="Type d'écart à signaler*" value={formData.typeEcart} onChange={handleChange} name="typeEcart" options={[
                                    { value: '', label: '-- Choisir un type --'},
                                    { value: 'index_cuve', label: 'Écart sur Index Cuve' },
                                    { value: 'caisse_especes', label: 'Écart sur Espèces en Caisse' }
                                ]}/>
                             </div>
                        </Card>

                        {formData.typeEcart === 'index_cuve' && (
                             <Card title="Détails de l'Écart sur Cuve" icon={FiDroplet}>
                                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <Select 
                                        label="Cuve Concernée*" 
                                        name="cuveConcerneeId" 
                                        value={formData.cuveConcerneeId || ''} 
                                        onChange={handleChange} 
                                        options={[
                                            { value: '', label: '-- Sélectionner une cuve --' },
                                            { value: 'CUVE_01', label: 'Cuve SP95 - Principale' },
                                            { value: 'CUVE_02', label: 'Cuve Diesel - A' }
                                        ]} 
                                     />
                                     <Input 
                                        label="Index Fin Physique Relevé*" 
                                        type="number" 
                                        name="indexFinPhysiqueReleve" 
                                        value={formData.indexFinPhysiqueReleve || ''} 
                                        onChange={handleChange} 
                                     />
                                     <Input 
                                        label="Index Fin Théorique (Syst.)" 
                                        value={formData.valeurTheoriqueSysteme || ''} 
                                        readOnly 
                                        disabled 
                                     />
                                     <Input 
                                        label="Écart Constaté" 
                                        value={formData.ecartCalcule || ''} 
                                        readOnly 
                                        disabled 
                                        className={`font-bold ${getEcartClassName(parseFloat(formData.ecartCalcule || '0'))}`}
                                     />
                                 </div>
                             </Card>
                        )}
                        
                        {formData.typeEcart === 'caisse_especes' && (
                              <Card title="Détails de l'Écart sur Caisse" icon={FiDollarSign}>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input 
                                        label="Montant Théorique (Système)*" 
                                        type="number"
                                        name="montantTheoriqueSysteme"
                                        value={formData.montantTheoriqueSysteme || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input 
                                        label="Montant Physique Compté*"
                                        type="number"
                                        name="montantPhysiqueCompte"
                                        value={formData.montantPhysiqueCompte || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="md:col-span-2">
                                        <StatCard 
                                            title="Écart Constaté" 
                                            icon={FiDollarSign}
                                            value={formData.ecartCalculeCaisse?.toString() || '0'}
                                            unit="XAF"
                                            variant={getEcartVariant(formData.ecartCalculeCaisse || 0)}
                                        />
                                    </div>
                                </div>
                              </Card>
                        )}

                        {formData.typeEcart && (
                            <Card title="Justification et Soumission" icon={FiSave}>
                                <div className="p-6 space-y-6">
                                    <Textarea label="Cause Présumée / Observations*" name="causePresumee" value={formData.causePresumee} onChange={handleChange} rows={4} placeholder="Décrivez la cause possible..."/>
                                    <FileUpload label="Joindre un Justificatif (Optionnel)" selectedFile={formData.justificatif ?? null} onFileSelect={(file) => setFormData(prev => ({...prev, justificatif: file}))} />
                                    <div className="text-right">
                                         <Button type="submit" loading={isSubmitting} variant="warning" size="lg">Envoyer le Signalement</Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </form>
                 )}
            </div>
        </DashboardLayout>
    );
};

// Helper pour déterminer la variante de l'écart
const getEcartVariant = (ecart: number): 'success' | 'warning' | 'error' | 'neutral' => {
    if (ecart === 0) return 'success';
    if (Math.abs(ecart) < 1000) return 'warning';
    return 'error';
};

export default SignalementEcartsChefDePistePage;