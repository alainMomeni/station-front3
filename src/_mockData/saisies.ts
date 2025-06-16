import { format } from 'date-fns';
import type { CaissePourSaisie, QuartTravail, CuvePourSaisieIndex } from '../types/saisies';

export const generateDummyQuartsPourDate = (date: Date): QuartTravail[] => {
  const dateStr = format(date, 'dd/MM/yyyy');
  const dateIsoSuffix = format(date, 'yyyyMMdd');
  
  return [
    {
      id: `matin_${dateIsoSuffix}`,
      libelle: `(07h-15h) - ${dateStr}`,
      dateDebut: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`,
      dateFin: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`,
      statut: 'termine'
    },
    {
      id: `soir_${dateIsoSuffix}`,
      libelle: `(15h-23h) - ${dateStr}`,
      dateDebut: `${format(date, 'yyyy-MM-dd')}T15:00:00Z`,
      dateFin: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`,
      statut: 'en_cours'
    },
    {
      id: `nuit_${dateIsoSuffix}`,
      libelle: `(23h-07h) - ${dateStr}`,
      dateDebut: `${format(date, 'yyyy-MM-dd')}T23:00:00Z`,
      dateFin: `${format(date, 'yyyy-MM-dd')}T07:00:00Z`,
      statut: 'planifie'
    }
  ];
};

export const fetchCaissesPourQuartEtDate = async (
  _quartId: string,
  _date: Date
): Promise<CaissePourSaisie[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 'CAISSE_01',
      libelle: 'Caisse Principale',
      caissierNomAffecte: 'Jean C.',
      montantTheoriqueEspeces: 450000,
      montantReelCompteEspeces: '',
      notesSpecifiquesCaisse: ''
    },
    {
      id: 'CAISSE_02',
      libelle: 'Caisse Secondaire',
      caissierNomAffecte: 'Aisha K.',
      montantTheoriqueEspeces: 275000,
      montantReelCompteEspeces: '',
      notesSpecifiquesCaisse: ''
    }
  ];
};

export const fetchCuvesPourQuartEtDate = async (
  _quartId: string,
  _date: Date
): Promise<CuvePourSaisieIndex[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 'CUVE_01',
      nomCuve: 'Cuve SP95 - Principale',
      typeCarburant: 'SP95',
      unite: 'L',
      dernierIndexFinConnu: 123456.75,
      indexDebutQuart: '',
      indexFinQuart: '',
      indexFinTheorique: 123789.50
    },
    {
      id: 'CUVE_02',
      nomCuve: 'Cuve Diesel - A',
      typeCarburant: 'Diesel',
      unite: 'L',
      dernierIndexFinConnu: 89123.50,
      indexDebutQuart: '',
      indexFinQuart: '',
      indexFinTheorique: 89456.25
    },
    {
      id: 'CUVE_03',
      nomCuve: 'Cuve SP98 - Réserve',
      typeCarburant: 'SP98',
      unite: 'L',
      dernierIndexFinConnu: 45678.25,
      indexDebutQuart: '',
      indexFinQuart: '',
      indexFinTheorique: 45890.75
    }
  ];
};