import { format } from 'date-fns';
import type { QuartTravail, SuiviPresenceEmploye } from '../types/personnel';

export const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'ddMMyy');
  return [
    {
      id: `matin_${dateStr}`,
      libelle: 'Matin (07h-15h)',
      heureDebut: '07:00',
      heureFin: '15:00',
      statut: 'en_cours',
      postesAConfigurer: undefined
    },
    {
      id: `soir_${dateStr}`,
      libelle: 'Soir (15h-23h)',
      heureDebut: '15:00',
      heureFin: '23:00',
      statut: 'planifie',
      postesAConfigurer: undefined
    },
    {
      id: `nuit_${dateStr}`,
      libelle: 'Nuit (23h-07h)',
      heureDebut: '23:00',
      heureFin: '07:00',
      statut: 'planifie',
      postesAConfigurer: undefined
    }
  ];
};

export const fetchPersonnelAffecteEtPresence = async (
  _quartId: string, 
  _date: Date
): Promise<SuiviPresenceEmploye[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      id: 'EMP001',
      nomComplet: 'Natalya P.',
      rolePrevU: 'pompiste',
      posteLibelle: 'Pompes 1 & 2',
      statut: 'present',
      heureArriveeReelle: '06:55',
      heureDepartReelle: '15:05'
    },
    {
      id: 'EMP002',
      nomComplet: 'Jean C.',
      rolePrevU: 'caissier',
      posteLibelle: 'Caisse Principale',
      statut: 'retard',
      heureArriveeReelle: '07:25',
      heureDepartReelle: '15:00',
      motifAbsenceRetard: 'Panne de voiture'
    },
    {
      id: 'EMP003',
      nomComplet: 'Ali K.',
      rolePrevU: 'pompiste',
      posteLibelle: 'Pompes 3 & 4',
      statut: 'absent_justifie',
      motifAbsenceRetard: 'Arrêt maladie'
    }
  ];
};