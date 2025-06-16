import { format, subDays } from 'date-fns';
import type { LogActivite, LogActionType } from '../types/logs';

// List of possible log action types for filtering
export const logActionTypes: LogActionType[] = [
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'LOGOUT',
    'CREATE',
    'UPDATE',
    'DELETE',
    'PRICE_CHANGE',
    'STOCK_ADJUSTMENT',
    'PERMISSION_CHANGE',
    'SYSTEM_ACTION'
];

// Mock users for logs
export const dummyUtilisateursLog = [
    { id: 'USR001', nomComplet: 'Jean Caissier', prenom: 'Jean', nom: 'Caissier' },
    { id: 'USR002', nomComplet: 'Natalya Pompiste', prenom: 'Natalya', nom: 'Pompiste' },
    { id: 'USR003', nomComplet: 'M. Diallo (Admin)', prenom: 'M.', nom: 'Diallo' }
];

// Mock logs data
export const dummyLogsData: LogActivite[] = [
    {
        id: 1,
        timestamp_log: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
        utilisateur_id_log: 'USR001',
        action_log: 'LOGIN_SUCCESS',
        details_log: { ip: '192.168.1.100', navigator: 'Chrome' },
        resultat_action_log: 'succes'
    },
    {
        id: 2,
        timestamp_log: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
        utilisateur_id_log: 'USR002',
        action_log: 'STOCK_ADJUSTMENT',
        details_log: { 
            produit_id: 'PROD001',
            ancien_stock: 100,
            nouveau_stock: 95,
            motif: 'Correction inventaire'
        },
        entite_concernee_log: 'stocks',
        entite_id_concernee_log: 'PROD001',
        resultat_action_log: 'succes'
    },
    {
        id: 3,
        timestamp_log: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
        utilisateur_id_log: 'USR003',
        action_log: 'PRICE_CHANGE',
        details_log: {
            produit_id: 'CARB001',
            ancien_prix: 750,
            nouveau_prix: 755
        },
        entite_concernee_log: 'prix_carburants',
        entite_id_concernee_log: 'CARB001',
        resultat_action_log: 'succes'
    }
];