// src/types/equipements.ts

export type StatutPompe = 'active' | 'inactive' | 'en_maintenance';

export interface TypeCarburant {
  id: string;
  nom: string;
  unite: string;
}

export interface Cuve {
  id: string;
  nom: string;
  typeCarburantId: string;
  capaciteMax: number;
  niveauActuel?: number;
  seuilSecurite?: number;
  seuilAlerteBas: number; // Added this property
}

export interface DistributionPompe {
  id: string;
  typeCarburantId: string;
  typeCarburantNom?: string;
  cuveId: string;
  cuveNom?: string;
}

export interface Pompe {
  id: string;
  nom: string;
  modele?: string;
  numeroSerie?: string;
  dateInstallation?: string;
  statut: StatutPompe;
  distributions: DistributionPompe[];
  dateDerniereMaintenance?: string;
}

export interface PompeRowData extends Omit<Pompe, 'distributions'> {
  carburantsDistribues: string;
  cuvesSources: string;
}

export interface TypeCarburant {
  id: string; // Ex: 'SP95', 'DIESEL'
  nom: string;
}

export type StatutCuve = 'operationnelle' | 'maintenance' | 'hors_service';

export interface Cuve {
  id: string; // UUID
  nom: string;
  typeCarburantId: string; // FK vers Types_Carburant.id
  typeCarburantNom?: string; // Pour affichage facile
  capaciteMax: number; // en Litres
  seuilAlerteBas: number; // en Litres
  niveauActuel?: number; // Donnée optionnelle, pour affichage, provient d'une autre logique
  statut: StatutCuve;
}

export interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  stockOuvertureQuart?: number;
  prixVenteUnitaire?: number;
  unite?: string;
  dernierIndexDebut?: number;
  dernierIndexFin?: number;
}