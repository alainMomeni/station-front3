// src/components/suivi-livraisons/ReceptionForm.tsx
import React, { useMemo } from 'react';
import { FileText, Clipboard, Package, CheckSquare, ArrowLeft } from 'lucide-react';
import type { BonCommandeData, LigneBonCommande, InfoLivraison } from '../../types/achats';
import { Card } from '../ui/Card'; // Change default import to named import
// Import des composants UI
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea'; // Notre nouveau composant
import { Alert } from '../ui/Alert';

// Calculs et logique extraits pour plus de clarté
const useReceptionLogic = (bonDeCommande: BonCommandeData) => {
    return useMemo(() => {
        const lignesAvecQuantitesRestantes = bonDeCommande.lignes.map(ligne => {
            const quantiteCommandee = parseInt(ligne.quantite);
            const quantiteDejaRecue = parseInt(ligne.quantiteDejaRecue || '0');
            const quantiteRestante = quantiteCommandee - quantiteDejaRecue;
            
            return {
                ...ligne,
                quantiteRestante: Math.max(0, quantiteRestante),
                quantiteDejaRecue: ligne.quantiteDejaRecue || '0'
            };
        });

        const hasPartialQuantities = lignesAvecQuantitesRestantes.some(ligne => {
            const quantiteRecueMaintenant = parseInt(ligne.quantiteRecue || '0');
            return quantiteRecueMaintenant > 0 && quantiteRecueMaintenant < ligne.quantiteRestante;
        });

        const isCompleteLivraison = lignesAvecQuantitesRestantes.every(ligne => {
            const quantiteRecueMaintenant = parseInt(ligne.quantiteRecue || '0');
            return quantiteRecueMaintenant === ligne.quantiteRestante;
        });

        return { lignesAvecQuantitesRestantes, hasPartialQuantities, isCompleteLivraison };
    }, [bonDeCommande]);
};

// Interface
interface ReceptionFormProps {
  bonDeCommande: BonCommandeData;
  infoLivraison: InfoLivraison;
  onValider: (validationType: 'partielle' | 'complete') => void;
  onUpdateLigne: (ligneId: string, field: keyof LigneBonCommande, value: string) => void;
  onUpdateInfo: (field: keyof InfoLivraison, value: string) => void;
  onAnnuler: () => void;
  isProcessing: boolean;
}

// Composant principal
const ReceptionForm: React.FC<ReceptionFormProps> = ({
  bonDeCommande,
  infoLivraison,
  onValider,
  onUpdateLigne,
  onUpdateInfo,
  onAnnuler,
  isProcessing
}) => {
  const isReadOnly = isProcessing || bonDeCommande.statut === 'livre';
  const { lignesAvecQuantitesRestantes, hasPartialQuantities, isCompleteLivraison } = useReceptionLogic(bonDeCommande);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={onAnnuler} disabled={isProcessing} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Nouvelle Livraison - BC: <span className="text-purple-600">{bonDeCommande.numeroBC}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Fournisseur: {bonDeCommande.fournisseurNom}</p>
          </div>
        </div>
      </div>
      
      {bonDeCommande.statut === 'partiellement_livre' && (
        <Alert variant="warning" title="Livraison complémentaire">
          Cette commande a déjà été partiellement livrée. Les quantités affichées ci-dessous correspondent au restant à livrer.
        </Alert>
      )}

      <Card title="Informations de cette Livraison" icon={FileText}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="N° Bon de Livraison *" type="text" value={infoLivraison.numeroBL} onChange={(e) => onUpdateInfo('numeroBL', e.target.value)} disabled={isReadOnly} placeholder="Saisir le numéro du BL" />
            <Input label="Date de Réception *" type="date" value={infoLivraison.dateReception} onChange={(e) => onUpdateInfo('dateReception', e.target.value)} disabled={isReadOnly} />
          </div>
        </div>
      </Card>
      
      <Card title="Articles à Livrer" icon={Clipboard}>
        <div className="p-6 space-y-4">
          <Alert variant="info" title="Information">
            Les quantités affichées correspondent aux quantités restantes à livrer pour cette commande.
          </Alert>
          {lignesAvecQuantitesRestantes.map(ligne => (
            <LigneReceptionItemNouvelleLivraison key={ligne.id} ligne={ligne} onLigneChange={onUpdateLigne} isReadOnly={isReadOnly} />
          ))}
        </div>
      </Card>
      
      {bonDeCommande.statut !== 'livre' && (
        <Card title="Notes et Actions" icon={CheckSquare}>
          <div className="p-6 space-y-6">
            <Textarea label="Notes et Observations" value={infoLivraison.notes} onChange={(e) => onUpdateInfo('notes', e.target.value)} disabled={isReadOnly} rows={4} placeholder="Commentaires sur la livraison, écarts, etc." />
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-gray-200">
              {hasPartialQuantities && !isCompleteLivraison && (
                <Button variant="warning" onClick={() => onValider('partielle')} loading={isProcessing} leftIcon={<Package className="h-4 w-4" />}>
                  Enregistrer Livraison Partielle
                </Button>
              )}
              <Button variant={isCompleteLivraison ? 'success' : 'primary'} onClick={() => onValider(isCompleteLivraison ? 'complete' : 'partielle')} loading={isProcessing} leftIcon={<CheckSquare className="h-4 w-4" />}>
                {isCompleteLivraison ? 'Finaliser la Commande' : 'Valider cette Livraison'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {bonDeCommande.statut === 'livre' && (
        <Alert variant="success" title="Commande Entièrement Livrée">
          Cette commande a été entièrement réceptionnée et les stocks ont été mis à jour.
        </Alert>
      )}
    </div>
  );
};

// Composant interne pour une ligne, refactorisé aussi
interface LigneReceptionItemNouvelleLivraisonProps {
  ligne: LigneBonCommande & { quantiteRestante: number; quantiteDejaRecue: string; };
  onLigneChange: (ligneId: string, field: keyof LigneBonCommande, value: string) => void;
  isReadOnly: boolean;
}

const LigneReceptionItemNouvelleLivraison: React.FC<LigneReceptionItemNouvelleLivraisonProps> = ({ ligne, onLigneChange, isReadOnly }) => {
  const quantiteRecueMaintenant = parseInt(ligne.quantiteRecue || '0');
  const depassementQuantite = quantiteRecueMaintenant > ligne.quantiteRestante;

  const DetailItem = ({ label, value, className = '' }: { label: string, value: string, className?: string }) => (
    <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className={`text-sm font-medium ${className}`}>{value}</div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
        <div className="md:col-span-2 col-span-2">
            <div className="font-medium text-gray-900">{ligne.produitNom}</div>
            <div className="text-sm text-gray-500">Réf: {ligne.produitId}</div>
        </div>
        <DetailItem label="Total Commandé" value={`${parseInt(ligne.quantite).toLocaleString()} ${ligne.unite}`} className="text-gray-700"/>
        <DetailItem label="Déjà Reçu" value={`${parseInt(ligne.quantiteDejaRecue).toLocaleString()} ${ligne.unite}`} className="text-blue-600"/>
        <DetailItem label="Restant" value={`${ligne.quantiteRestante.toLocaleString()} ${ligne.unite}`} className="text-orange-600 font-semibold"/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start pt-4 border-t border-dashed">
        <div className="md:col-span-2">
          <Input type="number" value={ligne.quantiteRecue || ''} onChange={(e) => onLigneChange(ligne.id, 'quantiteRecue', e.target.value)} disabled={isReadOnly} label="Reçu Maintenant" error={depassementQuantite ? 'Dépassement du restant' : undefined} placeholder="0" variant="compact"/>
        </div>
        <Input type="text" value={ligne.numeroLot || ''} onChange={(e) => onLigneChange(ligne.id, 'numeroLot', e.target.value)} disabled={isReadOnly} label="N° Lot" placeholder="Optionnel" variant="compact" />
        <Input type="date" value={ligne.datePeremption || ''} onChange={(e) => onLigneChange(ligne.id, 'datePeremption', e.target.value)} disabled={isReadOnly} label="Péremption" variant="compact"/>
        <Input type="text" value={ligne.notesReceptionLigne || ''} onChange={(e) => onLigneChange(ligne.id, 'notesReceptionLigne', e.target.value)} disabled={isReadOnly} label="Note" placeholder="Notes..." variant="compact" />
      </div>
    </div>
  );
};

export default ReceptionForm;