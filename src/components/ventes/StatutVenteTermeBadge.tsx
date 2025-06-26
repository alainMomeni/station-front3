// src/components/ventes/StatutVenteTermeBadge.tsx
import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';

type StatutVenteTerme = 'En attente' | 'Payée' | 'En retard';

const statusConfig: Record<StatutVenteTerme, { text: string; variant: BadgeProps['variant']; }> = {
  'En attente': { text: 'En attente', variant: 'warning' },
  'Payée': { text: 'Payée', variant: 'success' },
  'En retard': { text: 'En retard', variant: 'error' },
};

interface StatutVenteTermeBadgeProps {
  statut: StatutVenteTerme;
}

const StatutVenteTermeBadge: React.FC<StatutVenteTermeBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || { text: 'Inconnu', variant: 'neutral' };
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default StatutVenteTermeBadge;