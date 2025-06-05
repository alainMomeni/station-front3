// src/types/configuration.ts

export interface CarburantPrixConfig {
  id: string; // ID du type de carburant (ex: 'SP95', 'DIESEL')
  nomCarburant: string;
  prixAchatMoyenActuel?: number; // Informatif, peut venir d'une autre source
  tauxMargeSouhaite?: number; // En %
  prixVenteActuelTTC: number; // Modifiable par le gérant
  prixVenteCalculeTTC?: number; // Basé sur achat + marge (informatif)
  unite: 'Litre';
  dateApplicationPrix?: string; // Prochaine date d'effet si un changement est prévu
}

export interface CuveSeuilConfig {
  id: string; // ID de la cuve
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  seuilAlerteBas: number; // Modifiable
  // seuilCritique?: number; // Optionnel
}

// Pour la fidélité (V2)
// export interface RegleFidelite {
//   pointsParLitreOuXAF: number;
//   valeurPointEnXAF: number;
//   // ... autres règles
// }