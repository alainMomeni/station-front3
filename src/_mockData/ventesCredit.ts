// Assumons que le nom de fichier est src/_mockData/facturation.ts
import { format, subDays } from 'date-fns';
import type { ClientProfessionnel, TransactionCredit } from '../types/ventes';

export const dummyClientsPro: ClientProfessionnel[] = [
  { 
    id: 'CLI001',
    nomEntreprise: 'Transport Express Plus',
    limiteCredit: 5000000,
    soldeActuel: 2350000,
    statutCompte: 'actif'
  },
  { 
    id: 'CLI002',
    nomEntreprise: 'BTP Construction S.A.',
    limiteCredit: 10000000,
    soldeActuel: 9850000,
    statutCompte: 'bloque'
  },
  { 
    id: 'CLI003',
    nomEntreprise: 'AgroDistrib & Co',
    limiteCredit: 2000000,
    soldeActuel: 750000,
    statutCompte: 'actif'
  }
];

export const dummyTransactionsCreditNonFacturees: TransactionCredit[] = [
  {
    id: 'TRCR001',
    clientId: 'CLI001',
    clientNom: 'Transport Express Plus',
    dateTransaction: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
    description: 'Carburant SP95 - BC123',
    montant: 450000,
    estFacturee: false // FIX: Propriété requise ajoutée
  },
  {
    id: 'TRCR002', 
    clientId: 'CLI002', 
    clientNom: 'BTP Construction S.A.',
    dateTransaction: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    description: 'Diesel Pack Pro',
    montant: 850000,
    estFacturee: false // FIX: Propriété requise ajoutée
  },
  {
    id: 'TRCR003',
    clientId: 'CLI003',
    clientNom: 'AgroDistrib & Co',
    dateTransaction: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
    description: 'Lubrifiants Industrie',
    montant: 175000,
    estFacturee: false // FIX: Propriété requise ajoutée
  }
];