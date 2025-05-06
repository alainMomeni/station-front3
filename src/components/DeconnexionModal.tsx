import React from 'react';
import { FiLogOut, FiX, FiAlertTriangle } from 'react-icons/fi';

interface DeconnexionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeconnexionModal: React.FC<DeconnexionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      // onClick={onClose} // Optionally close on backdrop click
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200" aria-label="Fermer">
                <FiX className="h-5 w-5" />
            </button>
        </div>

        <div className="text-center">
            <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmation de Déconnexion</h3>
            <p className="text-sm text-gray-600 mb-6">
            Êtes-vous sûr de vouloir vous déconnecter ? Vous serez redirigé vers la page de connexion.
            </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiLogOut className="mr-2 h-5 w-5" />
            Se Déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeconnexionModal;