// src/_mockData/planning.ts - VERSION CORRIGÉE
import { format } from 'date-fns';
import type { Shift, QuartTravail, Employe, SyntheseQuartData } from '../types/personnel';

// ====== PLANNING UTILISATEUR AVEC DATES JUIN/JUILLET 2025 ======
export const userShifts: Shift[] = [
    // Juin 2025
    {
        id: 'shift_jun_26',
        date: '2025-06-26', // Aujourd'hui
        startTime: '07:00',
        endTime: '15:00',
        type: 'Service Matin',
        notes: 'Station principale - Vérifier niveaux des cuves'
    },
    {
        id: 'shift_jun_27',
        date: '2025-06-27',
        startTime: '15:00',
        endTime: '23:00',
        type: 'Service Soir',
        notes: 'Fermeture station - Compter la caisse'
    },
    {
        id: 'shift_jun_28',
        date: '2025-06-28',
        startTime: '07:00',
        endTime: '15:00',
        type: 'Service Matin',
        notes: 'Formation nouveau employé'
    },
    {
        id: 'shift_jun_30',
        date: '2025-06-30',
        startTime: '15:00',
        endTime: '23:00',
        type: 'Service Soir',
        notes: 'Inventaire fin de mois'
    },
    
    // Juillet 2025
    {
        id: 'shift_jul_01',
        date: '2025-07-01',
        startTime: '07:00',
        endTime: '15:00',
        type: 'Service Matin',
        notes: 'Début nouveau mois - Rapport mensuel'
    },
    {
        id: 'shift_jul_03',
        date: '2025-07-03',
        startTime: '23:00',
        endTime: '07:00',
        type: 'Service Nuit',
        notes: 'Surveillance nocturne - Week-end'
    },
    {
        id: 'shift_jul_05',
        date: '2025-07-05',
        startTime: '15:00',
        endTime: '23:00',
        type: 'Service Soir',
        notes: 'Weekend - Affluence élevée prévue'
    },
    {
        id: 'shift_jul_08',
        date: '2025-07-08',
        startTime: '07:00',
        endTime: '15:00',
        type: 'Service Matin',
        notes: 'Maintenance préventive pompes'
    },
    {
        id: 'shift_jul_10',
        date: '2025-07-10',
        startTime: '15:00',
        endTime: '23:00',
        type: 'Service Soir',
        notes: 'Formation sécurité obligatoire'
    },
    {
        id: 'shift_jul_12',
        date: '2025-07-12',
        startTime: '23:00',
        endTime: '07:00',
        type: 'Service Nuit',
        notes: 'Réception livraison carburant'
    }
];

// ====== FONCTIONS UTILITAIRES ======
export const getShiftsForMonth = (year: number, month: number): Shift[] => {
    const monthStr = month.toString().padStart(2, '0');
    return userShifts.filter(shift => 
        shift.date.startsWith(`${year}-${monthStr}`)
    );
};

export const getShiftsForDateRange = (startDate: string, endDate: string): Shift[] => {
    return userShifts.filter(shift => 
        shift.date >= startDate && shift.date <= endDate
    );
};

export const getShiftById = (id: string): Shift | undefined => {
    return userShifts.find(shift => shift.id === id);
};

export const getShiftForDate = (date: string): Shift | undefined => {
    return userShifts.find(shift => shift.date === date);
};

// ====== GÉNÉRATEUR DE SHIFTS DE TEST ======
export const generateTestShifts = (startDate: Date, numberOfDays: number = 30): Shift[] => {
    const shifts: Shift[] = [];
    const shiftTypes = [
        { type: 'Service Matin', start: '07:00', end: '15:00' },
        { type: 'Service Soir', start: '15:00', end: '23:00' },
        { type: 'Service Nuit', start: '23:00', end: '07:00' }
    ];
    
    for (let i = 0; i < numberOfDays; i++) {
        // Ne pas créer un shift tous les jours (simulation repos)
        if (i % 4 === 3) continue; // Jour de repos tous les 4 jours
        
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const shiftType = shiftTypes[i % 3];
        const shift: Shift = {
            id: `generated_${i}`,
            date: currentDate.toISOString().split('T')[0],
            startTime: shiftType.start,
            endTime: shiftType.end,
            type: shiftType.type,
            notes: `Shift généré automatiquement - Jour ${i + 1}`
        };
        
        shifts.push(shift);
    }
    
    return shifts;
};

// Export des shifts avec possibilité de basculer vers des données générées
// Décommentez la ligne suivante pour utiliser des shifts générés automatiquement
// export const userShifts = generateTestShifts(new Date(), 60);

// ====== SOLUTION 1: Typage explicite avec 'as const' ======
export const dummyEmployes: Employe[] = [
  { 
    id: 'emp1', 
    nomComplet: 'Natalya P.', 
    role: 'pompiste' as const, 
    estDisponible: true, 
    statutEmploye: 'actif' as const 
  },
  { 
    id: 'emp2', 
    nomComplet: 'Jean C.', 
    role: 'caissier' as const, 
    estDisponible: true, 
    statutEmploye: 'actif' as const 
  },
  { 
    id: 'emp3', 
    nomComplet: 'Ali K.', 
    role: 'pompiste' as const, 
    estDisponible: false, 
    statutEmploye: 'conge' as const 
  },
  { 
    id: 'emp4', 
    nomComplet: 'Fatima B.', 
    role: 'caissier' as const, 
    estDisponible: true, 
    statutEmploye: 'actif' as const 
  },
  { 
    id: 'emp5', 
    nomComplet: 'Moussa D.', 
    role: 'polyvalent' as const, 
    estDisponible: true, 
    statutEmploye: 'actif' as const 
  }
];

// ====== SOLUTION 2 ALTERNATIVE: Avec 'satisfies' (TypeScript 4.9+) ======
/*
export const dummyEmployes = [
  { 
    id: 'emp1', 
    nomComplet: 'Natalya P.', 
    role: 'pompiste', 
    estDisponible: true, 
    statutEmploye: 'actif'
  },
  { 
    id: 'emp2', 
    nomComplet: 'Jean C.', 
    role: 'caissier', 
    estDisponible: true, 
    statutEmploye: 'actif'
  },
  { 
    id: 'emp3', 
    nomComplet: 'Ali K.', 
    role: 'pompiste', 
    estDisponible: false, 
    statutEmploye: 'conge'
  },
  { 
    id: 'emp4', 
    nomComplet: 'Fatima B.', 
    role: 'caissier', 
    estDisponible: true, 
    statutEmploye: 'actif'
  },
  { 
    id: 'emp5', 
    nomComplet: 'Moussa D.', 
    role: 'polyvalent', 
    estDisponible: true, 
    statutEmploye: 'actif'
  }
] satisfies Employe[];
*/

// ====== SOLUTION 3 ALTERNATIVE: Avec assertion complète ======
/*
export const dummyEmployes = [
  { id: 'emp1', nomComplet: 'Natalya P.', role: 'pompiste', estDisponible: true, statutEmploye: 'actif' },
  { id: 'emp2', nomComplet: 'Jean C.', role: 'caissier', estDisponible: true, statutEmploye: 'actif' },
  { id: 'emp3', nomComplet: 'Ali K.', role: 'pompiste', estDisponible: false, statutEmploye: 'conge' },
  { id: 'emp4', nomComplet: 'Fatima B.', role: 'caissier', estDisponible: true, statutEmploye: 'actif' },
  { id: 'emp5', nomComplet: 'Moussa D.', role: 'polyvalent', estDisponible: true, statutEmploye: 'actif' }
] as Employe[];
*/

export const getQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  return [
    {
      id: `matin_${dateIsoSuffix}`,
      libelle: `(07h-15h) - ${dateStr}`,
      heureDebut: '07:00',
      heureFin: '15:00',
      statut: 'termine' as const,
      postesAConfigurer: [
        { id: 'poste1', libelle: 'Pompes 1 & 2', typeRequis: 'pompiste' as const },
        { id: 'poste2', libelle: 'Caisse Principale', typeRequis: 'caissier' as const }
      ]
    },
    {
      id: `soir_${dateIsoSuffix}`,
      libelle: `(15h-23h) - ${dateStr}`,
      heureDebut: '15:00',
      heureFin: '23:00',
      statut: 'planifie' as const,
      postesAConfigurer: [
        { id: 'poste3', libelle: 'Pompes 3 & 4', typeRequis: 'pompiste' as const },
        { id: 'poste4', libelle: 'Caisse Secondaire', typeRequis: 'caissier' as const }
      ]
    }
  ];
};

export const dummySyntheseQuarts: SyntheseQuartData[] = [
  {
    id: 'QRT-001',
    pompisteNom: 'Natalya P.',
    dateHeureDebut: '2024-07-10T07:00:00Z',
    dateHeureFin: '2024-07-10T15:00:00Z',
    pompesGerees: ['Pompe 1', 'Pompe 2'],
    totalVolumeCarburantVenduLitres: 1250,
    totalValeurVenduXAF: 937500,
    totalVentesEspeces: 600000,
    totalVentesCarte: 200000,
    totalVentesMobile: 137500,
    notesQuart: 'RAS'
  },
  {
    id: 'QRT-002',
    pompisteNom: 'Ali K.',
    dateHeureDebut: '2024-07-09T15:00:00Z',
    dateHeureFin: '2024-07-09T23:00:00Z',
    pompesGerees: ['Pompe 3'],
    totalVolumeCarburantVenduLitres: 980,
    totalValeurVenduXAF: 735000,
    totalVentesEspeces: 400000,
    totalVentesCarte: 250000,
    totalVentesMobile: 85000,
    notesQuart: 'Incident mineur sur Pompe 3'
  }
  // Ajoute d'autres objets si besoin
];