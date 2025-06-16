import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';  // Add this import
import type { RoleType, UtilisateurSysteme, RecapPerformanceEmploye, EmployeSimple } from '../types/personnel';

// Helper function for generating full names
export const generateNomComplet = (prenom: string, nom: string): string => {
  return `${prenom} ${nom}`.trim();
};

// Role options for filters
export const rolesPourFiltre: { value: RoleType | ''; label: string }[] = [
    { value: '', label: 'Tous les Rôles' },
    { value: 'pompiste', label: 'Pompiste' },
    { value: 'caissier', label: 'Caissier' },
    { value: 'chef_de_piste', label: 'Chef de Piste' },
    { value: 'gerant', label: 'Gérant' }
];

export const dummyEmployesPourPerf: EmployeSimple[] = [
    { id: 'emp1', nomComplet: 'Natalya P.', rolePrincipal: 'pompiste' },
    { id: 'emp2', nomComplet: 'Jean C.', rolePrincipal: 'caissier' },
    { id: 'emp3', nomComplet: 'Ali K.', rolePrincipal: 'pompiste' },
    { id: 'emp4', nomComplet: 'Fatima B.', rolePrincipal: 'caissier' },
    { id: 'emp5', nomComplet: 'Moussa D.', rolePrincipal: 'polyvalent' }
];

export const dummyUtilisateursData: UtilisateurSysteme[] = [
    {
        id: 'usr1',
        prenom: 'Natalya',
        nom: 'Pompiste',
        email: 'natalya@station.com',
        roles: ['pompiste'],
        statutCompte: 'actif',
        derniereConnexion: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd HH:mm:ss'),
        dateCreation: format(new Date(Date.now() - 86400000 * 30), 'yyyy-MM-dd HH:mm:ss'),
        nomComplet: generateNomComplet('Natalya', 'Pompiste')
    },
    {
        id: uuidv4(),
        prenom: 'Jean',
        nom: 'Caissier',
        email: 'jean.c@station.com',
        roles: ['caissier'],
        statutCompte: 'actif',
        derniereConnexion: format(new Date(Date.now() - 3600000 * 5), 'yyyy-MM-dd HH:mm:ss'),
        dateCreation: format(new Date(Date.now() - 86400000 * 60), 'yyyy-MM-dd HH:mm:ss'),
        nomComplet: 'Jean Caissier'
    },
    {
        id: 'gerant_admin_001',
        prenom: 'M.',
        nom: 'Diallo',
        email: 'gerant@station.com',
        roles: ['gerant'],
        statutCompte: 'actif',
        derniereConnexion: new Date().toISOString(),
        dateCreation: new Date(Date.now() - 86400000 * 100).toISOString(),
        nomComplet: 'M. Diallo'
    }
];

export const fetchRecapPerformancePersonnel = async (
    _dateDebut: string,
    _dateFin: string,
    employeId?: string
): Promise<RecapPerformanceEmploye[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return dummyEmployesPourPerf
        .filter(e => !employeId || e.id === employeId)
        .map(e => ({
            employeId: e.id,
            nomComplet: e.nomComplet,
            rolePrincipal: e.rolePrincipal as any,
            rolesTenusSurPeriode: [e.rolePrincipal],
            nombreQuartsTravailles: Math.floor(Math.random() * 20) + 10,
            nombreRetards: Math.floor(Math.random() * 3),
            nombreAbsencesJustifiees: Math.floor(Math.random() * 2),
            nombreAbsencesNonJustifiees: Math.floor(Math.random() * 1),
            totalHeuresTravaillees: Math.floor(Math.random() * 160) + 120,
            chiffreAffairesTotal: Math.floor(Math.random() * 5000000) + 1000000,
            volumeTotalVendu: e.rolePrincipal === 'pompiste' ? Math.floor(Math.random() * 20000) + 5000 : undefined,
            uniteVolume: e.rolePrincipal === 'pompiste' ? 'L' : undefined,
            nombreTotalTransactions: Math.floor(Math.random() * 500) + 100,
            venteMoyenneParTransaction: Math.floor(Math.random() * 50000) + 10000
        }));
};