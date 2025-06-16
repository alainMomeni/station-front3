// src/types/clients.ts (ou facturation.ts)

import type { ClientProfessionnel, TransactionCredit } from './ventes';

export type { ClientProfessionnel, TransactionCredit };

// Add this type export
export type StatutPaiementFacture = 'non_payee' | 'partiellement_payee' | 'payee' | 'en_retard' | 'annulee';

export interface FactureClient {
  id: string; // Généré par le système
  numeroFacture: string;
  clientId: string;
  clientNom: string;
  dateFacture: string; // YYYY-MM-DD
  dateEcheance: string; // YYYY-MM-DD
  periodeFactureeDebut: string; // YYYY-MM-DD
  periodeFactureeFin: string;   // YYYY-MM-DD
  transactionsIds: string[]; // IDs des TransactionCredit incluses
  montantHT: number;
  montantTVA?: number;
  montantTTC: number;
  statutPaiement: StatutPaiementFacture; // Use the new type
  notes?: string;
  urlPdf?: string; // Lien vers le PDF généré
  dateCreation?: string;
}

export interface ClientPourFacturation extends ClientProfessionnel {
    montantNonFacture: number; // Somme des transactions non facturées
    prochaineEcheanceFacturation?: string; // Pour indiquer quand facturer (ex: fin de mois)
}