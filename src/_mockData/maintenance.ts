// src/_mockData/maintenance.ts

import { format, addDays, subDays } from 'date-fns';
import type { 
    InterventionMaintenance, 
    PlanMaintenance, 
    Equipement
} from '../types/maintenance';

// Equipment mock data
export const dummyEquipements: Equipement[] = [
    {
        id: 'POMPE_01',
        nom: 'Pompe 1 - Piste Principale',
        categorie: 'Pompe'
    },
    {
        id: 'POMPE_02',
        nom: 'Pompe 2 - Piste Principale',
        categorie: 'Pompe'
    },
    {
        id: 'CUVE_DIESEL',
        nom: 'Cuve Diesel Principale',
        categorie: 'Cuve'
    },
    {
        id: 'TPE_CAISSE_1',
        nom: 'Terminal CB Caisse 1',
        categorie: 'TPE'
    }
];

// Maintenance interventions mock data - FIX
export const dummyInterventions: InterventionMaintenance[] = [
    {
        id: 'INT001',
        dateCreation: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'), // champ requis ajouté
        equipementId: 'POMPE_01',
        equipementNom: 'Pompe 1 - Piste Principale',
        typeIntervention: 'preventive',                 // 'type' -> 'typeIntervention'
        descriptionProblemeTache: 'Maintenance préventive trimestrielle', // 'description' -> 'descriptionProblemeTache'
        statut: 'planifiee',
        priorite: 'moyenne',
        dateInterventionPrevue: format(addDays(new Date(), 5), 'yyyy-MM-dd'), // 'dateIntervention' -> 'dateInterventionPrevue'
        assigneA: 'Jean Dupont',                       // 'technicienNom' -> 'assigneA'
        rapportIntervention: 'Vérification complète programmée' // 'notes' -> 'rapportIntervention'
    },
    {
        id: 'INT002',
        dateCreation: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'), // champ requis ajouté
        equipementId: 'TPE_CAISSE_1',
        equipementNom: 'Terminal CB Caisse 1',
        typeIntervention: 'curative',                  // 'type' -> 'typeIntervention'
        descriptionProblemeTache: 'Problème de lecture carte', // 'description' -> 'descriptionProblemeTache'
        statut: 'en_cours',
        priorite: 'haute',
        dateInterventionPrevue: format(new Date(), 'yyyy-MM-dd'), // 'dateIntervention' -> 'dateInterventionPrevue'
        assigneA: 'Marc Technicien',                  // 'technicienNom' -> 'assigneA'
        rapportIntervention: 'En attente pièce de rechange' // 'notes' -> 'rapportIntervention'
    }
];

// Maintenance plans mock data - FIX
export const dummyPlansMaintenance: PlanMaintenance[] = [
    {
        id: 'PLAN001',
        nomPlan: 'Maintenance Pompes',
        ciblesIds: ['POMPE_01', 'POMPE_02'], // 'equipementsCiblesIds' -> 'ciblesIds'
        ciblesNoms: 'Pompes 1 et 2',
        descriptionTaches: 'Vérification des joints, filtres et calibration',
        frequence: 'mensuel',
        dateDebutCycle: format(subDays(new Date(), 15), 'yyyy-MM-dd'), // champ requis ajouté
        prochaineEcheance: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
        estActif: true
        // 'derniereMaintenance' a été supprimé car inexistant dans le type
    },
    {
        id: 'PLAN002',
        nomPlan: 'Inspection Cuves',
        ciblesIds: ['CUVE_DIESEL'], // 'equipementsCiblesIds' -> 'ciblesIds'
        ciblesNoms: 'Cuve Diesel Principale',
        descriptionTaches: 'Vérification étanchéité et nettoyage',
        frequence: 'trimestriel',
        dateDebutCycle: format(subDays(new Date(), 45), 'yyyy-MM-dd'), // champ requis ajouté
        prochaineEcheance: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
        estActif: true
        // 'derniereMaintenance' a été supprimé car inexistant dans le type
    }
];