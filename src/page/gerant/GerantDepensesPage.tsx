// src/page/gerant/GerantDepensesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiPlusCircle, FiEdit, FiTrash2, FiFilter, FiAlertCircle, FiX, FiPaperclip } from 'react-icons/fi';
import { format, subDays, startOfMonth } from 'date-fns';
import type { DepenseData, CategorieDepense } from '../../types/finance'; // Adapter chemin
import DepenseFormModal from '../../components/modals/DepenseFormModal'; // Import du modal
import { v4 as uuidv4 } from 'uuid';

// --- Données Mock ---
const dummyCategoriesDepense: CategorieDepense[] = [
  { id: 'CAT_SAL', nom: 'Salaires & Charges Sociales' }, { id: 'CAT_MAINT', nom: 'Maintenance & Réparations' },
  { id: 'CAT_ACH_FOURN', nom: 'Achats Fournitures (Bureau, Entretien)' }, { id: 'CAT_LOYER', nom: 'Loyer & Charges Locatives' },
  { id: 'CAT_ENERGIE', nom: 'Électricité & Eau' }, { id: 'CAT_CARB_SERV', nom: 'Carburant de Service/Groupe' },
  { id: 'CAT_MARK', nom: 'Marketing & Publicité' }, { id: 'CAT_FRAIS_B', nom: 'Frais Bancaires & Financiers' },
  { id: 'CAT_TAXES', nom: 'Impôts & Taxes' }, { id: 'CAT_DIVERS', nom: 'Frais Divers d\'Exploitation' },
];

const dummyDepenses: DepenseData[] = [
  { id: uuidv4(), dateDepense: format(subDays(new Date(), 2), 'yyyy-MM-dd'), description: 'Réparation pompe N°3 - Remplacement joint', montant: 150000, categorieId: 'CAT_MAINT', fournisseurBeneficiaire: 'TechniService SARL', modePaiement: 'cheque', referencePaiement: 'CHQ00123', pieceJointeNom: 'fact_techserv_123.pdf'},
  { id: uuidv4(), dateDepense: format(subDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Achat ramettes papier A4 et stylos', montant: 25000, categorieId: 'CAT_ACH_FOURN', fournisseurBeneficiaire: 'Papeterie Moderne', modePaiement: 'especes'},
  { id: uuidv4(), dateDepense: format(startOfMonth(new Date()), 'yyyy-MM-dd'), description: 'Paiement Salaires Juillet 2024', montant: 2500000, categorieId: 'CAT_SAL', modePaiement: 'virement_bancaire', referencePaiement: 'VIR_SAL_JUL24'},
  { id: uuidv4(), dateDepense: format(subDays(new Date(), 10), 'yyyy-MM-dd'), description: 'Facture électricité SENELEC - Juin 2024', montant: 375000, categorieId: 'CAT_ENERGIE', fournisseurBeneficiaire: 'SENELEC', modePaiement: 'mobile_money_entreprise', pieceJointeNom: 'fact_sen_juin.png'},
];
// --------------------

const modesPaiementOptions = [
  { value: 'especes', label: 'Espèces' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'virement_bancaire', label: 'Virement Bancaire' },
  { value: 'mobile_money_entreprise', label: 'Mobile Money' },
];

const GerantDepensesPage: React.FC = () => {
  const [depenses, setDepenses] = useState<DepenseData[]>([]);
  const [categories] = useState<CategorieDepense[]>(dummyCategoriesDepense); // Fixe pour la démo
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [depenseEnEdition, setDepenseEnEdition] = useState<DepenseData | null>(null);
  const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

  // Filtres
  const [filtreDateDebut, setFiltreDateDebut] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [filtreDateFin, setFiltreDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filtreCategorieId, setFiltreCategorieId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    // Simuler le chargement
    setTimeout(() => {
      const enrichedDepenses = dummyDepenses.map(d => ({
        ...d,
        categorieNom: categories.find(c => c.id === d.categorieId)?.nom || 'Inconnue'
      }));
      setDepenses(enrichedDepenses);
      setIsLoading(false);
    }, 700);
  }, [categories]); // Recharger si les catégories changent (peu probable pour la démo)

  const filteredDepenses = useMemo(() => {
    return depenses
      .filter(d => {
        const dateD = new Date(d.dateDepense + 'T00:00:00'); // Assurer la comparaison correcte
        const dateDebutOk = !filtreDateDebut || dateD >= new Date(filtreDateDebut + 'T00:00:00');
        const dateFinOk = !filtreDateFin || dateD <= new Date(filtreDateFin + 'T23:59:59');
        return dateDebutOk && dateFinOk;
      })
      .filter(d => filtreCategorieId === '' || d.categorieId === filtreCategorieId)
      .filter(d => 
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.fournisseurBeneficiaire && d.fournisseurBeneficiaire.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.referencePaiement && d.referencePaiement.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a,b) => new Date(b.dateDepense).getTime() - new Date(a.dateDepense).getTime());
  }, [depenses, filtreDateDebut, filtreDateFin, filtreCategorieId, searchTerm]);
  
  const totalDepensesFiltrees = useMemo(() => 
    filteredDepenses.reduce((sum, d) => sum + d.montant, 0)
  , [filteredDepenses]);

  const handleOpenModal = (depense?: DepenseData) => {
    setActionStatus(null);
    setDepenseEnEdition(depense || null);
    setShowModal(true);
  };

  const handleSaveDepense = async (
    data: Omit<DepenseData, 'id' | 'enregistreParId' | 'pieceJointeUrl' | 'pieceJointeNom' | 'categorieNom'>, 
    pieceJointeFichier?: File | null
  ) => {
    const gmtActuelId = "GERANT_ID_001"; // Simulé
    
    console.log("Sauvegarde dépense:", data, "Fichier:", pieceJointeFichier?.name);
    // TODO: Logique Directus pour l'upload de fichier puis création/update de l'item
    // Si pieceJointeFichier existe, uploader vers /files, récupérer l'ID du fichier Directus
    // const uploadedFileId = await uploadFileToDirectus(pieceJointeFichier);
    // const pieceJointeUrl = `/assets/${uploadedFileId}`;
    // const pieceJointeNom = pieceJointeFichier.name;
    
    let message = "";
    if(depenseEnEdition && depenseEnEdition.id) { // Modification
        const updatedDepense = {
            ...depenseEnEdition, ...data, 
            categorieNom: categories.find(c=>c.id === data.categorieId)?.nom,
            // pieceJointeUrl: uploadedFileId ? pieceJointeUrl : depenseEnEdition.pieceJointeUrl, // Garder l'ancien si pas de nouveau
            // pieceJointeNom: pieceJointeFichier ? pieceJointeNom : depenseEnEdition.pieceJointeNom,
        };
        setDepenses(prev => prev.map(d => d.id === updatedDepense.id ? updatedDepense : d));
        message = `Dépense "${updatedDepense.description}" modifiée.`;
    } else { // Ajout
        const nouvelleDepense: DepenseData = {
            id: uuidv4(), ...data, enregistreParId: gmtActuelId,
            categorieNom: categories.find(c=>c.id === data.categorieId)?.nom,
            // pieceJointeUrl: uploadedFileId ? pieceJointeUrl : undefined,
            // pieceJointeNom: pieceJointeFichier ? pieceJointeNom : undefined,
        };
        setDepenses(prev => [nouvelleDepense, ...prev]);
        message = `Nouvelle dépense "${nouvelleDepense.description}" enregistrée.`;
    }
    setActionStatus({type:'success', message});
    setShowModal(false);
  };
  
  const handleDeleteDepense = (depenseId: string) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) {
        setDepenses(prev => prev.filter(d => d.id !== depenseId));
        const nomDepense = depenses.find(d=>d.id === depenseId)?.description;
        setActionStatus({type:'success', message:`Dépense "${nomDepense || depenseId}" supprimée.`});
    }
  }

  const formatCurrency = (val: number) => val.toLocaleString('fr-FR', {style:'currency', currency:'XAF', minimumFractionDigits:0});
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";


  return (
    <DashboardLayout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                 Gestion des Dépenses
            </h1>
            <button onClick={() => handleOpenModal()} 
                className="btn-primary-sm inline-flex items-center shrink-0">
                <FiPlusCircle className="mr-2 h-4 w-4"/> Nouvelle Dépense
            </button>
        </div>
        
        {actionStatus && (
            <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {actionStatus.message}
                 <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"> <FiX size={16}/> </button>
            </div>
        )}

        {/* Filtres */}
        <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col lg:flex-row gap-3 items-center flex-wrap">
            <FiFilter className="h-5 w-5 text-gray-400 shrink-0 hidden lg:block"/>
            <input type="date" value={filtreDateDebut} onChange={e => setFiltreDateDebut(e.target.value)} className={inputClass + " lg:w-auto"}/>
            <span className="text-gray-500 hidden lg:inline">à</span>
            <input type="date" value={filtreDateFin} onChange={e => setFiltreDateFin(e.target.value)} className={inputClass + " lg:w-auto"}/>
            <select value={filtreCategorieId} onChange={e => setFiltreCategorieId(e.target.value)} className={`${inputClass} cursor-pointer lg:w-auto flex-grow lg:flex-grow-0`}>
                <option value="">Toutes les Catégories</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
            </select>
            <input type="text" placeholder="Rechercher (description, fournisseur...)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputClass} flex-grow`}/>
        </div>

        {/* Tableau */}
        <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="th-class">Date</th>
                            <th className="th-class">Description</th>
                            <th className="th-class hidden md:table-cell">Catégorie</th>
                            <th className="th-class text-right">Montant (XAF)</th>
                            <th className="th-class hidden sm:table-cell">Fournisseur/Bénéf.</th>
                            <th className="th-class hidden lg:table-cell">Mode Paiement</th>
                            <th className="th-class text-center">PJ</th>
                            <th className="th-class text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan={8} className="text-center py-10"><Spinner /></td></tr>
                    ) : filteredDepenses.length > 0 ? filteredDepenses.map(d => (
                        <tr key={d.id} className="hover:bg-purple-50/20">
                            <td className="px-3 py-2.5 whitespace-nowrap">{format(new Date(d.dateDepense+'T00:00:00'), 'dd/MM/yy')}</td>
                            <td className="px-3 py-2.5">
                                <div className="font-medium text-gray-800">{d.description}</div>
                                {d.referencePaiement && <div className="text-xs text-gray-400">Réf: {d.referencePaiement}</div>}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap hidden md:table-cell">{d.categorieNom}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-right font-semibold">{formatCurrency(d.montant)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap hidden sm:table-cell">{d.fournisseurBeneficiaire || '-'}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap hidden lg:table-cell">{modesPaiementOptions.find(m=>m.value === d.modePaiement)?.label || d.modePaiement}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center">
                                {d.pieceJointeNom ? <a href={d.pieceJointeUrl || '#'} target="_blank" rel="noopener noreferrer" title={d.pieceJointeNom}><FiPaperclip className="text-blue-500 hover:text-blue-700"/></a> : '-'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center space-x-2">
                                <button onClick={() => handleOpenModal(d)} className="text-indigo-600 hover:text-indigo-800" title="Modifier"><FiEdit size={16}/></button>
                                <button onClick={() => handleDeleteDepense(d.id)} className="text-red-500 hover:text-red-700" title="Supprimer"><FiTrash2 size={16}/></button>
                            </td>
                        </tr>
                    )) : (
                         <tr><td colSpan={8} className="text-center py-10 text-gray-500 italic">Aucune dépense enregistrée ou ne correspond aux filtres.</td></tr>
                    )}
                    </tbody>
                     {filteredDepenses.length > 0 && (
                        <tfoot className="bg-gray-100">
                            <tr className="font-bold text-gray-700">
                                <td className="px-3 py-2 text-left uppercase" colSpan={3}>Total Dépenses Filtrées</td>
                                <td className="px-3 py-2 text-right text-lg">{formatCurrency(totalDepensesFiltrees)}</td>
                                <td className="px-3 py-2" colSpan={4}></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>

        <DepenseFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSaveDepense}
            depenseInitiale={depenseEnEdition}
            categoriesDepense={categories}
        />
    </DashboardLayout>
  );
};
// Ajout de styles globaux (peuvent être dans App.css ou un fichier CSS dédié)
// .th-class { @apply px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
export default GerantDepensesPage;