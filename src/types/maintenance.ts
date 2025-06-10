// src/types/maintenance.ts

export type StatutIntervention = 'planifiee' | 'en_cours' | 'terminee' | 'annulee' | 'en_attente_pieces';
export type TypeIntervention = 'preventive' | 'curative';
export type PrioriteIntervention = 'basse' | 'moyenne' | 'haute' | 'urgente';
export type FrequenceMaintenance = 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'semestriel' | 'annuel';


// Une interface simplifiée pour représenter les équipements
export interface Equipement {
  id: string; // Ex: 'POMPE_01', 'CUVE_DIESEL_A', 'TPE_CAISSE_1'
  nom: string;
  categorie: 'Pompe' | 'Cuve' | 'TPE' | 'Bâtiment' | 'Autre';
}

export interface InterventionMaintenance {
  id: string; // Numéro de ticket/d'intervention
  dateCreation: string; // ISO String
  equipementId: string;
  equipementNom?: string; // Pour affichage
  typeIntervention: TypeIntervention;
  descriptionProblemeTache: string;
  priorite: PrioriteIntervention;
  statut: StatutIntervention;
  assigneA?: string; // Nom du technicien ou entreprise externe
  dateInterventionPrevue?: string; // YYYY-MM-DD
  dateInterventionReelle?: string; // YYYY-MM-DD
  coutEstime?: number;
  coutReel?: number;
  rapportIntervention?: string; // Notes du technicien sur l'intervention
  creeParNom?: string; // Gérant qui a créé le ticket
  referencePlanMaintenanceId?: string; // Si issue d'un plan
  referenceSignalementId?: string; // Si issue d'un signalement
}


export interface PlanMaintenance {
  id: string; // UUID
  nomPlan: string;
  descriptionTaches: string;
  // Simplification : au lieu d'une relation N-N, on peut avoir un champ catégorie ou une liste d'ID texte
  ciblesIds: string[]; // Ex: ['POMPE_01', 'POMPE_02']
  ciblesNoms?: string; // Pour affichage
  frequence: FrequenceMaintenance;
  dateDebutCycle: string; // YYYY-MM-DD: Première fois où la maintenance doit être faite
  prochaineEcheance?: string; // Calculé par le backend : dateDebutCycle + frequence
  estActif: boolean;
  assigneParDefautA?: string;
}

// Pour les plans (V2)
// export interface PlanMaintenance {
//   id: string;
//   nomPlan: string;
//   equipementsCiblesIds: string[];
//   descriptionTaches: string;
//   frequence: 'journalier' | 'hebdomadaire' | 'mensuel' | 'trimestriel' | 'annuel';
//   prochaineEcheance: string; // YYYY-MM-DD
//   estActif: boolean;
// }