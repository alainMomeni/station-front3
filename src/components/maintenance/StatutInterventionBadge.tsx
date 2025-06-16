import React from 'react';
import type { StatutIntervention } from '../../types/maintenance';
//... (logique de mapping des statuts vers les variantes de badge)
const StatutInterventionBadge: React.FC<{ statut: StatutIntervention }> = ({ statut }) => {
  return <div>{statut}</div>;
};
export default StatutInterventionBadge;