// src/components/reclamations/StatutReclamationBadge.tsx
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { StatutReclamation } from '../../types/reclamations';

// Mapping du statut métier vers notre Design System
const statusConfig: Record<StatutReclamation, { text: string; variant: BadgeProps['variant']; }> = {
  nouvelle: { text: 'Nouvelle', variant: 'info' },
  en_cours: { text: 'En Cours', variant: 'warning' },
  en_attente_client: { text: 'Attente Client', variant: 'primary' },
  resolue: { text: 'Résolue', variant: 'success' },
  cloturee: { text: 'Clôturée', variant: 'neutral' },
  rejetee: { text: 'Rejetée', variant: 'error' },
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral' as const };

interface StatutReclamationBadgeProps {
  statut: StatutReclamation;
}

const StatutReclamationBadge: React.FC<StatutReclamationBadgeProps> = ({ statut }) => {
  const config = statusConfig[statut] || unknownStatus;
  
  return (
    <Badge variant={config.variant} icon={<HelpCircle className="h-full w-full opacity-0" />}>
      {config.text}
    </Badge>
  );
};

export default StatutReclamationBadge;