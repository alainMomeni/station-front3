// src/components/modals/QuartDetailModal.tsx
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatCard } from '../ui/StatCard'; // On réutilise StatCard !
import type { SyntheseQuartData } from '../../types/personnel'; // Adapter le type
import { format, parseISO } from 'date-fns';
import { FiDollarSign, FiDroplet } from 'react-icons/fi';
import { fr } from 'date-fns/locale';

interface QuartDetailModalProps {
  quart: SyntheseQuartData | null;
  onClose: () => void;
}

const QuartDetailModal: React.FC<QuartDetailModalProps> = ({ quart, onClose }) => {
  if (!quart) return null;

  return (
    <Modal
      isOpen={!!quart}
      onClose={onClose}
      title={`Détails du Quart - ${quart.id}`}
      footer={<Button onClick={onClose}>Fermer</Button>}
      size="lg"
    >
        <div className="space-y-6">
            <div className="text-center">
                <p className="font-semibold text-lg">{format(parseISO(quart.dateHeureDebut), 'eeee dd MMMM yyyy', {locale: fr})}</p>
                <p className="text-gray-500">{format(parseISO(quart.dateHeureDebut), 'HH:mm')} - {format(parseISO(quart.dateHeureFin), 'HH:mm')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <StatCard variant="primary" icon={FiDroplet} title="Volume Total Vendu" value={quart.totalVolumeCarburantVenduLitres.toLocaleString()} unit="L" />
                 <StatCard variant="success" icon={FiDollarSign} title="Valeur Totale Vendue" value={quart.totalValeurVenduXAF.toLocaleString()} unit="XAF"/>
            </div>

            {quart.indexDetailsParPompe && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Détails des Index</h4>
                     {/* Ici on pourrait utiliser une petite table ou une liste bien formatée */}
                     <pre className="text-xs bg-white p-2 rounded max-h-40 overflow-auto">{JSON.stringify(quart.indexDetailsParPompe, null, 2)}</pre>
                </div>
            )}

            {quart.notesQuart && (
                <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                    <strong>Notes du quart:</strong> {quart.notesQuart}
                </div>
            )}
        </div>
    </Modal>
  );
};

export default QuartDetailModal;