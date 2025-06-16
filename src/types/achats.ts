// src/types/achats.ts

export type StatutBC = 'brouillon' | 'soumis' | 'partiellement_livre' | 'livre' | 'annule' | 'en_litige';

/**
 * Représente un fournisseur de produits ou services pour la station.
 */
export interface Fournisseur {
  id: string;
  nom: string;
  email?: string;
}

/**
 * Représente une seule ligne d'article dans un bon de commande.
 */
export interface LigneBonCommande {
  id: string;
  produitId: string;
  produitNom: string;
  quantite: string; // Quantité totale commandée
  unite: string;
  prixUnitaireHT: string;
  montantLigneHT: number;
  quantiteRecue?: string; // Quantité reçue dans la livraison actuelle
  quantiteDejaRecue?: string; // Quantité déjà reçue lors des précédentes livraisons
  numeroLot?: string;
  datePeremption?: string;
  notesReceptionLigne?: string;
}

/**
 * Représente les informations générales de la livraison saisies par le gérant.
 */
export interface InfoLivraison {
  numeroBL: string;
  dateReception: string;
  notes: string;
}

/**
 * Représente un Bon de Commande (BC) complet.
 */
export interface BonCommandeData {
  notes: string;
  id?: string;
  fournisseurId: string;
  fournisseurNom?: string;
  dateCommande: string;
  dateLivraisonSouhaitee: string;
  lignes: LigneBonCommande[];
  statut: StatutBC;
  totalHT: number;
  numeroBC: string;
  numeroBLFournisseur?: string;
  dateReceptionEffective?: string;
  notesLivraisonGlobale?: string;
  // Nouvelles propriétés pour le suivi des livraisons multiples
  livraisons?: HistoriqueLivraison[]; // Historique de toutes les livraisons
}

/**
 * Représente une livraison individuelle dans l'historique
 */
export interface HistoriqueLivraison {
  id: string;
  numeroBL: string;
  dateReception: string;
  notes: string;
  lignesLivrees: {
    ligneId: string;
    quantiteLivree: number;
    numeroLot?: string;
    datePeremption?: string;
    notesLigne?: string;
  }[];
}

/**
 * Représente un produit simple dans le système.
 */
export interface ProduitSimple {
  id: string;
  nom: string;
  type: 'carburant' | 'lubrifiant' | 'boutique' | 'accessoire' | 'service' | 'autre';
  uniteMesure: string;
  prixAchatDefault?: number;
}