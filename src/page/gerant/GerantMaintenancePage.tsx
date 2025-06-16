// src/page/gerant/GerantMaintenancePage.tsx (CORRIGÉ, STRUCTURE VALIDÉE)
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiTool, FiFilter, FiEdit, FiPlus } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Types et Données Mock
import type { InterventionMaintenance, StatutIntervention } from '../../types/maintenance';
import { dummyInterventions } from '../../_mockData/maintenance';

// Écosystème et UI Kit
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import Spinner from '../../components/Spinner';

// Note: Le StatutInterventionBadge devrait être un composant séparé comme on l'a fait avant.
// Je le laisse ici pour la simplicité de la réponse, mais il devrait être dans src/components/maintenance/.
const StatutInterventionBadge: FC<{ statut: StatutIntervention }> = ({ statut }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statut === 'planifiee' ? 'bg-blue-100 text-blue-800' :
        statut === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
        statut === 'terminee' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
    }`}>
        {statut.replace('_', ' ').toUpperCase()}
    </span>
);


// Définition des colonnes de la table
const getInterventionColumns = (onEdit: (intervention: InterventionMaintenance) => void): Column<InterventionMaintenance>[] => [
    { 
        key: 'date', 
        title: 'Date', 
        render: (_, i) => format(parseISO(i.dateCreation), 'dd/MM/yyyy') 
    },
    { 
        key: 'equipement', 
        title: 'Équipement & Description',
        render: (_, i) => (
            <div>
                <div className="font-medium text-gray-900">{i.equipementNom}</div>
                <div className="text-sm text-gray-500">{i.descriptionProblemeTache}</div>
            </div>
        )
    },
    { 
        key: 'type', 
        title: 'Type', 
        dataIndex: 'typeIntervention', 
        align: 'center' 
    },
    { 
        key: 'technicien', 
        title: 'Technicien', 
        dataIndex: 'assigneA',  // Changed from technicienNom to assigneA
        render: (v) => v || '-' // Add fallback for empty values
    },
    { 
        key: 'statut', 
        title: 'Statut', 
        align: 'center', 
        render: (_, i) => <StatutInterventionBadge statut={i.statut} /> 
    },
    { 
        key: 'actions', 
        title: 'Actions', 
        align: 'center', 
        render: (_, i) => <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><FiEdit /></Button> 
    }
];


// Page principale
const GerantMaintenancePage: React.FC = () => {
    const [interventions, setInterventions] = useState<InterventionMaintenance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtreStatut, setFiltreStatut] = useState<StatutIntervention | ''>('');
    
    // Chargement
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setInterventions(dummyInterventions);
            setIsLoading(false);
        }, 800);
    }, []);

    // Filtrage
    const filteredInterventions = useMemo(() => {
        if (!interventions) return [];
        return interventions
            .filter(i => 
                ((String(i.equipementNom ?? '')).toLowerCase().includes(searchTerm.toLowerCase()) || (String(i.description ?? '')).toLowerCase().includes(searchTerm.toLowerCase()))
                && (!filtreStatut || i.statut === filtreStatut)
            );
    }, [interventions, searchTerm, filtreStatut]);

    // Handlers
    const handleEditIntervention = (intervention: InterventionMaintenance) => {
        console.log('Edit:', intervention.id);
        // Logique pour ouvrir une modale d'édition
    };

    const handleAddIntervention = () => {
        console.log('Add new intervention');
        // Logique pour ouvrir une modale de création
    };
    
    const tableColumns = getInterventionColumns(handleEditIntervention);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                            <FiTool className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Suivi des Interventions</h1>
                            <p className="text-gray-600">Consultez et gérez les interventions de maintenance.</p>
                        </div>
                    </div>
                    <Button variant="success" onClick={handleAddIntervention} leftIcon={<FiPlus />}>
                        Nouvelle Intervention
                    </Button>
                </div>
                
                <Card icon={FiFilter} title="Filtres">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Rechercher"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Équipement ou description..."
                        />
                        <Select
                            label="Statut"
                            value={filtreStatut}
                            onChange={e => setFiltreStatut(e.target.value as StatutIntervention | '')}
                            options={[
                                { value: '', label: 'Tous les statuts' },
                                { value: 'planifiee', label: 'Planifiée' },
                                { value: 'en_cours', label: 'En cours' },
                                { value: 'terminee', label: 'Terminée' }
                            ]}
                        />
                    </div>
                </Card>

                <Card title={`Interventions (${filteredInterventions.length})`} icon={FiTool}>
                    {isLoading ? (
                        <div className="p-20 flex justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <Table<InterventionMaintenance>
                            columns={tableColumns}
                            data={filteredInterventions}
                            emptyText="Aucune intervention ne correspond à vos filtres."
                        />
                    )}
                </Card>
            </div>
        </>
    );
};

export default GerantMaintenancePage;