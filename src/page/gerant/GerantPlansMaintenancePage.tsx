// src/page/gerant/GerantMaintenancePage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiTool, FiClipboard, FiClock, FiEdit } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Types et Données Mock
import type { InterventionMaintenance, PlanMaintenance } from '../../types/maintenance';

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Table, type Column } from '../../components/ui/Table';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
// ... importez vos nouveaux badges ici

type ActiveTab = 'interventions' | 'plans';

// --- Définitions de Colonnes pour les Tables ---
const getInterventionColumns = (_p0: () => void): Column<InterventionMaintenance>[] => [/*...*/];
const getPlanColumns = (onEdit: (p: PlanMaintenance) => void, onToggle: (id: string) => void): Column<PlanMaintenance>[] => [
    { key: 'plan', title: 'Plan de Maintenance', render: (_, p) => (
        <div>
            <div className={`font-medium ${p.estActif ? 'text-gray-900' : 'text-gray-400'}`}>{p.nomPlan}</div>
            <div className="text-xs text-gray-500 max-w-sm truncate">{p.descriptionTaches}</div>
        </div>
    )},
    { key: 'cibles', title: 'Équipements Ciblés', dataIndex: 'ciblesNoms' },
    { key: 'frequence', title: 'Fréquence', align: 'center', render: (_,p) => p.frequence /* <FrequencePlanBadge frequence={p.frequence}/> */ },
    { key: 'echeance', title: 'Proch. Échéance', align: 'center', render: (_, p) => p.prochaineEcheance ? format(parseISO(p.prochaineEcheance), 'dd/MM/yyyy') : '-' },
    { key: 'actif', title: 'Actif', align: 'center', render: (_,p) => <ToggleSwitch checked={p.estActif} onChange={() => onToggle(p.id)} size="sm" /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, p) => <Button variant="ghost" size="sm" onClick={() => onEdit(p)}><FiEdit/></Button> }
];

// --- Page Principale ---
const GerantMaintenancePage: React.FC = () => {
    // États
    const [activeTab, setActiveTab] = useState<ActiveTab>('interventions');
    const [interventions, ] = useState<InterventionMaintenance[]>([]);
    const [plans, ] = useState<PlanMaintenance[]>([]);
    const [isLoading, ] = useState(true);
    // ... Autres états pour modales, filtres, etc. ...
    
    // ... Logique de chargement, de filtrage et handlers ...

    // Création dynamique des colonnes
    const planColumns = getPlanColumns(
        () => { /* handle edit */ }, 
        () => { /* handle toggle */ }
    );
    const interventionColumns = getInterventionColumns(() => { /* handle edit */ });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiTool className="text-white text-2xl" /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestion de la Maintenance</h1>
                        <p className="text-gray-600">Planifiez la maintenance préventive et suivez les interventions.</p>
                    </div>
                </div>

                <Card>
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant={activeTab === 'interventions' ? 'primary' : 'secondary'} onClick={() => setActiveTab('interventions')} leftIcon={<FiClock />}>Suivi des Interventions</Button>
                            <Button variant={activeTab === 'plans' ? 'primary' : 'secondary'} onClick={() => setActiveTab('plans')} leftIcon={<FiClipboard />}>Plans de Maintenance</Button>
                        </div>
                        <Button variant="success" onClick={() => { /* handleOpenModal(...) */ }}>
                            {activeTab === 'interventions' ? 'Nouvelle Intervention' : 'Nouveau Plan'}
                        </Button>
                    </div>
                </Card>
                
                {/* Ici, on pourrait ajouter une Card de filtres si nécessaire pour l'onglet Interventions */}
                
                <Card 
                    title={activeTab === 'interventions' ? 'Dernières Interventions' : 'Plans de Maintenance Préventive'} 
                    icon={activeTab === 'interventions' ? FiClock : FiClipboard}
                >
                    {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg"/></div> :
                        activeTab === 'interventions' ?
                            <Table<InterventionMaintenance> columns={interventionColumns} data={interventions} emptyText="Aucune intervention enregistrée."/> :
                            <Table<PlanMaintenance> columns={planColumns} data={plans} emptyText="Aucun plan de maintenance configuré."/>
                    }
                </Card>
            </div>
            
            {/* ... Modales (Intervention & Plan) ... */}
        </DashboardLayout>
    );
};

export default GerantMaintenancePage;