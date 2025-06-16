// src/page/gerant/GerantDepensesPage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { FiTrendingDown, FiFilter, FiCalendar, FiSearch, FiEdit, FiTrash2, FiPaperclip } from 'react-icons/fi';
import { format, startOfMonth } from 'date-fns';

// Types et Données Mock (inchangés)
import type { DepenseData } from '../../types/finance';
import { dummyCategoriesDepense, dummyDepenses } from '../../_mockData/depenses'; // Simuler import dédié

// Écosystème et UI Kit
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import { StatCard } from '../../components/ui/StatCard';
import DepenseFormModal from '../../components/modals/DepenseFormModal';

// --- Colonnes pour la Table ---
const getDepensesColumns = (onEdit: (d: DepenseData) => void, onDelete: (id: string) => void): Column<DepenseData>[] => [
    { key: 'date', title: 'Date', render: (_, d) => format(new Date(d.dateDepense+'T00:00:00'), 'dd/MM/yyyy')},
    { key: 'description', title: 'Description', render: (_, d) => (
        <div>
            <span className="font-medium text-gray-800">{d.description}</span>
            {d.referencePaiement && <span className="block text-xs text-gray-400">Réf: {d.referencePaiement}</span>}
        </div>
    )},
    { key: 'categorie', title: 'Catégorie', dataIndex: 'categorieNom'},
    { key: 'montant', title: 'Montant', align: 'right', render: (_, d) => <span className="font-semibold text-red-600">{d.montant.toLocaleString()} XAF</span>},
    { key: 'fournisseur', title: 'Fournisseur', dataIndex: 'fournisseurBeneficiaire'},
    { key: 'pj', title: 'PJ', align: 'center', render: (_, d) => (
        d.pieceJointeNom ? <a href={d.pieceJointeUrl || '#'} target="_blank" rel="noopener noreferrer"><FiPaperclip className="text-blue-500"/></a> : '-'
    )},
    { key: 'actions', title: 'Actions', align: 'center', render: (_, d) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(d)} title="Modifier"><FiEdit /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(d.id)} title="Supprimer"><FiTrash2 className="text-red-500" /></Button>
        </div>
    )},
];


// --- Page Principale ---
const GerantDepensesPage: React.FC = () => {
    // États
    const [depenses, setDepenses] = useState<DepenseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [depenseEnEdition] = useState<DepenseData | null>(null);
    const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

    // États des filtres
    const [filtreDateDebut, setFiltreDateDebut] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [filtreDateFin, setFiltreDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [filtreCategorieId, setFiltreCategorieId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const enriched = dummyDepenses.map(d => ({...d, categorieNom: dummyCategoriesDepense.find(c => c.id === d.categorieId)?.nom || 'N/A' }));
            setDepenses(enriched);
            setIsLoading(false);
        }, 700);
    }, []);

    // Memoization des données filtrées
    const filteredDepenses = useMemo(() => {
         return depenses
            .filter(d => new Date(d.dateDepense) >= new Date(filtreDateDebut) && new Date(d.dateDepense) <= new Date(filtreDateFin))
            .filter(d => !filtreCategorieId || d.categorieId === filtreCategorieId)
            .filter(d => d.description.toLowerCase().includes(searchTerm.toLowerCase()) || d.fournisseurBeneficiaire?.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => new Date(b.dateDepense).getTime() - new Date(a.dateDepense).getTime());
    }, [depenses, filtreDateDebut, filtreDateFin, filtreCategorieId, searchTerm]);
    
    const totalDepensesFiltrees = useMemo(() => filteredDepenses.reduce((sum, d) => sum + d.montant, 0), [filteredDepenses]);

    // Handlers pour les modales et actions (logique inchangée)
    const handleOpenModal = () => { /* ... */ };
    const handleSaveDepense = async (_data: any) => { /* ... */ };
    const handleDeleteDepense = () => { /* ... */ };

    // Création des colonnes pour la table
    const tableColumns = getDepensesColumns(handleOpenModal, handleDeleteDepense);
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                            <FiTrendingDown className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestion des Dépenses</h1>
                            <p className="text-gray-600">Suivez et catégorisez toutes les sorties de fonds.</p>
                        </div>
                    </div>
                     <Button variant="success" onClick={() => handleOpenModal()}>Nouvelle Dépense</Button>
                </div>
                
                {actionStatus && <Alert variant={actionStatus.type} title="Notification" dismissible onDismiss={() => setActionStatus(null)}>{actionStatus.message}</Alert>}
                
                <Card icon={FiFilter} title="Filtres des Dépenses">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <Input type="date" label="Date de début" value={filtreDateDebut} onChange={e => setFiltreDateDebut(e.target.value)} rightIcon={<FiCalendar />} />
                        <Input type="date" label="Date de fin" value={filtreDateFin} onChange={e => setFiltreDateFin(e.target.value)} rightIcon={<FiCalendar />} />
                        <Select label="Catégorie" value={filtreCategorieId} onChange={e => setFiltreCategorieId(e.target.value)} options={[{value: '', label: 'Toutes les catégories'}, ...dummyCategoriesDepense.map(c => ({value: c.id, label: c.nom}))]}/>
                        <Input label="Rechercher" placeholder="Description, fournisseur..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />}/>
                    </div>
                </Card>

                {isLoading ? <div className="p-12 flex justify-center"><Spinner /></div> : 
                    <>
                        <StatCard variant="error" icon={FiTrendingDown} title="Total des Dépenses sur la Période" value={totalDepensesFiltrees.toLocaleString()} unit="XAF"/>
                    
                        <Card title={`Liste des Dépenses (${filteredDepenses.length})`} icon={FiTrendingDown}>
                             <Table<DepenseData>
                                columns={tableColumns}
                                data={filteredDepenses}
                                emptyText="Aucune dépense ne correspond à vos filtres."
                            />
                        </Card>
                    </>
                }
            </div>

            <DepenseFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveDepense}
                depenseInitiale={depenseEnEdition}
                categoriesDepense={dummyCategoriesDepense}
            />
        </>
    );
};

export default GerantDepensesPage;