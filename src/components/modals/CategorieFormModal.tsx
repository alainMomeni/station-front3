// src/components/modals/CategorieFormModal.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect } from 'react';
import type { CategorieProduit } from '../../types/catalogue';

// Importer tous nos composants UI
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Alert } from '../ui/Alert';

interface CategorieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categorieData: Pick<CategorieProduit, 'id' | 'nom' | 'description' | 'typeProduitAssocie'>) => Promise<void>;
  categorieInitial?: CategorieProduit | null;
}

const CategorieFormModal: React.FC<CategorieFormModalProps> = ({ isOpen, onClose, onSave, categorieInitial }) => {
  
  const getInitialState = () => ({
    id: categorieInitial?.id || '',
    nom: categorieInitial?.nom || '',
    description: categorieInitial?.description || '',
    typeProduitAssocie: categorieInitial?.typeProduitAssocie || 'boutique',
  });

  const [formData, setFormData] = useState(getInitialState());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Réinitialiser le formulaire quand la modale s'ouvre avec de nouvelles données
  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialState());
        setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, categorieInitial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.nom.trim()) {
        setError("Le nom de la catégorie est obligatoire.");
        return;
    }
    setIsSaving(true);
    try {
        await onSave(formData);
    } catch (saveError: any) {
        setError(saveError.message || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
        setIsSaving(false);
    }
  };
  
  const typeProduitOptions = [
      { value: 'boutique', label: 'Boutique' }, { value: 'lubrifiant', label: 'Lubrifiant' },
      { value: 'carburant', label: 'Carburant' }, { value: 'accessoire', label: 'Accessoire' },
      { value: 'service', label: 'Service' }, { value: 'autre', label: 'Autre' },
  ];

  return (
    // On utilise notre composant <Modal>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categorieInitial?.id ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} loading={isSaving}>Enregistrer</Button>
        </div>
      }
    >
        <div className="space-y-4">
            {error && <Alert variant="error">{error}</Alert>}
            
            <Input
                label="Nom de la Catégorie"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                autoFocus
            />
            
            <Select
                label="Type de Produits Associé"
                name="typeProduitAssocie"
                value={formData.typeProduitAssocie}
                onChange={handleChange}
                options={typeProduitOptions}
                required
            />
            
            <Textarea
                label="Description (Optionnel)"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
            />
        </div>
    </Modal>
  );
};

export default CategorieFormModal;