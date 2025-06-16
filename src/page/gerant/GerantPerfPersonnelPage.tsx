// src/page/gerant/GerantPerfPersonnelPage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, type FC } from 'react';
import { FiUserCheck, FiCalendar, FiEye, FiUsers, FiFilter } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';

// Types et Données Mock (inchangés)
import type { RecapPerformanceEmploye } from '../../types/personnel';
import { dummyEmployesPourPerf, fetchRecapPerformancePersonnel } from '../../_mockData/personnel';

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';

// --- Sous-composant pour la cellule "Ponctualité" ---
const PonctualiteCell: FC<{ perf: RecapPerformanceEmploye }> = ({ perf }) => (
    <div className="flex justify-center items-center space-x-2">
        <span title="Retards" className={perf.nombreRetards > 0 ? 'font-semibold text-yellow-600' : 'text-gray-500'}>
            {perf.nombreRetards}
        </span>
        <span className="text-gray-300">/</span>
        <span title="Absences Justifiées" className={perf.nombreAbsencesJustifiees > 0 ? 'text-orange-500' : 'text-gray-500'}>
            {perf.nombreAbsencesJustifiees}
        </span>
        <span className="text-gray-300">/</span>
        <span title="Absences Non Justifiées" className={perf.nombreAbsencesNonJustifiees > 0 ? 'font-bold text-red-600' : 'text-gray-500'}>
            {perf.nombreAbsencesNonJustifiees}
        </span>
    </div>
);


// --- Colonnes pour la Table ---
const getPerformanceColumns = (onVoirDetails: (id: string) => void): Column<RecapPerformanceEmploye>[] => [
    { key: 'employe', title: 'Employé', render: (_, p) => (
        <div>
            <div className="font-medium text-gray-900">{p.nomComplet}</div>
            <div className="text-xs text-gray-500">{p.rolesTenusSurPeriode?.join(', ')}</div>
        </div>
    )},
    { key: 'quarts', title: 'Quarts', dataIndex: 'nombreQuartsTravailles', align: 'center' },
    { key: 'ponctualite', title: 'Ret./Abs.J/Abs.NJ', align: 'center', render: (_, p) => <PonctualiteCell perf={p} /> },
    { key: 'ca', title: 'CA Total', align: 'right', render: (_, p) => <span className="font-semibold text-green-600">{p.chiffreAffairesTotal.toLocaleString()} XAF</span> },
    { key: 'volume', title: 'Volume Vendu', align: 'right', render: (_, p) => p.volumeTotalVendu != null ? `${p.volumeTotalVendu.toLocaleString()} L` : 'N/A' },
    { key: 'actions', title: 'Détails', align: 'center', render: (_, p) => (
        <Button variant="ghost" size="sm" onClick={() => onVoirDetails(p.employeId)}>
            <FiEye />
        </Button>
    )},
];


// --- Page Principale ---
const GerantPerfPersonnelPage: React.FC = () => {
    // États
    const [dateDebut, setDateDebut] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
    const [filtreEmployeId, setFiltreEmployeId] = useState('');
    const [performances, setPerformances] = useState<RecapPerformanceEmploye[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Chargement des données
    useEffect(() => {
        setIsLoading(true);
        fetchRecapPerformancePersonnel(dateDebut, dateFin, filtreEmployeId || undefined)
            .then(setPerformances)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [dateDebut, dateFin, filtreEmployeId]);
    
    // Handlers
    const handleVoirDetails = (employeId: string) => {
        alert(`Affichage des détails pour l'employé ${employeId} (V2).`);
    };

    const tableColumns = getPerformanceColumns(handleVoirDetails);

    // --- Rendu de la page ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiUserCheck className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Performance du Personnel</h1>
                        <p className="text-gray-600">Analysez les données de performance de vos équipes sur une période.</p>
                    </div>
                </div>

                <Card icon={FiFilter} title="Filtres">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <Input type="date" label="Date de début" value={dateDebut} onChange={e => setDateDebut(e.target.value)} rightIcon={<FiCalendar />} />
                        <Input type="date" label="Date de fin" value={dateFin} onChange={e => setDateFin(e.target.value)} rightIcon={<FiCalendar />} />
                        <Select label="Employé" value={filtreEmployeId} onChange={e => setFiltreEmployeId(e.target.value)}
                            options={[{ value: '', label: 'Tous les employés' }, ...dummyEmployesPourPerf.map(e => ({ value: e.id, label: e.nomComplet }))]}
                        />
                    </div>
                </Card>

                <Card title={`Récapitulatif de Performance (${performances.length} employés)`} icon={FiUsers}>
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Spinner size="lg"/></div>
                    ) : (
                        <Table<RecapPerformanceEmploye>
                            columns={tableColumns}
                            data={performances}
                            emptyText="Aucune donnée de performance pour les filtres sélectionnés."
                        />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default GerantPerfPersonnelPage;