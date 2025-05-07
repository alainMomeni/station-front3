import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi'; // Ajuster icônes si besoin

interface VenteDirecteFormData {
  produit: string;
  quantite: string;
  prixUnitaire: string;
  montantTotal: string;
  modePaiement: 'Espèces' | 'Carte' | 'Mobile Money' | 'Autre';
  pompe: string;
  client?: string;
  remise?: string;
  pompiste: string;
}

const produitsDisponibles = [
    { id: 'prod1', nom: 'Super SP95', prix: 750, unite: 'L' },
    { id: 'prod2', nom: 'Diesel', prix: 700, unite: 'L' },
    { id: 'prod4', nom: 'Huile Moteur XYZ (1L)', prix: 5000, unite: 'Unité' },
];

// Styles communs réutilisables (style Ventes à Terme)
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer";
const readOnlyInputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm";


const VentesFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteDirecteFormData>({
    produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
    modePaiement: 'Espèces', pompe: '', client: '', remise: '',
    pompiste: 'Natalya', // Simulé
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const selectedProduit = produitsDisponibles.find(p => p.id === formData.produit);
    let pu = selectedProduit?.prix || 0;
    const quantiteNum = parseFloat(formData.quantite);
    const remiseNum = parseFloat(formData.remise || '0');
    let totalNet = 0;

    if (!isNaN(quantiteNum) && pu > 0) {
      totalNet = (quantiteNum * pu) - remiseNum;
    }

    setFormData(prev => ({
      ...prev,
      prixUnitaire: selectedProduit ? pu.toString() : '',
      montantTotal: totalNet > 0 ? totalNet.toFixed(0) : '',
    }));
  }, [formData.produit, formData.quantite, formData.remise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Nouvelle Vente Directe:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Vente enregistrée !');
    setIsSubmitting(false);
    navigate('/ventes/directes');
  };

  return (
    <DashboardLayout>
      {/* Header (reste identique) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Nouvelle Vente Directe
        </h1>
        <div className="flex items-center space-x-3">
            <button
                type="submit"
                form="vente-terme-form"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm disabled:opacity-50"
            >
            <FiSave className="-ml-1 mr-2 h-5 w-5" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button             
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 shadow-sm"
            >
                Annuler
            </button>
        </div>
      </div>

      {/* Formulaire avec le style visuel de VentesTermeFormPage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* ** Utilisation du style de VentesTermeFormPage (labels, grid, classes communes) ** */}
        <form id="vente-directe-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="pompe" className={labelClass}>N° Pompe <span className="text-red-500">*</span></label>
                <input type="text" name="pompe" id="pompe" value={formData.pompe} onChange={handleChange} placeholder="Ex: P01, Caisse..." className={inputClass} required />
            </div>
            <div>
                <label htmlFor="pompiste" className={labelClass}>Pompiste</label>
                <input type="text" name="pompiste" id="pompiste" value={formData.pompiste} className={readOnlyInputClass} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="produit" className={labelClass}>Produit <span className="text-red-500">*</span></label>
              <select id="produit" name="produit" value={formData.produit} onChange={handleChange} className={selectClass} required>
                <option value="" disabled>Sélectionner un produit...</option>
                {produitsDisponibles.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="quantite" className={labelClass}>Quantité <span className="text-red-500">*</span></label>
              <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 20" min="0.01" step="0.01" className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="prixUnitaire" className={labelClass}>Prix Unitaire (XAF)</label>
                <input type="text" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire} className={readOnlyInputClass} readOnly />
            </div>
            <div>
              <label htmlFor="modePaiement" className={labelClass}>Mode de Paiement <span className="text-red-500">*</span></label>
              <select id="modePaiement" name="modePaiement" value={formData.modePaiement} onChange={handleChange} className={selectClass} required>
                <option value="Espèces">Espèces</option>
                <option value="Carte">Carte Bancaire</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
                <label htmlFor="montantTotal" className={labelClass}>Total à Payer (XAF)</label>
                <input type="text" name="montantTotal" id="montantTotal" value={formatCurrency(parseFloat(formData.montantTotal || '0'))} className={readOnlyInputClass + " font-semibold"} readOnly />
            </div>
          </div>
           {/* Mettre le reste du formulaire (submit/cancel buttons) ici */}
        </form>
      </div>
    </DashboardLayout>
  );
};

// Helper pour le formatage XAF (à mettre en dehors ou dans un fichier util)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default VentesFormPage;