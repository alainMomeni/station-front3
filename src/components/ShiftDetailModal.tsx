import React from 'react';
import { FiX, FiClock, FiType, FiInfo } from 'react-icons/fi';

// Assume Shift type is defined and imported if not here
interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    type?: string;
    notes?: string;
}

interface ShiftDetailModalProps {
    shift: Shift | null; // Can be null if no shift selected or modal is hidden
    onClose: () => void;
    selectedDate: Date | null;
}

const ShiftDetailModal: React.FC<ShiftDetailModalProps> = ({ shift, onClose, selectedDate }) => {
    if (!shift || !selectedDate) {
        return null; // Don't render if no shift is selected
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Close on backdrop click
        >
            {/* Modal Content */}
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-700">
                        Détails du Quart
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                        aria-label="Fermer"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <FiClock className="h-5 w-5 text-purple-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-gray-800">
                                {new Date(shift.date + 'T00:00:00').toLocaleDateString('fr-FR', { // Ensure correct date parsing
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FiClock className="h-5 w-5 text-purple-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Heures</p>
                            <p className="font-medium text-gray-800">
                                {shift.startTime} - {shift.endTime}
                            </p>
                        </div>
                    </div>

                    {shift.type && (
                        <div className="flex items-center">
                            <FiType className="h-5 w-5 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Type de Quart</p>
                                <p className="font-medium text-gray-800">{shift.type}</p>
                            </div>
                        </div>
                    )}

                    {shift.notes && (
                         <div className="flex items-start">
                            <FiInfo className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="font-medium text-gray-800 text-sm whitespace-pre-wrap">
                                    {shift.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer (Optional) */}
                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftDetailModal;