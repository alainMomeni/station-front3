// src/page/gerant/GerantVentesPersonnelPage.tsx (FINAL & CORRIGÉ)
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiUsers, FiFilter, FiCalendar, FiEye } from 'react-icons/fi';
import { format, startOfDay } from 'date-fns';

// Types et Données Mock (inchangés)
import type { PerformanceVenteEmploye, QuartTravail } from '../../types/ventes';
import { 
  dummyEmployesSimples, 
  generateDummyQuartsPourDate, 
  fetchVentesParPersonnel 
} from '../../_mockData/ventes';

// Écosystème de l'application (inchangé)
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';

// Composants UI (inchangés)
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import ModalDetailTransactionsEmploye from '../../components/modals/ModalDetailTransactionsEmploye';
import { StatCard } from '../../components/ui/StatCard';

// --- Sous-composants (inchangés) ---

const TotalsSummary: FC<{ totals: { transactions: number; volume: number; montantNet: number } }> = ({ totals }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard variant="neutral" icon={FiUsers} title="Transactions" value={totals.transactions.toLocaleString()} />
        <StatCard variant="primary" icon={FiCalendar} title="Volume Total (L)" value={totals.volume.toLocaleString('fr-FR', {maximumFractionDigits: 0})} />
        <StatCard variant="success" icon={FiUsers} title="Total Net Encaissé" value={totals.montantNet.toLocaleString('fr-FR')} unit="XAF"/>
    </div>
);

const VentesFilters: FC<{
    selectedDate: Date; setSelectedDate: (d: Date) => void;
    quartsDuJour: QuartTravail[];
    selectedQuartId: string | null; setSelectedQuartId: (id: string | null) => void;
    selectedEmployeId: string | null; setSelectedEmployeId: (id: string | null) => void;
    isLoading: boolean;
}> = ({ selectedDate, setSelectedDate, quartsDuJour, selectedQuartId, setSelectedQuartId, selectedEmployeId, setSelectedEmployeId, isLoading }) => {
    
    const quartOptions = quartsDuJour.map(q => ({
        value: q.id,
        label: `${q.libelle} (${q.statut})`
    }));

    return (
        <Card icon={FiFilter} title="Filtres de la Période">
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex items-end space-x-1">
                    <div className="flex-grow">
                        <Input 
                            type="date" 
                            label="Date" 
                            value={format(selectedDate, 'yyyy-MM-dd')} 
                            onChange={e => setSelectedDate(startOfDay(new Date(e.target.value)))} 
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <Select
                    label="Quart de travail"
                    value={selectedQuartId || ''}
                    onChange={e => setSelectedQuartId(e.target.value || null)}
                    disabled={isLoading || quartsDuJour.length === 0}
                    options={quartOptions}
                />
                <Select 
                    label="Employé" 
                    value={selectedEmployeId || ''} 
                    onChange={e => setSelectedEmployeId(e.target.value || null)} 
                    disabled={isLoading}
                    options={[{value: '', label: 'Tous les employés'}, ...dummyEmployesSimples.map((e: { id: any; nomComplet: any; }) => ({value: e.id, label: e.nomComplet}))]}
                />
            </div>
        </Card>
    );
};


// --- Page Principale ---
const GerantVentesPersonnelPage: React.FC = () => {
    // États et Hooks (inchangés)
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [quartsDuJour, setQuartsDuJour] = useState<QuartTravail[]>([]);
    const [selectedQuartId, setSelectedQuartId] = useState<string | null>(null);
    const [selectedEmployeId, setSelectedEmployeId] = useState<string | null>(null);
    const [ventesPersonnel, setVentesPersonnel] = useState<PerformanceVenteEmploye[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEmployePourDetail, setSelectedEmployePourDetail] = useState<PerformanceVenteEmploye | null>(null);
    
     useEffect(() => {
        const nouveauxQuarts = generateDummyQuartsPourDate(selectedDate);
        setQuartsDuJour(nouveauxQuarts);
        setSelectedQuartId(nouveauxQuarts.find((q: { id: string; }) => q.id.startsWith('tous_'))?.id || nouveauxQuarts[0]?.id || null);
    }, [selectedDate]);
    useEffect(() => {
        if (!selectedQuartId) return;
        setIsLoading(true);
        fetchVentesParPersonnel(selectedDate, selectedQuartId, selectedEmployeId)
            .then(setVentesPersonnel)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [selectedDate, selectedQuartId, selectedEmployeId]);
    const totals = useMemo(() => {
        return ventesPersonnel.reduce((acc, curr) => ({
            transactions: acc.transactions + curr.nombreTransactions,
            volume: acc.volume + (curr.totalVolumeVendu || 0),
            montantNet: acc.montantNet + curr.totalMontantNetEncaisse,
        }), { transactions: 0, volume: 0, montantNet: 0 });
    }, [ventesPersonnel]);

    // Ouvre la modale de détail
    const handleVoirDetails = (performance: PerformanceVenteEmploye) => {
        setSelectedEmployePourDetail(performance);
        setShowDetailModal(true);
    };

    // Colonnes pour la table (inchangées)
    const tableColumns: Column<PerformanceVenteEmploye>[] = [
        { key: 'employe', title: 'Employé', dataIndex: 'employeNom', render: v => <span className="font-medium">{v}</span> },
        { key: 'role', title: 'Rôle / Poste', render: (_, r) => <div>{r.roleQuart}{r.posteLibelle && <span className="block text-xs text-gray-400">{r.posteLibelle}</span>}</div> },
        { key: 'trans', title: 'Transactions', dataIndex: 'nombreTransactions', align: 'center'},
        { key: 'volume', title: 'Volume', align: 'right', render: (_, r) => r.totalVolumeVendu != null ? r.totalVolumeVendu.toLocaleString() + ' ' + (r.uniteVolume || '') : 'N/A' },
        { key: 'net', title: 'Total Net', align: 'right', render: (_, r) => <span className="font-semibold text-green-600">{r.totalMontantNetEncaisse.toLocaleString()} XAF</span> },
        { 
            key: 'actions', title: 'Actions', align: 'center',
            render: (_, record) => (
                <Button variant="ghost" size="sm" onClick={() => handleVoirDetails(record)}>
                    <FiEye className="text-purple-600" />
                </Button>
            )
        }
    ];
    
    // --- Le Rendu ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiUsers className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Performance des Ventes</h1>
                        <p className="text-gray-600">Analysez les ventes par employé pour une période donnée.</p>
                    </div>
                </div>

                <VentesFilters
                    selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                    quartsDuJour={quartsDuJour}
                    selectedQuartId={selectedQuartId} setSelectedQuartId={setSelectedQuartId}
                    selectedEmployeId={selectedEmployeId} setSelectedEmployeId={setSelectedEmployeId}
                    isLoading={isLoading}
                />

                {isLoading ? <div className="flex justify-center p-12"><Spinner /></div> : 
                    !ventesPersonnel.length ? (
                        // ====== LIGNE CORRIGÉE ======
                        <Card title="Aucune Donnée" icon={FiUsers}>
                            <div className="text-center p-12 text-gray-500">Aucune donnée de vente pour les filtres sélectionnés.</div>
                        </Card>
                        // ============================
                    ) : (
                        <>
                            <TotalsSummary totals={totals} />
                            <Card title={`Détail des ventes (${ventesPersonnel.length} employés)`} icon={FiUsers}>
                                <Table<PerformanceVenteEmploye>
                                    columns={tableColumns}
                                    data={ventesPersonnel}
                                />
                            </Card>
                        </>
                    )
                }
            </div>

            <ModalDetailTransactionsEmploye 
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                performanceEmploye={selectedEmployePourDetail}
            />
        </DashboardLayout>
    );
};

export default GerantVentesPersonnelPage;