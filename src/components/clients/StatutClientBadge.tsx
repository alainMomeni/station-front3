// src/components/clients/StatutClientBadge.tsx
import React from 'react';
import type { StatutClient } from '../../types/clients';

interface StatutClientBadgeProps {
  statut: StatutClient; // Using the proper type from types/clients.ts
}

const StatutClientBadge: React.FC<StatutClientBadgeProps> = ({ statut }) => {
  const getStatusStyles = (statut: StatutClient): string => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-gray-100 text-gray-800';
      case 'bloque':
        return 'bg-red-100 text-red-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(statut)}`}>
      {statut.charAt(0).toUpperCase() + statut.slice(1)}
    </span>
  );
};

export default StatutClientBadge;