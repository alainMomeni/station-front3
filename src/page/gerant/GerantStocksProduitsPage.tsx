// src/page/gerant/GerantStocksProduitsPage.tsx
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiArchive, FiFilter, FiSearch, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { ProduitStockDetail, ProduitStatutStock } from '../../types/stock';

// Import de l'écosystème
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';

// Import de nos composants UI et des composants spécifiques
import StatutStockBadge from '../../components/stocks/StatutStockBadge';
import { Card } from '../../components/ui/Card';
import { Table, type Column } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

// --- Données Mock ---
const dummyProduitsStock: ProduitStockDetail[] = [
    {
      id: 'PROD001', nom: 'Huile Moteur Synthétique 5W-30 (1L)', categorie: 'Lubrifiants Moteur', typeProduit: 'lubrifiant', stockActuel: 45, uniteMesure: 'Litre', seuilAlerteMinimum: 20, prixVenteUnitaire: 8500,
      statutStock: 'OK'
    },
    {
      id: 'PROD002', nom: 'Eau Minérale Cristaline (1.5L)', categorie: 'Boissons Fraîches', typeProduit: 'boutique', stockActuel: 15, uniteMesure: 'Bouteille', seuilAlerteMinimum: 24, derniereEntreeDate: '2024-07-10',
      statutStock: 'OK'
    },
    {
      id: 'PROD003', nom: 'Filtre à Huile Réf. XF-123', categorie: 'Filtres', typeProduit: 'accessoire', stockActuel: 8, uniteMesure: 'Unité', seuilAlerteMinimum: 10, prixVenteUnitaire: 6000,
      statutStock: 'OK'
    },
    {
      id: 'PROD004', nom: 'Liquide de refroidissement (-25°C)', categorie: 'Fluides Techniques', typeProduit: 'lubrifiant', stockActuel: 0, uniteMesure: 'Bidon 5L', seuilAlerteMinimum: 5, prixVenteUnitaire: 4500,
      statutStock: 'OK'
    },
    {
      id: 'PROD005', nom: 'Chips Saveur Paprika (Grand)', categorie: 'Snacks Salés', typeProduit: 'boutique', stockActuel: 75, uniteMesure: 'Sachet', seuilAlerteMinimum: 30, prochaineDatePeremption: '2024-12-31',
      statutStock: 'OK'
    },
];

// Helper pour calculer le statut
const getStatutStock = (p: ProduitStockDetail): ProduitStatutStock => {
    if (p.stockActuel <= 0) return 'RUPTURE';
    if (p.stockActuel <= p.seuilAlerteMinimum) return 'STOCK_FAIBLE';
    return 'OK';
}
// --------------------

// Définition des colonnes pour le composant <Table>
const tableColumns: Column<ProduitStockDetail>[] = [
  { 
    key: 'produit', 
    title: 'Produit', 
    render: (_, record) => (
      <div>
        <div className="font-medium text-gray-900">{record.nom}</div>
        <div className="text-xs text-gray-500">{record.reference || record.id}</div>
      </div>
    ),
  },
  { 
    key: 'categorie', 
    title: 'Catégorie', 
    dataIndex: 'categorie',
  },
  {
    key: 'stock',
    title: 'Stock Actuel',
    align: 'center',
    render: (_, record) => (
      <span className="font-semibold text-gray-800">{record.stockActuel} <span className="text-xs text-gray-500">{record.uniteMesure}</span></span>
    ),
  },
  {
    key: 'seuil',
    title: 'Seuil Min.',
    align: 'center',
    render: (_, record) => (
      <span className="text-gray-600">{record.seuilAlerteMinimum}</span>
    )
  },
  {
    key: 'statut',
    title: 'Statut',
    align: 'center',
    render: (_, record) => <StatutStockBadge statut={record.statutStock}/>
  },
  {
    key: 'actions',
    title: 'Actions',
    align: 'center',
    render: (_, record) => (
      <Link to={`/gerant/catalogue/produit/${record.id}`}>
        <Button variant="ghost" size="sm" title="Voir la fiche produit">
          <FiEye className="h-4 w-4"/>
        </Button>
      </Link>
    ),
  }
];

// Sous-composant pour les filtres
const StocksFilters: FC<{
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    categorie: string;
    onCategorieChange: (cat: string) => void;
    statut: ProduitStatutStock | '';
    onStatutChange: (statut: ProduitStatutStock | '') => void;
    categoriesUniques: string[];
}> = ({ searchTerm, onSearchTermChange, categorie, onCategorieChange, statut, onStatutChange, categoriesUniques }) => (
    <Card title="Filtres et Recherche" icon={FiFilter}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="Rechercher" placeholder="Nom ou référence..." value={searchTerm} onChange={e => onSearchTermChange(e.target.value)} leftIcon={<FiSearch className="h-4 w-4 text-gray-400"/>} />
            <Select label="Catégorie" value={categorie} onChange={e => onCategorieChange(e.target.value)} options={[
                { value: '', label: 'Toutes les catégories' },
                ...categoriesUniques.map(cat => ({ value: cat, label: cat }))
            ]}/>
            <Select label="Statut du stock" value={statut} onChange={e => onStatutChange(e.target.value as "" | ProduitStatutStock)} options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'OK', label: 'Stock OK' },
                { value: 'STOCK_FAIBLE', label: 'Stock faible' },
                { value: 'RUPTURE', label: 'Rupture' },
            ]}/>
        </div>
    </Card>
);

// Composant principal de la page
const GerantStocksProduitsPage: React.FC = () => {
  const [produits, setProduits] = useState<ProduitStockDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<ProduitStatutStock | ''>('');

  useEffect(() => {
    // Simulation du chargement
    setTimeout(() => {
      const processedData = dummyProduitsStock.map(p => ({...p, statutStock: getStatutStock(p) }));
      setProduits(processedData);
      setIsLoading(false);
    }, 700);
  }, []);

  const categoriesUniques = useMemo(() => Array.from(new Set(produits.map(p => p.categorie).filter(Boolean) as string[])).sort(), [produits]);

  const produitsFiltres = useMemo(() => {
    return produits
      .filter(p => (p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || (p.reference && p.reference.toLowerCase().includes(searchTerm.toLowerCase()))))
      .filter(p => !filtreCategorie || p.categorie === filtreCategorie)
      .filter(p => !filtreStatut || p.statutStock === filtreStatut)
      .sort((a,b) => {
        const order = { 'RUPTURE': 0, 'STOCK_FAIBLE': 1, 'OK': 2 };
        return order[a.statutStock] - order[b.statutStock] || a.nom.localeCompare(b.nom);
      });
  }, [produits, searchTerm, filtreCategorie, filtreStatut]);
  
  const valorisationTotaleStockVente = useMemo(() => produitsFiltres.reduce((acc, prod) => acc + (prod.stockActuel * (prod.prixVenteUnitaire || 0)), 0), [produitsFiltres]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                <FiArchive className="text-white text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Stocks Boutique & Lubrifiants</h1>
                <p className="text-gray-600">Consultez l'état de vos stocks en temps réel.</p>
            </div>
        </div>
        
        <StocksFilters 
            searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
            categorie={filtreCategorie} onCategorieChange={setFiltreCategorie}
            statut={filtreStatut} onStatutChange={setFiltreStatut}
            categoriesUniques={categoriesUniques}
        />

        {isLoading ? (
            <div className="flex justify-center p-20"><Spinner size="lg" /></div>
        ) : (
            <Card 
                title={`Liste des Produits (${produitsFiltres.length})`}
                icon={FiArchive}
                headerContent={
                  <div className="text-sm">
                      <span className="text-gray-300">Valorisation :</span> <span className="font-semibold text-white">{valorisationTotaleStockVente.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 })}</span>
                  </div>
                }
            >
                <Table<ProduitStockDetail>
                    columns={tableColumns}
                    data={produitsFiltres}
                    loading={isLoading}
                    emptyText="Aucun produit ne correspond à vos filtres."
                />
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GerantStocksProduitsPage;