// Assumons que le fichier se nomme src/_mockData/rapportsMarges.ts
import { format } from 'date-fns';
import type { RapportMargesResultat, LigneAnalyseMarge } from '../types/finance';
import type { ProduitOuCarburantPourFiltre } from '../types/finance';

export const produitsEtCategoriesPourFiltre: ProduitOuCarburantPourFiltre[] = [
  { id: 'SP95', nom: 'Essence SP95', type: 'carburant' },
  { id: 'DIESEL', nom: 'Diesel', type: 'carburant' },
  { id: 'SP98', nom: 'SP98', type: 'carburant' },
  { id: 'CAT_LUB', nom: 'Lubrifiants', type: 'categorie_boutique' },
  { id: 'CAT_ACC', nom: 'Accessoires Auto', type: 'categorie_boutique' }
];

export const genererRapportMargesSimule = async (
  dateDebut: string,
  dateFin: string,
  produitId?: string
): Promise<RapportMargesResultat> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

  const lignesAnalyse: LigneAnalyseMarge[] = [
    {
      idProduitCarburant: 'SP95', // FIX: 'id' renommé en 'idProduitCarburant'
      nomProduitCarburant: 'Essence SP95',
      type: 'carburant',
      unite: 'L',
      quantiteVendue: 45000,
      chiffreAffairesTotal: 33750000,
      coutAchatTotal: 27000000,
      margeBrute: 6750000,
      tauxMargeBrute: 20
    },
    {
      idProduitCarburant: 'DIESEL', // FIX: 'id' renommé en 'idProduitCarburant'
      nomProduitCarburant: 'Diesel',
      type: 'carburant',
      unite: 'L',
      quantiteVendue: 65000,
      chiffreAffairesTotal: 45500000,
      coutAchatTotal: 35750000,
      margeBrute: 9750000,
      tauxMargeBrute: 21.4
    }
  ];

  // Calculate totals
  const totals = lignesAnalyse.reduce((acc, curr) => ({
    ca: acc.ca + curr.chiffreAffairesTotal,
    cout: acc.cout + curr.coutAchatTotal,
    marge: acc.marge + curr.margeBrute
  }), { ca: 0, cout: 0, marge: 0 });

  return {
    titre: 'Analyse des Marges par Produit',
    periode: `Du ${format(new Date(dateDebut), 'dd/MM/yyyy')} au ${format(new Date(dateFin), 'dd/MM/yyyy')}`,
    lignesAnalyse: produitId 
      // FIX: utilise la bonne propriété pour filtrer
      ? lignesAnalyse.filter(l => l.idProduitCarburant === produitId)
      : lignesAnalyse,
    totalGlobalChiffreAffaires: totals.ca,
    totalGlobalCoutAchat: totals.cout,
    totalGlobalMargeBrute: totals.marge,
    // FIX: Correction de la coquille
    tauxMargeBruteGlobal: (totals.marge / totals.ca) * 100
  };
};