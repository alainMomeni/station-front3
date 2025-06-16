// src/page/gerant/GerantRapportsActivitePage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiBarChart2, FiCalendar, FiFilter, FiDownload, FiPlayCircle } from 'react-icons/fi';
import { format, subDays } from 'date-fns';

// Types et Données Mock (inchangés)
import type { RapportFiltres, RapportResultat } from '../../types/rapports';
import { typesDeRapportsDisponibles, genererRapportSimule } from '../../_mockData/rapports'; // Simuler import

// Écosystème
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';

// UI Kit
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { StatCard } from '../../components/ui/StatCard';
import { Table, type Column } from '../../components/ui/Table';

// --- Page Principale ---

const GerantRapportsActivitePage: React.FC = () => {
    // États
    const [filtres, setFiltres] = useState<RapportFiltres>({
        typeRapport: typesDeRapportsDisponibles[0]?.value || '',
        dateDebut: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        dateFin: format(new Date(), 'yyyy-MM-dd'),
    });
    const [rapportGenere, setRapportGenere] = useState<RapportResultat | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const handleFiltreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFiltres(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setRapportGenere(null); setError(null);
    };

    const handleGenererRapport = async () => {
        if (!filtres.typeRapport || !filtres.dateDebut || !filtres.dateFin || new Date(filtres.dateDebut) > new Date(filtres.dateFin)) {
            setError("Veuillez vérifier vos critères. Le type de rapport et une période valide sont requis.");
            return;
        }
        setIsGenerating(true); setError(null); setRapportGenere(null);
        try {
            const resultat = await genererRapportSimule(filtres);
            setRapportGenere(resultat);
        } catch (err) {
            setError("Une erreur est survenue lors de la génération du rapport.");
        }
        setIsGenerating(false);
    };

    const handleTelechargerSimule = (format: 'CSV' | 'PDF') => {
        if (!rapportGenere) return;
        alert(`Simulation du téléchargement du rapport "${rapportGenere.titre}" en ${format}.`);
    };

    // Conversion du tableau de données pour le composant Table
    const tableDataForReport = rapportGenere?.tableauDonnees?.lignes.map((ligne, index) => {
        return ligne.reduce((obj, cell, cellIndex) => {
            const header = rapportGenere.tableauDonnees!.entetes[cellIndex] || `col_${cellIndex}`;
            obj[header] = cell;
            return obj;
        }, { id: index } as Record<string, any>);
    }) || [];
    
    const tableColumnsForReport: Column[] = rapportGenere?.tableauDonnees?.entetes.map(entete => ({
        key: entete,
        title: entete,
        dataIndex: entete,
        align: entete.toLowerCase().includes('montant') || entete.toLowerCase().includes('ca') ? 'right' : 'left'
    })) || [];


    // --- Rendu de la page ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiBarChart2 className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Générateur de Rapports</h1>
                        <p className="text-gray-600">Configurez et générez des rapports d'activité personnalisés.</p>
                    </div>
                </div>

                {error && <Alert variant="error" title="Erreur de configuration" dismissible onDismiss={() => setError(null)}>{error}</Alert>}
                
                <Card icon={FiFilter} title="Critères du Rapport">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <Select label="Type de Rapport" name="typeRapport" value={filtres.typeRapport} onChange={handleFiltreChange} options={[{ value: '', label: '-- Sélectionner --', disabled: true}, ...typesDeRapportsDisponibles]}/>
                        <Input type="date" label="Date de Début" name="dateDebut" value={filtres.dateDebut} onChange={handleFiltreChange} rightIcon={<FiCalendar />}/>
                        <Input type="date" label="Date de Fin" name="dateFin" value={filtres.dateFin} onChange={handleFiltreChange} rightIcon={<FiCalendar />}/>
                    </div>
                    <div className="p-6 pt-0 flex justify-end">
                         <Button onClick={handleGenererRapport} loading={isGenerating} disabled={isGenerating || !filtres.typeRapport} leftIcon={<FiPlayCircle />}>Générer</Button>
                    </div>
                </Card>

                {isGenerating && (
                    <Card>
                        <div className="flex flex-col items-center justify-center p-12">
                            <Spinner size="lg"/>
                            <p className="mt-4 text-gray-600 font-medium">Génération du rapport en cours...</p>
                        </div>
                    </Card>
                )}

                {rapportGenere && (
                    <Card title={rapportGenere.titre} icon={FiBarChart2} headerContent={
                        <div className="flex space-x-2">
                           <Button variant="secondary" size="sm" onClick={()=>handleTelechargerSimule('CSV')} leftIcon={<FiDownload />}>CSV</Button>
                           <Button variant="secondary" size="sm" onClick={()=>handleTelechargerSimule('PDF')} leftIcon={<FiDownload />}>PDF</Button>
                        </div>
                    }>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-gray-500 italic">Rapport pour la période : {rapportGenere.periode}</p>
                            
                            {rapportGenere.indicateursCles && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {rapportGenere.indicateursCles.map((kpi, idx) => (
                                        <StatCard key={idx} variant="neutral" icon={FiBarChart2} title={kpi.libelle} value={kpi.valeur.toString()} unit={kpi.unite} />
                                    ))}
                                </div>
                            )}

                            {rapportGenere.tableauDonnees && (
                                <Table columns={tableColumnsForReport} data={tableDataForReport} />
                            )}
                        </div>
                    </Card>
                )}

                {!isGenerating && !rapportGenere && (
                     <Card>
                        <div className="text-center p-12 text-gray-500">
                           <p>Configurez vos critères ci-dessus et cliquez sur "Générer" pour afficher un rapport.</p>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default GerantRapportsActivitePage;