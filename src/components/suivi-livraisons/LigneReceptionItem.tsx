// src/components/suivi-livraisons/LigneReceptionItem.tsx
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { LigneBonCommande } from '../../types/achats';

interface LigneReceptionItemProps {
  ligne: LigneBonCommande;
  onLigneChange: (ligneId: string, field: keyof LigneBonCommande, value: string) => void;
  isReadOnly: boolean;
}

const LigneReceptionItem: React.FC<LigneReceptionItemProps> = ({
  ligne,
  onLigneChange,
  isReadOnly
}) => {
  const quantiteCommandee = parseInt(ligne.quantite);
  const quantiteRecue = parseInt(ligne.quantiteRecue || '0');
  const ecart = quantiteRecue - quantiteCommandee;
  const hasEcart = ecart !== 0;

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF', 
      minimumFractionDigits: 0 
    }).format(amount);

  const inputClass = `w-full px-3 py-2 border rounded-lg text-sm ${
    isReadOnly 
      ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed' 
      : 'block w-full text-sm border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 transition-all duration-200 bg-white hover:border-purple-300 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none'
  }`;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
        {/* Produit */}
        <div className="lg:col-span-2">
          <div className="font-medium text-gray-900">{ligne.produitNom}</div>
          <div className="text-sm text-gray-500">Réf: {ligne.produitId}</div>
        </div>

        {/* Quantité commandée */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Commandée</div>
          <div className="font-semibold text-gray-900">
            {quantiteCommandee.toLocaleString()} {ligne.unite}
          </div>
        </div>

        {/* Quantité reçue */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Reçue</div>
          <input
            type="number"
            value={ligne.quantiteRecue || ''}
            onChange={(e) => onLigneChange(ligne.id, 'quantiteRecue', e.target.value)}
            disabled={isReadOnly}
            className={inputClass}
            placeholder={ligne.quantite}
          />
        </div>

        {/* Écart */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-1">Écart</div>
          <div className={`flex items-center justify-center font-semibold ${
            hasEcart 
              ? ecart > 0 ? 'text-green-600' : 'text-red-600'
              : 'text-gray-500'
          }`}>
            {hasEcart && (
              ecart > 0 
                ? <CheckCircle className="h-4 w-4 mr-1" />
                : <AlertTriangle className="h-4 w-4 mr-1" />
            )}
            {ecart !== 0 ? `${ecart > 0 ? '+' : ''}${ecart}` : '0'}
          </div>
        </div>

        {/* Montant */}
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Montant HT</div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(ligne.montantLigneHT)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LigneReceptionItem;