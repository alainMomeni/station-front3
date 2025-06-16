// src/components/suivi-livraisons/StatutBadge.tsx
import React from 'react';
import { Clock, Package, CheckSquare, XCircle, FileText, AlertCircle } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui'; // On importe notre composant Badge
import type { StatutBC } from '../../types/achats';

// Mapping des statuts métiers vers les variantes de notre Design System
const statusMap: Record<StatutBC, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  soumis: { text: 'En attente', variant: 'info', icon: Clock },
  partiellement_livre: { text: 'Partiel', variant: 'warning', icon: Package },
  livre: { text: 'Terminée', variant: 'success', icon: CheckSquare },
  annule: { text: 'Annulé', variant: 'error', icon: XCircle },
  brouillon: { text: 'Brouillon', variant: 'neutral', icon: FileText },
  en_litige: { text: 'En Litige', variant: 'error', icon: AlertCircle }
};

interface StatutBadgeProps {
  statut: StatutBC;
}

const StatutBadge: React.FC<StatutBadgeProps> = ({ statut }) => {
  const config = statusMap[statut] || statusMap.brouillon;

  return (
    <Badge variant={config.variant} icon={<config.icon className="h-full w-full" />}>
      {config.text}
    </Badge>
  );
};

export default StatutBadge;