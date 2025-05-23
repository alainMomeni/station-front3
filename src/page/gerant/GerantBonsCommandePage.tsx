// src/page/gerant/GerantBonsCommandePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiFileText, FiPlusCircle, FiTrash2, FiSave, FiAlertCircle } from 'react-icons/fi';
import { format, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des ID uniques pour les lignes
import type { Fournisseur, ProduitSimple, LigneBonCommande, BonCommandeData } from '../../types/achats'; // Assurez-vous que le chemin est correct

// --- Données Mock ---
const dummyFournisseurs: Fournisseur[] = [
  { id: 'F001', nom: 'TotalEnergies Distribution', email: 'commandes@total.com' },
  { id: 'F002', nom: 'Oilibya Petroleum', email: 'sales@oilibya.biz' },
  { id: 'F003', nom: 'Grossiste Lubrifiants Express', email: 'contact@lubexpress.com' },
  { id: 'F004', nom: 'Centrale Achat Boutique', email: 'achats@centraleboutique.net' },
];

const dummyProduits: ProduitSimple[] = [
  { id: 'CARB_SP95', nom: 'Essence SP95', type: 'carburant', uniteMesure: 'L', prixAchatDefault: 680 },
  { id: 'CARB_DIESEL', nom: 'Diesel', type: 'carburant', uniteMesure: 'L', prixAchatDefault: 650 },
  { id: 'CARB_SP98', nom: 'Essence SP98', type: 'carburant', uniteMesure: 'L', prixAchatDefault: 710 },
  { id: 'LUB_10W40', nom: 'Huile Moteur 10W40 (5L)', type: 'lubrifiant', uniteMesure: 'Bidon', prixAchatDefault: 12500 },
  { id: 'LUB_ATF', nom: 'Huile Transmission ATF (1L)', type: 'lubrifiant', uniteMesure: 'Litre', prixAchatDefault: 4500 },
  { id: 'BOUT_EAU', nom: 'Eau Minérale 1.5L', type: 'boutique', uniteMesure: 'Pack de 6', prixAchatDefault: 1200 },
  { id: 'BOUT_CHIPS', nom: 'Chips Paprika Gr.Paquet', type: 'boutique', uniteMesure: 'Carton de 12', prixAchatDefault: 4800 },
];
// --------------------


const GerantBonsCommandePage: React.FC = () => {
  const [bcData, setBcData] = useState<BonCommandeData>({
    fournisseurId: '',
    dateCommande: format(new Date(), 'yyyy-MM-dd'),
    dateLivraisonSouhaitee: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    numeroBC: `BC-${Date.now().toString().slice(-6)}`, // BC temporaire
    lignes: [],
    statut: 'brouillon',
  });
  const [isLoading, setIsLoading] = useState(false); // Pour le chargement des fournisseurs/produits
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produitsDisponibles, setProduitsDisponibles] = useState<ProduitSimple[]>([]);

  useEffect(() => {
    // Simuler le chargement initial des données
    setIsLoading(true);
    setFournisseurs(dummyFournisseurs);
    setProduitsDisponibles(dummyProduits);
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBcData(prev => ({ ...prev, [name]: value }));
    setSubmitStatus(null);
  };

  const handleLigneChange = (ligneId: string, field: keyof LigneBonCommande, value: string) => {
    setBcData(prev => ({
      ...prev,
      lignes: prev.lignes.map(ligne => {
        if (ligne.id === ligneId) {
          const updatedLigne = { ...ligne, [field]: value };
          // Recalculer montantLigneHT si quantité ou prixUnitaireHT change
          if (field === 'quantite' || field === 'prixUnitaireHT') {
            const qte = parseFloat(updatedLigne.quantite);
            const pu = parseFloat(updatedLigne.prixUnitaireHT);
            if (!isNaN(qte) && !isNaN(pu)) {
              updatedLigne.montantLigneHT = parseFloat((qte * pu).toFixed(2));
            } else {
              updatedLigne.montantLigneHT = 0;
            }
          }
          return updatedLigne;
        }
        return ligne;
      })
    }));
    setSubmitStatus(null);
  };
  
  const handleProduitSelectChange = (ligneId: string, selectedProduitId: string) => {
    const produitSelectionne = produitsDisponibles.find(p => p.id === selectedProduitId);
    if (produitSelectionne) {
        setBcData(prev => ({
            ...prev,
            lignes: prev.lignes.map(ligne =>
                ligne.id === ligneId ? {
                    ...ligne,
                    produitId: produitSelectionne.id,
                    produitNom: produitSelectionne.nom,
                    unite: produitSelectionne.uniteMesure,
                    prixUnitaireHT: produitSelectionne.prixAchatDefault?.toString() || '',
                    // Recalculer montantLigneHT avec le nouveau prix
                    montantLigneHT: (parseFloat(ligne.quantite || '0') * (produitSelectionne.prixAchatDefault || 0))
                } : ligne
            )
        }));
    }
  };


  const ajouterLigne = () => {
    const nouvelleLigne: LigneBonCommande = {
      id: uuidv4(), // Génère un ID unique temporaire
      produitId: '',
      produitNom: '',
      quantite: '1',
      unite: '',
      prixUnitaireHT: '',
      montantLigneHT: 0,
    };
    setBcData(prev => ({ ...prev, lignes: [...prev.lignes, nouvelleLigne] }));
    setSubmitStatus(null);
  };

  const supprimerLigne = (ligneId: string) => {
    setBcData(prev => ({ ...prev, lignes: prev.lignes.filter(ligne => ligne.id !== ligneId) }));
    setSubmitStatus(null);
  };
  
  const totalHTCommande = useMemo(() => {
      return bcData.lignes.reduce((total, ligne) => total + (ligne.montantLigneHT || 0), 0);
  }, [bcData.lignes]);


  const handleSubmitBonCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcData.fournisseurId) {
        setSubmitStatus({type: 'error', message: "Veuillez sélectionner un fournisseur."});
        return;
    }
    if (bcData.lignes.length === 0) {
        setSubmitStatus({type: 'error', message: "Veuillez ajouter au moins un article au bon de commande."});
        return;
    }
    for (const ligne of bcData.lignes) {
        if (!ligne.produitId || !ligne.quantite || !ligne.prixUnitaireHT || 
            parseFloat(ligne.quantite) <=0 || parseFloat(ligne.prixUnitaireHT) < 0 ) {
            setSubmitStatus({type: 'error', message: `Veuillez compléter toutes les informations (Produit, Qté > 0, Prix U. >= 0) pour la ligne concernant "${ligne.produitNom || 'Nouvel article'}".`});
            return;
        }
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    const dataFinalisee = {
        ...bcData,
        totalHT: totalHTCommande,
        // Vous pouvez ajouter ici le totalTTC si vous gérez la TVA
        numeroBC: bcData.numeroBC || `BC-${Date.now().toString().slice(-6)}` // Assurer un N° BC
    };
    console.log("Bon de Commande à soumettre:", dataFinalisee);

    // TODO: Appel API vers Directus pour créer un item dans la collection 'bons_commande'
    // Les 'lignes' seraient une relation M2M ou une collection de répétiteurs (Repeaters) dans Directus.
    // Ou une collection séparée 'lignes_bons_commande' avec une relation M2O vers 'bons_commande'.
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitStatus({type: 'success', message: `Bon de commande ${dataFinalisee.numeroBC} enregistré avec succès!`});
    // Réinitialiser le formulaire
    setBcData({
        fournisseurId: '',
        dateCommande: format(new Date(), 'yyyy-MM-dd'),
        dateLivraisonSouhaitee: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        numeroBC: `BC-${Date.now().toString().slice(-6)}`,
        lignes: [],
        statut: 'brouillon',
    });
    setIsSubmitting(false);
  };

  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";

  if (isLoading) {
    return <DashboardLayout><div className="flex justify-center items-center py-20"><Spinner size="lg" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          <FiFileText className="inline-block mr-2 mb-1 h-6 w-6" /> Créer un Bon de Commande
        </h1>
      </div>

      <form onSubmit={handleSubmitBonCommande} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        {submitStatus && (
          <div className={`p-3 rounded-md mb-6 flex items-center text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            {submitStatus.message}
          </div>
        )}

        {/* Informations Générales */}
        <fieldset className="mb-6 border border-gray-200 p-4 rounded-md">
            <legend className="text-sm font-medium text-purple-700 px-2">Informations Générales</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <div>
                    <label htmlFor="fournisseurId" className="block text-xs font-medium text-gray-700 mb-1">Fournisseur <span className="text-red-500">*</span></label>
                    <select id="fournisseurId" name="fournisseurId" value={bcData.fournisseurId} onChange={handleInputChange} className={inputClass + " cursor-pointer"} required>
                        <option value="" disabled>-- Sélectionner Fournisseur --</option>
                        {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="numeroBC" className="block text-xs font-medium text-gray-700 mb-1">N° Bon de Commande</label>
                    <input type="text" id="numeroBC" name="numeroBC" value={bcData.numeroBC} onChange={handleInputChange} className={inputClass} placeholder="Ex: BC-2024-001"/>
                </div>
                <div>
                    <label htmlFor="referenceFournisseur" className="block text-xs font-medium text-gray-700 mb-1">Référence Fournisseur</label>
                    <input type="text" id="referenceFournisseur" name="referenceFournisseur" value={bcData.referenceFournisseur || ''} onChange={handleInputChange} className={inputClass} placeholder="Ex: PROFORMA-123"/>
                </div>
                <div>
                    <label htmlFor="dateCommande" className="block text-xs font-medium text-gray-700 mb-1">Date Commande <span className="text-red-500">*</span></label>
                    <input type="date" id="dateCommande" name="dateCommande" value={bcData.dateCommande} onChange={handleInputChange} className={inputClass} required/>
                </div>
                <div>
                    <label htmlFor="dateLivraisonSouhaitee" className="block text-xs font-medium text-gray-700 mb-1">Date Livraison Souhaitée</label>
                    <input type="date" id="dateLivraisonSouhaitee" name="dateLivraisonSouhaitee" value={bcData.dateLivraisonSouhaitee || ''} onChange={handleInputChange} className={inputClass} />
                </div>
            </div>
             <div className="mt-4">
                <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">Notes Générales</label>
                <textarea id="notes" name="notes" value={bcData.notes || ''} onChange={handleInputChange} rows={2} className={inputClass + " text-sm"} placeholder="Conditions spéciales, contact livraison..."></textarea>
            </div>
        </fieldset>

        {/* Lignes d'Articles */}
        <fieldset className="mb-6 border border-gray-200 p-4 rounded-md">
             <legend className="text-sm font-medium text-purple-700 px-2">Articles Commandés</legend>
            {bcData.lignes.map((ligne, index) => (
                <div key={ligne.id} className={`py-3 ${index > 0 ? 'border-t border-gray-100 mt-3' : ''}`}>
                    <div className="grid grid-cols-12 gap-x-3 gap-y-2 items-end">
                        <div className="col-span-12 sm:col-span-4 md:col-span-4">
                            <label htmlFor={`produit-${ligne.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">Produit/Carburant <span className="text-red-500">*</span></label>
                            <select id={`produit-${ligne.id}`} value={ligne.produitId} onChange={(e) => handleProduitSelectChange(ligne.id, e.target.value)} className={inputClass + " cursor-pointer text-xs sm:text-sm py-1.5 sm:py-2"} required>
                                <option value="" disabled>Choisir...</option>
                                {produitsDisponibles.map(p => <option key={p.id} value={p.id}>{p.nom} ({p.type})</option>)}
                            </select>
                        </div>
                        <div className="col-span-4 sm:col-span-2 md:col-span-2">
                            <label htmlFor={`qte-${ligne.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">Qté <span className="text-red-500">*</span></label>
                            <input type="number" id={`qte-${ligne.id}`} value={ligne.quantite} onChange={(e) => handleLigneChange(ligne.id, 'quantite', e.target.value)} step="0.01" min="0.01" className={inputClass + " text-xs sm:text-sm py-1.5 sm:py-2"} required/>
                        </div>
                        <div className="col-span-4 sm:col-span-2 md:col-span-1">
                            <label htmlFor={`unite-${ligne.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">Unité</label>
                            <input type="text" id={`unite-${ligne.id}`} value={ligne.unite} readOnly className={inputClass + " bg-gray-100 text-xs sm:text-sm py-1.5 sm:py-2"}/>
                        </div>
                        <div className="col-span-4 sm:col-span-2 md:col-span-2">
                            <label htmlFor={`pu-${ligne.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">P.U. HT <span className="text-red-500">*</span></label>
                            <input type="number" id={`pu-${ligne.id}`} value={ligne.prixUnitaireHT} onChange={(e) => handleLigneChange(ligne.id, 'prixUnitaireHT', e.target.value)} step="0.01" min="0" className={inputClass + " text-xs sm:text-sm py-1.5 sm:py-2"} required/>
                        </div>
                        <div className="col-span-10 sm:col-span-3 md:col-span-2">
                             <label className="block text-xs font-medium text-gray-700 mb-0.5">Montant Ligne HT</label>
                            <input type="text" value={(ligne.montantLigneHT || 0).toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) + ' XAF'} readOnly className={inputClass + " bg-gray-100 font-semibold text-xs sm:text-sm py-1.5 sm:py-2"}/>
                        </div>
                        <div className="col-span-2 sm:col-span-1 md:col-span-1 flex items-end justify-end sm:justify-start">
                             <button type="button" onClick={() => supprimerLigne(ligne.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Supprimer la ligne">
                                <FiTrash2 size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="mt-4 text-left">
                <button type="button" onClick={ajouterLigne} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                    <FiPlusCircle className="mr-2 h-4 w-4" /> Ajouter un Article
                </button>
            </div>
        </fieldset>

        {/* Récapitulatif & Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-right md:text-left w-full md:w-auto">
                 <p className="text-sm text-gray-600">Total Articles HT:</p>
                 <p className="text-2xl font-bold text-purple-700">
                    {totalHTCommande.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits:0 })}
                 </p>
                {/* Ajouter Total TVA et Total TTC si nécessaire */}
            </div>
            <div className="w-full md:w-auto">
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                {isSubmitting ? <Spinner size="sm" color="text-white" /> : (
                    <>
                    <FiSave className="mr-2 h-5 w-5" /> Enregistrer le Bon de Commande
                    </>
                )}
                </button>
            </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default GerantBonsCommandePage;