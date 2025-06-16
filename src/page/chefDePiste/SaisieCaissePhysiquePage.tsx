// src/page/chefDePiste/SaisieCaissePhysiquePage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo, type FC, type MouseEvent } from 'react';
import { FiClipboard, FiSave, FiTrendingUp, FiTrendingDown, FiUsers } from 'react-icons/fi';
import { format, startOfDay, parseISO } from 'date-fns';
import { fetchCaissesPourQuartEtDate } from '../../_mockData/saisies';

// Types, Mocks et Composants (inchangés)
import type { CaissePourSaisie } from '../../types/saisies';
import { generateDummyQuartsPourDate } from '../../_mockData/saisies';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Textarea } from '../../components/ui/Textarea';
import { StatCard } from '../../components/ui/StatCard';

const formatXAF = (val: number | string | undefined | null): string => {
    if (val === null || val === undefined) return '';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? '' : num.toLocaleString('fr-FR') + ' XAF';
};

// --- Sous-composant pour un bloc de saisie de caisse ---
const CaisseSaisieCard: FC<{
    caisse: CaissePourSaisie;
    onInputChange: (caisseId: string, field: keyof CaissePourSaisie, value: string) => void;
    isReadOnly: boolean;
}> = ({ caisse, onInputChange, isReadOnly }) => {

    const reel = parseFloat(caisse.montantReelCompteEspeces);
    const theorique = caisse.montantTheoriqueEspeces || 0;
    const ecart = !isNaN(reel) ? reel - theorique : undefined;
    let ecartVariant: React.ComponentProps<typeof StatCard>['variant'] = 'neutral';
    if (ecart !== undefined) {
        if (ecart > 0) ecartVariant = 'warning';
        else if (ecart < 0) ecartVariant = 'error';
        else ecartVariant = 'success';
    }

    return (
        <Card title={caisse.libelle} icon={FiClipboard} headerContent={<span className="text-xs text-white/80">{caisse.caissierNomAffecte}</span>}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <Input label="Théorique Espèces (Syst.)" value={formatXAF(theorique)} readOnly disabled />
                <Input 
                    label="Réel Compté Espèces*"
                    type="number"
                    value={caisse.montantReelCompteEspeces}
                    onChange={(e) => onInputChange(caisse.id, 'montantReelCompteEspeces', e.target.value)}
                    placeholder="0"
                    disabled={isReadOnly}
                    required
                />
                <StatCard 
                    title="Écart Constaté"
                    icon={ecart === undefined || ecart === 0 ? FiUsers : (ecart > 0 ? FiTrendingUp : FiTrendingDown)}
                    value={formatXAF(ecart)}
                    variant={ecartVariant}
                    className="h-full" // Pour s'aligner en hauteur
                />
            </div>
            {isReadOnly ? null : (
                 <div className="p-6 pt-0">
                    <Input
                        label="Notes sur cette caisse (Optionnel)"
                        value={caisse.notesSpecifiquesCaisse || ''}
                        onChange={(e) => onInputChange(caisse.id, 'notesSpecifiquesCaisse', e.target.value)}
                        placeholder="Ex: différence de 500F due à..."
                        disabled={isReadOnly}
                    />
                 </div>
            )}
        </Card>
    );
};

// --- Page Principale ---
const SaisieCaissePhysiquePage: React.FC = () => {
    // États et Logique (inchangés)
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [quartActifId, setQuartActifId] = useState<string | null>(null);
    const [caisses, setCaisses] = useState<CaissePourSaisie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting] = useState(false);
    const [notesGenerales, setNotesGenerales] = useState('');
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const quartsDuJour = useMemo(() => generateDummyQuartsPourDate(selectedDate), [selectedDate]);

    useEffect(() => { /* Logique de chargement */ }, [selectedDate, quartActifId]);
    
    // Charger les caisses quand le quart change
    useEffect(() => {
        const loadCaisses = async () => {
            if (!quartActifId || !selectedDate) {
                setCaisses([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchCaissesPourQuartEtDate(quartActifId, selectedDate);
                setCaisses(data);
            } catch (error) {
                console.error("Erreur chargement caisses:", error);
                setSubmitStatus({ type: 'error', message: "Erreur lors du chargement des données" });
            } finally {
                setIsLoading(false);
            }
        };

        loadCaisses();
    }, [quartActifId, selectedDate]);

    const handleCaisseInputChange = (caisseId: string, field: keyof CaissePourSaisie, value: string) => {
        setCaisses(prev => prev.map(caisse => 
            caisse.id === caisseId ? { ...caisse, [field]: value } : caisse
        ));
    };

    function isSaisiePermise(): boolean {
        // TODO: Implement actual permission logic
        return true;
    }

    function handleSubmitSaisie(_event: MouseEvent<HTMLButtonElement>): void {
        throw new Error('Function not implemented.');
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiClipboard className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Saisie des Fonds de Caisse</h1>
                            <p className="text-gray-600">Vérifiez et enregistrez les montants comptés en fin de quart.</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(startOfDay(parseISO(e.target.value)))} disabled={isSubmitting || isLoading}/>
                     </div>
                </div>

                 {submitStatus && <Alert variant={submitStatus.type} title="Notification" dismissible onDismiss={() => setSubmitStatus(null)}>{submitStatus.message}</Alert>}

                <Card>
                    <div className="p-4">
                        <Select label="Sélectionnez le quart de travail"
                            value={quartActifId || ''}
                            onChange={e => setQuartActifId(e.target.value)}
                            disabled={isSubmitting || isLoading}
                            options={[{value: '', label: '-- Choisir un quart --'}, ...quartsDuJour.map(q => ({value: q.id, label: q.libelle, disabled: q.statut === 'planifie'}))]}
                        />
                    </div>
                </Card>

                {isLoading ? (
                    <div className="p-20 flex justify-center"><Spinner size="lg" /></div>
                ) : !quartActifId ? (
                     <Card><div className="text-center p-12 text-gray-500">Veuillez sélectionner un quart pour commencer la saisie.</div></Card>
                ) : caisses.length === 0 ? (
                    <Card><div className="text-center p-12 text-gray-500">Aucune caisse à vérifier pour le quart sélectionné.</div></Card>
                ) : (
                    <div className="space-y-6">
                        {caisses.map(caisse => (
                             <CaisseSaisieCard 
                                key={caisse.id}
                                caisse={caisse}
                                onInputChange={handleCaisseInputChange}
                                isReadOnly={!isSaisiePermise() || isSubmitting} // `isSaisiePermise` à implémenter
                             />
                        ))}

                        <Card title="Finalisation de la Saisie" icon={FiSave}>
                             <div className="p-6 space-y-4">
                                <Textarea 
                                    label="Notes Générales du Chef de Piste"
                                    rows={3}
                                    value={notesGenerales}
                                    onChange={e => setNotesGenerales(e.target.value)}
                                    placeholder="Observations globales sur les encaissements, incidents..."
                                    disabled={!isSaisiePermise() || isSubmitting}
                                />
                                <div className="text-right">
                                     <Button 
                                        onClick={handleSubmitSaisie}
                                        loading={isSubmitting} 
                                        disabled={!isSaisiePermise() || isSubmitting}
                                        size="lg"
                                     >
                                        Enregistrer les Saisies
                                     </Button>
                                </div>
                             </div>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SaisieCaissePhysiquePage;