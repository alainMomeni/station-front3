// src/components/cards/CuveStatCard.tsx (REFACTORISÉ)
import React from 'react';
import { Thermometer, Droplet, Archive, TrendingDown } from 'lucide-react';
import { StatCard } from '../ui/StatCard'; // On utilise notre nouvelle StatCard

export type StatutNiveauCuve = 'OK' | 'ALERTE_BASSE' | 'CRITIQUE';

export interface CuveStatData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  unite: 'L' | 'm³';
  temperature?: number;
  derniereLivraisonDate?: string;
  pourcentageRemplissage: number;
  volumeDisponibleAvantSeuil: number;
  statutNiveau: StatutNiveauCuve;
}

// Sous-composant pour une info simple avec une icône
const InfoItem: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit: string }> = ({ icon: Icon, label, value, unit }) => (
    <div className="flex items-center text-xs text-gray-500">
        <Icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
        <span className="font-medium mr-1">{label}:</span>
        <span>{typeof value === 'number' ? value.toLocaleString() : value} {unit}</span>
    </div>
);

// Map statut métier vers variantes de StatCard
const getVariantFromStatut = (statut: StatutNiveauCuve): React.ComponentProps<typeof StatCard>['variant'] => {
    switch (statut) {
        case 'CRITIQUE': return 'error';
        case 'ALERTE_BASSE': return 'warning';
        case 'OK': return 'success';
        default: return 'neutral';
    }
};

interface CuveStatCardProps {
  cuve: CuveStatData;
}

const CuveStatCard: React.FC<CuveStatCardProps> = ({ cuve }) => {

  const progressBarValue = cuve.pourcentageRemplissage.toFixed(1);

  // Définir la couleur de la barre de progression en fonction du statut
  const progressBarColorClass = {
    'OK': 'bg-green-500',
    'ALERTE_BASSE': 'bg-yellow-500',
    'CRITIQUE': 'bg-red-500'
  }[cuve.statutNiveau];

  return (
    <StatCard
      variant={getVariantFromStatut(cuve.statutNiveau)}
      icon={Droplet}
      title={cuve.nomCuve}
      value={cuve.niveauActuel.toLocaleString()}
      unit={cuve.unite}
      footer={
        <div className="space-y-3">
            {/* Barre de progression */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{cuve.typeCarburant}</span>
                  <span className="font-semibold">{progressBarValue}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full transition-all duration-500 ${progressBarColorClass}`} style={{ width: `${progressBarValue}%` }}></div>
              </div>
            </div>

            {/* Détails supplémentaires */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <InfoItem icon={Archive} label="Capacité" value={cuve.capaciteMax} unit={cuve.unite}/>
                <InfoItem icon={TrendingDown} label="Seuil Sécurité" value={cuve.seuilSecurite} unit={cuve.unite} />
                {cuve.temperature !== undefined && <InfoItem icon={Thermometer} label="Temp" value={cuve.temperature} unit="°C" />}
            </div>
        </div>
      }
    />
  );
};

export default CuveStatCard;