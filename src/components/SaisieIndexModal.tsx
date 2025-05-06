import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiChevronsRight, FiChevronsLeft, FiAlertCircle } from 'react-icons/fi';
import Spinner from './Spinner'; // Import Spinner

// Assumons que CuveData est aussi défini ici ou importé
interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  dernierIndexFin?: number; // Pour pré-remplir l'index de début du nouveau quart
  // ... autres champs de CuveData si nécessaire
}

interface SaisieIndexModalProps {
  cuve: CuveData | null;
  onClose: () => void;
  onSubmitIndex: (cuveId: string, indexDebut: number, indexFin: number, notes?: string) => Promise<void>; // Function to handle submission
}

const SaisieIndexModal: React.FC<SaisieIndexModalProps> = ({ cuve, onClose, onSubmitIndex }) => {
  const [indexDebut, setIndexDebut] = useState<string>('');
  const [indexFin, setIndexFin] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pré-remplir l'index de début si le dernier index de fin est disponible
    if (cuve && cuve.dernierIndexFin !== undefined) {
      setIndexDebut(cuve.dernierIndexFin.toString());
    } else if (cuve) {
        setIndexDebut(''); // Reset if no previous end index
    }
    // Reset other fields when cuve changes or modal opens
    setIndexFin('');
    setNotes('');
    setError(null);
  }, [cuve]); // Re-run effect when cuve changes


  if (!cuve) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const debut = parseFloat(indexDebut);
    const fin = parseFloat(indexFin);

    if (isNaN(debut) || isNaN(fin)) {
      setError('Veuillez entrer des nombres valides pour les index.');
      return;
    }
    if (fin <= debut) {
      setError("L'index de fin doit être supérieur à l'index de début.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitIndex(cuve.id, debut, fin, notes);
      // onClose(); // Optionally close modal on success, or parent can handle it
    } catch (submissionError: any) {
      setError(submissionError.message || 'Une erreur est survenue lors de la soumission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-purple-700">
            Saisie Index - {cuve.nomCuve} ({cuve.typeCarburant})
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200" aria-label="Fermer">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="indexDebut" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FiChevronsLeft className="mr-2 h-4 w-4 text-gray-500" /> Index Début (Quart)
            </label>
            <input
              type="number"
              id="indexDebut"
              value={indexDebut}
              onChange={(e) => setIndexDebut(e.target.value)}
              placeholder="Ex: 12345.67"
              step="0.01" // Allow decimals
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="indexFin" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <FiChevronsRight className="mr-2 h-4 w-4 text-gray-500" /> Index Fin (Quart)
            </label>
            <input
              type="number"
              id="indexFin"
              value={indexFin}
              onChange={(e) => setIndexFin(e.target.value)}
              placeholder="Ex: 12400.10"
              step="0.01"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              required
            />
          </div>

           {/* Affichage de la différence */}
          {(indexDebut && indexFin && !isNaN(parseFloat(indexFin)) && !isNaN(parseFloat(indexDebut)) && parseFloat(indexFin) > parseFloat(indexDebut)) && (
            <p className="text-sm text-gray-600 bg-purple-50 p-2 rounded-md">
              Vente calculée : <span className="font-semibold">{(parseFloat(indexFin) - parseFloat(indexDebut)).toFixed(2)}</span> unités
            </p>
          )}


          <div>
            <label htmlFor="notesSaisie" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optionnel)
            </label>
            <textarea
              id="notesSaisie"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes additionnelles sur la saisie..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            ></textarea>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 flex items-start">
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[120px]"
            >
              {isSubmitting ? <Spinner size="sm" color="text-white" /> : (
                <>
                  <FiSave className="mr-2 h-5 w-5" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaisieIndexModal;