
export interface VenteEmployeDetail {
  id: string; // ID de la transaction
  heure: string; // HH:mm
  produitService: string;
  quantite: number;
  unite: string;
  montantBrut: number;
  remise: number;
  montantNet: number;
  modePaiement: string;
}

export interface PerformanceVenteEmploye {
  employeId: string;
  employeNom: string;
  roleQuart: 'pompiste' | 'caissier'; // Rôle tenu pendant CE quart
  posteLibelle?: string; // Ex: "Pompe P01" ou "Caisse Principale"
  nombreTransactions: number;
  totalVolumeVendu?: number; // Pour carburant
  uniteVolume?: 'L'; // Pour carburant
  totalMontantBrutVentes: number; // XAF
  totalRemisesAccordees: number; // XAF
  totalMontantNetEncaisse: number; // XAF
  detailsTransactions?: VenteEmployeDetail[]; // Pour un affichage détaillé optionnel
}

// Pour les filtres
export interface EmployeSimple {
  id: string;
  nomComplet: string;
  rolePrincipal: 'pompiste' | 'caissier' | 'chef_de_piste' | 'polyvalent';
}

export interface ClientProfessionnel {
  id: string;
  nomEntreprise: string;
  contactPrincipal?: string;
  emailContact?: string;
  telephoneContact?: string;
  adresseFacturation?: string;
  limiteCredit: number; // En XAF
  soldeActuel: number;   // Montant actuellement dû par le client (positif si le client doit, négatif si crédit)
  statutCompte?: 'actif' | 'bloque' | 'inactif'; // Bloqué si limite dépassée ou autre raison
  derniereFactureDate?: string; // YYYY-MM-DD
  derniereFactureMontant?: number;
}

export interface TransactionCredit {
  id: string;
  clientId: string;
  clientNom: string; // Pour affichage facile
  dateTransaction: string; // YYYY-MM-DD HH:mm
  description: string; // Ex: "Carburant SP95 - P01" ou "Huile Moteur SuperGrade"
  montant: number; // Montant de cette transaction
  referenceBC?: string; // Si liée à un bon de commande interne
  estFacturee: boolean;
  factureId?: string; // Si déjà facturée
}