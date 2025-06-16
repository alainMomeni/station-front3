// src/types/clients.ts
export type TypeClient = 'particulier' | 'professionnel';
export type StatutClient = 'actif' | 'inactif' | 'prospect' | 'bloque';

export interface ClientBase {
  id: string; // UUID ou ID Directus
  typeClient: TypeClient;
  nomAffichage: string; // Nom pour l'affichage dans les listes (Nom Prénom ou Raison Sociale)
  email?: string;
  telephone?: string;
  adresse?: string;
  statutCompte: StatutClient;
  dateCreation?: string;
  derniereActiviteDate?: string; // Date de la dernière transaction/interaction
  notes?: string;
}

export interface ClientParticulier extends ClientBase {
  id: string;
  typeClient: 'particulier';
  nomAffichage: string;
  nomFamille: string;  // Changed from 'nom' to 'nomFamille' for clarity
  prenom: string;
  statutCompte: StatutClient;
  email?: string;
  telephone: string;
  derniereActiviteDate: string;
}

export interface ClientProfessionnel extends ClientBase {
  typeClient: 'professionnel';
  raisonSociale: string;
  // Ajout des propriétés manquantes pour la compatibilité
  nomEntreprise?: string; // Alias pour raisonSociale
  emailContact?: string; // Alias pour email
  rccm?: string;
  ninea?: string;
  nomContactPrincipal?: string;
  emailContactPrincipal?: string;
  telephoneContactPrincipal?: string;
  adresseFacturation?: string;
  limiteCredit?: number;
  soldeActuel?: number; // Renommé de soldeActuelCredit pour cohérence
  soldeActuelCredit?: number; // Pour le suivi rapide du solde dû
  conditionsPaiement?: string; // Ex: "30 jours net"
}

// Type unifié pour les formulaires et listes, avec un discriminateur
export type ClientData = ClientParticulier | ClientProfessionnel;

// Pour les données affichées dans le tableau principal de la page GerantGestionClientsPage
export interface ClientRowData extends ClientBase {
  // on a déjà nomAffichage
  contactInfo: string; // Concaténation Tél/Email
  specificInfo: string; // Raison sociale ou Prénom/Nom
  soldeOuType: string; // Affiche solde pour Pro, type pour Particulier
}

// Interface pour les transactions de crédit
export interface TransactionCredit {
  id: string;
  clientId: string;
  clientNom: string;
  dateTransaction: string;
  description: string;
  montant: number;
  estFacturee: boolean;
  referenceBC?: string;
  type?: 'achat' | 'paiement';
}

export interface LigneReleveClient {
  date: string; // DD/MM/YYYY HH:mm
  reference?: string; // N° Facture, N° Transaction
  description: string;
  debit?: number; // Montant ajouté à la dette du client
  credit?: number; // Montant réduisant la dette du client (paiement)
  soldeProgressif: number;
}

export interface ReleveClientData {
  client: ClientProfessionnel;
  paiement: any;
  debit?: number; // Achats à crédit
  credit?: number; // Paiements reçus
  dateGeneration: string; // YYYY-MM-DD HH:mm
  periodeDebut: string; // YYYY-MM-DD
  periodeFin: string; // YYYY-MM-DD
  soldeProgressif: number;
}

export interface ReleveCompteClient {
  clientId: string;
  clientNom: string;
  clientAdresse?: string; // Pour l'en-tête du relevé
  clientEmail?: string; // Email du client pour l'envoi
  numeroReleve: string;
  dateGeneration: string; // YYYY-MM-DD
  periodeDebut: string; // YYYY-MM-DD
  periodeFin: string; // YYYY-MM-DD
  soldeInitialPeriode: number;
  lignes: LigneReleveClient[];
  soldeFinalPeriode: number;
  totalDebitsPeriode?: number;
  totalCreditsPeriode?: number;
  notesBasDePage?: string; // Notes générales pour le relevé
}