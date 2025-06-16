// Le nom du fichier est déduit, par ex: src/_mockData/personnel.ts
import { format } from 'date-fns';
import type { Employe, QuartDefinition, PosteDeTravail } from '../types/personnel';

// Mock work stations
export const dummyPostes: PosteDeTravail[] = [
    { 
        id: 'p12', 
        libelle: 'Pompes 1 & 2', 
        typeRequis: 'pompiste' 
    },
    { 
        id: 'p34', 
        libelle: 'Pompes 3 & 4', 
        typeRequis: 'pompiste' 
    },
    { 
        id: 'cp1', 
        libelle: 'Caisse Principale', 
        typeRequis: 'caissier' 
    },
    { 
        id: 'cp2', 
        libelle: 'Caisse Secondaire', 
        typeRequis: 'caissier' 
    }
];

// Mock employees data - FIX
export const dummyEmployes: Employe[] = [
    { 
        id: 'emp1', 
        nomComplet: 'Natalya P.', 
        role: 'pompiste', 
        estDisponible: true,
        statutEmploye: 'actif' // FIX: Propriété requise ajoutée
    },
    { 
        id: 'emp2', 
        nomComplet: 'Jean C.', 
        role: 'caissier', 
        estDisponible: true,
        statutEmploye: 'actif' // FIX: Propriété requise ajoutée
    },
    { 
        id: 'emp3', 
        nomComplet: 'Ali K.', 
        role: 'pompiste', 
        estDisponible: true,
        statutEmploye: 'actif' // FIX: Propriété requise ajoutée
    },
    { 
        id: 'emp4', 
        nomComplet: 'Fatima B.', 
        role: 'caissier', 
        estDisponible: false,
        statutEmploye: 'conge' // FIX: Propriété requise ajoutée (exemple avec un statut différent)
    },
    { 
        id: 'emp5', 
        nomComplet: 'Moussa D.', 
        role: 'polyvalent', 
        estDisponible: true,
        statutEmploye: 'actif' // FIX: Propriété requise ajoutée
    }
];

// Function to get shifts for a specific date
export const getQuartsPourDate = (date: Date): QuartDefinition[] => {
    const dateStr = format(date, 'ddMMyy');
    return [
        {
            id: `matin_${dateStr}`,
            libelle: 'Matin (07h-15h)',
            heureDebut: '07:00',
            heureFin: '15:00',
            postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2]]
        },
        {
            id: `soir_${dateStr}`,
            libelle: 'Soir (15h-23h)',
            heureDebut: '15:00',
            heureFin: '23:00',
            postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2], dummyPostes[3]]
        },
        {
            id: `nuit_${dateStr}`,
            libelle: 'Nuit (23h-07h)',
            heureDebut: '23:00',
            heureFin: '07:00',
            postesAConfigurer: [dummyPostes[0], dummyPostes[2]]
        }
    ];
};