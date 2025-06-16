// src/components/equipements/StatutCuveBadge.tsx
import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutCuve } from '../../types/equipements';

// Mapping du statut métier vers notre Design System
const statusConfig: Record<StatutCuve, { text: string; variant: BadgeProps['variant']; }> = {
  operationnelle: { text: 'Opérationnelle', variant: 'success' },
  maintenance: { text: 'En Maintenance', variant: 'warning' },
  hors_service: { text: 'Hors Service', variant: 'error' },
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral' as const };

interface StatutCuveBadgeProps {
  statut: StatutCuve;
}

const StatutCuveBadge: React.FC<StatutCuveBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || unknownStatus;
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatutCuveBadge;