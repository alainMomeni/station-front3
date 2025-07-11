// src/types/personnel.ts (ou utilisateurs.ts)
import type { RoleType } from '../config/menuConfig'; // Réutiliser RoleType

export type { RoleType }; // Re-export RoleType to make it available for imports

export type StatutCompteUtilisateur = 'actif' | 'inactif' | 'bloque';

// Add PosteDeTravail interface
export interface PosteDeTravail {
  id: string;           // Ex: "pompe_1_2", "caisse_principale"
  libelle: string;      // Ex: "Pompes 1 & 2", "Caisse Principale"
  typeRequis: 'pompiste' | 'caissier'; // Rôle nécessaire pour ce poste
}

// FIX: Définition de l'interface QuartTravail et ajout de son exportation
export type StatutQuart = 'planifie' | 'en_cours' | 'termine' | 'cloture';

export interface QuartTravail {
  postesAConfigurer: any;
  id: string;
  libelle: string;
  heureDebut: string;
  heureFin: string;
  statut: StatutQuart;
}


// Add QuartDefinition interface
export interface QuartDefinition {
  id: string;          // Ex: "matin_160724"
  libelle: string;     // Ex: "Matin (07h-15h)"
  heureDebut: string;  // "07:00"
  heureFin: string;    // "15:00"
  postesAConfigurer: PosteDeTravail[];
}

// Add Affectation interface
export interface Affectation {
  quartId: string;
  posteId: string;
  employeId: string | null; // null si personne n'est affecté
}

export interface UtilisateurSysteme {
  id?: string; // Make id optional since it's not required for creation (generated by Directus)
  prenom: string;
  nom: string;
  nomComplet?: string; // Propriété calculée pour affichage
  email: string; // Sera l'identifiant de connexion principal
  telephone?: string;
  roles: RoleType[]; // Un utilisateur peut potentiellement avoir plusieurs rôles (ex: polyvalent)
  statutCompte: StatutCompteUtilisateur;
  derniereConnexion?: string; // ISO Date string
  dateCreation?: string;
  // Ne pas stocker le mot de passe en clair ici !
}

export interface RecapPerformanceEmploye {
  employeId: string;
  nomComplet: string;
  rolePrincipal: 'pompiste' | 'caissier' | 'chef_de_piste' | 'polyvalent'; // Son rôle de base
  rolesTenusSurPeriode?: string[]; // Ex: ['Pompiste', 'Caissier'] si polyvalent
  nombreQuartsTravailles: number;
  nombreRetards: number;
  nombreAbsencesJustifiees: number;
  nombreAbsencesNonJustifiees: number;
  totalHeuresTravaillees?: number; // Calculé
  chiffreAffairesTotal: number; // XAF
  volumeTotalVendu?: number; // Litres (pour pompistes)
  uniteVolume?: 'L';
  nombreTotalTransactions: number;
  venteMoyenneParTransaction?: number; // CA / Nb Transactions
}

export interface DetailQuartTravailleEmploye {
  dateQuart: string; // YYYY-MM-DD
  typeQuartLibelle: string; // Ex: "Matin (07h-15h)"
  heureArriveeEnregistree?: string; // HH:mm
  heureDepartEnregistree?: string; // HH:mm
  statutPresence: 'Present' | 'Retard' | 'Absent_J' | 'Absent_NJ'; // J=Justifié, NJ=Non Justifié
  caGenereQuart?: number;
  volumeVenduQuart?: number;
  uniteVolume?: 'L';
}

export interface EmployeSimple {
  id: string;
  nomComplet: string;
  rolePrincipal: string;
}

// Add after existing interfaces

export interface Employe {
  id: string;
  nomComplet: string;
  role: 'pompiste' | 'caissier' | 'polyvalent' | 'chef_de_piste';
  estDisponible: boolean;
  email?: string;
  telephone?: string;
  dateEmbauche?: string;
  statutEmploye: 'actif' | 'inactif' | 'conge' | 'suspendu';
}

// Add after existing types
export type StatutPresence = 'non_defini' | 'present' | 'retard' | 'absent_justifie' | 'absent_non_justifie';

// Add interface for SuiviPresenceEmploye if not already present
export interface SuiviPresenceEmploye {
  id: string;
  nomComplet: string;
  rolePrevU: 'pompiste' | 'caissier' | 'polyvalent';
  posteLibelle: string;
  statut: StatutPresence;
  heureArriveeReelle?: string;
  heureDepartReelle?: string;
  motifAbsenceRetard?: string;
}

// Add Shift interface
export interface Shift {
  id: string;
  date: string; // format 'YYYY-MM-DD'
  startTime: string; // format 'HH:mm'
  endTime: string;   // format 'HH:mm'
  type?: string;
  notes?: string;
}

export interface IndexParPompeCuve {
  idPompeCuve: string;
  nomCarburant: string;
  indexDebut: number;
  indexFin: number;
  volumeVendu: number;
}

export interface SyntheseQuartData {
  id: string;
  pompisteNom: string;
  dateHeureDebut: string;
  dateHeureFin: string;
  pompesGerees: string[];
  indexDetailsParPompe?: IndexParPompeCuve[];
  totalVolumeCarburantVenduLitres: number;
  totalValeurVenduXAF: number;
  totalVentesEspeces: number;
  totalVentesCarte: number;
  totalVentesMobile: number;
  notesQuart?: string;
}

export interface ProfileState {
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone?: string;
  avatarUrl?: string;
}