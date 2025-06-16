import { format, subDays } from 'date-fns';
import type { DepenseData, CategorieDepense, ModePaiementDepense } from '../types/finance';

export const modesPaiementOptions: { value: ModePaiementDepense; label: string }[] = [
  { value: 'especes', label: 'Espèces' },
  { value: 'virement_bancaire', label: 'Virement Bancaire' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'carte_entreprise', label: 'Carte Entreprise' },
  { value: 'mobile_money_entreprise', label: 'Mobile Money (Entr.)' },
  { value: 'autre', label: 'Autre' }
];

export const dummyCategoriesDepense: CategorieDepense[] = [
  { id: 'CAT_UTIL', nom: 'Fournitures & Utilitaires' },
  { id: 'CAT_MAINT', nom: 'Maintenance & Réparations' },
  { id: 'CAT_SAL', nom: 'Salaires & Charges' },
  { id: 'CAT_CARB', nom: 'Approvisionnement Carburant' },
  { id: 'CAT_BOUT', nom: 'Approvisionnement Boutique' },
  { id: 'CAT_DIV', nom: 'Dépenses Diverses' }
];

export const dummyDepenses: DepenseData[] = [
  {
    id: 'DEP001',
    dateDepense: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    description: 'Facture Électricité - Juillet',
    montant: 450000,
    categorieId: 'CAT_UTIL',
    fournisseurBeneficiaire: 'ENEO Cameroun',
    modePaiement: 'virement_bancaire',
    referencePaiement: 'VIR-2024-001',
    notes: 'Consommation mensuelle station'
  },
  {
    id: 'DEP002',
    dateDepense: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    description: 'Maintenance Pompes',
    montant: 250000,
    categorieId: 'CAT_MAINT',
    fournisseurBeneficiaire: 'TechnoService SARL',
    modePaiement: 'especes',
    referencePaiement: 'FACT-TS-235',
    notes: 'Maintenance trimestrielle'
  },
  {
    id: 'DEP003',
    dateDepense: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    description: 'Approvisionnement Boutique',
    montant: 850000,
    categorieId: 'CAT_BOUT',
    fournisseurBeneficiaire: 'Centrale Distribution',
    modePaiement: 'cheque',
    referencePaiement: 'CHQ-2024-015',
    notes: 'Réapprovisionnement stock boutique'
  }
];