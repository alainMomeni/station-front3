// src/page/gerant/GerantConfigPage.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiAlertTriangle, FiDroplet, FiArchive, FiSave, FiAlertCircle, FiTag, FiX } from 'react-icons/fi';
import type { CarburantPrixConfig, CuveSeuilConfig } from '../../types/configuration'; // Adapter chemin
import { Link } from 'react-router-dom';

// --- Données Mock ---
const dummyCarburantsPourPrix: Omit<CarburantPrixConfig, 'prixVenteActuelTTC'>[] = [
  { id: 'SP95', nomCarburant: 'Essence SP95', unite: 'Litre', prixAchatMoyenActuel: 680, tauxMargeSouhaite: 18 },
  { id: 'DIESEL', nomCarburant: 'Diesel', unite: 'Litre', prixAchatMoyenActuel: 650, tauxMargeSouhaite: 20 },
  { id: 'SP98', nomCarburant: 'Essence SP98', unite: 'Litre', prixAchatMoyenActuel: 710, tauxMargeSouhaite: 19 },
];

const dummyCuvesPourSeuils: CuveSeuilConfig[] = [
  { id: 'cuve1', nomCuve: 'Cuve SP95 - Principale', typeCarburant: 'Essence SP95', capaciteMax: 20000, seuilAlerteBas: 4000},
  { id: 'cuve2', nomCuve: 'Cuve Diesel - A', typeCarburant: 'Diesel', capaciteMax: 15000, seuilAlerteBas: 3000},
  { id: 'cuve3', nomCuve: 'Cuve SP98 - Réserve', typeCarburant: 'Essence SP98', capaciteMax: 10000, seuilAlerteBas: 2000},
];
// --------------------

type ActiveConfigTab = 'prixCarburants' | 'seuilsCuves' | 'prixProduits' | 'fidelite'; // Etendre au besoin

const GerantConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveConfigTab>('prixCarburants');
  
  const [carburantsConfig, setCarburantsConfig] = useState<CarburantPrixConfig[]>([]);
  const [cuvesSeuilsConfig, setCuvesSeuilsConfig] = useState<CuveSeuilConfig[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<ActiveConfigTab | null>(null); // Pour savoir quelle section sauvegarde
  const [saveStatus, setSaveStatus] = useState<{ type: 'success'|'error', section: ActiveConfigTab, message:string } | null>(null);

  // Simuler le chargement des configurations existantes
  useEffect(() => {
    setIsLoading(true);
    setSaveStatus(null);
    setTimeout(() => {
      // Simuler que les prix de vente actuels sont déjà définis (pourraient venir de Directus)
      const initialCarbConfig = dummyCarburantsPourPrix.map(c => {
        const prixVenteActuel = parseFloat((c.prixAchatMoyenActuel! * (1 + (c.tauxMargeSouhaite! / 100)) * 1.18).toFixed(0)); // Simule achat + marge + TVA grossièrement
        return {
            ...c,
            prixVenteActuelTTC: prixVenteActuel,
            prixVenteCalculeTTC: prixVenteActuel // Au chargement, on peut considérer qu'ils sont égaux
        };
      });
      setCarburantsConfig(initialCarbConfig);
      setCuvesSeuilsConfig(dummyCuvesPourSeuils);
      setIsLoading(false);
    }, 800);
  }, []);

  const handlePrixCarburantChange = (id: string, field: keyof CarburantPrixConfig, value: string | number) => {
    setCarburantsConfig(prev => prev.map(c => {
        if (c.id === id) {
            const updatedConfig = { ...c, [field]: value };
            // Recalculer le prix de vente si marge ou prix achat change (ou vice-versa si on saisit prix vente)
            // Pour l'instant, on modifie directement prixVenteActuelTTC
            if (field === 'tauxMargeSouhaite' && updatedConfig.prixAchatMoyenActuel) {
                 updatedConfig.prixVenteCalculeTTC = parseFloat((updatedConfig.prixAchatMoyenActuel * (1 + ( (typeof value === 'string' ? parseFloat(value) : value) / 100)) * 1.18).toFixed(0)); // Simulation avec TVA 18%
            }
             // Si on modifie prixVenteActuelTTC, on pourrait recalculer la marge (plus complexe)
            return updatedConfig;
        }
        return c;
    }));
    setSaveStatus(null);
  };
  
  const handleSeuilCuveChange = (id: string, value: string) => {
      setCuvesSeuilsConfig(prev => prev.map(c => 
        c.id === id ? { ...c, seuilAlerteBas: parseInt(value, 10) || 0 } : c
      ));
      setSaveStatus(null);
  };

  const handleSaveChanges = async (section: ActiveConfigTab) => {
    setIsSaving(section);
    setSaveStatus(null);
    let dataToSave: any;
    let successMessage = "";

    if (section === 'prixCarburants') {
      dataToSave = carburantsConfig.map(c => ({id: c.id, nom:c.nomCarburant, prixVenteTTC: c.prixVenteActuelTTC, tauxMarge: c.tauxMargeSouhaite}));
      successMessage = "Prix des carburants mis à jour.";
      // TODO: API Call vers Directus pour mettre à jour les items 'types_carburant' ou une collection 'tarifs_carburant'
      console.log("Saving Prix Carburants:", dataToSave);
    } else if (section === 'seuilsCuves') {
      dataToSave = cuvesSeuilsConfig.map(c => ({id: c.id, nom:c.nomCuve, seuilAlerte: c.seuilAlerteBas}));
      successMessage = "Seuils d'alerte des cuves mis à jour.";
      // TODO: API Call vers Directus pour mettre à jour les items 'cuves'
      console.log("Saving Seuils Cuves:", dataToSave);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler API
    setSaveStatus({type: 'success', section, message: successMessage});
    setIsSaving(null);
  };
  
  const formatCurrency = (val?: number) => val?.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) + ' XAF' || 'N/A';


  const renderPrixCarburants = () => (
    <div className="space-y-6">
      {carburantsConfig.map(carb => (
        <div key={carb.id} className="p-4 border rounded-lg bg-gray-50/50">
          <h3 className="text-md font-semibold text-purple-700 mb-2">{carb.nomCarburant}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
                <label className="block text-xs text-gray-500">P. Achat Moyen (Info)</label>
                <p className="font-medium mt-1">{formatCurrency(carb.prixAchatMoyenActuel)} / {carb.unite}</p>
            </div>
            <div>
                <label htmlFor={`marge-${carb.id}`} className="block text-xs text-gray-500">Taux Marge Souhaité (%)</label>
                <input type="number" id={`marge-${carb.id}`} step="0.1"
                       value={carb.tauxMargeSouhaite || ''} 
                       onChange={e => handlePrixCarburantChange(carb.id, 'tauxMargeSouhaite', parseFloat(e.target.value))}
                       className="mt-1 w-full sm:w-24 p-1.5 border-gray-300 rounded-md shadow-sm text-sm"/>
            </div>
            <div>
                <label className="block text-xs text-gray-500">P. Vente Calculé TTC (Est.)</label>
                <p className="font-medium mt-1 text-blue-600">{formatCurrency(carb.prixVenteCalculeTTC)} / {carb.unite}</p>
            </div>
             <div>
                <label htmlFor={`pv-${carb.id}`} className="block text-xs text-gray-500 font-semibold">P. Vente Final Appliqué (TTC) <span className="text-red-500">*</span></label>
                <input type="number" id={`pv-${carb.id}`} step="5" // Pas de 5 XAF
                       value={carb.prixVenteActuelTTC || ''} 
                       onChange={e => handlePrixCarburantChange(carb.id, 'prixVenteActuelTTC', parseFloat(e.target.value))}
                       className="mt-1 w-full sm:w-32 p-1.5 border-gray-300 rounded-md shadow-sm text-sm font-bold"/>
            </div>
          </div>
        </div>
      ))}
      <div className="text-right mt-6">
        <button onClick={() => handleSaveChanges('prixCarburants')} disabled={isSaving === 'prixCarburants'} className="btn-primary">
            {isSaving === 'prixCarburants' ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/>Sauvegarder Prix Carburants</>}
        </button>
      </div>
    </div>
  );

 const renderSeuilsCuves = () => (
    <div className="space-y-4">
        {cuvesSeuilsConfig.map(cuve => (
            <div key={cuve.id} className="p-3 border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
                <div>
                    <p className="font-medium text-purple-700">{cuve.nomCuve} <span className="text-xs text-gray-500">({cuve.typeCarburant})</span></p>
                    <p className="text-xs text-gray-500">Capacité: {cuve.capaciteMax.toLocaleString('fr-FR')} L</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor={`seuil-${cuve.id}`} className="text-sm text-gray-700 shrink-0">Seuil d'Alerte (L):</label>
                    <input type="number" id={`seuil-${cuve.id}`} step="100" min="0"
                           value={cuve.seuilAlerteBas || ''} 
                           onChange={e => handleSeuilCuveChange(cuve.id, e.target.value)}
                           className="p-1.5 border-gray-300 rounded-md shadow-sm text-sm w-full sm:w-32"/>
                </div>
            </div>
        ))}
        <div className="text-right mt-6">
            <button onClick={() => handleSaveChanges('seuilsCuves')} disabled={isSaving === 'seuilsCuves'} className="btn-primary">
                {isSaving === 'seuilsCuves' ? <Spinner size="sm" color="text-white"/> : <><FiSave className="mr-2"/>Sauvegarder Seuils Cuves</>}
            </button>
        </div>
    </div>
 );

 const renderPrixProduits = () => ( // Placeholder
    <div className="p-6 bg-gray-50 rounded-md border text-center">
        <FiArchive size={32} className="mx-auto text-gray-400 mb-2"/>
        <h3 className="font-semibold text-gray-700">Configuration des Prix Produits Boutique & Lubrifiants</h3>
        <p className="text-sm text-gray-500 mt-1">Cette section permettra de gérer les prix et marges des articles de la boutique.</p>
        <p className="text-xs text-gray-400 mt-2">(Souvent géré via la <Link to="/gerant/catalogue/gestion" className="text-purple-600 hover:underline">Gestion du Catalogue Produits</Link>).</p>
    </div>
 );
 
 const renderFidelite = () => ( // Placeholder
     <div className="p-6 bg-gray-50 rounded-md border text-center">
        <FiTag size={32} className="mx-auto text-gray-400 mb-2"/>
        <h3 className="font-semibold text-gray-700">Règles du Programme de Fidélité</h3>
        <p className="text-sm text-gray-500 mt-1">Définissez ici les paramètres de votre programme de fidélité.</p>
         <p className="text-xs text-gray-400 mt-2">(Points par achat, valeur des points, récompenses, etc.)</p>
    </div>
 );


  if (isLoading) {
    return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg"/></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
         Configuration de la Politique Commerciale
      </h1>

      {/* Onglets */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'prixCarburants', label: 'Prix Carburants', icon: FiDroplet },
            { id: 'seuilsCuves', label: 'Seuils Cuves', icon: FiAlertTriangle },
            { id: 'prixProduits', label: 'Prix Produits Boutique', icon: FiArchive },
            { id: 'fidelite', label: 'Programme Fidélité', icon: FiTag },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as ActiveConfigTab); setSaveStatus(null);}}
              className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <tab.icon className="mr-1.5 h-4 w-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {saveStatus && (
            <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${saveStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {saveStatus.message}
                <button onClick={() => setSaveStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"> <FiX size={16}/> </button>
            </div>
       )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {activeTab === 'prixCarburants' && renderPrixCarburants()}
        {activeTab === 'seuilsCuves' && renderSeuilsCuves()}
        {activeTab === 'prixProduits' && renderPrixProduits()}
        {activeTab === 'fidelite' && renderFidelite()}
      </div>
    </DashboardLayout>
  );
};

export default GerantConfigPage;