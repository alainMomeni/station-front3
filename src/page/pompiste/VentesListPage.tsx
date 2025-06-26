// src/page/pompiste/VentesListPage.tsx (FINAL & COHÉRENT)
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

// Types, Mocks et Composants
import type { VenteDirecte } from '../../types/ventes';
import { dummyVentesDirectes } from '../../_mockData/ventes';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import Pagination from '../../components/common/Pagination'; // Notre composant de pagination !


// --- Colonnes pour la Table ---
const getVentesColumns = (onView: (id: string) => void, onEdit: (id: string) => void, onDelete: (id: string) => void): Column<VenteDirecte>[] => [
    { key: 'id', title: 'ID Vente', dataIndex: 'id', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'date', title: 'Date/Heure', render: (_, v) => format(new Date(v.date), 'dd/MM/yy HH:mm') },
    { key: 'produit', title: 'Produit', dataIndex: 'produit', render: v => <span className="font-medium">{v}</span> },
    { key: 'quantite', title: 'Quantité', align: 'right', render: (_, v) => `${v.quantite.toLocaleString()} ${v.unite}` },
    { key: 'montant', title: 'Montant Total', align: 'right', render: (_, v) => <span className="font-semibold">{v.montantTotal.toLocaleString()} XAF</span> },
    { key: 'paiement', title: 'Paiement', dataIndex: 'modePaiement' },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, v) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onView(v.id)}><FiEye /></Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(v.id)}><FiEdit /></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(v.id)}><FiTrash2 className="text-red-500" /></Button>
        </div>
    )}
];

// --- Page Principale ---
const VentesListPage: React.FC = () => {
    // États
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Ajustable

    // Handlers (la logique reste la même)
    const handleView = (id: string) => alert(`Détails pour ${id}`);
    const handleEdit = (id: string) => alert(`Modifier ${id}`);
    const handleDelete = (id: string) => alert(`Supprimer ${id}`);

    // Filtrage et pagination
    const filteredVentes = useMemo(() => {
        return dummyVentesDirectes
            .filter(v => Object.values(v).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm]);

    const paginatedVentes = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredVentes.slice(start, start + itemsPerPage);
    }, [filteredVentes, currentPage, itemsPerPage]);

    const tableColumns = getVentesColumns(handleView, handleEdit, handleDelete);
    
    return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                           <FiShoppingCart className="text-white text-2xl" />
                        </div>
                        <div>
                           <h1 className="text-3xl font-bold text-gray-800">Historique des Ventes</h1>
                           <p className="text-gray-600">Consultez et gérez l'ensemble des ventes directes.</p>
                        </div>
                     </div>
                     <Link to="/ventes/nouveau">
                        <Button variant="success">Nouvelle Vente</Button>
                     </Link>
                </div>
                
                <Card>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                         <Input className="md:col-span-2" label="Rechercher" placeholder="ID, produit, pompiste, client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                         <Select label="Trier par" options={[{value: 'date', label: 'Date (plus récente)'}, {value: 'montant', label: 'Montant (plus élevé)'}]}/>
                    </div>
                </Card>

                 <Card title={`Ventes Récentes (${filteredVentes.length})`} icon={FiShoppingCart}>
                    <Table<VenteDirecte>
                        columns={tableColumns}
                        data={paginatedVentes}
                        emptyText="Aucune vente trouvée."
                    />
                     <Pagination 
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredVentes.length / itemsPerPage)}
                        totalItems={filteredVentes.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                 </Card>
            </div>
    );
};

export default VentesListPage;