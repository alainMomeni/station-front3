// src/page/VentesFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link a été importé
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi';
import Spinner from '../../components/Spinner';

// --- Données Mock pour Carburant avec stock ---
const produitsCarburant = [
    { id: 'prod1', nom: 'Super SP95', prix: 750, unite: 'L', stockActuel: 15000 }, // En litres
    { id: 'prod2', nom: 'Diesel', prix: 700, unite: 'L', stockActuel: 12500 },    // En litres
    { id: 'prod3', nom: 'SP98', prix: 800, unite: 'L', stockActuel: 5000 },     // Exemple SP98
];
// Pour les besoins de cet exemple, j'enlève Huile moteur car c'est plutôt boutique.
// Si le pompiste vend aussi des articles boutique via CE formulaire, alors il faudrait fusionner les listes.

interface VenteDirectePompisteFormData {
  produit: string; // ID carburant
  quantite: string;
  prixUnitaire: string;
  montantTotal: string;
  modePaiement: 'Espèces' | 'Carte' | 'Mobile Money' | 'Autre';
  pompe: string; // Garder "pompe" pour ce contexte
  client?: string;
  remise?: string;
  pompiste: string;
}

// --- Styles et Helpers ---
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer";
const readOnlyInputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm";
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
// generateDirectReceiptHtml: une fonction spécifique pour le reçu carburant serait idéale
// Pour simplifier, nous ne la créerons pas ici mais le principe est le même que pour la caisse.
// ----------------------------

const VentesFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteDirectePompisteFormData>({
    produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
    modePaiement: 'Espèces', pompe: '', client: '', remise: '',
    pompiste: 'Natalya', // Simulé
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** Nouvel état pour le stock **
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);
  const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(null);

  useEffect(() => {
    const selectedProduit = produitsCarburant.find(p => p.id === formData.produit);
    let pu = 0;
    let stock = null;
    let unit = null;

    if (selectedProduit) {
        pu = selectedProduit.prix;
        stock = selectedProduit.stockActuel;
        unit = selectedProduit.unite;
    }
    setSelectedProductStock(stock);
    setSelectedProductUnit(unit);

    const quantiteNum = parseFloat(formData.quantite);
    const remiseNum = parseFloat(formData.remise || '0');
    let totalNet = 0;
    if (!isNaN(quantiteNum) && pu > 0) { totalNet = (quantiteNum * pu) - remiseNum; }

    setFormData(prev => ({
      ...prev,
      prixUnitaire: selectedProduit ? pu.toString() : '',
      montantTotal: totalNet >= 0 ? totalNet.toFixed(0) : '0',
    }));
  }, [formData.produit, formData.quantite, formData.remise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Nouvelle Vente Directe Carburant:', formData);
    // TODO: Appel API Directus (collection ventes_carburant?)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simule API
    alert('Vente carburant enregistrée !');
    // Ici aussi, on pourrait déclencher l'impression du reçu carburant
    setIsSubmitting(false);
    navigate('/ventes/directes');
  };

  return (
    <DashboardLayout>
      {/* Header (l'attribut "form" du bouton Enregistrer doit correspondre à l'id du formulaire) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Nouvelle Vente Carburant
        </h1>
        <div className="flex items-center space-x-3">
            <button
                type="submit"
                form="vente-directe-pompiste-form" // ID Unique
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm disabled:opacity-50"
            >
            <FiSave className="-ml-1 mr-2 h-5 w-5" />
                {isSubmitting ? <Spinner size="sm" color="text-white"/> : 'Enregistrer'}
            </button>
            <Link // Transformé en Link
                to="/ventes/directes"
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 shadow-sm"
            >
                Annuler
            </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form id="vente-directe-pompiste-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Pompe / Pompiste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="pompe" className={labelClass}>N° Pompe <span className="text-red-500">*</span></label><input type="text" name="pompe" id="pompe" value={formData.pompe} onChange={handleChange} placeholder="Ex: P01, Caisse..." className={inputClass} required /></div>
            <div><label htmlFor="pompiste" className={labelClass}>Pompiste</label><input type="text" name="pompiste" id="pompiste" value={formData.pompiste} className={readOnlyInputClass} readOnly /></div>
          </div>

          {/* Produit Carburant / Quantité - AVEC STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor="produit" className={labelClass}>Carburant <span className="text-red-500">*</span></label>
              <select id="produit" name="produit" value={formData.produit} onChange={handleChange} className={selectClass} required>
                <option value="" disabled>Sélectionner un carburant...</option>
                {produitsCarburant.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="quantite" className={labelClass}>Quantité (Litres) <span className="text-red-500">*</span></label>
              <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 20" min="0.01" step="0.01" className={inputClass} required />
               {/* ** Affichage du Stock Disponible ** */}
              {selectedProductStock !== null && (
                  <p className={`text-xs mt-1 ${selectedProductStock <= 0 ? 'text-red-600 font-semibold' : selectedProductStock < 1000 ? 'text-yellow-600' : 'text-gray-500'}`}>
                      Disponible (cuve/estimation) : {selectedProductStock.toLocaleString('fr-FR')} {selectedProductUnit || ''}
                  </p>
              )}
            </div>
          </div>

          {/* PU / Remise / Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label htmlFor="prixUnitaire" className={labelClass}>Prix Unitaire (XAF/L)</label><input type="text" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire ? formatCurrency(parseFloat(formData.prixUnitaire)) : ''} className={readOnlyInputClass} readOnly /></div>
            <div><label htmlFor="remise" className={labelClass}>Remise (XAF)</label><input type="number" name="remise" id="remise" value={formData.remise} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} /></div>
            <div><label htmlFor="montantTotal" className={labelClass}>Total à Payer (XAF)</label><input type="text" name="montantTotal" id="montantTotal" value={formatCurrency(parseFloat(formData.montantTotal || '0'))} className={readOnlyInputClass + " font-semibold text-lg"} readOnly /></div>
          </div>

          {/* Paiement / Client (Optionnel) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="modePaiement" className={labelClass}>Mode de Paiement <span className="text-red-500">*</span></label><select id="modePaiement" name="modePaiement" value={formData.modePaiement} onChange={handleChange} className={selectClass} required><option value="Espèces">Espèces</option><option value="Carte">Carte Bancaire</option><option value="Mobile Money">Mobile Money</option><option value="Autre">Autre</option></select></div>
            <div><label htmlFor="client" className={labelClass}>Client (Optionnel)</label><input type="text" name="client" id="client" value={formData.client} onChange={handleChange} placeholder="Nom du client si connu" className={inputClass} /></div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default VentesFormPage;