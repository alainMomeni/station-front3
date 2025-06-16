// src/_mockData/livraisons.ts
import type { BonCommandeData, Fournisseur } from '../types/achats';
import { format, subDays } from 'date-fns';

export const dummyFournisseurs: Fournisseur[] = [
  { id: 'F001', nom: 'TotalEnergies Distribution', email: 'commandes@total.com' },
  { id: 'F002', nom: 'Oilibya Petroleum', email: 'sales@oilibya.biz' },
  { id: 'F003', nom: 'Shell Gabon', email: 'orders@shell.ga' },
  { id: 'F004', nom: 'Petro Plus', email: 'achats@petroplus.com' }
];

const produits = [
  { id: 'CARB_SP95', nom: 'Essence SP95', prix: 650 },
  { id: 'CARB_DIESEL', nom: 'Diesel', prix: 680 },
  { id: 'CARB_SP98', nom: 'Essence SP98', prix: 710 }
];

const statuts = ['soumis', 'partiellement_livre', 'livre'] as const;

export const generateDummyBonsDeCommande = (): BonCommandeData[] => {
  return Array.from({ length: 16 }, (_, i) => {
    const produit = produits[i % 3];
    const quantite = 2000 + (i * 500);
    const montant = quantite * produit.prix;
    
    return {
      id: `BC${String(i + 1).padStart(3, '0')}`,
      numeroBC: `BC-2024-${String(i + 1).padStart(3, '0')}`,
      fournisseurId: `F00${1 + (i % 4)}`,
      fournisseurNom: dummyFournisseurs[i % 4].nom,
      dateCommande: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      dateLivraisonSouhaitee: format(subDays(new Date(), i - 7), 'yyyy-MM-dd'),
      statut: statuts[i % 3],
      lignes: [{
        id: `L${i + 1}`,
        produitId: produit.id,
        produitNom: produit.nom,
        quantite: String(quantite),
        unite: 'L',
        prixUnitaireHT: String(produit.prix),
        montantLigneHT: montant,
        quantiteRecue: i % 3 === 1 ? String(Math.floor(quantite * 0.8)) : undefined
      }],
      totalHT: montant,
      notes: '' // FIX: Ajout de la propriété 'notes' requise par le type BonCommandeData
    };
  });
};