// src/types/stock.ts

export type ProduitStatutStock = 'OK' | 'STOCK_FAIBLE' | 'RUPTURE';

export interface ProduitStockDetail {
  id: string;           // ID du produit
  nom: string;
  reference?: string;    // SKU ou référence interne
  categorie?: string;
  typeProduit: 'boutique' | 'lubrifiant' | 'accessoire' | 'autre';
  stockActuel: number;
  uniteMesure: string;
  seuilAlerteMinimum: number;
  statutStock: ProduitStatutStock; // Calculé
  prixAchatUnitaire?: number; // Pour valorisation
  prixVenteUnitaire?: number; // Pour valorisation
  fournisseurPrincipalNom?: string;
  derniereEntreeDate?: string; // Date de la dernière réception
  prochaineDatePeremption?: string; // Pour les produits périssables
}