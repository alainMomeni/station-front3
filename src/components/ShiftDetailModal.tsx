// src/components/modals/ShiftDetailModal.tsx (CORRIGÉ POUR ACCEPTER 'selectedDate')
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { FiClock, FiType, FiInfo } from 'react-icons/fi';
import type { Shift } from '../types/personnel'; // Assurez-vous d'avoir ce type partagé

// ====== INTERFACE CORRIGÉE ======
interface ShiftDetailModalProps {
  shift: Shift | null;
  onClose: () => void;
  selectedDate: Date | null; // **LA PROP EST MAINTENANT DÉCLARÉE ICI**
}
// =================================

// Sous-composant pour une ligne d'information
const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode; }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start">
        <Icon className="h-5 w-5 text-purple-500 mr-4 mt-1 flex-shrink-0" />
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <div className="font-semibold text-gray-800">{value}</div>
        </div>
    </div>
);

const ShiftDetailModal: React.FC<ShiftDetailModalProps> = ({ shift, onClose, selectedDate }) => {
  // Garde-fou pour ne rien rendre si les props essentielles sont manquantes
  if (!shift || !selectedDate) return null;

  return (
    <Modal
      isOpen={!!shift}
      onClose={onClose}
      title={`Détails du Quart - ${format(selectedDate, 'eeee dd MMMM yyyy', { locale: fr })}`} // On utilise bien selectedDate
      footer={<Button onClick={onClose}>Fermer</Button>}
    >
      <div className="space-y-4">
        <InfoRow 
            icon={FiClock} 
            label="Heures de travail"
            value={`${shift.startTime} - ${shift.endTime}`}
        />

        {shift.type && (
            <InfoRow 
                icon={FiType} 
                label="Type de Quart"
                value={shift.type}
            />
        )}
        
        {shift.notes && (
            <InfoRow 
                icon={FiInfo} 
                label="Notes et Instructions"
                value={<p className="text-sm whitespace-pre-wrap">{shift.notes}</p>}
            />
        )}
      </div>
    </Modal>
  );
};

export default ShiftDetailModal;