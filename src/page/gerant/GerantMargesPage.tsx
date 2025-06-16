// src/page/gerant/GerantMargesPage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiDollarSign, FiFilter, FiCalendar, FiPlayCircle } from 'react-icons/fi';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// Types et Données Mock (inchangés)
import type { RapportMargesResultat, LigneAnalyseMarge } from '../../types/finance';
import { genererRapportMargesSimule, produitsEtCategoriesPourFiltre } from '../../_mockData/marges'; // Simuler import

// Écosystème et UI Kit
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { StatCard } from '../../components/ui/StatCard';
import { Table, type Column } from '../../components/ui/Table';

// --- Colonnes pour la Table ---
const getMargesColumns = (): Column<LigneAnalyseMarge>[] => [
    { key: 'produit', title: 'Produit/Carburant', render: (_, l) => <div><span className="font-medium">{l.nomProduitCarburant}</span><span className="block text-xs text-gray-500">{l.type}</span></div> },
    { key: 'qte', title: 'Qté Vendue', align: 'center', render: (_, l) => `${l.quantiteVendue.toLocaleString()} ${l.unite}`},
    { key: 'ca', title: 'CA Total', align: 'right', render: (_, l) => l.chiffreAffairesTotal.toLocaleString() + ' XAF' },
    { key: 'cout', title: 'Coût Achat Total', align: 'right', render: (_, l) => <span className="text-red-600">{l.coutAchatTotal.toLocaleString()} XAF</span> },
    { key: 'marge_brute', title: 'Marge Brute', align: 'right', render: (_, l) => <span className="font-semibold text-green-700">{l.margeBrute.toLocaleString()} XAF</span> },
    { key: 'taux_marge', title: 'Taux Marge', align: 'right', render: (_, l) => <span className="font-bold text-green-700">{l.tauxMargeBrute}%</span> },
];

// --- Page Principale ---
const GerantMargesPage: React.FC = () => {
    // États
    const [dateDebut, setDateDebut] = useState(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
    const [filtreProduitId, setFiltreProduitId] = useState('');
    const [coutsOp, setCoutsOp] = useState('');
    
    const [rapport, setRapport] = useState<RapportMargesResultat | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handler pour la génération
    const handleGenererRapport = async () => {
        if (!dateDebut || !dateFin || new Date(dateDebut) > new Date(dateFin)) {
            setError("Veuillez vérifier les dates de la période.");
            return;
        }
        setIsLoading(true); setError(null); setRapport(null);
        try {
            const resultat = await genererRapportMargesSimule(dateDebut, dateFin, filtreProduitId || undefined);
            const coutsOpNum = parseFloat(coutsOp);
            if (!isNaN(coutsOpNum) && coutsOpNum >= 0) {
                resultat.totalCoutsOperationnels = coutsOpNum;
                resultat.totalGlobalMargeNette = resultat.totalGlobalMargeBrute - coutsOpNum;
                resultat.tauxMargeNetteGlobal = resultat.totalGlobalChiffreAffaires > 0 ? ((resultat.totalGlobalMargeNette || 0) / resultat.totalGlobalChiffreAffaires * 100) : 0;
            }
            setRapport(resultat);
        } catch (err) {
            setError("Une erreur est survenue lors du calcul.");
        }
        setIsLoading(false);
    };

    const colonnesTableau = getMargesColumns();

    // --- Rendu ---
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiDollarSign className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Analyse des Marges</h1>
                        <p className="text-gray-600">Calculez et analysez la rentabilité de vos produits.</p>
                    </div>
                </div>

                {error && <Alert variant="error" title="Erreur" dismissible onDismiss={() => setError(null)}>{error}</Alert>}

                <Card icon={FiFilter} title="Critères d'Analyse">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <Input type="date" label="Date de Début" value={dateDebut} onChange={e => setDateDebut(e.target.value)} rightIcon={<FiCalendar />}/>
                        <Input type="date" label="Date de Fin" value={dateFin} onChange={e => setDateFin(e.target.value)} rightIcon={<FiCalendar />}/>
                        <Select label="Filtrer (Produit/Catégorie)" value={filtreProduitId} onChange={e => setFiltreProduitId(e.target.value)} options={produitsEtCategoriesPourFiltre.map(opt => ({ value: opt.id, label: `${opt.nom} (${opt.type})` }))}/>
                        <Input type="number" label="Coûts Opérationnels (Optionnel)" placeholder="Ex: 1500000" value={coutsOp} onChange={e => setCoutsOp(e.target.value)} />
                    </div>
                    <div className="p-6 pt-0 flex justify-end">
                        <Button onClick={handleGenererRapport} loading={isLoading} leftIcon={<FiPlayCircle />}>Calculer les Marges</Button>
                    </div>
                </Card>

                {isLoading ? (
                    <Card><div className="flex flex-col items-center justify-center p-12"><Spinner size="lg" /><p className="mt-4 text-gray-600">Calcul en cours...</p></div></Card>
                ) : rapport ? (
                    <Card title={rapport.titre} icon={FiDollarSign}>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-gray-500 italic">Période d'analyse : {rapport.periode}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                               <StatCard variant="primary" icon={FiDollarSign} title="CA Global HT" value={rapport.totalGlobalChiffreAffaires.toLocaleString()} unit="XAF"/>
                               <StatCard variant="error" icon={FiDollarSign} title="Coût Achat Global" value={rapport.totalGlobalCoutAchat.toLocaleString()} unit="XAF" />
                               <StatCard variant="success" icon={FiDollarSign} title="Marge BRUTE Globale" value={rapport.totalGlobalMargeBrute.toLocaleString()} unit={`XAF (${rapport.tauxMargeBruteGlobal?.toFixed(1)}%)`} />
                               {rapport.totalGlobalMargeNette !== undefined && (
                                   <StatCard variant="warning" icon={FiDollarSign} title="Marge NETTE Globale" value={rapport.totalGlobalMargeNette.toLocaleString()} unit={`XAF (${rapport.tauxMargeNetteGlobal?.toFixed(1)}%)`} />
                               )}
                            </div>

                            {rapport.lignesAnalyse.length > 0 && <Table columns={colonnesTableau} data={rapport.lignesAnalyse} />}

                             {rapport.totalCoutsOperationnels !== undefined && (
                                <Alert variant="info" title="Note sur la Marge Nette">
                                    La Marge Nette est calculée sur la base des Coûts Opérationnels de {rapport.totalCoutsOperationnels.toLocaleString()} XAF que vous avez saisis.
                                </Alert>
                            )}
                        </div>
                    </Card>
                ) : (
                    <Card><div className="text-center p-12 text-gray-500"><p>Sélectionnez vos critères et cliquez sur "Calculer les Marges" pour afficher l'analyse.</p></div></Card>
                )}
            </div>
        </>
    );
};

export default GerantMargesPage;