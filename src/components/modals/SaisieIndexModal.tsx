// src/components/modals/SaisieIndexModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Alert } from '../ui/Alert';
import type { CuveData } from '../../types/equipements';

interface SaisieIndexModalProps {
  cuve: CuveData;
  onClose: () => void;
  onSubmitIndex: (cuveId: string, indexDebut: number, indexFin: number, notes?: string) => Promise<void>;
}

const SaisieIndexModal: React.FC<SaisieIndexModalProps> = ({ cuve, onClose, onSubmitIndex }) => {
  const [indexDebut, setIndexDebut] = useState('');
  const [indexFin, setIndexFin] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pré-remplir l'index de début avec le dernier index de fin connu
    setIndexDebut(cuve.dernierIndexFin?.toString() || '');
  }, [cuve]);

  const handleSubmit = async () => {
    const debut = parseFloat(indexDebut);
    const fin = parseFloat(indexFin);

    if (isNaN(debut) || isNaN(fin) || debut <= 0 || fin <= 0) {
      setError("Les index doivent être des nombres positifs."); return;
    }
    if (fin <= debut) {
      setError("L'index de fin doit être supérieur à l'index de début."); return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmitIndex(cuve.id, debut, fin, notes);
      onClose(); // Ferme la modale en cas de succès
    } catch (e) {
      setError("Erreur lors de la soumission. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Saisie des Index - ${cuve.nomCuve}`}
      footer={
        <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} loading={isSubmitting}>Enregistrer les Index</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}
        <p className="text-sm text-gray-600">
          Veuillez saisir les index de début et de fin de votre quart de travail pour la cuve <span className="font-semibold">{cuve.typeCarburant}</span>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Index Début de Quart*" type="number" step="0.01" value={indexDebut} onChange={e => setIndexDebut(e.target.value)} required autoFocus />
          <Input label="Index Fin de Quart*" type="number" step="0.01" value={indexFin} onChange={e => setIndexFin(e.target.value)} required />
        </div>
        <Textarea label="Notes (Optionnel)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations, incidents..." />
      </div>
    </Modal>
  );
};

export default SaisieIndexModal;