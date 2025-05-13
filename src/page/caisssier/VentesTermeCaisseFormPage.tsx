// src/page/caissier/VentesTermeCaisseFormPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi';
import Spinner from '../../components/Spinner';

// --- Données Mock avec stock ---
const produitsBoutique = [
    { id: 'boutique1', nom: 'Huile Moteur XYZ (1L)', prix: 5000, unite: 'Unité', stockActuel: 15 },
    { id: 'boutique2', nom: 'Filtre à air ABC', prix: 7500, unite: 'Unité', stockActuel: 8 },
    // ... autres produits
];
const clientsDisponibles: any[] = [ /* ... (identique) ... */ ];

interface VenteTermeCaisseFormData { /* ... (identique) ... */
  client: string; produit: string; quantite: string; prixUnitaire: string; montantTotal: string; dateEcheance: string; notes?: string; caissier: string;
}

// --- Styles, Helpers, generateTermReceiptHtml (inchangés par rapport à la demande précédente) ---
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer";
const readOnlyInputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm";
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);
const generateTermReceiptHtml = (data: VenteTermeCaisseFormData, venteId: string): string => { /* ... (Code de la fonction inchangé) ... */
    const now = new Date(); const product = produitsBoutique.find(p => p.id === data.produit); const client = clientsDisponibles.find(c => c.id === data.client); const prixUnitaireNum = parseFloat(data.prixUnitaire || '0'); const quantiteNum = parseFloat(data.quantite || '0'); const montantTotalNum = parseFloat(data.montantTotal || '0'); const styles = ` body { font-family: 'Arial', sans-serif; margin: 20px; font-size: 12px; color: #333; } .container { width: 320px; margin: auto; border: 1px solid #ccc; padding: 15px;} h2, h3 { text-align: center; margin-bottom: 10px; } h2 { font-size: 16px;} h3 {font-size: 14px; text-transform: uppercase;} hr { border: none; border-top: 1px dashed #aaa; margin: 15px 0; } .info p, .item p, .totals p { margin: 4px 0; } .info span, .item span, .totals span { display: inline-block; } .label { font-weight: bold; min-width: 100px;} .item .desc { width: 180px;} .item .qty, .item .price, .item .line-total { width: 60px; text-align: right; } .totals { margin-top: 10px; border-top: 1px solid #ccc; padding-top: 10px; } .totals .label { min-width: 170px;} .totals .value { text-align: right; font-weight: bold; width: 100px; font-size: 14px;} .center { text-align: center; } .small { font-size: 10px; } .signature { margin-top: 30px; border-top: 1px solid #555; padding-top: 5px; text-align:center; font-style: italic;} `; let itemsHtml = ''; if (product) { itemsHtml = ` <div class="item"> <p><strong>Produit:</strong> ${product.nom} (${product.unite})</p> <p> <span class="label">Quantité:</span> ${quantiteNum} <span class="label">PU:</span> ${formatCurrency(prixUnitaireNum)} </p> </div>`; } const dateEcheanceFormatted = data.dateEcheance ? new Date(data.dateEcheance + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric'}) : 'N/A'; return ` <!DOCTYPE html> <html> <head> <title>Bon de Vente à Terme - ${venteId}</title> <style>${styles}</style> </head> <body> <div class="container"> <h2>STATION LOGO</h2> <h3>Bon de Vente à Terme #${venteId}</h3> <p class="center small">Date création: ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p> <hr /> <div class="info"> <p><span class="label">Client:</span> <strong>${client?.nom || data.client}</strong></p> <p><span class="label">Caissier:</span> ${data.caissier}</p> ${data.notes ? `<p><span class="label">Notes:</span> ${data.notes}</p>` : ''} </div> <hr /> ${itemsHtml} <hr /> <div class="totals"> <p><span class="label">TOTAL À PAYER:</span><span class="value">${formatCurrency(montantTotalNum)}</span></p> <p><span class="label">Date d'échéance:</span><span class="value" style="font-size:12px;">${dateEcheanceFormatted}</span></p> </div> <div class="signature"> Signature Client / Cachet </div> </div> </body> </html> `;
};
// -----------------------------------------------

const VentesTermeCaisseFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteTermeCaisseFormData>({ /* ... (identique) ... */
    client: '', produit: '', quantite: '', prixUnitaire: '', montantTotal: '', dateEcheance: '', notes: '', caissier: 'Jean C.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** Nouvel état pour le stock du produit sélectionné **
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);
  const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(null);

  const calculateTotal = () => {
      const selectedProduit = produitsBoutique.find(p => p.id === formData.produit);
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
       calculateTotal();
   }, [formData.produit, formData.quantite]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { /* ... (identique) ... */
    const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => { /* ... (identique, avec impression) ... */
     e.preventDefault(); setIsSubmitting(true); const currentFormData = { ...formData }; try { await new Promise(resolve => setTimeout(resolve, 1000)); const fakeVenteId = `VTC-${Date.now().toString().slice(-5)}`; alert('Vente à terme boutique enregistrée !'); const receiptHtml = generateTermReceiptHtml(currentFormData, fakeVenteId); const printWindow = window.open('', '_blank', 'height=600,width=450'); if (printWindow) { printWindow.document.open(); printWindow.document.write(receiptHtml); printWindow.document.close(); setTimeout(() => { printWindow.print(); }, 500); } else { alert("Impossible d'ouvrir la fenêtre d'impression. Vérifiez les bloqueurs de popups."); } setIsSubmitting(false); navigate('/caisse/ventes/terme'); } catch (error) { console.error("Erreur lors de l'enregistrement:", error); alert("Erreur lors de l'enregistrement de la vente à terme."); setIsSubmitting(false); }
  };

  return (
    <DashboardLayout>
        {/* Header (identique) */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1"> Nouvelle Vente à Terme (Boutique) </h1>
            <div className="flex items-center space-x-3">
                <button type="submit" form="vente-terme-caisse-form" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm disabled:opacity-50"> <FiSave className="-ml-1 mr-2 h-5 w-5" /> {isSubmitting ? <Spinner size='sm' color='text-white'/> : 'Enregistrer'} </button>
                <Link to="/caisse/ventes/terme" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 shadow-sm"> Annuler </Link>
            </div>
        </div>
        {/* Formulaire */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form id="vente-terme-caisse-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Client Select (identique) */}
                <div> <label htmlFor="client" className={labelClass}>Client <span className="text-red-500">*</span></label> <select id="client" name="client" value={formData.client} onChange={handleChange} className={selectClass} required><option value="" disabled>Sélectionner un client...</option>{clientsDisponibles.map(c => (<option key={c.id} value={c.id}>{c.nom}</option>))}</select> </div>

                {/* Produit / Date Echeance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label htmlFor="produit" className={labelClass}>Produit Boutique <span className="text-red-500">*</span></label>
                        <select id="produit" name="produit" value={formData.produit} onChange={handleChange} className={selectClass} required>
                            <option value="" disabled>Sélectionner un produit...</option>
                            {produitsBoutique.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.unite})</option>)}
                        </select>
                         {/* ** Affichage Stock ici aussi (adapté pour structure Produit / Quantité séparée) ** */}
                        {formData.produit && selectedProductStock !== null && (
                            <p className={`text-xs mt-1 ${selectedProductStock <= 0 ? 'text-red-600 font-semibold' : selectedProductStock < 5 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                Stock actuel : {selectedProductStock} {selectedProductUnit || ''}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="dateEcheance" className={labelClass}>Date d'Échéance <span className="text-red-500">*</span></label>
                        <input type="date" name="dateEcheance" id="dateEcheance" value={formData.dateEcheance} onChange={handleChange} className={inputClass} required/>
                    </div>
                </div>

                {/* Quantité / PU / Total */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="quantite" className={labelClass}>Quantité <span className="text-red-500">*</span></label>
                        <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 5" min="1" step="1" className={inputClass} required/>
                    </div>
                    <div><label htmlFor="prixUnitaire" className={labelClass}>Prix Unitaire (XAF)</label> <input type="text" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire ? formatCurrency(parseFloat(formData.prixUnitaire)): ''} className={readOnlyInputClass} readOnly /> </div>
                    <div><label htmlFor="montantTotal" className={labelClass}>Montant Total (XAF)</label> <input type="text" name="montantTotal" id="montantTotal" value={formData.montantTotal ? formatCurrency(parseFloat(formData.montantTotal)) : ''} readOnly className={readOnlyInputClass + " font-semibold text-lg"} /> </div>
                </div>
                {/* Caissier (Info) / Notes (Optionnel) (identique) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div> <label htmlFor="caissier" className={labelClass}>Caissier</label> <input type="text" name="caissier" id="caissier" value={formData.caissier} className={readOnlyInputClass} readOnly /> </div>
                    <div> <label htmlFor="notes" className={labelClass}>Notes (Optionnel)</label> <textarea name="notes" id="notes" rows={1} value={formData.notes} onChange={handleChange} placeholder="Référence Bon Commande, etc." className={inputClass + " pt-2"}></textarea> </div>
                </div>
            </form>
        </div>
    </DashboardLayout>
  );
};

export default VentesTermeCaisseFormPage;