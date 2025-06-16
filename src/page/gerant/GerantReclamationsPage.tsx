// src/page/gerant/GerantReclamationsPage.tsx (CORRECTION ERREUR 'LENGTH')

// ... (tous les imports et définitions de colonnes restent identiques)
import React, { useState, useEffect, useMemo } from 'react';
import { FiMessageSquare, FiFilter, FiSearch, FiCalendar, FiEdit } from 'react-icons/fi';
import { format, subMonths, startOfMonth, parseISO } from 'date-fns';
import type { ReclamationClient, StatutReclamation, TypeReclamation } from '../../types/reclamations';
import { dummyReclamationsData, statutReclamationOptions } from '../../_mockData/reclamations';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import StatutReclamationBadge from '../../components/reclamations/StatutReclamationBadge';
import ReclamationTraitementModal from '../../components/modals/ReclamationTraitementModal';

// Définir les colonnes du tableau
const getReclamationColumns = (onEdit: (r: ReclamationClient) => void): Column<ReclamationClient>[] => [
  { 
    key: 'id', 
    title: 'ID',
    dataIndex: 'id'
  },
  { 
    key: 'date', 
    title: 'Date',
    render: (_, r) => format(parseISO(r.dateSoumission), 'dd/MM/yyyy')
  },
  { 
    key: 'client', 
    title: 'Client',
    render: (_, r) => (
      <div>
        <div className="font-medium">{r.nomClient}</div>
        {r.contactClientEmail && <div className="text-sm text-gray-500">{r.contactClientEmail}</div>}
      </div>
    )
  },
  { 
    key: 'type', 
    title: 'Type',
    dataIndex: 'typeReclamation'
  },
  { 
    key: 'statut', 
    title: 'Statut',
    render: (_, r) => <StatutReclamationBadge statut={r.statut} />
  },
  { 
    key: 'actions', 
    title: 'Actions',
    align: 'center',
    render: (_, r) => (
      <Button variant="ghost" size="sm" onClick={() => onEdit(r)}>
        <FiEdit />
      </Button>
    )
  }
];

const GerantReclamationsPage: React.FC = () => {
    // --- États ---
    const [reclamations, setReclamations] = useState<ReclamationClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reclamationEnTraitement, setReclamationEnTraitement] = useState<ReclamationClient | null>(null);
    const [isCreationModeModal, setIsCreationModeModal] = useState(false);
    const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtreType] = useState<TypeReclamation | ''>('');
    const [filtreStatut, setFiltreStatut] = useState<StatutReclamation | ''>('');
    const [filtreDateDebut, setFiltreDateDebut] = useState(format(startOfMonth(subMonths(new Date(),1)), 'yyyy-MM-dd'));
    const [filtreDateFin, setFiltreDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));
    
    // --- Logique (useEffect et useMemo corrigés) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setReclamations(dummyReclamationsData);
            setIsLoading(false);
        }, 800);
    }, []);

    const filteredReclamations = useMemo(() => {
        // Garde-fou robuste : si reclamations n'est pas un tableau, on retourne un tableau vide.
        if (!Array.isArray(reclamations)) return []; 
        
        return reclamations
            .filter(r => (r.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) || r.descriptionDetaillee.toLowerCase().includes(searchTerm.toLowerCase())))
            .filter(r => !filtreType || r.typeReclamation === filtreType)
            .filter(r => !filtreStatut || r.statut === filtreStatut)
            .filter(r => {
                const dateR = parseISO(r.dateSoumission);
                return dateR >= parseISO(filtreDateDebut) && dateR <= parseISO(filtreDateFin + 'T23:59:59.999Z');
            });
    }, [reclamations, searchTerm, filtreType, filtreStatut, filtreDateDebut, filtreDateFin]);


    const handleOpenModal = (reclamation?: ReclamationClient, isCreation = false) => {
        setReclamationEnTraitement(reclamation || null);
        setIsCreationModeModal(isCreation);
        setShowModal(true);
    };

    const handleSaveReclamation = async () => { /* ... */ };
    const tableColumns = useMemo(() => 
        getReclamationColumns((recla) => handleOpenModal(recla, false)), 
        []
    );

    // --- Rendu ---
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    {/* ... En-tête de page (inchangé) ... */}
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiMessageSquare className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestion des Réclamations</h1>
                            <p className="text-gray-600">Suivez et traitez les retours de vos clients.</p>
                        </div>
                    </div>
                     <Button variant="success" onClick={() => handleOpenModal(undefined, true)}>Enregistrer Réclamation</Button>
                </div>
                
                {actionStatus && <Alert variant={actionStatus.type} title="Notification" dismissible onDismiss={() => setActionStatus(null)}>{actionStatus.message}</Alert>}
                
                <Card icon={FiFilter} title="Filtres des Réclamations">
                    {/* ... Filtres (inchangés) ... */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                         <Input className="lg:col-span-2" label="Rechercher" placeholder="ID, client, description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />}/>
                         <Input type="date" label="Après le" value={filtreDateDebut} onChange={e => setFiltreDateDebut(e.target.value)} rightIcon={<FiCalendar />}/>
                         <Input type="date" label="Avant le" value={filtreDateFin} onChange={e => setFiltreDateFin(e.target.value)} rightIcon={<FiCalendar />}/>
                         <Select label="Statut" value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as StatutReclamation | '')} options={statutReclamationOptions}/>
                    </div>
                </Card>

                {/* ====== BLOC CORRIGÉ ====== */}
                <Card 
                    title={`Liste des Réclamations (${filteredReclamations?.length ?? 0})`} 
                    icon={FiMessageSquare}
                >
                    {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg" /></div> :
                        <Table<ReclamationClient>
                            columns={tableColumns}
                            data={filteredReclamations || []}
                            emptyText="Aucune réclamation ne correspond à vos filtres."
                        />
                    }
                </Card>
                {/* =========================== */}

            </div>
            
            {showModal && (
                <ReclamationTraitementModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveReclamation}
                    reclamationInitial={reclamationEnTraitement}
                    isCreationMode={isCreationModeModal}
                />
            )}
        </>
    );
};

export default GerantReclamationsPage;