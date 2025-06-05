// src/page/gerant/GerantMargesPage.tsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiCalendar, FiFilter, FiDollarSign, FiInfo, FiAlertCircle, FiPlayCircle } from 'react-icons/fi';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import type { RapportMargesResultat, LigneAnalyseMarge, ProduitOuCarburantPourFiltre } from '../../types/finance'; // Adapter chemin

// Données simulées pour les produits de stock
const dummyProduitsStock = [
  { id: 'SP95', nom: 'Essence SP95', typeProduit: 'carburant' },
  { id: 'DIESEL', nom: 'Diesel', typeProduit: 'carburant' },
  { id: 'GASOIL', nom: 'Gasoil', typeProduit: 'carburant' },
  { id: 'LUB_5L', nom: 'Huile Moteur Super Lub (5L)', typeProduit: 'lubrifiant' },
  { id: 'LUB_1L', nom: 'Huile Moteur Standard (1L)', typeProduit: 'lubrifiant' },
  { id: 'LUB_TRANS', nom: 'Huile de Transmission', typeProduit: 'lubrifiant' },
  { id: 'BOUT_EAU', nom: 'Eau Minérale 1.5L', typeProduit: 'boutique' },
  { id: 'BOUT_SNACK', nom: 'Barre Chocolatée Max', typeProduit: 'boutique' },
  { id: 'BOUT_CAFE', nom: 'Café Express', typeProduit: 'boutique' },
  { id: 'BOUT_PAIN', nom: 'Pain de Mie', typeProduit: 'boutique' },
  { id: 'ACC_BALAI', nom: 'Balai Essuie-Glace', typeProduit: 'boutique' }, // Regroupé avec boutique
  { id: 'ACC_AMPOULE', nom: 'Ampoule H7', typeProduit: 'boutique' }, // Regroupé avec boutique
];

// Mock de la fonction qui générerait le rapport de marges
const genererRapportMargesSimule = async (
  dateDebut: string,
  dateFin: string,
  filtreProduitId?: string // Peut être ID produit, carburant ou catégorie
): Promise<RapportMargesResultat> => {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const periodeStr = `Du ${format(new Date(dateDebut+'T00:00:00'), 'dd/MM/yyyy')} au ${format(new Date(dateFin+'T00:00:00'), 'dd/MM/yyyy')}`;
  const lignes: LigneAnalyseMarge[] = [];
  let totalCA = 0, totalCout = 0;

  const typesProduitsSimules: ProduitOuCarburantPourFiltre[] = [
    { id: 'SP95', nom: 'Essence SP95', type: 'carburant' },
    { id: 'DIESEL', nom: 'Diesel', type: 'carburant' },
    { id: 'LUB_5L', nom: 'Huile Moteur Super Lub (5L)', type: 'lubrifiant' },
    { id: 'BOUT_EAU', nom: 'Eau Minérale 1.5L', type: 'boutique' },
    { id: 'BOUT_SNACK', nom: 'Barre Chocolatée Max', type: 'boutique' },
  ];
  
  let produitsAAnalyser = typesProduitsSimules;

  // Gestion des filtres par catégorie
  if (filtreProduitId) {
    if (filtreProduitId === 'CAT_CARB') {
      produitsAAnalyser = typesProduitsSimules.filter(p => p.type === 'carburant');
    } else if (filtreProduitId === 'CAT_BOUT') {
      produitsAAnalyser = typesProduitsSimules.filter(p => p.type === 'boutique');
    } else if (filtreProduitId === 'CAT_LUB') {
      produitsAAnalyser = typesProduitsSimules.filter(p => p.type === 'lubrifiant');
    } else if (filtreProduitId !== '') {
      // Produit spécifique
      produitsAAnalyser = typesProduitsSimules.filter(p => p.id === filtreProduitId);
    }
    // Si filtreProduitId === '', on garde tous les produits
  }

  produitsAAnalyser.forEach(p => {
    const qteVendue = Math.floor(Math.random() * (p.type === 'carburant' ? 20000 : 200)) + (p.type === 'carburant' ? 5000 : 50);
    const prixVenteMoyen = p.type === 'carburant' ? (p.nom.includes('SP95') ? 820 : 780) : (Math.random() * 1500 + 500);
    const coutAchatMoyen = prixVenteMoyen * (0.75 + (Math.random() * 0.1 - 0.05)); // Marge brute entre 10% et 40%
    
    const ca = qteVendue * prixVenteMoyen;
    const cout = qteVendue * coutAchatMoyen;
    const margeB = ca - cout;
    const tauxMargeB = ca > 0 ? (margeB / ca) * 100 : 0;

    lignes.push({
      idProduitCarburant: p.id,
      nomProduitCarburant: p.nom,
      type: p.type === 'categorie_boutique' ? 'boutique' : p.type,
      quantiteVendue: qteVendue,
      unite: p.type === 'carburant' ? 'L' : 'Unité',
      chiffreAffairesTotal: parseFloat(ca.toFixed(0)),
      coutAchatTotal: parseFloat(cout.toFixed(0)),
      margeBrute: parseFloat(margeB.toFixed(0)),
      tauxMargeBrute: parseFloat(tauxMargeB.toFixed(1)),
    });
    totalCA += ca;
    totalCout += cout;
  });

  const totalMargeB = totalCA - totalCout;
  const tauxMargeBGlobal = totalCA > 0 ? (totalMargeB / totalCA) * 100 : 0;

  const nomFiltre = filtreProduitId === 'CAT_CARB' ? 'Carburants' :
                   filtreProduitId === 'CAT_BOUT' ? 'Boutique' :
                   filtreProduitId === 'CAT_LUB' ? 'Lubrifiants' :
                   lignes[0]?.nomProduitCarburant || '';

  return {
    titre: `Analyse des Marges Brutes ${filtreProduitId && filtreProduitId !== '' ? `pour ${nomFiltre}` : 'Globales'}`,
    periode: periodeStr,
    lignesAnalyse: lignes.sort((a,b)=> b.margeBrute - a.margeBrute), // Trier par meilleure marge
    totalGlobalChiffreAffaires: parseFloat(totalCA.toFixed(0)),
    totalGlobalCoutAchat: parseFloat(totalCout.toFixed(0)),
    totalGlobalMargeBrute: parseFloat(totalMargeB.toFixed(0)),
    tauxMorgenBruteGlobal: parseFloat(tauxMargeBGlobal.toFixed(1)),
  };
};

// Interface étendue pour les options de filtre avec catégories
interface OptionFiltreProduit {
  id: string;
  nom: string;
  type: string; // Peut inclure les catégories spéciales
}

const produitsEtCategoriesPourFiltre: OptionFiltreProduit[] = [
    {id: '', nom: 'Tous Produits & Carburants', type: 'global'}, // Option spéciale
    {id: 'CAT_CARB', nom: 'Tous Carburants', type: 'categorie'},
    {id: 'CAT_BOUT', nom: 'Toute la Boutique', type: 'categorie'},
    {id: 'CAT_LUB', nom: 'Tous Lubrifiants', type: 'categorie'},
    ...dummyProduitsStock.map(p => ({ 
        id: p.id, 
        nom: p.nom, 
        type: p.typeProduit === 'accessoire' ? 'boutique' : p.typeProduit // Regrouper accessoires avec boutique pour simplifier
    }))
].filter((value, index, self) => index === self.findIndex((t) => t.id === value.id)); // Assurer l'unicité

const GerantMargesPage: React.FC = () => {
  const [dateDebut, setDateDebut] = useState(format(startOfMonth(subMonths(new Date(),1)), 'yyyy-MM-dd')); // Mois précédent par défaut
  const [dateFin, setDateFin] = useState(format(endOfMonth(subMonths(new Date(),1)), 'yyyy-MM-dd'));
  const [filtreProduitId, setFiltreProduitId] = useState(''); // '' pour global
  
  const [rapport, setRapport] = useState<RapportMargesResultat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [coutsOperationnelsSaisis, setCoutsOperationnelsSaisis] = useState<string>('');

  const handleGenererRapport = async () => {
    if (!dateDebut || !dateFin) {
        setErrorMessage("Veuillez sélectionner une période complète.");
        return;
    }
     if (new Date(dateDebut) > new Date(dateFin)) {
        setErrorMessage("La date de début ne peut pas être ultérieure à la date de fin.");
        return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setRapport(null);
    try {
      const resultat = await genererRapportMargesSimule(dateDebut, dateFin, filtreProduitId || undefined);
      // Injecter les coûts opérationnels s'ils sont saisis pour calculer la marge nette globale
      const coutsOpNum = parseFloat(coutsOperationnelsSaisis);
      if(!isNaN(coutsOpNum) && coutsOpNum >= 0) {
          resultat.totalCoutsOperationnels = coutsOpNum;
          resultat.totalGlobalMargeNette = resultat.totalGlobalMargeBrute - coutsOpNum;
          if (resultat.totalGlobalChiffreAffaires > 0) {
              resultat.tauxMargeNetteGlobal = parseFloat(((resultat.totalGlobalMargeNette || 0) / resultat.totalGlobalChiffreAffaires * 100).toFixed(1));
          } else {
              resultat.tauxMargeNetteGlobal = 0;
          }
      }
      setRapport(resultat);
    } catch (error) {
      console.error("Erreur génération rapport marges:", error);
      setErrorMessage("Erreur lors de la génération du rapport de marges.");
    }
    setIsLoading(false);
  };
  
  const formatCurrency = (val: number | undefined) => val?.toLocaleString('fr-FR', {style:'currency', currency:'XAF', minimumFractionDigits:0}) || 'N/A';
  const formatPercent = (val: number | undefined) => val?.toFixed(1) + '%' || 'N/A';

  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-purple-500 focus:border-purple-500";

  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
         Analyse des Marges
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Critères d'Analyse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="dateDebut" className="block text-xs font-medium text-gray-700 mb-1"><FiCalendar className="inline mr-1"/>Date Début</label>
            <input type="date" id="dateDebut" value={dateDebut} onChange={e => setDateDebut(e.target.value)} className={inputClass}/>
          </div>
          <div>
            <label htmlFor="dateFin" className="block text-xs font-medium text-gray-700 mb-1"><FiCalendar className="inline mr-1"/>Date Fin</label>
            <input type="date" id="dateFin" value={dateFin} onChange={e => setDateFin(e.target.value)} className={inputClass}/>
          </div>
          <div>
            <label htmlFor="filtreProduitId" className="block text-xs font-medium text-gray-700 mb-1"><FiFilter className="inline mr-1"/>Produit/Carburant/Catégorie</label>
            <select id="filtreProduitId" value={filtreProduitId} onChange={e => setFiltreProduitId(e.target.value)} className={`${inputClass} cursor-pointer`}>
                {produitsEtCategoriesPourFiltre.map(opt => <option key={opt.id} value={opt.id}>{opt.nom} ({opt.type})</option>)}
            </select>
          </div>
           <div className="md:col-span-2 lg:col-span-3">
            <label htmlFor="coutsOperationnelsSaisis" className="block text-xs font-medium text-gray-700 mb-1"><FiDollarSign className="inline mr-1"/>Coûts Opérationnels Globaux sur Période (Optionnel, pour Marge Nette)</label>
            <input type="number" id="coutsOperationnelsSaisis" value={coutsOperationnelsSaisis} 
                   onChange={e => setCoutsOperationnelsSaisis(e.target.value)} 
                   className={inputClass} placeholder="Ex: 1500000"/>
          </div>
          <div className="lg:col-span-3 pt-3">
            <button onClick={handleGenererRapport} disabled={isLoading}
              className="btn-primary inline-flex items-center px-6 py-2.5">
              {isLoading ? <Spinner size="sm" color="text-white"/> : <><FiPlayCircle className="mr-2"/>Calculer les Marges</>}
            </button>
          </div>
        </div>
         {errorMessage && <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-center"><FiAlertCircle className="mr-2 shrink-0"/> {errorMessage}</div>}
      </div>

      {isLoading && (<div className="bg-white p-6 rounded-lg shadow-md text-center py-12"><Spinner size="lg"/><p className="mt-3 text-gray-600">Calcul en cours...</p></div>)}

      {!isLoading && rapport && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl animate-fadeIn">
            <h2 className="text-xl font-semibold text-purple-700 mb-1">{rapport.titre}</h2>
            <p className="text-sm text-gray-500 mb-4">{rapport.periode}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 p-3 bg-gray-50 rounded-md border">
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium">CA GLOBAL HT</p>
                    <p className="text-xl font-bold text-blue-900">{formatCurrency(rapport.totalGlobalChiffreAffaires)}</p>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-xs text-red-700 font-medium">COÛT ACHAT GLOBAL HT</p>
                    <p className="text-xl font-bold text-red-900">{formatCurrency(rapport.totalGlobalCoutAchat)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-xs text-green-700 font-medium">MARGE BRUTE GLOBALE</p>
                    <p className="text-xl font-bold text-green-900">{formatCurrency(rapport.totalGlobalMargeBrute)}</p>
                    <p className="text-sm text-green-800 font-semibold">{formatPercent(rapport.tauxMorgenBruteGlobal)}</p>
                </div>
                 {rapport.totalCoutsOperationnels !== undefined && (
                     <div className="p-3 bg-yellow-50 rounded border border-yellow-300">
                        <p className="text-xs text-yellow-700 font-medium">MARGE NETTE GLOBALE (Estimée)</p>
                        <p className="text-xl font-bold text-yellow-900">{formatCurrency(rapport.totalGlobalMargeNette)}</p>
                        <p className="text-sm text-yellow-800 font-semibold">{formatPercent(rapport.tauxMargeNetteGlobal)}</p>
                    </div>
                 )}
            </div>
            
            {rapport.lignesAnalyse.length > 0 && (
            <div className="overflow-x-auto">
                <h3 className="text-md font-semibold text-gray-700 mb-2 mt-4">Détail par Produit/Carburant :</h3>
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit/Carburant</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qté Vendue</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CA Total</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Coût Achat Total</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Marge Brute</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taux Marge Brute</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {rapport.lignesAnalyse.map(ligne => (
                        <tr key={ligne.idProduitCarburant} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap">
                                <span className="font-medium text-gray-800">{ligne.nomProduitCarburant}</span>
                                <span className="block text-gray-500 text-xs">{ligne.type}</span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">{ligne.quantiteVendue.toLocaleString('fr-FR')} {ligne.unite}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right">{formatCurrency(ligne.chiffreAffairesTotal)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-red-600">{formatCurrency(ligne.coutAchatTotal)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right font-semibold text-green-600">{formatCurrency(ligne.margeBrute)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-right font-semibold text-green-600">{formatPercent(ligne.tauxMargeBrute)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            )}
            {rapport.totalCoutsOperationnels !== undefined && (
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
                    <p className="text-gray-700"><FiInfo className="inline mr-1"/> Les Coûts Opérationnels saisis pour cette période sont de <span className="font-semibold">{formatCurrency(rapport.totalCoutsOperationnels)}</span>. La marge nette globale est calculée sur cette base.</p>
                </div>
            )}
        </div>
      )}
      {!isLoading && !rapport && !errorMessage && (
           <div className="bg-white p-6 rounded-lg shadow-md text-center py-10">
            <p className="text-gray-500">Veuillez sélectionner vos critères et cliquer sur "Calculer les Marges" pour afficher l'analyse.</p>
          </div>
      )}
    </DashboardLayout>
  );
};

export default GerantMargesPage;