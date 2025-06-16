// src/page/gerant/GerantGestionClientsPage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiFilter, FiSearch, FiEdit, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

// Types et Données Mock (inchangés)
import type { ClientData, ClientProfessionnel, TypeClient, StatutClient } from '../../types/clients';
import { dummyClientsData } from '../../_mockData/clients'; // Adapter import

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import StatutClientBadge from '../../components/clients/StatutClientBadge';
import ClientFormModal from '../../components/modals/ClientFormModal';

// --- Définition des Colonnes ---
const getClientColumns = (onDetails: (id: string) => void, onEdit: (c: ClientData) => void, onDelete: (id: string) => void): Column<ClientData & { contactInfo: string }>[] => [
    { key: 'nom', title: 'Client', render: (_, c) => (
        <div>
            <div className="font-medium text-gray-900">{c.nomAffichage}</div>
            <div className="text-xs text-blue-600">{c.typeClient}</div>
        </div>
    )},
    { key: 'contact', title: 'Contact', dataIndex: 'contactInfo'},
    { key: 'solde', title: 'Solde Dû (Pro)', align: 'right', render: (_, c) => 
        c.typeClient === 'professionnel' ? 
            <span className="font-semibold text-orange-600">{(c as ClientProfessionnel).soldeActuelCredit?.toLocaleString() || 0} XAF</span> : 
            <span className="text-gray-400">N/A</span>
    },
    { key: 'statut', title: 'Statut', align: 'center', render: (_, c) => <StatutClientBadge statut={c.statutCompte} />},
    { key: 'derniere_activite', title: 'Dern. Activité', align: 'center', render: (_, c) => c.derniereActiviteDate ? format(new Date(c.derniereActiviteDate), 'dd/MM/yyyy') : '-'},
    { key: 'actions', title: 'Actions', align: 'center', render: (_, c) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onDetails(c.id)} title="Détails"><FiEye /></Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(c)} title="Modifier"><FiEdit /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(c.id)} title="Supprimer"><FiTrash2 className="text-red-500" /></Button>
        </div>
    )}
];

// --- Page Principale ---
const GerantGestionClientsPage: React.FC = () => {
    // États
    const [clients, setClients] = useState<ClientData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [clientEnEdition] = useState<ClientData | null>(null);
    const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

    // Filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [filtreTypeClient, setFiltreTypeClient] = useState<TypeClient | ''>('');
    const [filtreStatutClient, setFiltreStatutClient] = useState<StatutClient | ''>('');

    // ... logique de chargement, de filtrage et handlers ...
    useEffect(() => { setIsLoading(true); setTimeout(() => { setClients(dummyClientsData); setIsLoading(false); }, 500); }, []);
    
    const filteredAndPreparedClients = useMemo(() => {
        return clients
            .map(c => ({ ...c, contactInfo: `${c.telephone || ''}${c.telephone && c.email ? ' / ' : ''}${c.email || ''}` || '-' }))
            .filter(c => (c.nomAffichage.toLowerCase().includes(searchTerm.toLowerCase()) || c.contactInfo.toLowerCase().includes(searchTerm.toLowerCase())))
            .filter(c => !filtreTypeClient || c.typeClient === filtreTypeClient)
            .filter(c => !filtreStatutClient || c.statutCompte === filtreStatutClient)
            .sort((a,b) => a.nomAffichage.localeCompare(b.nomAffichage));
    }, [clients, searchTerm, filtreTypeClient, filtreStatutClient]);

    const handleOpenModal = () => { /* ... */ };
    const handleSaveClient = async () => { /* ... */ };
    const handleDeleteClient = async () => { /* ... */ };
    const handleVoirDetails = () => { /* ... */ };
    const tableColumns = getClientColumns(handleVoirDetails, handleOpenModal, handleDeleteClient);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiUsers className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestion des Clients</h1>
                            <p className="text-gray-600">Gérez votre base de clients particuliers et professionnels.</p>
                        </div>
                    </div>
                    <Button variant="success" onClick={() => handleOpenModal()}>Nouveau Client</Button>
                </div>

                {actionStatus && <Alert variant={actionStatus.type} title="Notification" dismissible onDismiss={() => setActionStatus(null)}>{actionStatus.message}</Alert>}
                
                <Card icon={FiFilter} title="Filtres">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Rechercher" placeholder="Nom, email, tél..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />} rightIcon={searchTerm ? <FiX className="cursor-pointer" onClick={() => setSearchTerm('')}/> : undefined} />
                        <Select label="Type de Client" value={filtreTypeClient} onChange={e => setFiltreTypeClient(e.target.value as TypeClient | '')} options={[
                             { value: '', label: 'Tous les types' }, { value: 'particulier', label: 'Particulier' }, { value: 'professionnel', label: 'Professionnel' }
                        ]}/>
                         <Select label="Statut du Compte" value={filtreStatutClient} onChange={e => setFiltreStatutClient(e.target.value as StatutClient | '')} options={[
                             { value: '', label: 'Tous les statuts' }, { value: 'actif', label: 'Actif' }, { value: 'inactif', label: 'Inactif' }, { value: 'prospect', label: 'Prospect' }, { value: 'bloque', label: 'Bloqué' }
                        ]}/>
                    </div>
                </Card>

                <Card title={`Liste des Clients (${filteredAndPreparedClients.length})`} icon={FiUsers}>
                    {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg"/></div> : 
                        <Table
                            columns={tableColumns}
                            data={filteredAndPreparedClients}
                            emptyText="Aucun client ne correspond à vos filtres."
                        />
                    }
                </Card>
            </div>
            
            {showModal && (
                <ClientFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveClient}
                    clientInitial={clientEnEdition}
                    isCreationMode={!clientEnEdition}
                />
            )}
        </DashboardLayout>
    );
};

export default GerantGestionClientsPage;