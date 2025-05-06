import React from 'react';
import { FiDroplet, FiAlertTriangle, FiEdit } from 'react-icons/fi'; // Added FiEdit

interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  unite?: string;
  // On pourrait ajouter ici des champs pour les index précédents si nécessaire
  dernierIndexDebut?: number;
  dernierIndexFin?: number;
}

interface CuveCardProps {
  cuve: CuveData;
  onOpenIndexModal: (cuve: CuveData) => void; // Function to open modal
}

const CuveCard: React.FC<CuveCardProps> = ({ cuve, onOpenIndexModal }) => {
  const pourcentageRemplissage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
  const estSousSeuil = cuve.niveauActuel <= cuve.seuilSecurite;
  const uniteMesure = cuve.unite || 'L';

  let progressBarColor = 'bg-green-500';
  if (pourcentageRemplissage <= (cuve.seuilSecurite / cuve.capaciteMax * 100) + 15 && pourcentageRemplissage > (cuve.seuilSecurite / cuve.capaciteMax * 100)) {
    progressBarColor = 'bg-yellow-500';
  }
  if (estSousSeuil) {
    progressBarColor = 'bg-red-500';
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 md:p-5 hover:shadow-xl transition-all duration-200 cursor-pointer group" // Added cursor-pointer and group
      onClick={() => onOpenIndexModal(cuve)} // Make card clickable
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenIndexModal(cuve)}
      aria-label={`Saisir les index pour ${cuve.nomCuve}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiDroplet className="mr-2 h-5 w-5 text-purple-600" />
          {cuve.nomCuve} - {cuve.typeCarburant}
        </h3>
        <div className="flex items-center space-x-2">
            {estSousSeuil && (
              <FiAlertTriangle className="h-6 w-6 text-red-500 animate-pulse" title="Niveau bas !" />
            )}
            {/* Icon to suggest index entry, appears on hover/focus of the group */}
            <FiEdit className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-focus-within:text-purple-600 transition-colors" title="Saisir les index" />
        </div>
      </div>

      {/* ... (rest of the card content for levels remains the same) ... */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Niveau: {cuve.niveauActuel.toLocaleString()} {uniteMesure}</span>
          <span>Max: {cuve.capaciteMax.toLocaleString()} {uniteMesure}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 dark:bg-gray-700">
          <div
            className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
            style={{ width: `${Math.max(0, Math.min(100, pourcentageRemplissage))}%` }}
            role="progressbar"
            aria-valuenow={pourcentageRemplissage}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">{pourcentageRemplissage.toFixed(1)}% plein</p>
      </div>

      <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
        <p>Seuil de sécurité : <span className={`font-medium ${estSousSeuil ? 'text-red-600' : 'text-gray-700'}`}>{cuve.seuilSecurite.toLocaleString()} {uniteMesure}</span></p>
         {/* Display last known indexes if available */}
        {(cuve.dernierIndexDebut !== undefined || cuve.dernierIndexFin !== undefined) && (
          <p className="mt-1">Derniers index : {cuve.dernierIndexDebut ?? 'N/A'} - {cuve.dernierIndexFin ?? 'N/A'}</p>
        )}
      </div>
    </div>
  );
};

export default CuveCard;