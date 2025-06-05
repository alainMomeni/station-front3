// src/components/modals/GenererFactureModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FiFileText, FiX, FiAlertCircle, FiCheckSquare } from 'react-icons/fi';
import type { ClientProfessionnel, TransactionCredit, FactureClient } from '../../types/facturation'; // Adapter chemin
import Spinner from '../Spinner'; // Adapter chemin
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';

interface GenererFactureModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfessionnel | null;
  transactionsAInclureInitiales: TransactionCredit[]; // Transactions non facturées pour ce client
  onFactureGeneree: (factureData: Omit<FactureClient, 'id' | 'urlPdf' | 'dateCreation'>, transactionsSelectionneesIds: string[]) => Promise<void>;
}

const GenererFactureModal: React.FC<GenererFactureModalProps> = ({ 
    isOpen, onClose, client, transactionsAInclureInitiales, onFactureGeneree 
}) => {
  
  const defaultPeriodeDebut = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const defaultPeriodeFin = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const [periodeFacturation, setPeriodeFacturation] = useState({ debut: defaultPeriodeDebut, fin: defaultPeriodeFin });
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [numeroFacture, setNumeroFacture] = useState(`FACT-${format(new Date(), 'yyyyMMdd')}-${client?.id.slice(-3) || 'XXX'}`);
  const [dateFacture, setDateFacture] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dateEcheance, setDateEcheance] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [notesFacture, setNotesFacture] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && client) {
      // Pré-calculer une période (ex: dernier mois non facturé, ou mois courant)
      // Pour la démo, on peut prendre toutes les transactions non facturées pour la période par défaut
      const transactionsDansPeriodeDefaut = transactionsAInclureInitiales
        .filter(tx => {
            const txDate = new Date(tx.dateTransaction);
            return txDate >= new Date(defaultPeriodeDebut + 'T00:00:00Z') && txDate <= new Date(defaultPeriodeFin + 'T23:59:59Z');
        })
        .map(tx => tx.id);
      setSelectedTransactionIds(transactionsDansPeriodeDefaut);
      
      // Reset other fields
      setNumeroFacture(`FACT-${format(new Date(), 'yyyyMMdd')}-${client.id.slice(-3)}`);
      setDateFacture(format(new Date(), 'yyyy-MM-dd'));
      setDateEcheance(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
      setNotesFacture('');
      setError(null);
    }
  }, [isOpen, client, transactionsAInclureInitiales, defaultPeriodeDebut, defaultPeriodeFin]);

  const transactionsFiltreesPourPeriode = useMemo(() => {
    return transactionsAInclureInitiales.filter(tx => {
        const txDate = new Date(tx.dateTransaction);
        return txDate >= new Date(periodeFacturation.debut + 'T00:00:00Z') && txDate <= new Date(periodeFacturation.fin + 'T23:59:59Z');
    });
  }, [transactionsAInclureInitiales, periodeFacturation]);
  
  // Recalculer la sélection si la période change
  useEffect(() => {
    if (isOpen) { // Uniquement si le modal est ouvert
        setSelectedTransactionIds(transactionsFiltreesPourPeriode.map(tx => tx.id));
    }
  }, [transactionsFiltreesPourPeriode, isOpen]);


  const handleToggleTransaction = (txId: string) => {
    setSelectedTransactionIds(prev => 
      prev.includes(txId) ? prev.filter(id => id !== txId) : [...prev, txId]
    );
  };
  
  const handleToggleAllTransactions = () => {
    if(selectedTransactionIds.length === transactionsFiltreesPourPeriode.length) {
        setSelectedTransactionIds([]); // Désélectionner tout
    } else {
        setSelectedTransactionIds(transactionsFiltreesPourPeriode.map(tx => tx.id)); // Sélectionner tout
    }
  }

  const totalFacture = useMemo(() => {
    return transactionsFiltreesPourPeriode
      .filter(tx => selectedTransactionIds.includes(tx.id))
      .reduce((sum, tx) => sum + tx.montant, 0);
  }, [selectedTransactionIds, transactionsFiltreesPourPeriode]);

  const handleSubmit = async () => {
    setError(null);
    if (!client) return;
    if (selectedTransactionIds.length === 0) {
        setError("Veuillez sélectionner au moins une transaction à facturer.");
        return;
    }
    if (!numeroFacture.trim() || !dateFacture || !dateEcheance) {
        setError("N° Facture, Date Facture et Date Échéance sont requis.");
        return;
    }

    setIsSaving(true);
    const factureData: Omit<FactureClient, 'id' | 'urlPdf' | 'dateCreation'> = {
      numeroFacture,
      clientId: client.id,
      clientNom: client.nomEntreprise,
      dateFacture,
      dateEcheance,
      periodeFactureeDebut: periodeFacturation.debut,
      periodeFactureeFin: periodeFacturation.fin,
      transactionsIds: selectedTransactionIds,
      montantHT: totalFacture, // Supposer que les transactions sont HT, ajuster si TTC
      montantTTC: totalFacture, // Pour simplifier, HT = TTC. Calculer TVA si besoin.
      statutPaiement: 'non_payee',
      notes: notesFacture,
    };
    try {
        await onFactureGeneree(factureData, selectedTransactionIds);
        // Le onClose sera géré par le parent après succès
    } catch(e: any) {
        setError(e.message || "Erreur lors de la génération de la facture.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen || !client) return null;
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  const formatCurrencyModal = (amount: number) => amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-3xl transform max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <h3 className="text-xl font-semibold text-purple-700">
            Générer Facture pour : {client.nomEntreprise}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100"><FiX size={22} /></button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar-thin space-y-5">
          {/* Infos Facture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><label className="block text-xs font-medium text-gray-600">N° Facture</label><input type="text" value={numeroFacture} onChange={e=>setNumeroFacture(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-xs font-medium text-gray-600">Date Facture</label><input type="date" value={dateFacture} onChange={e=>setDateFacture(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-xs font-medium text-gray-600">Date Échéance</label><input type="date" value={dateEcheance} onChange={e=>setDateEcheance(e.target.value)} className={inputClass} /></div>
          </div>
           {/* Période de Facturation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
                <div>
                    <label className="block text-xs font-medium text-gray-600">Période à facturer - Début</label>
                    <input type="date" value={periodeFacturation.debut} onChange={e=>setPeriodeFacturation(p => ({...p, debut: e.target.value}))} className={inputClass}/>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-600">Période à facturer - Fin</label>
                    <input type="date" value={periodeFacturation.fin} onChange={e=>setPeriodeFacturation(p => ({...p, fin: e.target.value}))} className={inputClass}/>
                </div>
            </div>

          {/* Tableau des transactions à inclure */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1.5">
                <h4 className="text-sm font-semibold text-gray-700">Transactions à Inclure (Période sélectionnée)</h4>
                 {transactionsFiltreesPourPeriode.length > 0 && (
                    <button onClick={handleToggleAllTransactions}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center">
                        <FiCheckSquare className="mr-1"/>
                        {selectedTransactionIds.length === transactionsFiltreesPourPeriode.length ? "Tout Désélectionner" : "Tout Sélectionner"}
                    </button>
                )}
            </div>
            {transactionsFiltreesPourPeriode.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-3 text-center">Aucune transaction à crédit non facturée pour cette période.</p>
            ) : (
              <div className="border rounded-md max-h-60 overflow-y-auto custom-scrollbar-thin">
                <table className="min-w-full text-xs">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="p-2 w-8 text-center"><FiCheckSquare/></th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactionsFiltreesPourPeriode.map(tx => (
                      <tr key={tx.id} className={`hover:bg-gray-50 ${selectedTransactionIds.includes(tx.id) ? 'bg-purple-50' : ''}`}>
                        <td className="p-2 text-center">
                          <input type="checkbox" 
                                 checked={selectedTransactionIds.includes(tx.id)}
                                 onChange={() => handleToggleTransaction(tx.id)} 
                                 className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                        </td>
                        <td className="p-2 whitespace-nowrap">{format(new Date(tx.dateTransaction), 'dd/MM/yy HH:mm')}</td>
                        <td className="p-2">{tx.description}</td>
                        <td className="p-2 text-right font-medium">{formatCurrencyModal(tx.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
             <div className="text-right mt-2 text-sm font-bold text-purple-700">
                Total Sélectionné: {formatCurrencyModal(totalFacture)}
            </div>
          </div>
            
          {/* Notes */}
          <div className="mt-3">
            <label htmlFor="notesFacture" className="block text-xs font-medium text-gray-600">Notes pour la Facture (optionnel)</label>
            <textarea id="notesFacture" value={notesFacture} onChange={e=>setNotesFacture(e.target.value)} rows={2} className={inputClass + " text-sm"} placeholder="Ex: Conditions de paiement spécifiques..."></textarea>
          </div>

          {error && (<div className="mt-3 p-2 rounded-md bg-red-50 text-red-700 text-sm flex items-center"><FiAlertCircle className="mr-1.5"/> {error}</div>)}
        </div>

        <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary-sm w-full sm:w-auto">Annuler</button>
          <button type="button" onClick={handleSubmit} disabled={isSaving || selectedTransactionIds.length === 0}
            className="btn-primary-sm w-full sm:w-auto inline-flex items-center justify-center min-w-[180px]">
            {isSaving ? <Spinner size="sm" color="text-white"/> : <><FiFileText className="mr-2"/>Générer la Facture</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default GenererFactureModal;