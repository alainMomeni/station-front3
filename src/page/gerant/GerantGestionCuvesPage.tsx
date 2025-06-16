// src/page/gerant/GerantGestionCuvesPage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { FiHardDrive, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

// Types et Données Mock (inchangés)
import type { Cuve } from '../../types/equipements';
import { dummyCuvesData, dummyTypesCarburant } from '../../_mockData/equipements';

// Écosystème et UI Kit
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, type Column } from '../../components/ui/Table';
import StatutCuveBadge from '../../components/equipements/StatutCuveBadge'; // Nouvel import
import CuveFormModal from '../../components/modals/CuveFormModal';


// --- Colonnes pour la Table ---
const getCuveColumns = (onEdit: (c: Cuve) => void, onDelete: (id: string) => void): Column<Cuve & { typeCarburantNom?: string }>[] => [
    { key: 'nom', title: 'Nom de la Cuve', dataIndex: 'nom', render: v => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'carburant', title: 'Type Carburant', dataIndex: 'typeCarburantNom' },
    { key: 'capacite', title: 'Capacité Max. (L)', align: 'right', dataIndex: 'capaciteMax', render: v => v?.toLocaleString() || '-' },
    { key: 'seuil', title: 'Seuil Alerte (L)', align: 'right', dataIndex: 'seuilAlerteBas', render: v => <span className="text-orange-600">{v?.toLocaleString() || '-'}</span> },
    { key: 'statut', title: 'Statut', align: 'center', render: (_, c) => <StatutCuveBadge statut={c.statut} /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, c) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(c)}><FiEdit/></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(c.id)}><FiTrash2 className="text-red-500"/></Button>
        </div>
    )},
];


// --- Page Principale ---
const GerantGestionCuvesPage: React.FC = () => {
    // États
    const [cuves, setCuves] = useState<(Cuve & { typeCarburantNom?: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [cuveEnEdition, ] = useState<Cuve | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Chargement et préparation des données
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const data = dummyCuvesData.map(c => ({...c, typeCarburantNom: dummyTypesCarburant.find(tc => tc.id === c.typeCarburantId)?.nom || 'Inconnu'}));
            setCuves(data);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredCuves = useMemo(() => {
        if (!cuves) return [];
        return cuves.filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [cuves, searchTerm]);

    // Handlers
    const handleOpenModal = (_cuve?: Cuve) => { /*...*/ };
    const handleSaveCuve = async (_data: Cuve) => { /*...*/ };
    const handleDeleteCuve = async (_id: string) => { /*...*/ };

    const tableColumns = getCuveColumns(handleOpenModal, handleDeleteCuve);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                            <FiHardDrive className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestion des Cuves</h1>
                            <p className="text-gray-600">Configurez et suivez l'état de vos cuves de carburant.</p>
                        </div>
                    </div>
                    <Button variant="success" onClick={() => handleOpenModal()}>Ajouter une Cuve</Button>
                </div>
                
                <Card icon={FiFilter} title="Rechercher une Cuve">
                    <div className="p-6">
                        <Input placeholder="Rechercher par nom de cuve..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />} />
                    </div>
                </Card>

                <Card title={`Liste des Cuves (${filteredCuves.length})`} icon={FiHardDrive}>
                    {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg" /></div> : 
                        <Table<Cuve & { typeCarburantNom?: string }>
                            columns={tableColumns}
                            data={filteredCuves}
                            emptyText="Aucune cuve trouvée."
                        />
                    }
                </Card>
            </div>
            
            {showModal && (
                <CuveFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveCuve}
                    cuveInitiale={cuveEnEdition}
                    isCreationMode={!cuveEnEdition}
                    typesCarburantDisponibles={dummyTypesCarburant}
                />
            )}
        </>
    );
};

export default GerantGestionCuvesPage;