// src/components/stocks/StatutStockBadge.tsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/Badge';
import type { ProduitStatutStock } from '../../types/stock';

// Mapping du statut métier vers notre Design System
const statusConfig: Record<ProduitStatutStock, { text: string; variant: BadgeProps['variant']; icon: React.ElementType }> = {
  OK: { text: 'OK', variant: 'success', icon: CheckCircle },
  STOCK_FAIBLE: { text: 'Stock Faible', variant: 'warning', icon: AlertTriangle },
  RUPTURE: { text: 'Rupture', variant: 'error', icon: XCircle },
};

const unknownStatus = { text: 'Inconnu', variant: 'neutral', icon: HelpCircle };

interface StatutStockBadgeProps {
  statut: ProduitStatutStock;
  className?: string;
}

const StatutStockBadge: React.FC<StatutStockBadgeProps> = ({ statut, className }) => {
  const config = statusConfig[statut] || unknownStatus;
  
  return (
    <Badge variant={config.variant} className={className} icon={<config.icon className="h-full w-full"/>}>
      {config.text}
    </Badge>
  );
};

export default StatutStockBadge;