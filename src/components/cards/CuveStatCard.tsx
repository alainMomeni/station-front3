// src/components/cards/CuveStatCard.tsx
import React from 'react';
import { FiDroplet, FiAlertTriangle, FiChevronsDown, FiThermometer } from 'react-icons/fi';

export interface CuveStatData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  unite?: string;
  temperature?: number; // Optionnel
  derniereLivraisonDate?: string; // Optionnel
  volumeDisponibleAvantSeuil?: number; // Calculé
  pourcentageRemplissage?: number; // Calculé
  statutNiveau?: 'OK' | 'ALERTE_BASSE' | 'CRITIQUE'; // Calculé
}

interface CuveStatCardProps {
  cuve: CuveStatData;
}

const CuveStatCard: React.FC<CuveStatCardProps> = ({ cuve }) => {
  const uniteMesure = cuve.unite || 'L';
  
  const pourcentageRemplissage = cuve.pourcentageRemplissage !== undefined 
    ? cuve.pourcentageRemplissage 
    : (cuve.niveauActuel / cuve.capaciteMax) * 100;

  const volumeDisponibleAvantSeuil = cuve.volumeDisponibleAvantSeuil !== undefined
    ? cuve.volumeDisponibleAvantSeuil
    : Math.max(0, cuve.niveauActuel - cuve.seuilSecurite);

  let statutNiveau = cuve.statutNiveau;
  if (!statutNiveau) {
    if (cuve.niveauActuel <= cuve.seuilSecurite) {
        statutNiveau = 'CRITIQUE';
    } else if (cuve.niveauActuel <= cuve.seuilSecurite * 1.25) { // Ex: Alerte si < 25% au-dessus du seuil
        statutNiveau = 'ALERTE_BASSE';
    } else {
        statutNiveau = 'OK';
    }
  }

  let progressBarColor = 'bg-green-500';
  let textColor = 'text-green-700';
  let bgColor = 'bg-green-50';
  let borderColor = 'border-green-300';
  let statusText = 'Niveau OK';

  if (statutNiveau === 'ALERTE_BASSE') {
    progressBarColor = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-400';
    statusText = 'Niveau Bas - Planifier';
  } else if (statutNiveau === 'CRITIQUE') {
    progressBarColor = 'bg-red-500';
    textColor = 'text-red-700';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-400';
    statusText = 'Niveau Critique - Urgence!';
  }

  return (
    <div
      className={`rounded-lg shadow-md p-4 md:p-5 flex flex-col border-l-4 ${borderColor} ${bgColor} hover:shadow-xl transition-all duration-200`}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiDroplet className={`mr-2 h-5 w-5 ${textColor}`} />
            {cuve.nomCuve}
          </h3>
          {statutNiveau !== 'OK' && (
            <FiAlertTriangle className={`h-6 w-6 ${textColor} animate-pulse`} title={statusText} />
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2 -mt-2">{cuve.typeCarburant}</p>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>
              Niveau: <span className="font-semibold">{cuve.niveauActuel.toLocaleString('fr-FR')} {uniteMesure}</span>
            </span>
            <span className="text-xs text-gray-500">
              Max: {cuve.capaciteMax.toLocaleString('fr-FR')} {uniteMesure}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <div
              className={`h-3 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
              style={{ width: `${Math.max(0, Math.min(100, pourcentageRemplissage))}%` }}
              role="progressbar"
              aria-valuenow={pourcentageRemplissage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-600 mt-1">{pourcentageRemplissage.toFixed(1)}% plein</p>
        </div>

        <div className={`p-2.5 rounded-md text-sm mb-3 border ${borderColor} ${bgColor}`}>
            <p className={`flex items-center justify-between font-medium ${textColor}`}>
                <span className='flex items-center'><FiAlertTriangle className="mr-1.5 h-4 w-4"/>Statut Actuel:</span>
                <span>{statusText}</span>
            </p>
        </div>


        <div className="space-y-1.5 text-sm text-gray-600">
          <p className="flex items-center justify-between">
            <span className='flex items-center'><FiChevronsDown className="mr-1.5 h-4 w-4 text-gray-400"/>Seuil de Sécurité:</span>
            <span className={`font-medium ${statutNiveau === 'CRITIQUE' ? 'text-red-600' : 'text-gray-800'}`}>
                {cuve.seuilSecurite.toLocaleString('fr-FR')} {uniteMesure}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className='flex items-center'><FiDroplet className="mr-1.5 h-4 w-4 text-gray-400"/>Vol. Dispo. (avant seuil):</span>
            <span className="font-medium text-gray-800">
                {volumeDisponibleAvantSeuil.toLocaleString('fr-FR', {maximumFractionDigits:0})} {uniteMesure}
            </span>
          </p>
          {cuve.temperature !== undefined && (
            <p className="flex items-center justify-between">
                <span className='flex items-center'><FiThermometer className="mr-1.5 h-4 w-4 text-gray-400"/>Température:</span>
                <span className="font-medium text-gray-800">{cuve.temperature}°C</span>
            </p>
          )}
        </div>
      </div>

      {cuve.derniereLivraisonDate && (
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-2 mt-3 text-right">
          Dernière livraison : {new Date(cuve.derniereLivraisonDate).toLocaleDateString('fr-FR')}
        </div>
      )}
    </div>
  );
};

export default CuveStatCard;