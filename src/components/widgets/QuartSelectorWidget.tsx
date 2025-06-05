// src/components/widgets/QuartSelectorWidget.tsx
import React from 'react';
import { FiChevronDown, FiClock } from 'react-icons/fi';

export interface QuartTravail {
  id: string;
  libelle: string; // Ex: "Matin (07h-15h) - 15/07/2024" ou "Quart Actuel"
  dateDebut: string; // ISOString
  dateFin: string;   // ISOString
  statut?: 'en_cours' | 'termine' | 'planifie';
}

interface QuartSelectorWidgetProps {
  quartsDisponibles: QuartTravail[];
  quartSelectionneId: string | null;
  onQuartChange: (quartId: string) => void;
  label?: string;
  disabled?: boolean;
}

const QuartSelectorWidget: React.FC<QuartSelectorWidgetProps> = ({
  quartsDisponibles,
  quartSelectionneId,
  onQuartChange,
  label = "Sélectionner un Quart de Travail",
  disabled = false,
}) => {
  if (!quartsDisponibles || quartsDisponibles.length === 0) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 flex items-center justify-center space-x-2">
        <FiClock className="h-5 w-5 text-gray-400" />
        <span>Aucun quart de travail disponible</span>
      </div>
    );
  }

  const getStatutColor = (statut?: QuartTravail['statut']): string => {
    if (statut === 'en_cours') return 'text-green-600 font-medium';
    if (statut === 'planifie') return 'text-blue-600';
    if (statut === 'termine') return 'text-gray-500';
    return 'text-gray-700';
  }


  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor="quartSelector" 
          className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id="quartSelector"
          value={quartSelectionneId || ''}
          onChange={(e) => onQuartChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full pl-4 pr-10 py-2 text-sm border border-gray-300 
            rounded-lg shadow-sm transition-all duration-200
            focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
            outline-none appearance-none
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-purple-400'}
          `}
        >
          <option value="" disabled className="text-gray-500">
            -- Sélectionner un quart --
          </option>
          {quartsDisponibles.map((quart) => (
            <option 
              key={quart.id} 
              value={quart.id} 
              className={`py-2 ${getStatutColor(quart.statut)}`}
            >
              {quart.libelle}
              {quart.statut === 'en_cours' && ' ⚡️'}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-purple-500">
          <FiChevronDown className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
};

export default QuartSelectorWidget;