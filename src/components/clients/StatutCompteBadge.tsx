// src/components/clients/StatutCompteBadge.tsx
import React from 'react';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutCompteClient } from '../../types/ventes'; // Assurez-vous d'avoir ce type

// Mapping du statut métier vers notre Design System
const statusConfig: Record<StatutCompteClient, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  actif: { text: 'Actif', variant: 'success', icon: CheckCircle },
  bloque: { text: 'Bloqué', variant: 'error', icon: Lock },
  inactif: {
    text: '',
    variant: undefined,
    icon: 'symbol'
  }
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral' as const, icon: AlertCircle };

interface StatutCompteBadgeProps {
  statut: StatutCompteClient | undefined;
  className?: string;
}

const StatutCompteBadge: React.FC<StatutCompteBadgeProps> = ({ statut, className }) => {
  const config = statut ? statusConfig[statut] : unknownStatus;
  
  return (
    <Badge variant={config.variant} className={className} icon={<config.icon className="h-full w-full"/>}>
      {config.text}
    </Badge>
  );
};

export default StatutCompteBadge;