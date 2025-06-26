// Assumons le nom de fichier : src/_mockData/ventes.ts
import { subDays } from 'date-fns';
import type { VenteDirecte, PerformanceVenteEmploye, QuartTravail, VenteTerme, StatutVenteTerme } from '../types/ventes';

// Mock direct sales data - FIX
export const dummyVentesDirectes: VenteDirecte[] = [
    {
        id: 'VD-001',
        date: new Date().toISOString(),
        produit: 'Super SP95',
        quantite: 45,
        unite: 'L',
        prixUnitaire: 750,
        montantTotal: 33750,
        modePaiement: 'Espèces',
        pompiste: 'Natalya P.',
        pompe: 'Pompe 1'
        // FIX: La ligne 'client: null' a été supprimée. 
        // L'absence de la clé optionnelle est la manière correcte de représenter 'undefined'.
    },
    {
        id: 'VD-002',
        date: subDays(new Date(), 1).toISOString(),
        produit: 'Diesel',
        quantite: 100,
        unite: 'L',
        prixUnitaire: 700,
        montantTotal: 70000,
        modePaiement: 'Carte',
        pompiste: 'Ali K.',
        pompe: 'Pompe 3',
        client: 'Entreprise ABC' // Cette ligne est correcte car la valeur est un 'string'.
    },
    {
        id: 'VD-003',
        date: subDays(new Date(), 1).toISOString(),
        produit: 'SP98',
        quantite: 30,
        unite: 'L',
        prixUnitaire: 800,
        montantTotal: 24000,
        modePaiement: 'Mobile Money',
        pompiste: 'Natalya P.',
        pompe: 'Pompe 2'
        // FIX: La ligne 'client: null' a été supprimée.
    }
];

// Mock simple employees data
export const dummyEmployesSimples = [
    { id: 'EMP1', nomComplet: 'Natalya P.', rolePrincipal: 'pompiste' },
    { id: 'EMP2', nomComplet: 'Ali K.', rolePrincipal: 'pompiste' },
    { id: 'EMP3', nomComplet: 'Jean C.', rolePrincipal: 'caissier' }
];

// Function to generate shifts for a date
export const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
    // Helper to create a valid ISO string for a given time on a given date
    const createIsoDate = (baseDate: Date, time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const newDate = new Date(baseDate);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate.toISOString();
    };

    return [
        {
            id: `matin_${date.toISOString().split('T')[0]}`,
            libelle: 'Matin (07h-15h)',
            dateDebut: createIsoDate(date, '07:00'),
            dateFin: createIsoDate(date, '15:00'),
            statut: 'en_cours'
        },
        {
            id: `soir_${date.toISOString().split('T')[0]}`,
            libelle: 'Soir (15h-23h)',
            dateDebut: createIsoDate(date, '15:00'),
            dateFin: createIsoDate(date, '23:00'),
            statut: 'planifie'
        }
    ];
};

// Function to fetch sales performance by employee
export const fetchVentesParPersonnel = async (
    _date: Date,
    _quartId: string,
    _employeId: string | null
): Promise<PerformanceVenteEmploye[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            employeId: 'EMP1',
            employeNom: 'Natalya P.',
            roleQuart: 'pompiste',
            posteLibelle: 'Pompes 1 & 2',
            nombreTransactions: 45,
            totalVolumeVendu: 2250,
            uniteVolume: 'L',
            totalMontantBrutVentes: 1687500,
            totalRemisesAccordees: 0,
            totalMontantNetEncaisse: 1687500
        },
        {
            employeId: 'EMP2',
            employeNom: 'Ali K.',
            roleQuart: 'pompiste',
            posteLibelle: 'Pompes 3 & 4',
            nombreTransactions: 38,
            totalVolumeVendu: 1900,
            uniteVolume: 'L',
            totalMontantBrutVentes: 1425000,
            totalRemisesAccordees: 15000,
            totalMontantNetEncaisse: 1410000
        }
    ];
};

export const produitsCarburant = [
  { id: 'SP95', nom: 'Super SP95', prix: 750, unite: 'L' },
  { id: 'DIESEL', nom: 'Diesel', prix: 700, unite: 'L' },
  { id: 'SP98', nom: 'SP98', prix: 800, unite: 'L' }
];

export const clientsDisponibles = [
  { id: 'CLI001', nom: 'Transport Express Plus' },
  { id: 'CLI002', nom: 'BTP Construction S.A.' },
  { id: 'CLI003', nom: 'AgroDistrib & Co' }
];

export const dummyVentesTerme: VenteTerme[] = [
  {
    id: 'VT-001',
    client: 'Transport Express Plus',
    produit: 'Super SP95',
    quantite: 500,
    montantTotal: 375000,
    dateEcheance: '2024-08-15',
    statut: 'En attente' as StatutVenteTerme,
    status: 'En attente' as StatutVenteTerme
  },
  {
    id: 'VT-002',
    client: 'BTP Construction S.A.',
    produit: 'Diesel',
    quantite: 1200,
    montantTotal: 840000,
    dateEcheance: '2024-08-20',
    statut: 'Payée' as StatutVenteTerme,
    status: 'Payée' as StatutVenteTerme
  },
  {
    id: 'VT-003',
    client: 'AgroDistrib & Co',
    produit: 'SP98',
    quantite: 300,
    montantTotal: 240000,
    dateEcheance: '2024-08-10',
    statut: 'En retard' as StatutVenteTerme,
    status: 'En retard' as StatutVenteTerme
  }
];