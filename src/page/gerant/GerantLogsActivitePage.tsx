// src/page/gerant/GerantLogsActivitePage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect } from 'react';
import { FiShield, FiCalendar, FiCheckCircle, FiXCircle, FiFilter, FiEye } from 'react-icons/fi';
import { format, parseISO, subDays } from 'date-fns';

// Types et Données Mock (inchangés)
import type { LogActivite, LogActionType } from '../../types/logs';
import { dummyLogsData, dummyUtilisateursLog, logActionTypes } from '../../_mockData/logs';

// Écosystème et UI Kit
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';


// --- Colonnes pour la Table ---
const getLogColumns = (onVoirDetails: (log: LogActivite) => void): Column<LogActivite & { utilisateur_nom?: string }>[] => [
    { key: 'timestamp', title: 'Horodatage', render: (_, log) => format(parseISO(log.timestamp_log), 'dd/MM/yy HH:mm:ss')},
    { key: 'utilisateur', title: 'Utilisateur', dataIndex: 'utilisateur_nom', render: v => <span className="font-medium">{v}</span> },
    { key: 'action', title: 'Action', render: (_, log) => (
        <div>
            <span className="font-semibold text-gray-800">{log.action_log}</span>
            {log.entite_concernee_log && <span className="block text-xs text-gray-500">{log.entite_concernee_log} {log.entite_id_concernee_log && `(${log.entite_id_concernee_log})`}</span>}
        </div>
    )},
    { key: 'resultat', title: 'Résultat', align: 'center', render: (_, log) => (
        log.resultat_action_log === 'succes' ? 
        <FiCheckCircle className="text-green-500 mx-auto" title="Succès"/> :
        <FiXCircle className="text-red-500 mx-auto" title="Échec"/>
    )},
    { key: 'actions', title: 'Détails', align: 'center', render: (_, log) => (
        <Button variant="ghost" size="sm" onClick={() => onVoirDetails(log)}>
            <FiEye/>
        </Button>
    )}
];

// --- Page Principale ---
const GerantLogsActivitePage: React.FC = () => {
    // États
    const [logs, setLogs] = useState<(LogActivite & { utilisateur_nom?: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateDebut, setDateDebut] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [filtreUtilisateurId, setFiltreUtilisateurId] = useState('');
    const [filtreAction, setFiltreAction] = useState<LogActionType | ''>('');

    // Chargement des données (déclenché par les filtres)
    useEffect(() => {
        setIsLoading(true);
        // ... (Logique de fetch inchangée, la simulation est bonne) ...
        setTimeout(() => {
            const enrichedLogs = dummyLogsData.map(log => ({
                ...log,
                utilisateur_nom: dummyUtilisateursLog.find(u => u.id === log.utilisateur_id_log)?.nomComplet || log.utilisateur_id_log || 'Système'
            }));
            setLogs(enrichedLogs); // Simuler la réception des données
            setIsLoading(false);
        }, 800);
    }, [dateDebut, dateFin, filtreUtilisateurId, filtreAction]);

    const handleVoirDetailsLog = (log: LogActivite) => {
        alert(`Détails du Log #${log.id}:\n\n` + JSON.stringify(log.details_log, null, 2));
    };

    const tableColumns = getLogColumns(handleVoirDetailsLog);

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiShield className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Journal des Activités</h1>
                        <p className="text-gray-600">Auditez toutes les actions effectuées sur le système.</p>
                    </div>
                </div>

                <Card icon={FiFilter} title="Filtrer le Journal">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input type="date" label="Date de début" value={dateDebut} onChange={e => setDateDebut(e.target.value)} rightIcon={<FiCalendar />} />
                        <Input type="date" label="Date de fin" value={dateFin} onChange={e => setDateFin(e.target.value)} rightIcon={<FiCalendar />} />
                        <Select label="Utilisateur" value={filtreUtilisateurId} onChange={e => setFiltreUtilisateurId(e.target.value)}
                            options={[
                                { value: '', label: 'Tous les utilisateurs' },
                                { value: 'SYSTEM', label: 'Système' },
                                ...dummyUtilisateursLog.map(u => ({ value: u.id, label: u.nomComplet || `${u.prenom} ${u.nom}` }))
                            ]}
                        />
                        <Select label="Type d'Action" value={filtreAction} onChange={e => setFiltreAction(e.target.value as LogActionType | '')}
                            options={[
                                { value: '', label: 'Toutes les actions' },
                                ...logActionTypes.map(a => ({ value: a, label: a }))
                            ]}
                        />
                    </div>
                </Card>
                
                <Card title={`Logs d'Activité (${logs.length})`} icon={FiShield}>
                    {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg" /></div> :
                        <Table
                            columns={tableColumns}
                            data={logs}
                            emptyText="Aucun log ne correspond à vos filtres."
                        />
                    }
                </Card>
            </div>
        </>
    );
};

export default GerantLogsActivitePage;