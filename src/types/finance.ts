// src/types/finance.ts

export interface LigneAnalyseMarge {
  idProduitCarburant: string;
  nomProduitCarburant: string;
  type: 'carburant' | 'boutique' | 'lubrifiant';
  quantiteVendue: number;
  unite: string;
  chiffreAffairesTotal: number; // CA = Quantité * Prix de Vente Moyen
  coutAchatTotal: number;      // Coût des Marchandises Vendues (CMV) = Quantité * Coût d'Achat Moyen
  margeBrute: number;          // CA - CMV
  tauxMargeBrute: number;      // (Marge Brute / CA) * 100
}

export interface RapportMargesResultat {
  titre: string;
  periode: string;
  lignesAnalyse: LigneAnalyseMarge[];
  totalGlobalChiffreAffaires: number;
  totalGlobalCoutAchat: number;
  totalGlobalMargeBrute: number;
  tauxMorgenBruteGlobal: number; // En %
  // Pour Marge Nette (V2)
  totalCoutsOperationnels?: number;
  totalGlobalMargeNette?: number;
  tauxMargeNetteGlobal?: number; // En %
}

// Pour les filtres
export interface ProduitOuCarburantPourFiltre {
  id: string;
  nom: string;
  type: 'carburant' | 'boutique' | 'lubrifiant' | 'categorie_boutique';
}


export interface CategorieDepense {
  id: string;
  nom: string;
}

export type ModePaiementDepense = 'especes' | 'virement_bancaire' | 'cheque' | 'carte_entreprise' | 'mobile_money_entreprise' | 'autre';

export interface DepenseData {
  id: string; // UUID ou ID auto-incrémenté par Directus
  dateDepense: string; // YYYY-MM-DD
  description: string;
  montant: number;
  categorieId: string;
  categorieNom?: string; // Pour affichage facile
  fournisseurBeneficiaire?: string; // Nom ou ID si relation
  modePaiement: ModePaiementDepense;
  referencePaiement?: string; // N° Facture, N° Chèque etc.
  notes?: string;
  pieceJointeUrl?: string; // URL du fichier stocké dans Directus Files
  pieceJointeNom?: string; // Nom du fichier original
  enregistreParId?: string; // ID du gérant ou utilisateur
}