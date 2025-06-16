// src/components/personnel/StatutPresenceBadge.tsx
import React from 'react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutPresence } from '../../types/personnel';
import { Check, X, Clock, AlertTriangle } from 'lucide-react';

const statusConfig: Record<StatutPresence, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  present: { text: 'Présent', variant: 'success', icon: Check },
  retard: { text: 'En Retard', variant: 'warning', icon: Clock },
  absent_justifie: { text: 'Absent (J)', variant: 'neutral', icon: X },
  absent_non_justifie: { text: 'Absent (NJ)', variant: 'error', icon: AlertTriangle },
  non_defini: { text: 'Non Défini', variant: 'neutral', icon: AlertTriangle },
};

interface StatutPresenceBadgeProps {
  statut: StatutPresence;
}

const StatutPresenceBadge: React.FC<StatutPresenceBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || statusConfig.non_defini;
  return <Badge variant={config.variant} icon={<config.icon className="h-3 w-3" />}>{config.text}</Badge>;
};

export default StatutPresenceBadge;