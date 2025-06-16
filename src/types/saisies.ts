export type StatutQuart = 'planifie' | 'en_cours' | 'termine';

export interface QuartTravail {
    id: string;
    libelle: string;        // Ex: "Matin (07h-15h) - 15/07/2024"
    dateDebut: string;      // ISOString
    dateFin: string;        // ISOString
    statut: StatutQuart;
}

export interface CaissePourSaisie {
    id: string;
    libelle: string;                   // Ex: "Caisse Principale"
    caissierNomAffecte: string;        // Ex: "Jean C."
    montantTheoriqueEspeces: number;   // Montant théorique en caisse selon système
    montantReelCompteEspeces: string;  // Montant réellement compté (à saisir)
    notesSpecifiquesCaisse?: string;   // Notes spécifiques à cette caisse
}

export interface SaisieCaissePhysique {
    quartId: string;
    date: string;                      // ISOString
    caisses: CaissePourSaisie[];
    notesGenerales?: string;          // Notes générales sur la saisie
    dateValidation?: string;          // ISOString
    validePar?: string;              // ID de l'utilisateur qui valide
}

export interface CuvePourSaisieIndex {
    id: string;
    nomCuve: string;
    typeCarburant: string;
    unite: string;
    dernierIndexFinConnu?: number;
    indexDebutQuart?: string;
    indexFinQuart?: string;
    indexFinTheorique?: number;
    notesIndex?: string;
}