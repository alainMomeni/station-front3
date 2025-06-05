// src/page/gerant/GerantSuiviLivraisonsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiCheckSquare, FiAlertCircle, FiEdit, FiPackage, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { BonCommandeData, LigneBonCommande, Fournisseur } from '../../types/achats'; // Adapter le chemin
import { tableConfig } from '../../config/tableConfig';

// --- Données Mock ---
// Réutiliser les fournisseurs et produits
const dummyFournisseurs: Fournisseur[] = [
  { id: 'F001', nom: 'TotalEnergies Distribution' }, { id: 'F002', nom: 'Oilibya Petroleum' }, { id: 'F003', nom: 'Grossiste Lubrifiants Express'}
];

const dummyBonsDeCommandeSoumis: BonCommandeData[] = [
    {
        id: 'BC001',
        fournisseurId: 'F001',
        fournisseurNom: 'TotalEnergies Distribution',
        numeroBC: 'BC-2024-07-001',
        dateCommande: '2024-07-10',
        dateLivraisonSouhaitee: '2024-07-17',
        lignes: [
            { id: 'l1', produitId: 'CARB_SP95', produitNom: 'Essence SP95', quantite: '5000', unite: 'L', prixUnitaireHT: '680' },
            { id: 'l2', produitId: 'CARB_DIESEL', produitNom: 'Diesel', quantite: '8000', unite: 'L', prixUnitaireHT: '650' },
        ],
        statut: 'soumis',
        totalHT: (5000*680) + (8000*650)
    },
    {
        id: 'BC002',
        fournisseurId: 'F003',
        fournisseurNom: 'Grossiste Lubrifiants Express',
        numeroBC: 'BC-2024-07-002',
        dateCommande: '2024-07-12',
        dateLivraisonSouhaitee: '2024-07-19',
        statut: 'partiellement_livre',
        totalHT: (50*12500) + (100*4500),
        numeroBLFournisseur: 'BL-EXT-789',
        dateReceptionEffective: '2024-07-18',
        lignes: [
            { 
                id: 'l3',
                produitId: 'LUB_10W40',
                produitNom: 'Huile Moteur 10W40 (5L)',
                quantite: '50',
                unite: 'Bidon',
                prixUnitaireHT: '12500',
                quantiteRecue: '50'
            },
            { 
                id: 'l4',
                produitId: 'LUB_ATF',
                produitNom: 'Huile Transmission ATF (1L)',
                quantite: '100',
                unite: 'Litre',
                prixUnitaireHT: '4500',
                quantiteRecue: '80',
                notesReceptionLigne: "Manque 20L - En attente reliquat"
            },
        ],
    },
    {
        id: 'BC003',
        fournisseurId: 'F001',
        fournisseurNom: 'TotalEnergies Distribution',
        numeroBC: 'BC-2024-07-003',
        dateCommande: '2024-07-15',
        dateLivraisonSouhaitee: '2024-07-22',
        statut: 'livre',
        dateReceptionEffective: '2024-07-20',
        numeroBLFournisseur: 'BL-TOT-1122',
        lignes: [
            { 
                id: 'l5',
                produitId: 'CARB_SP98',
                produitNom: 'Essence SP98',
                quantite: '3000',
                unite: 'L',
                prixUnitaireHT: '710',
                quantiteRecue: '3000'
            }
        ],
    },
];
// --------------------


const GerantSuiviLivraisonsPage: React.FC = () => {
  const [bonsDeCommande, setBonsDeCommande] = useState<BonCommandeData[]>([]);
  const [selectedBC, setSelectedBC] = useState<BonCommandeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<'soumis' | 'partiellement_livre' | 'tous'>('tous');

  useEffect(() => {
    setIsLoading(true);
    // Simuler le chargement des BC
    // Dans une vraie app, on fetcherait les BC avec statut 'soumis' ou 'partiellement_livre'
    setTimeout(() => {
      const avecNomFournisseur = dummyBonsDeCommandeSoumis.map(bc => ({
          ...bc,
          fournisseurNom: dummyFournisseurs.find(f => f.id === bc.fournisseurId)?.nom || 'Inconnu'
      }));
      setBonsDeCommande(avecNomFournisseur);
      setIsLoading(false);
    }, 700);
  }, []);

  const filteredBC = useMemo(() => {
      if (filtreStatut === 'tous') return bonsDeCommande;
      return bonsDeCommande.filter(bc => bc.statut === filtreStatut);
  }, [bonsDeCommande, filtreStatut]);

  const handleSelectBC = (bc: BonCommandeData) => {
    // Initialiser les quantités reçues à la quantité commandée si c'est la première fois qu'on valide ce BC pour ce BL
    // Ou charger les quantités précédemment saisies si on modifie une validation en brouillon.
    // Pour la démo, si statut "soumis", on pré-remplit, sinon on garde les valeurs (ou on met vide si pas de quantiteRecue)
    const lignesAvecQtRecueInit = bc.lignes.map(l => ({
      ...l,
      quantiteRecue: (bc.statut === 'soumis' || l.quantiteRecue === undefined) ? l.quantite : (l.quantiteRecue || ''),
      numeroLot: l.numeroLot || '',
      datePeremption: l.datePeremption || '',
      notesReceptionLigne: l.notesReceptionLigne || '',
    }));
    setSelectedBC({ ...bc, lignes: lignesAvecQtRecueInit });
    setMessage(null);
  };

  const handleLigneReceptionChange = (ligneId: string, field: keyof LigneBonCommande, value: string) => {
    if (!selectedBC) return;
    const nouvellesLignes = selectedBC.lignes.map(l =>
      l.id === ligneId ? { ...l, [field]: value } : l
    );
    setSelectedBC({ ...selectedBC, lignes: nouvellesLignes });
  };
  
  const handleInfoLivraisonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!selectedBC) return;
      const {name, value} = e.target;
      setSelectedBC(prev => prev ? ({...prev, [name]:value}) : null)
  }

  const handleValiderLivraison = async (validationType: 'partielle' | 'complete') => {
    if (!selectedBC) return;

    // Validation des saisies
    for (const ligne of selectedBC.lignes) {
        if (ligne.quantiteRecue === undefined || ligne.quantiteRecue.trim() === '' || parseFloat(ligne.quantiteRecue) < 0) {
            setMessage({type: 'error', text: `Veuillez saisir une quantité reçue valide (>= 0) pour ${ligne.produitNom}.`});
            return;
        }
         // Optionnel: Vérifier le format des dates de péremption, numéros de lot etc.
    }
    if(!selectedBC.numeroBLFournisseur?.trim() || !selectedBC.dateReceptionEffective) {
        setMessage({type:'error', text: "Veuillez saisir le N° BL Fournisseur et la Date de Réception."});
        return;
    }


    setIsProcessing(true);
    setMessage(null);
    const gmtActuel = {nom: "Utilisateur Gérant"}; // Simulé

    console.log("Validation Livraison:", {
        bcId: selectedBC.id,
        numeroBC: selectedBC.numeroBC,
        numeroBLFournisseur: selectedBC.numeroBLFournisseur,
        dateReceptionEffective: selectedBC.dateReceptionEffective,
        lignesValidees: selectedBC.lignes.map(l => ({
            produitId: l.produitId,
            produitNom: l.produitNom,
            quantiteCommandee: l.quantite,
            quantiteRecue: l.quantiteRecue,
            numeroLot: l.numeroLot,
            datePeremption: l.datePeremption,
            notes: l.notesReceptionLigne
        })),
        notesGlobales: selectedBC.notesLivraisonGlobale,
        valideePar: gmtActuel.nom,
        typeValidation: validationType,
    });

    // TODO: Logique Directus
    // 1. Mettre à jour le BonCommandeData:
    //    - statut (si 'complete' -> 'livre', si 'partielle' -> 'partiellement_livre')
    //    - dateReceptionEffective, numeroBLFournisseur, notesLivraisonGlobale, valideeParId, dateValidation
    //    - Mettre à jour chaque ligne avec quantiteRecue, numeroLot, datePeremption
    // 2. Créer des mouvements de stock (entrées):
    //    - Pour chaque ligne validée, créer un item dans 'mouvements_stock'
    //      avec produitId, quantiteRecue, type='entree_livraison', date, bcId, blId etc.
    // 3. Mettre à Jour les Stocks des Produits concernés (via Flow Directus déclenché par nouveau mouvement_stock)
    //    - produit.quantite_en_stock += quantiteRecue
    //    - Si le produit a gestion de lot/péremption, mettre à jour l'inventaire détaillé.
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mise à jour de l'état local
    setBonsDeCommande(prevBcs => prevBcs.map(bc => 
        bc.id === selectedBC.id 
        ? {...selectedBC, statut: validationType === 'complete' ? 'livre' : 'partiellement_livre'} 
        : bc
    ));
    setSelectedBC(null); // Fermer le détail après validation
    setMessage({type: 'success', text: `Livraison pour BC ${selectedBC.numeroBC} validée (${validationType}) et stocks mis à jour.`});
    setIsProcessing(false);
  };


  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Suivi & Validation des Livraisons
        </h1>
         <div className="w-full rounded-lg bg-white md:w-auto">
            <label htmlFor="filtreStatutBC" className="sr-only">Filtrer par statut BC</label>
            <select id="filtreStatutBC" value={filtreStatut} 
                onChange={e => setFiltreStatut(e.target.value as any)}
                className={`${inputClass} cursor-pointer min-w-[200px]`}>
                <option value="tous">Toutes les livraisons</option>
                <option value="soumis">Attendues (BC Soumis)</option>
                <option value="partiellement_livre">Partiellement Reçues/Validées</option>
            </select>
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

      {!isLoading && filteredBC.length === 0 && (
        <div className="text-center bg-white p-8 rounded-lg shadow text-gray-500">
          Aucun bon de commande en attente de validation ou correspondant à vos filtres.
        </div>
      )}

      {!isLoading && filteredBC.length > 0 && !selectedBC && (
        <div className={tableConfig.container.wrapper}>
          <h2 className="text-md font-semibold text-gray-700 mb-3">Livraisons à traiter / suivre :</h2>
          <div className={tableConfig.container.tableWrapper}>
            <table className={tableConfig.container.table}>
              <thead className={tableConfig.header.wrapper}>
                <tr>
                  <th className={tableConfig.header.cell.base}>N° BC</th>
                  <th className={tableConfig.header.cell.base}>Fournisseur</th>
                  <th className={tableConfig.header.cell.base}>Date Cmd.</th>
                  <th className={tableConfig.header.cell.base}>Liv. Prévue</th>
                  <th className={tableConfig.header.cell.base}>Statut</th>
                  <th className={tableConfig.header.cell.center}>Actions</th>
                </tr>
              </thead>
              <tbody className={tableConfig.body.wrapper}>
                {filteredBC.length > 0 ? (
                  filteredBC.map(bc => (
                    <tr key={bc.id} className={tableConfig.body.row.base}>
                      <td className={tableConfig.body.cell.base}>
                        <span className={tableConfig.body.cell.text.primary}>{bc.numeroBC}</span>
                      </td>
                      <td className={tableConfig.body.cell.base}>
                        {bc.fournisseurNom}
                      </td>
                      <td className={tableConfig.body.cell.base}>
                        {format(new Date(bc.dateCommande + 'T00:00:00'), 'dd/MM/yyyy', {locale:fr})}
                      </td>
                      <td className={tableConfig.body.cell.base}>
                        {bc.dateLivraisonSouhaitee ? format(new Date(bc.dateLivraisonSouhaitee + 'T00:00:00'), 'dd/MM/yyyy', {locale:fr}) : '-'}
                      </td>
                      <td className={tableConfig.body.cell.base}>
                        <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bc.statut === 'soumis' ? 'bg-blue-100 text-blue-800' :
                          bc.statut === 'partiellement_livre' ? 'bg-yellow-100 text-yellow-800' :
                          bc.statut === 'livre' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bc.statut.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className={tableConfig.body.cell.center}>
                        <div className={tableConfig.actions.wrapper}>
                          <button 
                            onClick={() => handleSelectBC(bc)}
                            className={tableConfig.actions.button.edit}
                            title={bc.statut === 'livre' ? "Consulter Détails" : "Valider / Modifier Réception"}
                          >
                            <FiEdit className="mr-1"/> {bc.statut === 'livre' ? "Détails" : "Vérifier"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={tableConfig.empty.wrapper}>
                      Aucune livraison ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Formulaire de Validation de Livraison Détaillé */}
      {selectedBC && (
        <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-xl animate-fadeIn">
           <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-xl font-semibold text-purple-700">
                    Vérification Livraison - BC: {selectedBC.numeroBC}
                </h2>
                <p className="text-sm text-gray-500">Fournisseur: {selectedBC.fournisseurNom}</p>
            </div>
            <button onClick={() => setSelectedBC(null)} className="text-gray-500 hover:text-red-600 p-1">
                <FiXCircle size={20} /> Fermer
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded-md mb-4 flex items-start text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="numeroBLFournisseur" className="block text-xs font-medium text-gray-700 mb-1">N° Bon Livraison Fournisseur <span className="text-red-500">*</span></label>
                <input type="text" name="numeroBLFournisseur" id="numeroBLFournisseur" value={selectedBC.numeroBLFournisseur || ''} onChange={handleInfoLivraisonChange} className={inputClass} disabled={isProcessing || selectedBC.statut === 'livre'}/>
            </div>
            <div>
                <label htmlFor="dateReceptionEffective" className="block text-xs font-medium text-gray-700 mb-1">Date Réception Effective <span className="text-red-500">*</span></label>
                <input type="date" name="dateReceptionEffective" id="dateReceptionEffective" value={selectedBC.dateReceptionEffective || ''} onChange={handleInfoLivraisonChange} className={inputClass} disabled={isProcessing || selectedBC.statut === 'livre'}/>
            </div>
            <div className="md:col-span-2">
                <label htmlFor="scanBL" className="block text-xs font-medium text-gray-700 mb-1">Scan du Bon de Livraison (PDF/Image)</label>
                <input type="file" name="scanBL" id="scanBL" accept=".pdf,image/*" className={`${inputClass} p-0 file:mr-3 file:py-2 file:px-3 file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer`} disabled={isProcessing || selectedBC.statut === 'livre'}/>
                {/* Afficher nom du fichier si déjà uploadé plus tard */}
            </div>
          </div>
          
          <h3 className="text-md font-semibold text-gray-700 mt-5 mb-2">Articles de la Commande:</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-thin">
            {selectedBC.lignes.map(ligne => (
              <div key={ligne.id} className="p-3 border rounded-md bg-gray-50/50">
                <p className="font-medium text-sm text-gray-800">{ligne.produitNom} ({ligne.unite})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-2 mt-1.5 text-xs">
                    <div>
                        <label className="block font-medium text-gray-500">Qté Commandée</label>
                        <input type="text" value={ligne.quantite} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed py-1`} />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-500">Qté Reçue <span className="text-red-500">*</span></label>
                        <input type="number" step="0.01" min="0" value={ligne.quantiteRecue || ''} 
                               onChange={(e) => handleLigneReceptionChange(ligne.id, 'quantiteRecue', e.target.value)} 
                               className={`${inputClass} py-1`} required disabled={isProcessing || selectedBC.statut === 'livre'}/>
                    </div>
                     <div>
                        <label className="block font-medium text-gray-500">N° Lot</label>
                        <input type="text" value={ligne.numeroLot || ''} 
                               onChange={(e) => handleLigneReceptionChange(ligne.id, 'numeroLot', e.target.value)} 
                               className={`${inputClass} py-1`} placeholder="Si applicable" disabled={isProcessing || selectedBC.statut === 'livre'}/>
                    </div>
                    <div>
                        <label className="block font-medium text-gray-500">Date Péremption</label>
                        <input type="date" value={ligne.datePeremption || ''}
                                onChange={(e) => handleLigneReceptionChange(ligne.id, 'datePeremption', e.target.value)} 
                                className={`${inputClass} py-1`} disabled={isProcessing || selectedBC.statut === 'livre'}/>
                    </div>
                    <div className="sm:col-span-2 md:col-span-4">
                         <label className="block font-medium text-gray-500">Notes Ligne</label>
                        <input type="text" value={ligne.notesReceptionLigne || ''}
                            onChange={(e) => handleLigneReceptionChange(ligne.id, 'notesReceptionLigne', e.target.value)}
                            className={`${inputClass} py-1`} placeholder="Écart, état..." disabled={isProcessing || selectedBC.statut === 'livre'} />
                    </div>
                </div>
                { parseFloat(ligne.quantiteRecue || '0') !== parseFloat(ligne.quantite) && ligne.quantiteRecue !== undefined && ligne.quantiteRecue.trim() !== "" &&
                    <p className={`text-xs mt-1.5 p-1 rounded ${parseFloat(ligne.quantiteRecue) < parseFloat(ligne.quantite) ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        Écart constaté: {(parseFloat(ligne.quantiteRecue) - parseFloat(ligne.quantite)).toFixed(2)} {ligne.unite}
                    </p>
                }
              </div>
            ))}
          </div>
            <div className="mt-4">
                <label htmlFor="notesLivraisonGlobale" className="block text-xs font-medium text-gray-700 mb-1">Notes Générales sur la Livraison</label>
                <textarea name="notesLivraisonGlobale" id="notesLivraisonGlobale" value={selectedBC.notesLivraisonGlobale || ''} onChange={handleInfoLivraisonChange} rows={2} className={inputClass} placeholder="État général de la livraison, relation fournisseur..." disabled={isProcessing || selectedBC.statut === 'livre'}></textarea>
            </div>


          {selectedBC.statut !== 'livre' && (
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => handleValiderLivraison('partielle')} disabled={isProcessing}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-yellow-500 text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50">
                    <FiPackage className="mr-2"/>Valider Réception Partielle
                </button>
                <button type="button" onClick={() => handleValiderLivraison('complete')} disabled={isProcessing}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                   {isProcessing ? <Spinner size="sm" color="text-white"/> : <><FiCheckSquare className="mr-2"/>Valider Réception Complète & Mettre à Jour Stock</>}
                </button>
            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
};

export default GerantSuiviLivraisonsPage;