import type { TypeCarburant, Cuve, Pompe } from '../types/equipements';

// Mock data for fuel types
export const dummyTypesCarburant: TypeCarburant[] = [
    { id: 'SP95', nom: 'SP95', unite: 'L' },
    { id: 'DIESEL', nom: 'Diesel', unite: 'L' },
    { id: 'SP98', nom: 'SP98', unite: 'L' },
    { id: 'KEROSENE', nom: 'Kérosène', unite: 'L' }
];

// Mock data for tanks
export const dummyCuvesData: Cuve[] = [
    {
        id: 'CUVE_01',
        nom: 'Cuve SP95 - Principale',
        typeCarburantId: 'SP95',
        capaciteMax: 20000,
        seuilAlerteBas: 4000,
        niveauActuel: 12500,
        seuilSecurite: 3000,
        statut: 'operationnelle'
    },
    {
        id: 'CUVE_02',
        nom: 'Cuve Diesel - A',
        typeCarburantId: 'DIESEL',
        capaciteMax: 15000,
        seuilAlerteBas: 3000,
        niveauActuel: 3500,
        seuilSecurite: 2500,
        statut: 'operationnelle'
    },
    {
        id: 'CUVE_03',
        nom: 'Cuve SP98 - Réserve',
        typeCarburantId: 'SP98',
        capaciteMax: 10000,
        seuilAlerteBas: 2500,
        niveauActuel: 8200,
        seuilSecurite: 2000,
        statut: 'operationnelle'
    }
];

// Mock data for pumps
export const dummyPompesData: Pompe[] = [
    {
        id: 'POMPE_01',
        nom: 'Pompe 1',
        modele: 'TokheimQuantium510',
        numeroSerie: 'TQ510-001',
        dateInstallation: '2023-01-15',
        statut: 'active',
        distributions: [
            { id: 'DIST_01', typeCarburantId: 'SP95', cuveId: 'CUVE_01' },
            { id: 'DIST_02', typeCarburantId: 'DIESEL', cuveId: 'CUVE_02' }
        ]
    },
    {
        id: 'POMPE_02',
        nom: 'Pompe 2',
        modele: 'TokheimQuantium510',
        numeroSerie: 'TQ510-002',
        dateInstallation: '2023-01-15',
        statut: 'active',
        distributions: [
            { id: 'DIST_03', typeCarburantId: 'SP95', cuveId: 'CUVE_01' },
            { id: 'DIST_04', typeCarburantId: 'SP98', cuveId: 'CUVE_03' }
        ]
    }
];

// Also export the dummyCuves for backwards compatibility
export const dummyCuves = dummyCuvesData;