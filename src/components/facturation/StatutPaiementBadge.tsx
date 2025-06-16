// src/components/facturation/StatutPaiementBadge.tsx
import React from 'react';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutPaiementFacture } from '../../types/facturation';

const statusConfig: Record<StatutPaiementFacture, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  non_payee: { text: 'Non Payée', variant: 'neutral', icon: Circle },
  partiellement_payee: { text: 'Partielle', variant: 'warning', icon: AlertCircle },
  payee: { text: 'Payée', variant: 'success', icon: CheckCircle },
  en_retard: { text: 'En Retard', variant: 'error', icon: Clock },
  annulee: { text: 'Annulée', variant: 'neutral', icon: Circle },
};

interface StatutPaiementBadgeProps {
  statut: StatutPaiementFacture;
}

const StatutPaiementBadge: React.FC<StatutPaiementBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || { text: 'Inconnu', variant: 'neutral', icon: Circle };
  
  return (
    <Badge variant={config.variant} icon={<config.icon className="h-full w-full"/>}>
      {config.text}
    </Badge>
  );
};

export default StatutPaiementBadge;