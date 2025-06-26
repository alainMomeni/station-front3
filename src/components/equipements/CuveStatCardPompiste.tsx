// src/components/equipements/CuveStatCardPompiste.tsx (VERSION FINALE, CORRIGÉE & COMPLÈTE)
import React from 'react';
import { StatCard } from '../ui/StatCard'; // On utilise notre composant de base
import { Button } from '../ui/Button';
import { FiDroplet, FiEdit2 } from 'react-icons/fi';
import type { CuveData } from '../../types/equipements';

interface CuveStatCardPompisteProps {
  cuve: CuveData;
  onOpenIndexModal: (cuve: CuveData) => void;
}

// Helper pour déterminer la variante de la carte en fonction du niveau
const getVariantFromLevel = (cuve: CuveData): React.ComponentProps<typeof StatCard>['variant'] => {
    const pourcentage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
    if (pourcentage < 25 || cuve.niveauActuel <= cuve.seuilSecurite) return 'error';
    if (pourcentage < 50) return 'warning';
    return 'success';
};

const CuveStatCardPompiste: React.FC<CuveStatCardPompisteProps> = ({ cuve, onOpenIndexModal }) => {
  const pourcentage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
  const variant = getVariantFromLevel(cuve) || 'primary';

  // Déterminer la couleur de la barre de progression en fonction de la variante
  const progressBarColorClass = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    primary: 'bg-purple-500',
    neutral: 'bg-gray-500'
  }[variant];

  return (
    <StatCard
      variant={variant}
      icon={FiDroplet}
      title={cuve.nomCuve}
      value={cuve.niveauActuel.toLocaleString()}
      unit={cuve.unite}
      // Le footer contiendra TOUT: la jauge, les infos, et le bouton d'action.
      footer={
        <div className="space-y-3">
          {/* Section 1: Infos et Jauge */}
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span>{cuve.typeCarburant}</span>
              <span className="font-semibold">{pourcentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${progressBarColorClass}`}
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>
          </div>

          {/* Section 2: Seuil et Bouton d'action */}
          <div className="flex justify-between items-center border-t border-gray-200/60 pt-3">
            <p className="text-xs text-orange-600">
              Seuil: {cuve.seuilSecurite.toLocaleString()} {cuve.unite}
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenIndexModal(cuve)}
              leftIcon={<FiEdit2 />}
            >
              Saisir Index
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default CuveStatCardPompiste;