import type { ProduitCatalogueComplet, CategorieProduit } from '../types/catalogue';

export const dummyCategoriesData: CategorieProduit[] = [
  { 
    id: 'CAT_CARB',
    nom: 'Carburants',
    typeProduitAssocie: 'carburant',
    nombreProduits: 3
  },
  { 
    id: 'CAT_LUB', 
    nom: 'Lubrifiants',
    typeProduitAssocie: 'lubrifiant',
    nombreProduits: 5
  },
  { 
    id: 'CAT_ACC', 
    nom: 'Accessoires Auto',
    typeProduitAssocie: 'accessoire',
    nombreProduits: 8
  },
  { 
    id: 'CAT_SNACK', 
    nom: 'Snacks & Boissons',
    typeProduitAssocie: 'boutique',
    nombreProduits: 12
  }
];

export const dummyProduitsCatalogueData: ProduitCatalogueComplet[] = [
  {
    id: 'SP95',
    nom: 'Essence SP95',
    reference: 'CARB-SP95',
    categorieId: 'CAT_CARB',
    typeProduit: 'carburant',
    description: 'Carburant sans plomb 95',
    prixVenteActuel: 750,
    stockActuel: 15000,
    uniteMesure: 'L',
    estActif: true
  },
  {
    id: 'HM5W40',
    nom: 'Huile Moteur 5W40',
    reference: 'LUB-5W40',
    categorieId: 'CAT_LUB',
    typeProduit: 'lubrifiant',
    description: 'Huile moteur synthétique',
    prixVenteActuel: 5500,
    stockActuel: 50,
    uniteMesure: 'L',
    estActif: true
  },
  {
    id: 'SNACK01',
    nom: 'Barre Chocolatée Max',
    reference: 'SNK-CHOC',
    categorieId: 'CAT_SNACK',
    typeProduit: 'boutique',
    description: 'Barre chocolatée énergétique',
    prixVenteActuel: 500,
    stockActuel: 124,
    uniteMesure: 'Unité',
    estActif: true
  }
];