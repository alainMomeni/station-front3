// src/page/pompiste/HistoriqueQuartsPompistePage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { FiArchive, FiFilter, FiEye } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Types, Mocks et Composants
import type { SyntheseQuartData } from '../../types/personnel';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, type Column } from '../../components/ui/Table';
import Pagination from '../../components/common/Pagination';
import QuartDetailModal from '../../components/modals/QuartDetailModal';
import { dummySyntheseQuarts } from '../../_mockData/planning'; // Assure-toi que ce mock existe


// --- Colonnes pour la Table ---
const getHistoriqueColumns = (onView: (quart: SyntheseQuartData) => void): Column<SyntheseQuartData>[] => [
    { key: 'periode', title: 'Période du Quart', render: (_, q) => <div><p className="font-medium">{format(parseISO(q.dateHeureDebut), 'dd/MM/yyyy')}</p><p className="text-xs text-gray-500">{format(parseISO(q.dateHeureDebut), 'HH:mm')} - {format(parseISO(q.dateHeureFin), 'HH:mm')}</p></div> },
    { key: 'pompes', title: 'Pompes', render: (_, q) => <div className="flex flex-wrap gap-1">{q.pompesGerees.map(p => <span key={p} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{p}</span>)}</div> },
    { key: 'volume', title: 'Volume Vendu (L)', align: 'right', render: (_, q) => q.totalVolumeCarburantVenduLitres.toLocaleString('fr-FR', {maximumFractionDigits: 2})},
    { key: 'valeur', title: 'Valeur Totale (XAF)', align: 'right', render: (_, q) => <span className="font-semibold">{q.totalValeurVenduXAF.toLocaleString()}</span>},
    { key: 'actions', title: 'Détails', align: 'center', render: (_, q) => <Button variant="ghost" size="sm" onClick={() => onView(q)}><FiEye /></Button> },
];

// --- Page Principale ---
const HistoriqueQuartsPompistePage: React.FC = () => {
    // États
    const [syntheses, setSyntheses] = useState<SyntheseQuartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedQuart, setSelectedQuart] = useState<SyntheseQuartData | null>(null);

    // Chargement et filtrage...
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setSyntheses(dummySyntheseQuarts); // Charge les données mock
            setIsLoading(false);
        }, 800);
    }, []);
    const filteredSyntheses = useMemo(() => {
        // Filtrage par date si les dates sont renseignées
        return syntheses.filter(q => {
            const debut = dateDebut ? new Date(dateDebut) : null;
            const fin = dateFin ? new Date(dateFin) : null;
            const date = new Date(q.dateHeureDebut);
            if (debut && date < debut) return false;
            if (fin && date > fin) return false;
            return true;
        });
    }, [syntheses, dateDebut, dateFin]);
    const paginatedSyntheses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSyntheses.slice(start, start + itemsPerPage);
    }, [filteredSyntheses, currentPage, itemsPerPage]);

    const tableColumns = getHistoriqueColumns((quart) => setSelectedQuart(quart));
    
    return (
        <>
            <div className="space-y-6">
                 <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiArchive className="text-white text-2xl" /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Mon Historique de Quarts</h1>
                        <p className="text-gray-600">Consultez le récapitulatif de vos quarts de travail passés.</p>
                    </div>
                </div>

                <Card icon={FiFilter} title="Filtrer par Période">
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input type="date" label="Date de début" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
                        <Input type="date" label="Date de fin" value={dateFin} onChange={e => setDateFin(e.target.value)} />
                    </div>
                </Card>

                <Card title={`Mes Quarts Passés (${filteredSyntheses.length})`} icon={FiArchive}>
                     {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg"/></div> : 
                        <>
                            <Table<SyntheseQuartData> columns={tableColumns} data={paginatedSyntheses} emptyText="Aucun quart trouvé pour cette période." />
                             <Pagination 
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredSyntheses.length / itemsPerPage)}
                                totalItems={filteredSyntheses.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                            />
                        </>
                    }
                </Card>
            </div>
            
            <QuartDetailModal quart={selectedQuart} onClose={() => setSelectedQuart(null)} />
        </>
    );
};

export default HistoriqueQuartsPompistePage;