// src/page/VentesTermeFormPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi';
import Spinner from '../../components/Spinner';

// --- Données Mock pour Carburant avec stock ---
const produitsCarburant = [
    { id: 'prod1', nom: 'Super SP95', prix: 750, unite: 'L', stockActuel: 15000 },
    { id: 'prod2', nom: 'Diesel', prix: 700, unite: 'L', stockActuel: 12500 },
    { id: 'prod3', nom: 'SP98', prix: 800, unite: 'L', stockActuel: 5000 },
];
const clientsDisponibles = [
    { id: 'client1', nom: 'Société ABC Transport' },
    { id: 'client2', nom: 'Gouvernement Local X' },
];

interface VenteTermePompisteFormData {
  client: string;
  produit: string; // ID carburant
  quantite: string;
  prixUnitaire: string;
  montantTotal: string;
  dateEcheance: string;
  notes?: string;
  pompiste: string; // Ajout du pompiste qui initie
}

// --- Styles et Helpers ---
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer";
const readOnlyInputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm";
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);
// generateTermReceiptHtmlCarburant: une fonction spécifique serait idéale ici aussi.
// ----------------------------

const VentesTermeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteTermePompisteFormData>({
    client: '', produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
    dateEcheance: '', notes: '', pompiste: 'Natalya' // Simulé
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** Nouvel état pour le stock **
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);
  const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(null);


  // Calcul Total et récupération PU / Stock
  const calculateAndSetProductInfo = () => {
      const selectedProduit = produitsCarburant.find(p => p.id === formData.produit);
      const prixUnitaire = selectedProduit?.prix || 0;
      const quantite = parseFloat(formData.quantite);
      let stock = null;
      let unit = null;

      if (selectedProduit) {
          stock = selectedProduit.stockActuel;
          unit = selectedProduit.unite;
      }
      setSelectedProductStock(stock);
      setSelectedProductUnit(unit);

      if (!isNaN(quantite) && prixUnitaire > 0) {
          setFormData(prev => ({ ...prev, montantTotal: (quantite * prixUnitaire).toFixed(0) }));
      } else {
           setFormData(prev => ({ ...prev, montantTotal: '' }));
      }
      setFormData(prev => ({ ...prev, prixUnitaire: selectedProduit ? prixUnitaire.toString() : ''}));
  };

  useEffect(() => {
      calculateAndSetProductInfo();
  }, [formData.produit, formData.quantite]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Vente à Terme Carburant Soumise:', formData);
    // TODO: API Call vers ventes_terme_carburant?
    setTimeout(() => {
      alert('Vente à terme carburant enregistrée !');
      // Impression du bon ici...
      setIsSubmitting(false);
      navigate('/ventes/terme');
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Nouvelle Vente à Terme (Carburant)
        </h1>
        <div className="flex items-center space-x-3">
            <button type="submit" form="vente-terme-pompiste-form" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm disabled:opacity-50">
                <FiSave className="-ml-1 mr-2 h-5 w-5" />
                {isSubmitting ? <Spinner size="sm" color="text-white" /> : 'Enregistrer'}
            </button>
            <Link to="/ventes/terme" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 shadow-sm"> Annuler </Link>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form id="vente-terme-pompiste-form" onSubmit={handleSubmit} className="space-y-6">
           {/* Client Select */}
          <div> <label htmlFor="client" className={labelClass}>Client <span className="text-red-500">*</span></label> <select id="client" name="client" value={formData.client} onChange={handleChange} className={selectClass} required><option value="" disabled>Sélectionner un client...</option>{clientsDisponibles.map(c => (<option key={c.id} value={c.id}>{c.nom}</option>))}</select> </div>

          {/* Produit Carburant / Date Echeance - AVEC STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor="produit" className={labelClass}>Carburant <span className="text-red-500">*</span></label>
              <select id="produit" name="produit" value={formData.produit} onChange={handleChange} className={selectClass} required>
                 <option value="" disabled>Sélectionner un carburant...</option>
                 {produitsCarburant.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
               {/* ** Affichage Stock Carburant ** */}
              {formData.produit && selectedProductStock !== null && (
                <p className={`text-xs mt-1 ${selectedProductStock <= 0 ? 'text-red-600 font-semibold' : selectedProductStock < 1000 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  Volume estimé disponible : {selectedProductStock.toLocaleString('fr-FR')} {selectedProductUnit || ''}
                </p>
              )}
            </div>
            <div> <label htmlFor="dateEcheance" className={labelClass}>Date d'Échéance <span className="text-red-500">*</span></label> <input type="date" name="dateEcheance" id="dateEcheance" value={formData.dateEcheance} onChange={handleChange} className={inputClass} required/> </div>
          </div>

           {/* Quantité / PU / Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label htmlFor="quantite" className={labelClass}>Quantité (Litres) <span className="text-red-500">*</span></label><input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 100" min="0.01" step="0.01" className={inputClass} required/></div>
            <div><label htmlFor="prixUnitaire" className={labelClass}>Prix Unitaire (XAF/L)</label><input type="text" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire ? formatCurrency(parseFloat(formData.prixUnitaire)) : ''} className={readOnlyInputClass} readOnly /></div>
            <div><label htmlFor="montantTotal" className={labelClass}>Montant Total (XAF)</label><input type="text" name="montantTotal" id="montantTotal" value={formData.montantTotal ? formatCurrency(parseFloat(formData.montantTotal)) : ''} readOnly className={readOnlyInputClass + " font-semibold text-lg"} /></div>
          </div>

          {/* Pompiste / Notes */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div> <label htmlFor="pompiste" className={labelClass}>Pompiste Initiateur</label> <input type="text" name="pompiste" id="pompiste" value={formData.pompiste} className={readOnlyInputClass} readOnly /> </div>
               <div><label htmlFor="notes" className={labelClass}>Notes (Optionnel)</label><textarea name="notes" id="notes" rows={1} value={formData.notes} onChange={handleChange} placeholder="Référence Bon Commande Client, etc." className={inputClass + " pt-2"}></textarea></div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default VentesTermeFormPage;