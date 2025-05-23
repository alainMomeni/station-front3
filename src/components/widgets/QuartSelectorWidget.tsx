// src/components/widgets/QuartSelectorWidget.tsx
import React from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

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
      <div className="text-sm text-gray-500 italic p-2 border border-dashed border-gray-300 rounded-md">
        Aucun quart de travail disponible pour la sélection.
      </div>
    );
  }

  const getStatutColor = (statut?: QuartTravail['statut']): string => {
    if (statut === 'en_cours') return 'text-green-500';
    if (statut === 'planifie') return 'text-blue-500';
    if (statut === 'termine') return 'text-gray-500';
    return 'text-gray-700';
  }

  return (
    <div className="mb-1">
      <label htmlFor="quartSelector" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        {label}
      </label>
      <div className="relative">
        <select
          id="quartSelector"
          value={quartSelectionneId || ''}
          onChange={(e) => onQuartChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm appearance-none cursor-pointer ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value="" disabled>-- Choisir un quart --</option>
          {quartsDisponibles.map((quart) => (
            <option key={quart.id} value={quart.id} className={getStatutColor(quart.statut)}>
              {quart.libelle} {quart.statut === 'en_cours' && '(Actuel)'}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <FiChevronDown className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default QuartSelectorWidget;