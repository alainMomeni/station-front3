// src/page/gerant/GerantCataloguePage.tsx
import React, { useState, useMemo, useEffect } from 'react'; // Ajouté useEffect
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiList, FiPlusCircle, FiEdit, FiTrash2, FiFilter, FiToggleLeft, FiToggleRight, FiTag, FiArchive, FiSearch, FiAlertCircle, FiX } from 'react-icons/fi';
import type { ProduitCatalogueComplet, CategorieProduit } from '../../types/catalogue';
import ProduitFormModal from '../../components/modals/ProduitFormModal'; // Import du Modal
import CategorieFormModal from '../../components/modals/CategorieFormModal'; // Import du Modal
import { v4 as uuidv4 } from 'uuid'; // Pour les nouveaux ID si non gérés par le backend pour l'instant

// --- Données Mock (inchangées pour l'instant) ---
const dummyCategoriesData: CategorieProduit[] = [
  { id: 'cat1', nom: 'Lubrifiants Moteur', typeProduitAssocie: 'lubrifiant', nombreProduits: 3 },
  { id: 'cat2', nom: 'Boissons Fraîches', typeProduitAssocie: 'boutique', nombreProduits: 5 },
  { id: 'cat3', nom: 'Snacks Sucrés', typeProduitAssocie: 'boutique', nombreProduits: 12 },
  { id: 'cat4', nom: 'Filtres Véhicules', typeProduitAssocie: 'accessoire', nombreProduits: 8 },
  { id: 'cat5', nom: 'Carburants', typeProduitAssocie: 'carburant', nombreProduits: 3 },
];

const dummyProduitsCatalogueData: ProduitCatalogueComplet[] = [
  { id: 'P001', nom: 'Huile SuperGrade 5W30', reference: 'LUB-SG-5W30-5L', categorieId: 'cat1', categorieNom: 'Lubrifiants Moteur', typeProduit: 'lubrifiant', uniteMesure: 'Bidon 5L', prixAchatStandard: 12000, prixVenteActuel: 15500, seuilAlerteStock: 10, estActif: true, stockActuel: 25, statutStock: 'OK' },
  { id: 'P002', nom: 'Eau PureSource 1.5L', reference: 'BOI-EAU-1.5L', categorieId: 'cat2', categorieNom: 'Boissons Fraîches', typeProduit: 'boutique', uniteMesure: 'Bouteille', prixAchatStandard: 180, prixVenteActuel: 500, seuilAlerteStock: 50, estActif: true, stockActuel: 120, statutStock: 'OK' },
  { id: 'P003', nom: 'Filtre à Air ProVent X2', reference: 'FIL-AIR-X2', categorieId: 'cat4', categorieNom: 'Filtres Véhicules', typeProduit: 'accessoire', uniteMesure: 'Unité', prixAchatStandard: 3500, prixVenteActuel: 6500, seuilAlerteStock: 5, estActif: true, stockActuel: 3, statutStock: 'STOCK_FAIBLE' },
  { id: 'P004', nom: 'Barre ChocoNuts King', reference: 'SNK-CHN-KG', categorieId: 'cat3', categorieNom: 'Snacks Sucrés', typeProduit: 'boutique', uniteMesure: 'Unité', prixAchatStandard: 450, prixVenteActuel: 800, seuilAlerteStock: 20, estActif: false, stockActuel: 0, statutStock: 'RUPTURE' },
  { id: 'C001', nom: 'Essence SP95', reference: 'CARB-SP95', categorieId: 'cat5', categorieNom: 'Carburants', typeProduit: 'carburant', uniteMesure: 'Litre', prixVenteActuel: 820, estActif: true },
  { id: 'C002', nom: 'Diesel Pro', reference: 'CARB-DIESEL', categorieId: 'cat5', categorieNom: 'Carburants', typeProduit: 'carburant', uniteMesure: 'Litre', prixVenteActuel: 780, estActif: true },
];
// --------------------

type ActiveTab = 'produits' | 'categories';

const GerantCataloguePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('produits');
  const [produits, setProduits] = useState<ProduitCatalogueComplet[]>([]); // Init vide
  const [categories, setCategories] = useState<CategorieProduit[]>([]); // Init vide
  const [isLoading, setIsLoading] = useState(true); 
  
  const [searchTermProduit, setSearchTermProduit] = useState('');
  const [filtreCategorieProduit, setFiltreCategorieProduit] = useState('');
  const [filtreTypeProduit, setFiltreTypeProduit] = useState('');
  const [filtreStatutProduit, setFiltreStatutProduit] = useState<'actif' | 'inactif' | ''>('');

  const [showProduitModal, setShowProduitModal] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState<ProduitCatalogueComplet | null>(null);
  const [showCategorieModal, setShowCategorieModal] = useState(false);
  const [categorieEnEdition, setCategorieEnEdition] = useState<CategorieProduit | null>(null);

  const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);


  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProduits(dummyProduitsCatalogueData.map(p => ({...p, categorieNom: dummyCategoriesData.find(c => c.id === p.categorieId)?.nom })));
      setCategories(dummyCategoriesData);
      setIsLoading(false);
    }, 500);
  }, []);
  
  const filteredProduits = useMemo(() => { /* ... (inchangé) ... */ 
      return produits
      .filter(p => 
        (p.nom.toLowerCase().includes(searchTermProduit.toLowerCase()) || 
         (p.reference && p.reference.toLowerCase().includes(searchTermProduit.toLowerCase())))
      )
      .filter(p => filtreCategorieProduit === '' || p.categorieId === filtreCategorieProduit)
      .filter(p => filtreTypeProduit === '' || p.typeProduit === filtreTypeProduit)
      .filter(p => filtreStatutProduit === '' || (filtreStatutProduit === 'actif' && p.estActif) || (filtreStatutProduit === 'inactif' && !p.estActif))
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, [produits, searchTermProduit, filtreCategorieProduit, filtreTypeProduit, filtreStatutProduit]);

  const typesProduitsUniques = useMemo(() =>  Array.from(new Set(produits.map(p => p.typeProduit))).sort() , [produits]);

  const handleOpenProduitModal = (produit?: ProduitCatalogueComplet) => {
    setActionStatus(null);
    setProduitEnEdition(produit || null); // Si produit est undefined, c'est un ajout
    setShowProduitModal(true);
  };

  const handleSaveProduit = async (produitData: ProduitCatalogueComplet) => {
    // Simulation d'un appel API
    console.log("Sauvegarde du produit:", produitData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (produitEnEdition && produitData.id) { // Modification
      setProduits(prev => prev.map(p => p.id === produitData.id ? {...p, ...produitData, categorieNom: categories.find(c=>c.id === produitData.categorieId)?.nom} : p));
      setActionStatus({type:'success', message:`Produit "${produitData.nom}" mis à jour.`});
    } else { // Ajout
      const nouveauProduit = { ...produitData, id: `P-${uuidv4().slice(0,4)}`, categorieNom: categories.find(c=>c.id === produitData.categorieId)?.nom }; // Simuler ID
      setProduits(prev => [nouveauProduit, ...prev]);
      setActionStatus({type:'success', message:`Produit "${nouveauProduit.nom}" ajouté.`});
    }
    setShowProduitModal(false);
    setProduitEnEdition(null);
  };

  const handleDeleteProduit = (produitId: string) => { /* ... (inchangé) ... */ 
      if (window.confirm("Supprimer ce produit ?")) {
        setProduits(prev => prev.filter(p => p.id !== produitId));
        setActionStatus({type:'success', message:`Produit ${produitId} supprimé.`});
    }
  };
  const toggleProduitActif = (produitId: string) => { /* ... (inchangé) ... */
      setProduits(prev => prev.map(p => p.id === produitId ? {...p, estActif: !p.estActif} : p));
      const produit = produits.find(p=>p.id === produitId);
      setActionStatus({type:'success', message:`Statut de "${produit?.nom}" mis à jour.`});
  };

  const handleOpenCategorieModal = (categorie?: CategorieProduit) => {
    setActionStatus(null);
    setCategorieEnEdition(categorie || null);
    setShowCategorieModal(true);
  };
  
  const handleSaveCategorie = async (catData: Pick<CategorieProduit, 'id' | 'nom' | 'description' | 'typeProduitAssocie'>) => {
    console.log("Sauvegarde catégorie:", catData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if(categorieEnEdition && catData.id) {
        setCategories(prev => prev.map(c => c.id === catData.id ? {...c, ...catData} : c));
        setActionStatus({type:'success', message:`Catégorie "${catData.nom}" mise à jour.`});
    } else {
        const nouvelleCat = {...catData, id: `cat-${uuidv4().slice(0,3)}`, nombreProduits: 0 };
        setCategories(prev => [nouvelleCat, ...prev]);
        setActionStatus({type:'success', message:`Catégorie "${nouvelleCat.nom}" ajoutée.`});
    }
    setShowCategorieModal(false);
    setCategorieEnEdition(null);
  };

  const handleDeleteCategorie = (categorieId: string) => { /* ... (inchangé) ... */
    if (window.confirm("Supprimer cette catégorie ?")) {
        // Attention: Gérer les produits de cette catégorie
        const produitsDansCat = produits.filter(p => p.categorieId === categorieId).length;
        if(produitsDansCat > 0) {
            setActionStatus({type:'error', message:`Impossible de supprimer. ${produitsDansCat} produit(s) utilisent cette catégorie.`});
            return;
        }
        setCategories(prev => prev.filter(c => c.id !== categorieId));
        setActionStatus({type:'success', message:`Catégorie ${categorieId} supprimée.`});
    }
  };
  
  // Le reste des fonctions renderProduitsTable et renderCategoriesTable reste globalement le même
  // On a juste besoin de s'assurer que les className des inputs et selects sont bien définis
  // et que les noms correspondent (ex: 'select-class', 'input-class' utilisés plus bas).
  // Je vais les rendre plus génériques dans le render
  const commonInputClass = "block w-full sm:w-auto text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  const commonSelectClass = commonInputClass + " cursor-pointer flex-grow sm:flex-grow-0";


  const renderProduitsTable = () => ( /* ... (La structure JSX reste la même, juste s'assurer d'utiliser les bonnes classes CSS si vous les aviez définies en dehors) ... */
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center flex-wrap">
        <FiFilter className="h-5 w-5 text-gray-400 shrink-0" />
        <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input type="text" placeholder="Rechercher produit..." value={searchTermProduit} onChange={e => setSearchTermProduit(e.target.value)} className={`w-full pl-9 pr-3 ${commonInputClass}`} />
        </div>
        <select value={filtreCategorieProduit} onChange={e => setFiltreCategorieProduit(e.target.value)} className={commonSelectClass}>
            <option value="">Toutes les Catégories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
        </select>
         <select value={filtreTypeProduit} onChange={e => setFiltreTypeProduit(e.target.value)} className={commonSelectClass}>
            <option value="">Tous les Types</option>
            {typesProduitsUniques.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
        </select>
         <select value={filtreStatutProduit} onChange={e => setFiltreStatutProduit(e.target.value as any)} className={commonSelectClass}>
            <option value="">Tous les Statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        {/* Le tableau reste identique à la version précédente */}
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nom / Référence</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Catégorie</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Type</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ">PV Actuel</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Stock Actuel</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ">Statut</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredProduits.length > 0 ? filteredProduits.map(p => (
                <tr key={p.id} className="hover:bg-purple-50/30">
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{p.nom}</div>
                        <div className="text-xs text-gray-500">{p.reference || p.id}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-500 hidden md:table-cell">{p.categorieNom || '-'}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-500 hidden lg:table-cell">{p.typeProduit}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-gray-700 text-center font-semibold">
                        {(p.prixVenteActuel || 0).toLocaleString('fr-FR')} XAF
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-gray-500 hidden sm:table-cell">
                        {p.stockActuel !== undefined ? `${p.stockActuel} ${p.uniteMesure}` : 'N/A'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                        <button onClick={() => toggleProduitActif(p.id)} 
                            className={`p-1 rounded-full ${p.estActif ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                            title={p.estActif ? 'Désactiver' : 'Activer'}>
                            {p.estActif ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                        </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-xs space-x-2">
                        <button onClick={() => handleOpenProduitModal(p)} className="text-indigo-600 hover:text-indigo-900" title="Modifier"><FiEdit size={16}/></button>
                        <button onClick={() => handleDeleteProduit(p.id)} className="text-red-600 hover:text-red-900" title="Supprimer"><FiTrash2 size={16}/></button>
                    </td>
                </tr>
            )) : (
                <tr><td colSpan={7} className="text-center px-6 py-10 text-gray-500 italic">Aucun produit trouvé.</td></tr>
            )}
            </tbody>
        </table>
      </div>
    </>
   );

  const renderCategoriesTable = () => (  /* ... (La structure JSX reste la même) ... */ 
    <>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nom de la Catégorie</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Type de Produits Associé</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nb. Produits</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {categories.length > 0 ? categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-purple-50/30">
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{cat.nom}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-let text-gray-500 hidden sm:table-cell">{cat.typeProduitAssocie}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-left text-gray-500">{cat.nombreProduits || 0}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-left text-xs space-x-2">
                            <button onClick={() => handleOpenCategorieModal(cat)} className="text-indigo-600 hover:text-indigo-900" title="Modifier"><FiEdit size={16}/></button>
                            <button onClick={() => handleDeleteCategorie(cat.id)} className="text-red-600 hover:text-red-900" title="Supprimer"><FiTrash2 size={16}/></button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan={4} className="text-center px-6 py-10 text-gray-500 italic">Aucune catégorie définie.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          <FiList className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion du Catalogue
        </h1>
        <div className="flex space-x-2 shrink-0">
             <button onClick={() => activeTab === 'produits' ? handleOpenProduitModal() : handleOpenCategorieModal()} 
                    className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 shadow-sm">
                <FiPlusCircle className="mr-2 h-4 w-4" /> Ajouter {activeTab === 'produits' ? 'un Produit' : 'une Catégorie'}
            </button>
        </div>
      </div>
      
       {actionStatus && (
        <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {actionStatus.message}
            <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"> <FiX size={16}/> </button>
        </div>
      )}

      {/* Onglets pour Produits / Catégories */}
      <div className="mb-4 border-b border-gray-200">
        {/* ... (Structure des onglets inchangée) ... */}
         <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('produits')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'produits' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiArchive className="inline mr-1.5 h-4 w-4" /> Gestion des Produits
          </button>
          <button onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'categories' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FiTag className="inline mr-1.5 h-4 w-4" /> Gestion des Catégories
          </button>
        </nav>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {isLoading && <div className="flex justify-center py-10"><Spinner size="lg"/></div>}
        {!isLoading && activeTab === 'produits' && renderProduitsTable()}
        {!isLoading && activeTab === 'categories' && renderCategoriesTable()}
      </div>
      
      {showProduitModal && (
        <ProduitFormModal 
            isOpen={showProduitModal} 
            onClose={() => { setShowProduitModal(false); setProduitEnEdition(null);}} 
            onSave={handleSaveProduit} 
            produitInitial={produitEnEdition}
            categories={categories}
        />
      )}
      {showCategorieModal && (
        <CategorieFormModal 
            isOpen={showCategorieModal} 
            onClose={() => { setShowCategorieModal(false); setCategorieEnEdition(null);}} 
            onSave={handleSaveCategorie}
            categorieInitial={categorieEnEdition}
        />
      )}

    </DashboardLayout>
  );
};

export default GerantCataloguePage;