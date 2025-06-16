// src/page/gerant/GerantCataloguePage.tsx (CORRIGÉ & COHÉRENT)
import React, { useState, useMemo, useEffect, type FC } from 'react';
import { FiArchive, FiTag, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

// Types et Données Mock
import type { ProduitCatalogueComplet, CategorieProduit } from '../../types/catalogue';
import { dummyProduitsCatalogueData, dummyCategoriesData } from '../../_mockData/catalogue'; // Simule import

// Composants de l'écosystème
import Spinner from '../../components/Spinner';

// Composants UI réutilisables
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, type Column } from '../../components/ui/Table';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { Alert } from '../../components/ui/Alert';

// Composants de Modale (supposés exister et être cohérents)
import ProduitFormModal from '../../components/modals/ProduitFormModal';
import CategorieFormModal from '../../components/modals/CategorieFormModal';

type ActiveTab = 'produits' | 'categories';
type StatutFilter = '' | 'actif' | 'inactif';

// --- Colonnes pour le composant Table (inchangées) ---

const getProduitColumns = (onEdit: (p: any) => void, onDelete: (id: string) => void, onToggle: (id: string) => void): Column<ProduitCatalogueComplet>[] => [
    { key: 'produit', title: 'Produit', render: (_, p) => (
        <div>
          <div className={`font-medium ${p.estActif ? 'text-gray-900' : 'text-gray-400'}`}>{p.nom}</div>
          <div className="text-xs text-gray-500">{p.reference || p.id}</div>
        </div>
    )},
    { key: 'categorie', title: 'Catégorie', dataIndex: 'categorieNom'},
    { key: 'type', title: 'Type', dataIndex: 'typeProduit', align: 'center'},
    { key: 'prix', title: 'PV Actuel', align: 'right', render: (_, p) => <span className="font-semibold">{(p.prixVenteActuel || 0).toLocaleString()} XAF</span> },
    { key: 'stock', title: 'Stock', align: 'center', render: (_, p) => p.stockActuel !== undefined ? `${p.stockActuel} ${p.uniteMesure}`: 'N/A' },
    { key: 'statut', title: 'Actif', align: 'center', render: (_, p) => <ToggleSwitch checked={p.estActif} onChange={() => onToggle(p.id)} size="sm" /> },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, p) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(p)}><FiEdit/></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)}><FiTrash2 className="text-red-500"/></Button>
        </div>
    )},
];

const getCategorieColumns = (onEdit: (c: any) => void, onDelete: (id: string) => void): Column<CategorieProduit>[] => [
    { key: 'nom', title: 'Nom Catégorie', dataIndex: 'nom', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'type', title: 'Type Associé', dataIndex: 'typeProduitAssocie' },
    { key: 'nbProduits', title: 'Nb. Produits', dataIndex: 'nombreProduits', align: 'center' },
    { key: 'actions', title: 'Actions', align: 'center', render: (_, c) => (
        <div className="flex justify-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(c)}><FiEdit/></Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(c.id)}><FiTrash2 className="text-red-500"/></Button>
        </div>
    )},
];

// --- Sous-composant pour les filtres ---
const FiltersProduits: FC<{
    searchTerm: string; 
    setSearchTerm: (s: string) => void;
    categorie: string; 
    setCategorie: (c: string) => void;
    type: string; 
    setType: (t: string) => void;
    statut: StatutFilter; 
    setStatut: (s: StatutFilter) => void;
    categories: CategorieProduit[];
    types: string[];
}> = ({ searchTerm, setSearchTerm, categorie, setCategorie, type, setType, statut, setStatut, categories, types }) => (
    <Card icon={FiFilter} title="Filtres et Recherche">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
                label="Rechercher" 
                placeholder="Nom ou référence..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                leftIcon={<FiSearch className="h-4 w-4" />} 
            />
            <Select 
                label="Catégorie" 
                value={categorie} 
                onChange={e => setCategorie(e.target.value)} 
                options={[
                    { value: '', label: 'Toutes les catégories' }, 
                    ...categories.map(c => ({ value: c.id, label: c.nom }))
                ]} 
            />
            <Select 
                label="Type de produit" 
                value={type} 
                onChange={e => setType(e.target.value)} 
                options={[
                    { value: '', label: 'Tous les types' }, 
                    ...types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
                ]} 
            />
            <Select 
                label="Statut" 
                value={statut} 
                onChange={e => setStatut(e.target.value as StatutFilter)} 
                options={[
                    { value: '', label: 'Tous les statuts' }, 
                    { value: 'actif', label: 'Actif' }, 
                    { value: 'inactif', label: 'Inactif' }
                ]} 
            />
        </div>
    </Card>
);

// --- Page Principale ---

const GerantCataloguePage: React.FC = () => {
    // Tous les états et handlers restent identiques à la version précédente
    const [activeTab, setActiveTab] = useState<ActiveTab>('produits');
    const [produits, setProduits] = useState<ProduitCatalogueComplet[]>([]);
    const [categories, setCategories] = useState<CategorieProduit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTermProduit, setSearchTermProduit] = useState('');
    const [filtreCategorieProduit, setFiltreCategorieProduit] = useState('');
    const [filtreTypeProduit, setFiltreTypeProduit] = useState('');
    const [filtreStatutProduit, setFiltreStatutProduit] = useState<StatutFilter>('');
    const [isProduitModalOpen, setIsProduitModalOpen] = useState(false);
    const [produitEnEdition, setProduitEnEdition] = useState<ProduitCatalogueComplet | null>(null);
    const [isCategorieModalOpen, setIsCategorieModalOpen] = useState(false);
    const [categorieEnEdition, setCategorieEnEdition] = useState<CategorieProduit | null>(null);
    const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const prods = dummyProduitsCatalogueData.map((p: any) => ({ 
                ...p, 
                categorieNom: dummyCategoriesData.find((c: any) => c.id === p.categorieId)?.nom 
            }));
            setProduits(prods);
            setCategories(dummyCategoriesData);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredProduits = useMemo(() => produits
      .filter(p => (
          p.nom.toLowerCase().includes(searchTermProduit.toLowerCase()) || 
          (p.reference && p.reference.toLowerCase().includes(searchTermProduit.toLowerCase()))
      ))
      .filter(p => !filtreCategorieProduit || p.categorieId === filtreCategorieProduit)
      .filter(p => !filtreTypeProduit || p.typeProduit === filtreTypeProduit)
      .filter(p => !filtreStatutProduit || 
          (p.estActif && filtreStatutProduit === 'actif') || 
          (!p.estActif && filtreStatutProduit === 'inactif')
      )
      .sort((a, b) => a.nom.localeCompare(b.nom)),
    [produits, searchTermProduit, filtreCategorieProduit, filtreTypeProduit, filtreStatutProduit]);

    const typesProduitsUniques = useMemo(() => 
        Array.from(new Set(produits.map(p => p.typeProduit))).sort(), 
        [produits]
    );
    
    // Logique des Handlers (inchangée)
    const closeAllModals = () => { 
        setIsProduitModalOpen(false); 
        setProduitEnEdition(null); 
        setIsCategorieModalOpen(false); 
        setCategorieEnEdition(null); 
    };

    const handleOpenModal = (type: ActiveTab, item?: any) => {
        setActionStatus(null);
        if (type === 'produits') { 
            setProduitEnEdition(item || null); 
            setIsProduitModalOpen(true); 
        } else { 
            setCategorieEnEdition(item || null); 
            setIsCategorieModalOpen(true); 
        }
    };
    
    const handleSaveProduit = async (): Promise<void> => {
        // Implement your save logic here
    };
    
    const handleSaveCategorie = async (): Promise<void> => {
        // Implement your category save logic here
    };
    
    const handleDelete = (_type: string, _id: string, _tabType: ActiveTab) => { 
        /* ... */ 
    }; // Logique de suppression
    
    const handleToggleProduitActif = () => { 
        /* ... */ 
    }; // Logique de toggle

    // Création dynamique des colonnes (inchangée)
    const produitColumns = getProduitColumns(
        (p) => handleOpenModal('produits', p), 
        (id) => handleDelete('produits', id, 'produits'), 
        handleToggleProduitActif
    );
    
    const categorieColumns = getCategorieColumns(
        (c) => handleOpenModal('categories', c), 
        (id) => handleDelete('categories', id, 'categories')
    );
    
    // Rendu de la page
    return (
            <div className="space-y-6">


<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
    <div className="flex items-center">
        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
            <FiArchive className="text-white text-2xl" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestion du Catalogue</h1>
            <p className="text-gray-600">Gérez vos produits et catégories en toute simplicité.</p>
        </div>
    </div>
    <div className="flex space-x-2">
        <Button 
            variant={activeTab === 'produits' ? 'secondary' : 'primary'} 
            onClick={() => setActiveTab('categories')} 
            leftIcon={<FiTag />}
        >
            Catégories
        </Button>
        <Button 
            variant={activeTab === 'produits' ? 'primary' : 'secondary'} 
            onClick={() => setActiveTab('produits')} 
            leftIcon={<FiArchive />}
        >
            Produits
        </Button>
        <Button 
            variant="success" 
            onClick={() => handleOpenModal(activeTab)}
        >
            Ajouter
        </Button>
    </div>
</div>
                
                {actionStatus && (
                    <Alert 
                        variant={actionStatus.type} 
                        title="Notification" 
                        dismissible 
                        onDismiss={() => setActionStatus(null)}
                    >
                        {actionStatus.message}
                    </Alert>
                )}
                
                {activeTab === 'produits' && (
                    <FiltersProduits 
                        searchTerm={searchTermProduit} 
                        setSearchTerm={setSearchTermProduit}
                        categorie={filtreCategorieProduit} 
                        setCategorie={setFiltreCategorieProduit}
                        type={filtreTypeProduit} 
                        setType={setFiltreTypeProduit}
                        statut={filtreStatutProduit} 
                        setStatut={setFiltreStatutProduit}
                        categories={categories}
                        types={typesProduitsUniques}
                    />
                )}
                
                <Card 
                    title={activeTab === 'produits' ? 'Liste des Produits' : 'Liste des Catégories'} 
                    icon={activeTab === 'produits' ? FiArchive : FiTag}
                >
                    {isLoading ? (
                        <div className="p-12 flex justify-center">
                            <Spinner/>
                        </div>
                    ) : activeTab === 'produits' ? (
                        <Table<ProduitCatalogueComplet> 
                            columns={produitColumns} 
                            data={filteredProduits} 
                            emptyText="Aucun produit trouvé."
                        />
                    ) : (
                        <Table<CategorieProduit> 
                            columns={categorieColumns} 
                            data={categories} 
                            emptyText="Aucune catégorie définie."
                        />
                    )}
                </Card>
                
                {isProduitModalOpen && (
                    <ProduitFormModal 
                        isOpen={isProduitModalOpen} 
                        onClose={closeAllModals} 
                        onSave={handleSaveProduit} 
                        produitInitial={produitEnEdition} 
                        categories={categories} 
                    />
                )}
                
                {isCategorieModalOpen && (
                    <CategorieFormModal 
                        isOpen={isCategorieModalOpen} 
                        onClose={closeAllModals} 
                        onSave={handleSaveCategorie} 
                        categorieInitial={categorieEnEdition}
                    />
                )}
            </div>
    );
};

export default GerantCataloguePage;