// src/data/dummy/facturationData.ts

import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import type { ClientPourFacturation, TransactionCredit, FactureClient } from '../types/facturation';

export const dummyClientsProData: ClientPourFacturation[] = [
  {
    id: 'CLI001',
    nomEntreprise: 'Transport Express Plus',
    soldeActuel: 2350000,
    limiteCredit: 5000000,
    statutCompte: 'actif',
    montantNonFacture: 450000
  },
  {
    id: 'CLI002',
    nomEntreprise: 'BTP Construction S.A.',
    soldeActuel: 9850000,
    limiteCredit: 10000000,
    statutCompte: 'bloque',
    montantNonFacture: 850000
  },
  {
    id: 'CLI003',
    nomEntreprise: 'AgroDistrib & Co',
    soldeActuel: 750000,
    limiteCredit: 2000000,
    statutCompte: 'actif',
    montantNonFacture: 175000
  }
];

export const dummyTransactionsCreditData: TransactionCredit[] = [
  {
    id: 'TRCR001',
    clientId: 'CLI001',
    clientNom: 'Transport Express Plus',
    dateTransaction: format(subDays(new Date(), 25), 'yyyy-MM-dd HH:mm:ss'), // Date ajustée pour être dans la période de facturation
    description: 'Carburant SP95 - BC123',
    montant: 450000,
    estFacturee: false
  },
  {
    id: 'TRCR002',
    clientId: 'CLI002',
    clientNom: 'BTP Construction S.A.',
    dateTransaction: format(subDays(new Date(), 40), 'yyyy-MM-dd HH:mm:ss'), // Date ajustée
    description: 'Diesel Pack Pro',
    montant: 850000,
    estFacturee: false
  }
];

// Période de facturation pour le mois précédent
const lastMonthStart = format(startOfMonth(subDays(new Date(), 30)), 'yyyy-MM-dd');
const lastMonthEnd = format(endOfMonth(subDays(new Date(), 30)), 'yyyy-MM-dd');


export const dummyFacturesClientData: FactureClient[] = [
  {
    id: 'FAC001',
    numeroFacture: 'F202401-001',
    clientId: 'CLI001',
    clientNom: 'Transport Express Plus',
    dateFacture: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    dateEcheance: format(subDays(new Date(), -15), 'yyyy-MM-dd'),
    statutPaiement: 'non_payee',
    montantTTC: 1250000,
    urlPdf: '#',
    dateCreation: format(subDays(new Date(), 15), 'yyyy-MM-dd HH:mm:ss'),
    
    // --- FIX: Ajout des propriétés requises ---
    periodeFactureeDebut: lastMonthStart,
    periodeFactureeFin: lastMonthEnd,
    transactionsIds: ['TRCR001'], // Lie la facture à la transaction
    montantHT: 1059322, // Montant TTC / 1.18 (TVA exemple)
  },
  {
    id: 'FAC002',
    numeroFacture: 'F202401-002',
    clientId: 'CLI002',
    clientNom: 'BTP Construction S.A.',
    dateFacture: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    dateEcheance: format(subDays(new Date(), 0), 'yyyy-MM-dd'),
    statutPaiement: 'payee',
    montantTTC: 2350000,
    urlPdf: '#',
    dateCreation: format(subDays(new Date(), 30), 'yyyy-MM-dd HH:mm:ss'),

    // --- FIX: Ajout des propriétés requises ---
    periodeFactureeDebut: lastMonthStart,
    periodeFactureeFin: lastMonthEnd,
    transactionsIds: ['TRCR002'], // Lie la facture à la transaction
    montantHT: 1991525, // Montant TTC / 1.18 (TVA exemple)
  }
];