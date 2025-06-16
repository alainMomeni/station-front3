// src/data/dummy/clientsData.ts

import { format, subDays } from 'date-fns';
import type { ClientData } from '../types/clients';

export const dummyClientsData: ClientData[] = [
  {
    id: 'CLI001',
    typeClient: 'professionnel',
    nomAffichage: 'Transport Express Plus',
    raisonSociale: 'Transport Express Plus',
    statutCompte: 'actif',
    email: 'contact@transportexpress.com',
    telephone: '+221 77 123 45 67',
    adresse: 'Km 4, Route de Rufisque, Dakar',
    derniereActiviteDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    soldeActuelCredit: 2350000,
    limiteCredit: 5000000
  },
  {
    id: 'CLI002',
    typeClient: 'professionnel',
    nomAffichage: 'BTP Construction S.A.',
    raisonSociale: 'BTP Construction S.A.',
    statutCompte: 'actif',
    email: 'daf@btpconstruct.net',
    telephone: '+221 33 567 89 01',
    adresse: 'VDN, Cité Keur Gorgui',
    derniereActiviteDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    soldeActuelCredit: 7500000,
    limiteCredit: 10000000
  },
  {
    id: 'CLI003',
    typeClient: 'particulier',
    nomAffichage: 'Mme Diallo Aminata',
    prenom: 'Aminata',
    nomFamille: 'Diallo', // FIX: 'nom' a été renommé en 'nomFamille'
    statutCompte: 'actif',
    email: 'aminata.diallo@email.com',
    telephone: '+221 76 234 56 78',
    derniereActiviteDate: format(subDays(new Date(), 1), 'yyyy-MM-dd')
  },
  {
    id: 'CLI004',
    typeClient: 'particulier',
    nomAffichage: 'M. Sow Ibrahim',
    prenom: 'Ibrahim',
    nomFamille: 'Sow', // FIX: 'nom' a été renommé en 'nomFamille'
    statutCompte: 'inactif',
    telephone: '+221 70 345 67 89',
    derniereActiviteDate: format(subDays(new Date(), 30), 'yyyy-MM-dd')
  }
];

export const filtreTypeClientOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'particulier', label: 'Particulier' },
  { value: 'professionnel', label: 'Professionnel' }
];

export const filtreStatutClientOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'bloque', label: 'Bloqué' }
];