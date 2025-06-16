// src/page/chefDePiste/SaisieIndexChefDePistePage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { 
    FiDatabase, 
    FiSave,
    FiCopy // Add this for icon in StatCard
} from 'react-icons/fi';
import { format, startOfDay, parseISO } from 'date-fns';

// Types, Mocks et Composants (inchangés)
import type { CuvePourSaisieIndex } from '../../types/saisies';
import { generateDummyQuartsPourDate, fetchCuvesPourQuartEtDate } from '../../_mockData/saisies';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Alert } from '../../components/ui/Alert';
import { StatCard } from '../../components/ui/StatCard'; // Add this import
import Spinner from '../../components/Spinner';


// --- Page Principale ---
const SaisieIndexChefDePistePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [quartActifId, setQuartActifId] = useState<string | null>(null);
    const [cuves, setCuves] = useState<CuvePourSaisieIndex[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState('');
    const [submitStatus, setSubmitStatus] = useState<{type:'success'|'error', message:string}|null>(null);

    const quartsDuJour = useMemo(() => 
        generateDummyQuartsPourDate(selectedDate), 
        [selectedDate]
    );

    // Charger les cuves quand le quart change
    useEffect(() => {
        const loadCuves = async () => {
            if (!quartActifId || !selectedDate) {
                setCuves([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchCuvesPourQuartEtDate(quartActifId, selectedDate);
                setCuves(data);
            } catch (error) {
                console.error("Erreur chargement cuves:", error);
                setSubmitStatus({ type: 'error', message: "Erreur lors du chargement des données" });
            } finally {
                setIsLoading(false);
            }
        };

        loadCuves();
    }, [quartActifId, selectedDate]);

    const handleIndexChange = (id: string, field: 'indexDebutQuart' | 'indexFinQuart', value: string) => {
        setCuves(prev => prev.map(cuve => 
            cuve.id === id ? { ...cuve, [field]: value } : cuve
        ));
    };

    const handleSubmitSaisie = async () => {
        if (!isSaisiePermise()) return;
        
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await new Promise(r => setTimeout(r, 1000)); // Simuler API
            setSubmitStatus({
                type: 'success',
                message: 'Les index ont été enregistrés avec succès.'
            });
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Une erreur est survenue lors de l\'enregistrement.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSaisiePermise = () => {
        const quart = quartsDuJour.find(q => q.id === quartActifId);
        return quart?.statut !== 'termine';
    };

    const getEcartDetails = (cuve: CuvePourSaisieIndex) => {
        const indexFin = parseFloat(cuve.indexFinQuart || '0');
        const indexTheo = cuve.indexFinTheorique || 0;
        const ecart = indexFin - indexTheo;
        
        let ecartVariant: 'success' | 'warning' | 'error' | 'neutral' = 'neutral';
        if (indexFin && !isNaN(indexFin)) {
            if (Math.abs(ecart) < 0.1) ecartVariant = 'success';
            else if (Math.abs(ecart) < 1) ecartVariant = 'warning';
            else ecartVariant = 'error';
        }

        return { ecart, ecartVariant };
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiDatabase className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Saisie des Index Cuves</h1>
                            <p className="text-gray-600">Enregistrez les index de début et de fin pour chaque quart.</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2">
                         <Input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(startOfDay(parseISO(e.target.value)))} disabled={isSubmitting || isLoading}/>
                    </div>
                </div>

                {submitStatus && <Alert variant={submitStatus.type} title="Notification" dismissible onDismiss={() => setSubmitStatus(null)}>{submitStatus.message}</Alert>}
                
                <Card>
                    <div className="p-4"><Select label="Sélectionner le quart de travail" value={quartActifId || ''} onChange={e => setQuartActifId(e.target.value)} options={[{value:'', label:'-- Choisir --'},...quartsDuJour.map(q=>({value:q.id, label:q.libelle}))]} /></div>
                </Card>

                 {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg" /></div> :
                    !quartActifId ? <Card><div className="text-center p-12 text-gray-500">Veuillez sélectionner un quart.</div></Card> :
                    <form onSubmit={e => {e.preventDefault(); handleSubmitSaisie();}} className="space-y-6">
                         {cuves.map(cuve => {
                            const { ecart, ecartVariant } = getEcartDetails(cuve);
                            
                            return (
                                <Card key={cuve.id} title={`${cuve.nomCuve} - ${cuve.typeCarburant}`} icon={FiDatabase}>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                                        <Input label="Index Fin Précédent" value={cuve.dernierIndexFinConnu?.toFixed(2) || 'N/A'} readOnly disabled />
                                        <Input label="Index Début Quart (Saisi)*" type="number" step="0.01" value={cuve.indexDebutQuart} onChange={e => handleIndexChange(cuve.id, 'indexDebutQuart', e.target.value)} disabled={isSubmitting} required />
                                        <Input label="Index Fin Théorique (Syst.)" value={cuve.indexFinTheorique?.toFixed(2) || 'Calcul...'} readOnly disabled />
                                        
                                        <div className="md:col-span-2">
                                            <Input label="Index Fin Quart (Saisi)*" type="number" step="0.01" value={cuve.indexFinQuart} onChange={e => handleIndexChange(cuve.id, 'indexFinQuart', e.target.value)} disabled={isSubmitting} required />
                                        </div>
                                        <div className="md:col-span-2">
                                             <StatCard title="Écart Index Fin (Saisi vs. Théo.)" icon={FiCopy} value={ecart.toFixed(2)} unit={cuve.unite} variant={ecartVariant} className="h-full" />
                                        </div>
                                    </div>
                                </Card>
                            );
                         })}

                        <Card title="Finalisation et Soumission" icon={FiSave}>
                             <div className="p-6 space-y-4">
                                <Textarea label="Notes Générales" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations sur le relevé des index..."/>
                                <div className="text-right">
                                    <Button type="submit" size="lg" loading={isSubmitting} disabled={isSubmitting}>Enregistrer les Index</Button>
                                </div>
                            </div>
                        </Card>
                    </form>
                }
            </div>
        </DashboardLayout>
    );
};

export default SaisieIndexChefDePistePage;