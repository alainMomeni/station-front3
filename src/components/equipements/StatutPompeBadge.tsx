// src/components/equipements/StatutPompeBadge.tsx
import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutPompe } from '../../types/equipements';

// Mapping du statut métier vers notre Design System
const statusConfig: Record<StatutPompe, { text: string; variant: BadgeProps['variant']; }> = {
  active: { text: 'Active', variant: 'success' },
  inactive: { text: 'Inactive', variant: 'neutral' },
  en_maintenance: { text: 'En Maintenance', variant: 'warning' },
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral' as const };

interface StatutPompeBadgeProps {
  statut: StatutPompe;
}

const StatutPompeBadge: React.FC<StatutPompeBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || unknownStatus;
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatutPompeBadge;