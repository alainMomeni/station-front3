// src/components/modals/ModalDetailTransactionsEmploye.tsx
import React from 'react';
import { FiX, FiShoppingCart, FiDroplet } from 'react-icons/fi';
import type { PerformanceVenteEmploye } from '../../types/ventes'; // Adapter chemin

interface ModalDetailTransactionsEmployeProps {
  isOpen: boolean;
  onClose: () => void;
  performanceEmploye: PerformanceVenteEmploye | null;
}

const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 });
};


const ModalDetailTransactionsEmploye: React.FC<ModalDetailTransactionsEmployeProps> = ({ isOpen, onClose, performanceEmploye }) => {
  if (!isOpen || !performanceEmploye) return null;

  const transactions = performanceEmploye.detailsTransactions || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl transform max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-purple-700">
              Détail des Transactions - {performanceEmploye.employeNom}
            </h3>
            <p className="text-sm text-gray-500">
                {performanceEmploye.roleQuart.charAt(0).toUpperCase() + performanceEmploye.roleQuart.slice(1)}
                {performanceEmploye.posteLibelle && ` - ${performanceEmploye.posteLibelle}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100" aria-label="Fermer">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {transactions.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-gray-500 italic">
                Aucun détail de transaction disponible pour cette sélection.
            </div>
        ) : (
            <div className="overflow-y-auto flex-grow custom-scrollbar-thin pr-2">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase">Heure</th>
                            <th className="px-3 py-2.5 text-left font-medium text-gray-500 uppercase">Produit/Service</th>
                            <th className="px-3 py-2.5 text-center font-medium text-gray-500 uppercase">Qté</th>
                            <th className="px-3 py-2.5 text-right font-medium text-gray-500 uppercase">Montant Net</th>
                            <th className="px-3 py-2.5 text-right font-medium text-gray-500 uppercase">Paiement</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-purple-50/30">
                                <td className="px-3 py-2 whitespace-nowrap">{tx.heure}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {performanceEmploye.roleQuart === 'pompiste' ? <FiDroplet className="text-blue-500 mr-1.5"/> : <FiShoppingCart className="text-green-500 mr-1.5"/>}
                                        {tx.produitService}
                                    </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-center">{tx.quantite} {tx.unite}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-right font-medium text-gray-700">{formatCurrency(tx.montantNet)}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-gray-500">{tx.modePaiement}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailTransactionsEmploye;