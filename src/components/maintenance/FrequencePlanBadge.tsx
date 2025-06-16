import React from 'react';
import type { FrequencePlan } from '../../types/maintenance';
//... (logique de mapping de la fréquence vers la variante de badge)
const FrequencePlanBadge: React.FC<{ frequence: FrequencePlan }> = ({ frequence }) => {
  return <div>{frequence}</div>;
};
export default FrequencePlanBadge;