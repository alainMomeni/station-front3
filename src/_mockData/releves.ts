import { format, subDays } from 'date-fns';
import type { ReleveCompteClient, ClientProfessionnel } from '../types/clients';

// Export dummy professional clients
export const dummyClientsProData: ClientProfessionnel[] = [
  {
      id: 'CLI001',
      typeClient: 'professionnel',
      nomEntreprise: 'Transport Express Plus',
      statutCompte: 'actif',
      email: 'contact@transportexpress.com',
      telephone: '+237 677 123 456',
      adresse: 'Rue des Transporteurs, Douala',
      limiteCredit: 5000000,
      soldeActuel: 2350000,
      raisonSociale: '',
      nomAffichage: ''
  },
  {
      id: 'CLI002',
      typeClient: 'professionnel',
      nomEntreprise: 'BTP Construction S.A.',
      statutCompte: 'actif',
      email: 'compta@btpconstruction.cm',
      telephone: '+237 699 234 567',
      adresse: 'Zone Industrielle, Yaoundé',
      limiteCredit: 10000000,
      soldeActuel: 7500000,
      raisonSociale: '',
      nomAffichage: ''
  }
];

export const fetchRelevePourClientEtPeriode = async (
  clientId: string,
  dateDebut: string,
  dateFin: string
): Promise<ReleveCompteClient> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const client = dummyClientsProData.find(c => c.id === clientId);
  if (!client) throw new Error('Client non trouvé');

  return {
    clientId: client.id,
    clientNom: client.nomEntreprise!,
    clientAdresse: client.adresse,
    clientEmail: client.email,
    numeroReleve: `REL-${format(new Date(), 'yyyyMMdd')}-${client.id}`,
    dateGeneration: format(new Date(), 'yyyy-MM-dd'),
    periodeDebut: dateDebut,
    periodeFin: dateFin,
    soldeInitialPeriode: 1500000,
    lignes: [
      {
        date: format(subDays(new Date(), 15), 'dd/MM/yyyy HH:mm'),
        reference: 'FAC-2024-001',
        description: 'Facture Carburant',
        debit: 450000,
        soldeProgressif: 1950000
      },
      {
        date: format(subDays(new Date(), 10), 'dd/MM/yyyy HH:mm'),
        reference: 'PMT-2024-001',
        description: 'Paiement par virement',
        credit: 1000000,
        soldeProgressif: 950000
      }
    ],
    soldeFinalPeriode: 950000,
    totalDebitsPeriode: 450000,
    totalCreditsPeriode: 1000000,
    notesBasDePage: 'Merci de votre confiance.'
  };
};