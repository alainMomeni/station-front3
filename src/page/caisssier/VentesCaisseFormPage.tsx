// src/page/caissier/VentesCaisseFormPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiSave } from 'react-icons/fi';
import Spinner from '../../components/Spinner';

// --- Données Mock avec stock ---
const produitsBoutique = [
    { id: 'boutique1', nom: 'Huile Moteur XYZ (1L)', prix: 5000, unite: 'Unité', stockActuel: 15 },
    { id: 'boutique2', nom: 'Filtre à air ABC', prix: 7500, unite: 'Unité', stockActuel: 8 },
    { id: 'boutique3', nom: 'Boisson Gazeuse', prix: 500, unite: 'Unité', stockActuel: 45 },
    { id: 'boutique4', nom: 'Essuie-glace TUV', prix: 12000, unite: 'Paire', stockActuel: 3 },
    { id: 'boutique5', nom: 'Lave-glace (5L)', prix: 3500, unite: 'Bidon', stockActuel: 0 }, // Rupture
];

interface VenteCaisseFormData { /* ... (identique) ... */
  produit: string; quantite: string; prixUnitaire: string; montantTotal: string;
  modePaiement: 'Espèces' | 'Carte' | 'Mobile Money' | 'Autre';
  pointDeVente: string; client?: string; remise?: string; caissier: string;
}

// --- Styles et Helpers (identiques) ---
const labelClass = "block text-sm font-medium text-gray-700 mb-1";
const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
const selectClass = "mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md cursor-pointer";
const readOnlyInputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm";
const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const generateDirectReceiptHtml = (data: VenteCaisseFormData, ventaId: string): string => { /* ... (Code de la fonction inchangé) ... */
    const now = new Date(); const product = produitsBoutique.find(p => p.id === data.produit); const prixUnitaireNum = parseFloat(data.prixUnitaire || '0'); const quantiteNum = parseFloat(data.quantite || '0'); const remiseNum = parseFloat(data.remise || '0'); const montantTotalNum = parseFloat(data.montantTotal || '0'); const subTotal = prixUnitaireNum * quantiteNum; const styles = ` body { font-family: 'Arial', sans-serif; margin: 20px; font-size: 12px; color: #333; } .container { width: 300px; margin: auto; } h2 { text-align: center; margin-bottom: 10px; font-size: 16px; } hr { border: none; border-top: 1px dashed #aaa; margin: 15px 0; } .info p, .item p, .totals p { margin: 3px 0; } .info span, .item span, .totals span { display: inline-block; } .label { font-weight: bold; min-width: 80px;} .item .desc { width: 150px;} .item .qty, .item .price, .item .line-total { width: 50px; text-align: right; } .totals { margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px; } .totals .label { min-width: 150px;} .totals .value { text-align: right; font-weight: bold; width: 100px; } .center { text-align: center; } .small { font-size: 10px; } `; let itemsHtml = ''; if (product) { itemsHtml = ` <div class="item"> <p><span class="desc">${product.nom} (${product.unite})</span></p> <p> <span class="qty"> Qté: ${quantiteNum}</span> <span class="price"> x ${formatCurrency(prixUnitaireNum)}</span> <span class="line-total"> = ${formatCurrency(subTotal)}</span> </p> </div>`; } return ` <!DOCTYPE html> <html> <head> <title>Reçu - ${ventaId}</title> <style>${styles}</style> </head> <body> <div class="container"> <h2>STATION LOGO</h2> <p class="center small">Nom de la station, Adresse, Tél.</p> <hr /> <div class="info"> <p><span class="label">Date:</span> ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p> <p><span class="label">Reçu #:</span> ${ventaId}</p> <p><span class="label">Caissier:</span> ${data.caissier}</p> <p><span class="label">Caisse:</span> ${data.pointDeVente}</p> ${data.client ? `<p><span class="label">Client:</span> ${data.client}</p>` : ''} </div> <hr /> ${itemsHtml} <div class="totals"> ${remiseNum > 0 ? ` <p><span class="label">Sous-total:</span><span class="value">${formatCurrency(subTotal)}</span></p> <p><span class="label">Remise:</span><span class="value">-${formatCurrency(remiseNum)}</span></p> ` : '' } <p><span class="label">TOTAL PAYÉ:</span><span class="value">${formatCurrency(montantTotalNum)}</span></p> <p><span class="label">Mode Paiement:</span><span class="value">${data.modePaiement}</span></p> </div> <hr /> <p class="center">Merci de votre visite !</p> </div> </body> </html> `;
};
// -----------------------------------------------

const VentesCaisseFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VenteCaisseFormData>({ /* ... (initial state identique) ... */
    produit: '', quantite: '', prixUnitaire: '', montantTotal: '',
    modePaiement: 'Espèces', pointDeVente: 'Caisse Principale',
    client: '', remise: '', caissier: 'Jean C.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ** Nouvel état pour le stock du produit sélectionné **
  const [selectedProductStock, setSelectedProductStock] = useState<number | null>(null);
  const [selectedProductUnit, setSelectedProductUnit] = useState<string | null>(null);


  useEffect(() => {
    const selectedProduit = produitsBoutique.find(p => p.id === formData.produit);
    let pu = 0;
    let stock = null;
    let unit = null;

    if (selectedProduit) {
        pu = selectedProduit.prix;
        stock = selectedProduit.stockActuel;
        unit = selectedProduit.unite;
    }
    setSelectedProductStock(stock); // Met à jour le stock affiché
    setSelectedProductUnit(unit);   // Met à jour l'unité affichée avec le stock

    const quantiteNum = parseFloat(formData.quantite);
    const remiseNum = parseFloat(formData.remise || '0');
    let totalNet = 0;
    if (!isNaN(quantiteNum) && pu > 0) { totalNet = (quantiteNum * pu) - remiseNum; }

    setFormData(prev => ({
        ...prev,
        prixUnitaire: selectedProduit ? pu.toString() : '',
        montantTotal: totalNet >= 0 ? totalNet.toFixed(0) : '0'
    }));
  }, [formData.produit, formData.quantite, formData.remise]); // formData.produit en dépendance

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => { /* ... (code handleSubmit identique, avec la logique d'impression) ... */
    e.preventDefault(); setIsSubmitting(true); const currentFormData = { ...formData }; try { await new Promise(resolve => setTimeout(resolve, 1000)); const fakeVenteId = `VC-${Date.now().toString().slice(-5)}`; alert('Vente boutique enregistrée !'); const receiptHtml = generateDirectReceiptHtml(currentFormData, fakeVenteId); const printWindow = window.open('', '_blank', 'height=600,width=400'); if (printWindow) { printWindow.document.open(); printWindow.document.write(receiptHtml); printWindow.document.close(); setTimeout(() => { printWindow.print(); }, 500); } else { alert("Impossible d'ouvrir la fenêtre d'impression. Vérifiez les bloqueurs de popups."); } setIsSubmitting(false); navigate('/caisse/ventes/directes'); } catch (error) { console.error("Erreur lors de l'enregistrement:", error); alert("Erreur lors de l'enregistrement de la vente."); setIsSubmitting(false); }
  };

  return (
    <DashboardLayout>
        {/* Header (identique) */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1"> Nouvelle Vente Boutique </h1>
            <div className="flex items-center space-x-3">
                <button type="submit" form="vente-caisse-form" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 shadow-sm disabled:opacity-50"> <FiSave className="-ml-1 mr-2 h-5 w-5" /> {isSubmitting ? <Spinner size='sm' color='text-white'/> : 'Enregistrer'} </button>
                <Link to="/caisse/ventes/directes" className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 shadow-sm"> Annuler </Link>
            </div>
        </div>
        {/* Formulaire */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form id="vente-caisse-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Ligne Point de vente / Caissier (identique) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="pointDeVente" className={labelClass}>Point de Vente <span className="text-red-500">*</span></label><input type="text" name="pointDeVente" id="pointDeVente" value={formData.pointDeVente} onChange={handleChange} placeholder="Ex: Caisse Principale..." className={inputClass} required /></div>
                    <div><label htmlFor="caissier" className={labelClass}>Caissier</label><input type="text" name="caissier" id="caissier" value={formData.caissier} className={readOnlyInputClass} readOnly /></div>
                </div>

                 {/* Ligne Produit / Quantité - AJOUT affichage stock */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"> {/* items-start pour aligner verticalement si besoin */}
                    <div>
                        <label htmlFor="produit" className={labelClass}>Produit Boutique <span className="text-red-500">*</span></label>
                        <select id="produit" name="produit" value={formData.produit} onChange={handleChange} className={selectClass} required>
                            <option value="" disabled>Sélectionner un produit...</option>
                            {produitsBoutique.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.unite})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantite" className={labelClass}>Quantité <span className="text-red-500">*</span></label>
                        <input type="number" name="quantite" id="quantite" value={formData.quantite} onChange={handleChange} placeholder="Ex: 1" min="1" step="1" className={inputClass} required />
                        {/* ** Affichage du Stock Disponible ** */}
                        {selectedProductStock !== null && (
                            <p className={`text-xs mt-1 ${selectedProductStock <= 0 ? 'text-red-600 font-semibold' : selectedProductStock < 5 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                Stock disponible : {selectedProductStock} {selectedProductUnit || ''}
                            </p>
                        )}
                    </div>
                </div>

                {/* Ligne Prix U / Remise / Total (identique) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label htmlFor="prixUnitaire" className={labelClass}>Prix Unitaire (XAF)</label><input type="text" name="prixUnitaire" id="prixUnitaire" value={formData.prixUnitaire ? formatCurrency(parseFloat(formData.prixUnitaire)) : ''} className={readOnlyInputClass} readOnly /></div>
                    <div><label htmlFor="remise" className={labelClass}>Remise (XAF)</label><input type="number" name="remise" id="remise" value={formData.remise} onChange={handleChange} placeholder="0" min="0" step="1" className={inputClass} /></div>
                    <div><label htmlFor="montantTotal" className={labelClass}>Total à Payer (XAF)</label><input type="text" name="montantTotal" id="montantTotal" value={formatCurrency(parseFloat(formData.montantTotal || '0'))} className={readOnlyInputClass + " font-semibold text-lg"} readOnly /></div>
                 </div>

                 {/* Ligne Paiement / Client (Optionnel) (identique) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label htmlFor="modePaiement" className={labelClass}>Mode de Paiement <span className="text-red-500">*</span></label><select id="modePaiement" name="modePaiement" value={formData.modePaiement} onChange={handleChange} className={selectClass} required><option value="Espèces">Espèces</option><option value="Carte">Carte Bancaire</option><option value="Mobile Money">Mobile Money</option><option value="Autre">Autre</option></select></div>
                    <div><label htmlFor="client" className={labelClass}>Client (Optionnel)</label><input type="text" name="client" id="client" value={formData.client} onChange={handleChange} placeholder="Nom du client si applicable" className={inputClass} /></div>
                 </div>
            </form>
        </div>
    </DashboardLayout>
  );
};

export default VentesCaisseFormPage;