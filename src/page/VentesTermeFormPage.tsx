import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi';

interface VenteTermeFormData {
  client: string; // Could be an ID to lookup client details
  produit: string;
  quantite: string;
  prixUnitaire: string; // To calculate total
  montantTotal: string; // Potentially calculated
  dateEcheance: string;
  notes?: string;
}

const VentesTermeFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteTermeFormData>({
    client: '',
    produit: '',
    quantite: '',
    prixUnitaire: '',
    montantTotal: '',
    dateEcheance: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic calculation for total amount
  const calculateTotal = (quantiteStr: string, prixUnitaireStr: string): string => {
    const quantite = parseFloat(quantiteStr);
    const prixUnitaire = parseFloat(prixUnitaireStr);
    if (!isNaN(quantite) && !isNaN(prixUnitaire)) {
        return (quantite * prixUnitaire).toFixed(0); // XAF usually has no decimals
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "quantite" || name === "prixUnitaire") {
        newFormData.montantTotal = calculateTotal(
            name === "quantite" ? value : newFormData.quantite,
            name === "prixUnitaire" ? value : newFormData.prixUnitaire
        );
    }
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Vente à Terme Soumise:', formData);
    // Simulate API Call
    setTimeout(() => {
      alert('Vente à terme enregistrée !');
      setIsSubmitting(false);
      navigate('/ventes/terme');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Nouvelle Vente à Terme
        </h1>
        <div className="flex items-center space-x-3">
            <button
                type="submit"
                form="vente-terme-form"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 shadow-sm disabled:opacity-50"
            >
                <FiSave className="-ml-1 mr-2 h-5 w-5" />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <Link
                to="/ventes/terme"
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 shadow-sm"
            >
                Annuler
            </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form id="vente-terme-form" onSubmit={handleSubmit} className="space-y-6">
           {/* Client Field (could be a select with existing clients) */}
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input type="text" name="client" id="client" value={formData.client} onChange={handleChange} placeholder="Nom ou ID du client"
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" required/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Produit Field */}
            <div>
                <label htmlFor="produit" className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <select id="produit" name="produit" value={formData.produit} onChange={handleChange}
                       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer" required>
                   <option value="" disabled>Sélectionner un produit</option>
                   <option value="Super">Super</option>
                   <option value="Gazoil">Gazoil</option>
                   {/* ... more products ... */}
               </select>
            </div>
             {/* Date d'échéance Field */}
            <div>
               <label htmlFor="dateEcheance" className="block text-sm font-medium text-gray-700 mb-1">Date d'Échéance</label>
               <input type="date" name="dateEcheance" id="dateEcheance" value={formData.dateEcheance} onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" required/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quantitée Field */}
            <div>
              <label htmlFor="quantite" className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 100"
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" required/>
            </div>
            {/* Prix Unitaire Field */}
            <div>
                <label htmlFor="prixUnitaire" className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (XAF)</label>
                <input type="number" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire} onChange={handleChange} placeholder="Ex: 700"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" required/>
            </div>
            {/* Montant Total Field (Read-only, calculated) */}
            <div>
                <label htmlFor="montantTotal" className="block text-sm font-medium text-gray-700 mb-1">Montant Total (XAF)</label>
                <input type="text" name="montantTotal" id="montantTotal" value={formData.montantTotal} readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm" />
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optionnel)</label>
            <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Détails supplémentaires sur la vente..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"></textarea>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default VentesTermeFormPage;