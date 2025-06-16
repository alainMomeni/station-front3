// src/components/personnel/StatutCompteUtilisateurBadge.tsx
import React from 'react';
import { CheckCircle, Lock, PauseCircle, HelpCircle } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutCompteUtilisateur } from '../../types/personnel';

const statusConfig: Record<StatutCompteUtilisateur, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  actif: { text: 'Actif', variant: 'success', icon: CheckCircle },
  inactif: { text: 'Inactif', variant: 'neutral', icon: PauseCircle },
  bloque: { text: 'Bloqué', variant: 'error', icon: Lock },
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral' as const, icon: HelpCircle };

interface StatutCompteUtilisateurBadgeProps {
  statut: StatutCompteUtilisateur;
}

const StatutCompteUtilisateurBadge: React.FC<StatutCompteUtilisateurBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || unknownStatus;
  
  return (
    <Badge variant={config.variant} icon={<config.icon className="h-full w-full"/>}>
      {config.text}
    </Badge>
  );
};

export default StatutCompteUtilisateurBadge;