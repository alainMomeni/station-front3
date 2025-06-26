// src/page/pompiste/VentesTermeListPage.tsx (FINAL & COHÉRENT)
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

// Types, Mocks et Composants
import type { VenteTerme, StatutVenteTerme } from '../../types/ventes';
import { dummyVentesTerme } from '../../_mockData/ventes';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import Pagination from '../../components/common/Pagination';
import StatutVenteTermeBadge from '../../components/ventes/StatutVenteTermeBadge';


// --- Colonnes pour la Table ---
const getVentesTermeColumns = (onView: (id: string) => void, onEdit: (id: string) => void, onDelete: (id: string) => void): Column<VenteTerme>[] => [
    { key: 'id', title: 'ID Vente', dataIndex: 'id', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'client', title: 'Client', dataIndex: 'client', render: v => <span className="font-medium">{v}</span>},
    { key: 'produit', title: 'Produit & Qté', render: (_, v) => `${v.produit} (${v.quantite})`},
    { key: 'montant', title: 'Montant Total', align: 'right', dataIndex: 'montantTotal', render: v => <span className="font-semibold">{v}</span>},
    { key: 'echeance', title: 'Échéance', render: (_, v) => format(new Date(v.dateEcheance), 'dd/MM/yyyy') },
    { key: 'statut', title: 'Statut', align: 'center', render: (_, v) => <StatutVenteTermeBadge statut={v.statut as StatutVenteTerme} /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, v) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onView(v.id)}><FiEye /></Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(v.id)}><FiEdit /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(v.id)}><FiTrash2 className="text-red-500" /></Button>
        </div>
    )}
];

// --- Page Principale ---
const VentesTermeListPage: React.FC = () => {
    // États
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Handlers (la logique reste la même)
    const handleView = (id: string) => alert(`Détails pour ${id}`);
    const handleEdit = (id: string) => alert(`Modifier ${id}`);
    const handleDelete = (id: string) => alert(`Supprimer ${id}`);

    // Filtrage et pagination
    const filteredVentes = useMemo(() => {
        return dummyVentesTerme
            .filter((v: { client: string; produit: string; }) => v.client.toLowerCase().includes(searchTerm.toLowerCase()) || v.produit.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a: { dateEcheance: string | number | Date; },b: { dateEcheance: string | number | Date; }) => new Date(b.dateEcheance).getTime() - new Date(a.dateEcheance).getTime());
    }, [searchTerm]);

    const paginatedVentes = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredVentes.slice(start, start + itemsPerPage);
    }, [filteredVentes, currentPage, itemsPerPage]);

    const tableColumns = getVentesTermeColumns(handleView, handleEdit, handleDelete);
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                           <FiFileText className="text-white text-2xl" />
                        </div>
                        <div>
                           <h1 className="text-3xl font-bold text-gray-800">Historique des Ventes à Terme</h1>
                           <p className="text-gray-600">Suivez les ventes à crédit et leurs échéances.</p>
                        </div>
                     </div>
                     <Link to="/ventes/terme/nouveau">
                        <Button variant="success" >Nouvelle Vente à Terme</Button>
                     </Link>
                </div>
                
                <Card icon={FiSearch} title="Recherche et Filtres">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                         <Input className="md:col-span-2" label="Rechercher une vente" placeholder="Client ou produit..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         <Select label="Trier par" options={[{value: 'echeance', label: 'Échéance (plus proche)'}, {value: 'montant', label: 'Montant (plus élevé)'}]}/>
                    </div>
                </Card>

                 <Card title={`Ventes à Terme en Cours (${filteredVentes.length})`} icon={FiFileText}>
                    <Table<VenteTerme>
                        columns={tableColumns}
                        data={paginatedVentes}
                        emptyText="Aucune vente à terme trouvée."
                    />
                     <Pagination 
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredVentes.length / itemsPerPage)}
                        totalItems={filteredVentes.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                 </Card>
            </div>
        </>
    );
};

export default VentesTermeListPage;