// src/types/catalogue.ts
import type { ProduitStatutStock } from './stock'; // Si vous avez ce type défini ailleurs

export interface CategorieProduit {
  id: string;
  nom: string;
  description?: string;
  typeProduitAssocie: 'boutique' | 'lubrifiant' | 'carburant' | 'accessoire' | 'service' | 'autre'; // À quoi s'applique cette catégorie
  nombreProduits?: number; // Calculé ou stocké
}

export interface ProduitCatalogueComplet { // Étend ou combine des interfaces existantes
  id: string;
  nom: string;
  reference?: string;
  description?: string;
  categorieId?: string;       // Lien vers CategorieProduit
  categorieNom?: string;      // Pour affichage facile
  typeProduit: 'boutique' | 'lubrifiant' | 'carburant' | 'accessoire' | 'service' | 'autre';
  uniteMesure: string;
  prixAchatStandard?: number;
  prixVenteActuel: number;
  tauxMargeObjectif?: number;  // en %
  seuilAlerteStock?: number;
  fournisseurPrefereId?: string; // Lien vers Fournisseur
  fournisseurPrefereNom?: string; // Pour affichage
  estActif: boolean; // Pour activer/désactiver le produit à la vente
  imageUrls?: string[];
  // Champs de stock, si on veut les afficher directement ici
  stockActuel?: number;
  statutStock?: ProduitStatutStock;
}