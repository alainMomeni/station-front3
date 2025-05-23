// src/types/achats.ts (ou un nom similaire)

export interface Fournisseur {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
}

export interface ProduitSimple {
  id: string;
  nom: string;
  type: 'carburant' | 'lubrifiant' | 'boutique';
  uniteMesure: string;
  prixAchatDefault?: number; // Prix d'achat par défaut pour pré-remplir
}

export interface LigneBonCommande {
  id: string;
  produitId: string;
  produitNom: string;
  quantite: string; // Commandée
  unite: string;
  prixUnitaireHT: string;
  montantLigneHT?: number;
  // --- Champs pour la réception ---
  quantiteRecue?: string;       // Quantité réellement reçue pour cette ligne
  numeroLot?: string;           // Si applicable
  datePeremption?: string;      // Format YYYY-MM-DD, si applicable
  notesReceptionLigne?: string;
}

export interface BonCommandeData {
  id?: string;
  fournisseurId: string;
  fournisseurNom?: string; // Utile pour l'affichage
  dateCommande: string;
  dateLivraisonSouhaitee?: string;
  numeroBC: string;
  referenceFournisseur?: string;
  lignes: LigneBonCommande[];
  notes?: string;
  totalHT?: number;
  statut: 'brouillon' | 'soumis' | 'partiellement_livre' | 'livre' | 'annule' | 'en_litige'; // Statuts étendus
  creeParId?: string;
  // --- Champs pour la livraison effective liée à ce BC ---
  numeroBLFournisseur?: string; // BL du fournisseur pour cette livraison
  dateReceptionEffective?: string; // Date réelle de la livraison
  notesLivraisonGlobale?: string;
  scanBL?: string; // ID du fichier uploadé (scan du BL)
  valideeParId?: string; // ID du gérant qui a validé
  dateValidation?: string;
}