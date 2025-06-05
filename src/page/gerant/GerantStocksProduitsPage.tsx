// src/page/gerant/GerantStocksProduitsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiSearch, FiFilter, FiAlertTriangle, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // Pour les liens d'action
import type { ProduitStockDetail, ProduitStatutStock } from '../../types/stock'; // Adapter le chemin

// --- Données Mock ---
const dummyProduitsStock: ProduitStockDetail[] = [
  { id: 'PROD001', nom: 'Huile Moteur Synthétique 5W-30 (1L)', categorie: 'Lubrifiants Moteur', typeProduit: 'lubrifiant', stockActuel: 45, uniteMesure: 'Litre', seuilAlerteMinimum: 20, statutStock: 'OK', prixVenteUnitaire: 8500, fournisseurPrincipalNom: 'Lubrifiants Express'},
  { id: 'PROD002', nom: 'Eau Minérale Cristaline (1.5L)', categorie: 'Boissons Fraîches', typeProduit: 'boutique', stockActuel: 15, uniteMesure: 'Bouteille', seuilAlerteMinimum: 24, statutStock: 'STOCK_FAIBLE', prixVenteUnitaire: 500, derniereEntreeDate: '2024-07-10'},
  { id: 'PROD003', nom: 'Filtre à Huile Réf. XF-123', categorie: 'Filtres', typeProduit: 'accessoire', stockActuel: 8, uniteMesure: 'Unité', seuilAlerteMinimum: 10, statutStock: 'STOCK_FAIBLE', prixVenteUnitaire: 6000 },
  { id: 'PROD004', nom: 'Liquide de refroidissement (-25°C)', categorie: 'Fluides Techniques', typeProduit: 'lubrifiant', stockActuel: 0, uniteMesure: 'Bidon 5L', seuilAlerteMinimum: 5, statutStock: 'RUPTURE', prixVenteUnitaire: 4500, fournisseurPrincipalNom: 'Chimitec Pro'},
  { id: 'PROD005', nom: 'Chips Saveur Paprika (Grand)', categorie: 'Snacks Salés', typeProduit: 'boutique', stockActuel: 75, uniteMesure: 'Sachet', seuilAlerteMinimum: 30, statutStock: 'OK', prochaineDatePeremption: '2024-12-31' },
  { id: 'PROD006', nom: 'Nettoyant Jantes Pro Brillance', categorie: 'Entretien Auto', typeProduit: 'accessoire', stockActuel: 22, uniteMesure: 'Spray', seuilAlerteMinimum: 10, statutStock: 'OK' },
  { id: 'PROD007', nom: 'AdBlue (10L)', categorie: 'Additifs Diesel', typeProduit: 'lubrifiant', stockActuel: 12, uniteMesure: 'Bidon', seuilAlerteMinimum: 15, statutStock: 'STOCK_FAIBLE', prixVenteUnitaire: 9000, derniereEntreeDate: '2024-07-15'},
];
// --------------------

// Helper pour le style des badges de statut
const StatutStockBadge: React.FC<{ statut: ProduitStatutStock }> = ({ statut }) => {
  let classes = "px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full";
  let icon = null;
  let text = statut.replace('_', ' ').toLowerCase();
  text = text.charAt(0).toUpperCase() + text.slice(1);

  switch (statut) {
    case 'OK':
      classes += " bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1 h-3 w-3" />;
      break;
    case 'STOCK_FAIBLE':
      classes += " bg-yellow-100 text-yellow-800";
      icon = <FiAlertTriangle className="mr-1 h-3 w-3" />;
      break;
    case 'RUPTURE':
      classes += " bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1 h-3 w-3" />;
      break;
    default:
      classes += " bg-gray-100 text-gray-800";
  }
  return <span className={classes}><span className='hidden sm:inline-block'>{icon}</span> {text}</span>;
};

const GerantStocksProduitsPage: React.FC = () => {
  const [produits, setProduits] = useState<ProduitStockDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<ProduitStatutStock | ''>('');

  useEffect(() => {
    setIsLoading(true);
    // Simuler le chargement des produits et leur stock actuel
    // Dans une vraie app, on fetcherait ces données depuis Directus.
    // Le 'statutStock' serait calculé côté client ou backend (via un champ 'computed').
    setTimeout(() => {
      const processedData = dummyProduitsStock.map(p => {
        let statutStock: ProduitStatutStock = 'OK';
        if (p.stockActuel <= 0) statutStock = 'RUPTURE';
        else if (p.stockActuel <= p.seuilAlerteMinimum) statutStock = 'STOCK_FAIBLE';
        return {...p, statutStock};
      })
      setProduits(processedData);
      setIsLoading(false);
    }, 700);
  }, []);

  const categoriesUniques = useMemo(() => {
    return Array.from(new Set(produits.map(p => p.categorie).filter(Boolean) as string[])).sort();
  }, [produits]);

  const produitsFiltres = useMemo(() => {
    return produits
      .filter(p => 
        (p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (p.reference && p.reference.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .filter(p => filtreCategorie === '' || p.categorie === filtreCategorie)
      .filter(p => filtreStatut === '' || p.statutStock === filtreStatut)
      .sort((a,b) => { // Trier pour mettre les ruptures et stocks faibles en premier
        const order = { 'RUPTURE':0, 'STOCK_FAIBLE': 1, 'OK': 2 };
        return order[a.statutStock] - order[b.statutStock] || a.nom.localeCompare(b.nom);
      });
  }, [produits, searchTerm, filtreCategorie, filtreStatut]);
  
  const valorisationTotaleStockVente = useMemo(() => {
      return produitsFiltres.reduce((acc, prod) => acc + (prod.stockActuel * (prod.prixVenteUnitaire || 0)), 0);
  }, [produitsFiltres]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Stocks Boutique & Lubrifiants
        </h1>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {/* Titre Filtres avec icône */}
          <div className="flex items-center text-gray-500 sm:w-auto whitespace-nowrap">
            <FiFilter className="h-5 w-5" />
            <span className="text-sm font-medium ml-2">Filtres</span>
          </div>

          {/* Conteneur des inputs */}
          <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center">
            {/* Recherche */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 
                         placeholder-gray-400 transition-all duration-200 focus:outline-none
                         hover:border-purple-400"
              />
            </div>

            {/* Filtre Catégorie */}
            <div className="relative w-full sm:w-52">
              <select 
                value={filtreCategorie} 
                onChange={e => setFiltreCategorie(e.target.value)}
                className="block w-full text-sm border border-gray-300 rounded-lg py-2 pl-3 pr-10
                         focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                         cursor-pointer bg-white transition-all duration-200
                         hover:border-purple-400"
              >
                <option value="">Toutes les Catégories</option>
                {categoriesUniques.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Filtre Statut */}
            <div className="relative w-full sm:w-52">
              <select 
                value={filtreStatut} 
                onChange={e => setFiltreStatut(e.target.value as any)}
                className="block w-full text-sm border border-gray-300 rounded-lg py-2 pl-3 pr-10
                         focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                         cursor-pointer bg-white transition-all duration-200
                         hover:border-purple-400"
              >
                <option value="">Tous les Statuts</option>
                <option value="OK">Stock OK</option>
                <option value="STOCK_FAIBLE">Stock Faible</option>
                <option value="RUPTURE">Rupture de Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des stocks */}
      {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
      ) : (
        <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
          {produitsFiltres.length > 0 && (
            <div className="mb-3 text-right px-2 md:px-0">
                <p className="text-sm text-gray-600">
                    Valeur Totale Stock (Prix Vente): <span className="font-semibold text-purple-700">{valorisationTotaleStockVente.toLocaleString('fr-FR', {style:'currency', currency: 'XAF', minimumFractionDigits:0})}</span>
                </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Produit</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell whitespace-nowrap">Catégorie</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock Actuel</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell whitespace-nowrap">Seuil Min.</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Statut</th>
                  <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produitsFiltres.length > 0 ? produitsFiltres.map((p) => (
                  <tr key={p.id} className={`hover:bg-purple-50/30 ${p.statutStock === 'RUPTURE' ? 'bg-red-50' : p.statutStock === 'STOCK_FAIBLE' ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{p.nom}</div>
                        <div className="text-xs text-gray-500">{p.reference || p.id}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-500 hidden md:table-cell">{p.categorie || '-'}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-800">{p.stockActuel}</span> {p.uniteMesure}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-gray-500 hidden sm:table-cell">{p.seuilAlerteMinimum} {p.uniteMesure}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <StatutStockBadge statut={p.statutStock} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-xs space-x-2">
                      <Link to={`/gerant/catalogue/produit/${p.id}`} className="text-indigo-600 hover:text-indigo-900" title="Voir/Modifier Fiche Produit">
                          <FiEye size={16} className="inline"/>
                      </Link>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center px-6 py-10 text-gray-500 italic">Aucun produit trouvé ou ne correspond aux filtres.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination (si la */}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GerantStocksProduitsPage;