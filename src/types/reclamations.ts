// src/types/reclamations.ts

export type TypeReclamation = 'qualite_carburant' | 'erreur_paiement' | 'service_client' | 'equipement' | 'produit_boutique' | 'autre';
export type StatutReclamation = 'nouvelle' | 'en_cours' | 'en_attente_client' | 'resolue' | 'cloturee' | 'rejetee';
export type PrioriteReclamation = 'basse' | 'moyenne' | 'haute' | 'critique';

export interface ActionReclamation {
  id: string; // UUID
  dateAction: string; // ISO String
  auteurNom: string; // Qui a fait l'action
  actionEffectuee: string; // Description de l'action/commentaire
  ancienStatut?: StatutReclamation;
  nouveauStatut?: StatutReclamation;
}

export interface ReclamationClient {
  id: string; // Généré par le système (ex: RECL-YYYYMMDD-XXXX)
  dateSoumission: string; // ISO String
  clientId?: string; // Optionnel si client non identifié au moment de la réclamation
  nomClient: string; // Nom du client (ou "Anonyme" ou contact fourni)
  contactClientEmail?: string;
  contactClientTelephone?: string;
  typeReclamation: TypeReclamation;
  descriptionDetaillee: string;
  priorite: PrioriteReclamation;
  statut: StatutReclamation;
  assigneAId?: string; // ID de l'employé responsable
  assigneANom?: string;
  dateResolutionSouhaitee?: string; // ISO String
  solutionApportee?: string;
  dateCloture?: string; // ISO String
  piecesJointes?: { nomFichier: string; url: string }[]; // URLs des fichiers
  historiqueActions: ActionReclamation[];
}