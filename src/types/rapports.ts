// src/types/rapports.ts (ou un fichier existant)

export type TypeRapportGlobal = 
    | 'ventes_globales_carburant'
    | 'ventes_globales_boutique'
    | 'synthese_encaissements'
    | 'analyse_marges_carburant' // Plus complexe, pour une V2
    | 'analyse_marges_boutique' // Plus complexe, pour une V2
    | 'inventaire_valeur_stock_boutique'
    | 'rapport_activite_journalier_complet'; // Un exemple de rapport très détaillé

export interface RapportFiltres {
    typeRapport: TypeRapportGlobal | '';
    dateDebut: string; // YYYY-MM-DD
    dateFin: string;   // YYYY-MM-DD
    // Optionnel: filtreSpecifique?: string; (ex: carburantId, categorieProduitId)
}

// Structure générique pour un rapport affiché (l'adapter selon le type)
export interface RapportResultat {
    titre: string;
    periode: string;
    indicateursCles?: { libelle: string; valeur: string | number; unite?: string }[];
    tableauDonnees?: {
        entetes: string[];
        lignes: (string | number)[][];
    };
    notes?: string;
    // rawData?: any; // Pour le téléchargement CSV/Excel
}