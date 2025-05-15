// src/components/CuveCard.tsx
import React from 'react';
import { FiDroplet, FiAlertTriangle, FiEdit, FiArchive, FiDollarSign } from 'react-icons/fi'; // FiDollarSign ajoutée

interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  stockOuvertureQuart?: number;
  prixVenteUnitaire?: number; // PRIX DE VENTE UNITAIRE POUR LE CALCUL
  unite?: string;
  dernierIndexDebut?: number;
  dernierIndexFin?: number;
}

interface CuveCardProps {
  cuve: CuveData;
  onOpenIndexModal: (cuve: CuveData) => void;
}

const CuveCard: React.FC<CuveCardProps> = ({ cuve, onOpenIndexModal }) => {
  const pourcentageRemplissage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
  const estSousSeuil = cuve.niveauActuel <= cuve.seuilSecurite;
  const uniteMesure = cuve.unite || 'L';

  const volumeVenduEstime = (cuve.stockOuvertureQuart !== undefined)
    ? cuve.stockOuvertureQuart - cuve.niveauActuel
    : undefined;


  const formatXAF = (amount: number | undefined) => {
      if (amount === undefined) return 'N/A';
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);
  };


  let progressBarColor = 'bg-green-500';
  if (pourcentageRemplissage <= (cuve.seuilSecurite / cuve.capaciteMax * 100) + 15 && pourcentageRemplissage > (cuve.seuilSecurite / cuve.capaciteMax * 100)) {
    progressBarColor = 'bg-yellow-500';
  }
  if (estSousSeuil) {
    progressBarColor = 'bg-red-500';
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 md:p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col"
      onClick={() => onOpenIndexModal(cuve)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenIndexModal(cuve)}
      aria-label={`Saisir les index pour ${cuve.nomCuve}`}
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FiDroplet className="mr-2 h-5 w-5 text-purple-600" />
            {cuve.nomCuve} - {cuve.typeCarburant}
          </h3>
          <div className="flex items-center space-x-2">
              {estSousSeuil && (
                <FiAlertTriangle className="h-6 w-6 text-red-500 animate-pulse" title="Niveau bas !" />
              )}
              <FiEdit className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-focus-within:text-purple-600 transition-colors" title="Saisir les index" />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Niveau Actuel: {cuve.niveauActuel.toLocaleString('fr-FR')} {uniteMesure}</span>
            <span>Max: {cuve.capaciteMax.toLocaleString('fr-FR')} {uniteMesure}</span>
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

        {/* Section Stock Ouverture */}
        {cuve.stockOuvertureQuart !== undefined && (
          <div className="mb-2 text-sm text-gray-600">
              <p className="flex items-center">
                <FiArchive className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                Début quart : <span className="font-semibold ml-1">{cuve.stockOuvertureQuart.toLocaleString('fr-FR')} {uniteMesure}</span>
              </p>
          </div>
        )}

        {/* NOUVELLE SECTION: Ventes estimées par cuve */}
        {volumeVenduEstime !== undefined && volumeVenduEstime > 0 && (
            <div className="p-2 rounded-md text-sm mt-1 mb-3 bg-green-50 border border-green-200 text-green-700">
                <p className="flex items-center">
                    <FiDollarSign className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                    Ventes (estim.) :
                    <span className="font-semibold ml-1">
                        {formatXAF(volumeVenduEstime * (cuve.prixVenteUnitaire || 0))}
                    </span>
                </p>
            </div>
        )}
      </div>

      <div className="text-xs text-gray-500 border-t border-gray-200 pt-2 mt-auto">
        <p>Seuil de sécurité : <span className={`font-medium ${estSousSeuil ? 'text-red-600' : 'text-gray-700'}`}>{cuve.seuilSecurite.toLocaleString('fr-FR')} {uniteMesure}</span></p>
      </div>
    </div>
  );
};

export default CuveCard;