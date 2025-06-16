// src/components/suivi-livraisons/LivraisonList.tsx
import React from 'react';
import { Eye, CheckSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatutBadge from './StatutBadge';
import Pagination from '../common/Pagination';
import { Button, Table } from '../ui';
import type { Column } from '../ui/Table';
import type { BonCommandeData } from '../../types/achats';

interface LivraisonListProps {
  bonsDeCommande: BonCommandeData[];
  onSelectBC: (bc: BonCommandeData) => void;
  paginationProps: React.ComponentProps<typeof Pagination>;
}

const LivraisonList: React.FC<LivraisonListProps> = ({
  bonsDeCommande,
  onSelectBC,
  paginationProps
}) => {
  // Définition des colonnes à l'intérieur du composant pour avoir accès à onSelectBC
  const columns: Column<BonCommandeData>[] = React.useMemo(() => [
    {
      key: 'statut',
      title: 'Statut',
      render: (_, record) => record?.statut ? <StatutBadge statut={record.statut} /> : null,
    },
    {
      key: 'numeroBC',
      title: 'N° BC',
      dataIndex: 'numeroBC',
      render: (value) => value ? <span className="font-medium text-gray-900">{value}</span> : null,
    },
    {
      key: 'fournisseur',
      title: 'Fournisseur',
      dataIndex: 'fournisseurNom',
      render: (value) => value || '-'
    },
    {
      key: 'dateCommande',
      title: 'Date Commande',
      render: (_, record) => record?.dateCommande ?
        format(parseISO(record.dateCommande), 'dd MMM yyyy', { locale: fr }) : '-',
    },
    {
      key: 'livraisonPrevue',
      title: 'Livraison Prévue',
      render: (_, record) => record?.dateLivraisonSouhaitee ?
        format(parseISO(record.dateLivraisonSouhaitee), 'dd MMM yyyy', { locale: fr }) : '-',
    },
    {
      key: 'montant',
      title: 'Montant HT',
      align: 'right',
      render: (_, record) => (
        <span className="font-semibold text-gray-900">
          {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'XAF', 
            minimumFractionDigits: 0 
          }).format(record.totalHT)}
        </span>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      align: 'center',
      render: (_, record) => record ? (
        <Button
          onClick={() => onSelectBC(record)}
          variant={record.statut === 'livre' ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={record.statut === 'livre' ? <Eye className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
        >
          {record.statut === 'livre' ? 'Consulter' : 'Valider'}
        </Button>
      ) : null,
    },
  ], [onSelectBC]); // Dépendance sur onSelectBC

  return (
    <>
      <Table<BonCommandeData>
        columns={columns}
        data={bonsDeCommande}
      />
      <Pagination {...paginationProps} />
    </>
  );
};

export default LivraisonList;