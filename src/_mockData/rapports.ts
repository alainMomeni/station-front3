import { format } from 'date-fns';
import type { RapportFiltres, RapportResultat, TypeRapportGlobal } from '../types/rapports';

export const typesDeRapportsDisponibles: { value: TypeRapportGlobal; label: string }[] = [
  { value: 'ventes_globales_carburant', label: 'Ventes Globales Carburant (Volume & Valeur)' },
  { value: 'ventes_globales_boutique', label: 'Ventes Globales Boutique (Articles & Valeur)' },
  { value: 'synthese_encaissements', label: 'Synthèse des Encaissements (par type)' },
  { value: 'inventaire_valeur_stock_boutique', label: 'Inventaire et Valorisation Stock Boutique' },
  { value: 'rapport_activite_journalier_complet', label: 'Rapport d\'Activité Journalier Détaillé' }
];

export const genererRapportSimule = async (filtres: RapportFiltres): Promise<RapportResultat> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simule le délai

  const periodeStr = `Du ${format(new Date(filtres.dateDebut), 'dd/MM/yyyy')} au ${format(new Date(filtres.dateFin), 'dd/MM/yyyy')}`;
  
  switch (filtres.typeRapport) {
    case 'ventes_globales_carburant':
      return {
        titre: 'Rapport des Ventes Globales de Carburant',
        periode: periodeStr,
        indicateursCles: [
          { libelle: 'Volume Total Vendu', valeur: (Math.random() * 50000 + 10000).toFixed(2), unite: 'L' },
          { libelle: 'Chiffre d\'Affaires', valeur: (Math.random() * 30000000 + 5000000).toLocaleString('fr-FR'), unite: 'XAF' }
        ],
        tableauDonnees: {
          entetes: ['Type Carburant', 'Volume (L)', 'CA (XAF)'],
          lignes: [
            ['SP95', (Math.random() * 20000).toFixed(2), (Math.random() * 15000000).toFixed(0)],
            ['Diesel', (Math.random() * 30000).toFixed(2), (Math.random() * 20000000).toFixed(0)],
            ['SP98', (Math.random() * 5000).toFixed(2), (Math.random() * 3000000).toFixed(0)]
          ]
        }
      };

    case 'synthese_encaissements':
      const totalEnc = Math.random() * 40000000 + 10000000;
      return {
        titre: 'Synthèse des Encaissements',
        periode: periodeStr,
        indicateursCles: [{
          libelle: "Total Encaissé",
          valeur: totalEnc.toLocaleString('fr-FR'),
          unite: 'XAF'
        }],
        tableauDonnees: {
          entetes: ['Mode de Paiement', 'Montant (XAF)', '%'],
          lignes: [
            ['Espèces', (totalEnc * 0.45).toFixed(0), '45%'],
            ['Carte Bancaire', (totalEnc * 0.35).toFixed(0), '35%'],
            ['Mobile Money', (totalEnc * 0.15).toFixed(0), '15%'],
            ['Ventes à Crédit', (totalEnc * 0.05).toFixed(0), '5%']
          ]
        }
      };

    default:
      return {
        titre: `Rapport ${filtres.typeRapport}`,
        periode: periodeStr,
        indicateursCles: [
          { libelle: 'Données', valeur: 'Simulées', unite: '' }
        ]
      };
  }
};