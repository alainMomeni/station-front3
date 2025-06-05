// src/page/gerant/GerantRelevesEntreprisesPage.tsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiFileText, FiCalendar, FiUsers, FiPrinter, FiDownload, FiPlayCircle, FiAlertCircle, FiMail } from 'react-icons/fi';
import { format, subMonths, startOfMonth, endOfMonth, parseISO, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ClientProfessionnel, TransactionCredit } from '../../types/clients';
import type { ReleveCompteClient, LigneReleveClient } from '../../types/clients';

// --- Données Mock ---
const dummyClientsProData: ClientProfessionnel[] = [
  { 
    id: 'CLI001', 
    typeClient: 'professionnel',
    nomAffichage: 'Transport Express Plus',
    raisonSociale: 'Transport Express Plus',
    nomEntreprise: 'Transport Express Plus', 
    emailContact: 'contact@transportexpress.com',
    email: 'contact@transportexpress.com',
    limiteCredit: 5000000, 
    soldeActuel: 1850000, 
    adresseFacturation: "Km 4, Route de Rufisque, Dakar", 
    statutCompte: 'actif'
  },
  { 
    id: 'CLI002', 
    typeClient: 'professionnel',
    nomAffichage: 'BTP Construction S.A.',
    raisonSociale: 'BTP Construction S.A.',
    nomEntreprise: 'BTP Construction S.A.', 
    emailContact: 'daf@btpconstruct.net',
    email: 'daf@btpconstruct.net',
    limiteCredit: 10000000, 
    soldeActuel: 7500000, 
    adresseFacturation: "VDN, Cité Keur Gorgui", 
    statutCompte: 'actif' 
  },
  { 
    id: 'CLI003', 
    typeClient: 'professionnel',
    nomAffichage: 'AgroDistrib & Co',
    raisonSociale: 'AgroDistrib & Co',
    nomEntreprise: 'AgroDistrib & Co', 
    emailContact: 'achats@agrodistrib.com',
    email: 'achats@agrodistrib.com',
    limiteCredit: 2000000, 
    soldeActuel: 350000, 
    adresseFacturation: "Zone Industrielle, Lot 34", 
    statutCompte: 'actif' 
  },
];

// Transactions et Paiements pour la simulation
const transactionsEtPaiementsSimules: TransactionCredit[] = [
  // Client CLI001
  { 
    id: 'TRCR001', 
    clientId: 'CLI001', 
    clientNom: 'Transport Express Plus', 
    dateTransaction: format(subDays(new Date(), 20), 'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Achat Diesel - Camion A', 
    montant: 450000, 
    estFacturee: true, 
    type: 'achat'
  },
  { 
    id: 'TRCR003', 
    clientId: 'CLI001', 
    clientNom: 'Transport Express Plus', 
    dateTransaction: format(subDays(new Date(), 15),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Achat Lubrifiants - Lot B', 
    montant: 85000, 
    estFacturee: true, 
    type: 'achat' 
  },
  { 
    id: 'PAIE001', 
    clientId: 'CLI001', 
    clientNom: 'Transport Express Plus', 
    dateTransaction: format(subDays(new Date(), 10),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Paiement Facture F202406-001', 
    montant: -210000, 
    estFacturee: true, 
    type: 'paiement'
  },
  { 
    id: 'TRCR006', 
    clientId: 'CLI001', 
    clientNom: 'Transport Express Plus', 
    dateTransaction: format(subDays(new Date(), 5),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'SP98 Camion Bleu', 
    montant: 220000, 
    estFacturee: false, 
    type: 'achat'
  },
  { 
    id: 'TRCR008', 
    clientId: 'CLI001', 
    clientNom: 'Transport Express Plus', 
    dateTransaction: format(subDays(new Date(), 2),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Gazole - Livraison X', 
    montant: 180000, 
    estFacturee: false, 
    type: 'achat'
  },
  // Client CLI002
  { 
    id: 'TRCR004', 
    clientId: 'CLI002', 
    clientNom: 'BTP Construction S.A.', 
    dateTransaction: format(subDays(new Date(), 18),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Diesel - Chantier Y', 
    montant: 1250000, 
    estFacturee: true, 
    type: 'achat' 
  },
  { 
    id: 'PAIE002', 
    clientId: 'CLI002', 
    clientNom: 'BTP Construction S.A.', 
    dateTransaction: format(subDays(new Date(), 8),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Paiement Facture F202406-002', 
    montant: -450000, 
    estFacturee: true, 
    type: 'paiement'
  },
  { 
    id: 'TRCR009', 
    clientId: 'CLI002', 
    clientNom: 'BTP Construction S.A.', 
    dateTransaction: format(subDays(new Date(), 3),'yyyy-MM-ddTHH:mm:ssX'), 
    description: 'Gazole - Engin Z', 
    montant: 75000, 
    estFacturee: false, 
    type: 'achat'
  },
];

const fetchRelevePourClientEtPeriode = async (clientId: string, dateDebut: string, dateFin: string): Promise<ReleveCompteClient | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const client = dummyClientsProData.find(c => c.id === clientId);
  if (!client) return null;

  // Simuler un solde initial. Dans la réalité, ce serait calculé.
  // Pour la démo: solde actuel - somme des transactions (achats + paiements) entre dateDebut et dateFin
  const dateDebutObj = parseISO(dateDebut + 'T00:00:00.000Z');
  const dateFinObj = parseISO(dateFin + 'T23:59:59.999Z');
  
  let soldeAvantPeriode = client.soldeActuel || 0; // On part du solde actuel et on remonte
  transactionsEtPaiementsSimules
    .filter(tx => tx.clientId === clientId && parseISO(tx.dateTransaction) >= dateDebutObj)
    .forEach(tx => {
        soldeAvantPeriode -= tx.montant; // Si montant est négatif (paiement), ça va l'ajouter.
    });
  const soldeInitialPeriode = parseFloat(soldeAvantPeriode.toFixed(0));

  const transactionsDeLaPeriode = transactionsEtPaiementsSimules
    .filter(tx => tx.clientId === clientId && 
                   parseISO(tx.dateTransaction) >= dateDebutObj && 
                   parseISO(tx.dateTransaction) <= dateFinObj)
    .sort((a, b) => parseISO(a.dateTransaction).getTime() - parseISO(b.dateTransaction).getTime());

  let soldeProgressif = soldeInitialPeriode;
  const lignesReleve: LigneReleveClient[] = transactionsDeLaPeriode.map(tx => {
    soldeProgressif += tx.montant; // Les paiements sont déjà négatifs
    return {
      date: format(parseISO(tx.dateTransaction), 'dd/MM/yyyy HH:mm'),
      description: tx.description,
      reference: tx.referenceBC || tx.id,
      debit: tx.type === 'achat' ? tx.montant : undefined,
      credit: tx.type === 'paiement' ? Math.abs(tx.montant) : undefined, // Afficher le crédit en positif
      soldeProgressif: parseFloat(soldeProgressif.toFixed(0))
    };
  });

  return {
    clientId: client.id,
    clientNom: client.nomEntreprise || client.raisonSociale,
    clientAdresse: client.adresseFacturation,
    clientEmail: client.emailContact || client.email,
    numeroReleve: `REL-${format(new Date(), 'yyyyMMdd')}-${client.id.slice(-3)}`,
    dateGeneration: format(new Date(), 'yyyy-MM-dd'),
    periodeDebut: dateDebut,
    periodeFin: dateFin,
    soldeInitialPeriode: soldeInitialPeriode,
    lignes: lignesReleve,
    soldeFinalPeriode: parseFloat(soldeProgressif.toFixed(0)),
    notesBasDePage: "Merci de vérifier ce relevé et de nous signaler toute anomalie sous 7 jours. Paiement attendu selon vos conditions contractuelles."
  };
};

const GerantRelevesEntreprisesPage: React.FC = () => {
  const [clientsPro] = useState<ClientProfessionnel[]>(dummyClientsProData);
  const [selectedClientId, setSelectedClientId] = useState<string>(dummyClientsProData[0]?.id || '');
  const [dateDebut, setDateDebut] = useState(format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  const [dateFin, setDateFin] = useState(format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'));
  
  const [releveGenere, setReleveGenere] = useState<ReleveCompteClient | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleGenererReleve = async () => {
    if (!selectedClientId || !dateDebut || !dateFin) {
      setErrorMessage("Veuillez sélectionner un client et une période complète.");
      return;
    }
    if (new Date(dateDebut) > new Date(dateFin)) {
        setErrorMessage("La date de début ne peut pas être ultérieure à la date de fin.");
        return;
    }
    setIsGenerating(true);
    setErrorMessage(null);
    setReleveGenere(null);
    try {
      const resultat = await fetchRelevePourClientEtPeriode(selectedClientId, dateDebut, dateFin);
      setReleveGenere(resultat);
    } catch (error) {
      console.error("Erreur génération relevé:", error);
      setErrorMessage("Une erreur est survenue lors de la génération du relevé.");
    }
    setIsGenerating(false);
  };
  
  const handlePrint = () => {
      if(!releveGenere) return;
      const printArea = document.getElementById('releve-preview-area');
      if(printArea){
          const originalContents = document.body.innerHTML;
          const printContents = printArea.innerHTML;
          
          document.body.innerHTML = `
              <html>
                  <head>
                      <title>Relevé de Compte - ${releveGenere.clientNom}</title>
                      <style>
                          body { font-family: Arial, sans-serif; margin: 20px; font-size: 10pt; }
                          .print-container { width: 100%; }
                          h1, h2, h3 { margin-bottom: 0.5em; color: #333; }
                          h2 { font-size: 1.5em;} h3 { font-size: 1.2em; }
                          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9pt; }
                          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                          th { background-color: #f7f7f7; font-weight: bold; }
                          .text-right { text-align: right !important; }
                          .font-semibold { font-weight: 600; }
                          .text-gray-600 { color: #555; }
                          .text-purple-700 { color: #6b46c1; }
                          .border-b { border-bottom: 1px solid #eee; }
                          .pb-4 { padding-bottom: 1rem; }
                          .mb-4 { margin-bottom: 1rem; }
                          .mt-2 { margin-top: 0.5rem; }
                          .no-print { display: none !important; }
                      </style>
                  </head>
                  <body>
                      <div class="print-container">
                          ${printContents}
                      </div>
                  </body>
              </html>
          `;
          window.print();
          document.body.innerHTML = originalContents;
          window.location.reload(); // Recharger pour restaurer les event listeners et le style
      }
  };

  const formatCurrencyTable = (val?: number) => val?.toLocaleString('fr-FR') || '-';

  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-purple-500 focus:border-purple-500";
  const filtresComplets = !!selectedClientId && !!dateDebut && !!dateFin;

  return (
    <DashboardLayout>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        <FiFileText className="inline-block mr-2 mb-1 h-6 w-6" /> Relevés de Compte Entreprise
      </h1>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Critères du Relevé</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-1">
                <label htmlFor="selectedClientId" className="block text-xs font-medium text-gray-700 mb-1">
                  <FiUsers className="inline mr-1"/>Client Entreprise
                </label>
                <select 
                  id="selectedClientId" 
                  value={selectedClientId} 
                  onChange={e => setSelectedClientId(e.target.value)} 
                  className={`${inputClass} cursor-pointer`}
                >
                    {clientsPro.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nomEntreprise || client.raisonSociale}
                      </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="dateDebutReleve" className="block text-xs font-medium text-gray-700 mb-1">
                  <FiCalendar className="inline mr-1"/>Période - Début
                </label>
                <input 
                  type="date" 
                  id="dateDebutReleve" 
                  value={dateDebut} 
                  onChange={e => setDateDebut(e.target.value)} 
                  className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="dateFinReleve" className="block text-xs font-medium text-gray-700 mb-1">
                  <FiCalendar className="inline mr-1"/>Période - Fin
                </label>
                <input 
                  type="date" 
                  id="dateFinReleve" 
                  value={dateFin} 
                  onChange={e => setDateFin(e.target.value)} 
                  className={inputClass}
                />
            </div>
             <div className="lg:col-span-1 pt-3">
                 <button 
                   onClick={handleGenererReleve} 
                   disabled={isGenerating || !selectedClientId}
                   className="btn-primary w-full inline-flex items-center justify-center px-6 py-2.5"
                 >
                    {isGenerating ? (
                      <Spinner size="sm" color="text-white"/>
                    ) : (
                      <>
                        <FiPlayCircle className="mr-2"/>
                        Générer Relevé
                      </>
                    )}
                </button>
            </div>
        </div>
         {errorMessage && (
           <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-center">
             <FiAlertCircle className="mr-2 shrink-0"/> {errorMessage}
           </div>
         )}
      </div>

      {isGenerating && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center py-12">
          <Spinner size="lg"/>
          <p className="mt-3 text-gray-600">Génération du relevé...</p>
        </div>
      )}

      {!isGenerating && releveGenere && (
        <div className="mt-6 animate-fadeIn">
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-xl border border-gray-200" id="releve-preview-area">
                {/* En-tête du Relevé */}
                <div className="mb-6 pb-4 border-b border-dashed">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-700">{releveGenere.clientNom}</h2>
                            <p className="text-sm text-gray-600">{releveGenere.clientAdresse || 'Adresse non spécifiée'}</p>
                            <p className="text-xs text-gray-500">Client ID: {releveGenere.clientId}</p>
                        </div>
                        <div className="text-left sm:text-right mt-3 sm:mt-0">
                            <h3 className="text-lg font-semibold text-gray-800">Relevé de Compte</h3>
                            <p className="text-xs text-gray-500">N°: {releveGenere.numeroReleve}</p>
                            <p className="text-xs text-gray-500">
                              Généré le: {format(parseISO(releveGenere.dateGeneration+'T00:00:00'), 'dd MMMM yyyy', {locale:fr})}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Période du <span className="font-medium">{format(parseISO(releveGenere.periodeDebut+'T00:00:00'), 'dd/MM/yyyy')}</span> au <span className="font-medium">{format(parseISO(releveGenere.periodeFin+'T00:00:00'), 'dd/MM/yyyy')}</span>
                    </p>
                </div>
                
                <p className="text-sm mb-2">
                  Solde au <span className="font-medium">{format(parseISO(releveGenere.periodeDebut+'T00:00:00'), 'dd/MM/yyyy')}</span> : <span className="font-semibold">{releveGenere.soldeInitialPeriode.toLocaleString('fr-FR')} XAF</span>
                </p>

                {/* Tableau des Lignes */}
                <div className="overflow-x-auto mb-4 border rounded-md">
                    <table className="min-w-full text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left font-medium text-gray-600">Date</th>
                                <th className="p-2 text-left font-medium text-gray-600">Description / Réf.</th>
                                <th className="p-2 text-right font-medium text-gray-600">Débit (Achats)</th>
                                <th className="p-2 text-right font-medium text-gray-600">Crédit (Paiements)</th>
                                <th className="p-2 text-right font-medium text-gray-600">Solde Progressif</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {releveGenere.lignes.map((ligne, idx) => (
                                <tr key={idx}>
                                    <td className="p-2 whitespace-nowrap">{ligne.date}</td>
                                    <td className="p-2">
                                        {ligne.description}
                                        {ligne.reference && (
                                          <span className="block text-gray-400 text-xs">Réf: {ligne.reference}</span>
                                        )}
                                    </td>
                                    <td className="p-2 text-right">
                                      {ligne.debit !== undefined ? formatCurrencyTable(ligne.debit) : '-'}
                                    </td>
                                    <td className="p-2 text-right text-green-600">
                                      {ligne.credit !== undefined ? formatCurrencyTable(ligne.credit) : '-'}
                                    </td>
                                    <td className="p-2 text-right font-medium">
                                      {formatCurrencyTable(ligne.soldeProgressif)}
                                    </td>
                                </tr>
                            ))}
                             {releveGenere.lignes.length === 0 && (
                                 <tr>
                                   <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                                     Aucune transaction ou paiement pour cette période.
                                   </td>
                                 </tr>
                             )}
                        </tbody>
                    </table>
                </div>
                <p className="text-md font-bold text-right mb-4">
                  Solde au <span className="font-medium">{format(parseISO(releveGenere.periodeFin+'T00:00:00'), 'dd/MM/yyyy')}</span> : <span className="text-purple-700 text-lg">{releveGenere.soldeFinalPeriode.toLocaleString('fr-FR')} XAF</span>
                </p>
                
                {releveGenere.notesBasDePage && (
                  <p className="mt-4 text-xs text-gray-500 border-t pt-3">{releveGenere.notesBasDePage}</p>
                )}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 no-print">
                <button 
                  onClick={handlePrint} 
                  className="btn-secondary-sm inline-flex items-center justify-center"
                >
                  <FiPrinter className="mr-1.5"/>Imprimer
                </button>
                <button 
                  onClick={() => alert("Téléchargement PDF simulé pour relevé N°" + releveGenere.numeroReleve)} 
                  className="btn-primary-sm inline-flex items-center justify-center"
                >
                  <FiDownload className="mr-1.5"/>Télécharger PDF
                </button>
                <button 
                  onClick={() => alert("Envoi Email simulé pour " + releveGenere.clientEmail)} 
                  disabled={!releveGenere.clientEmail} 
                  className="btn-primary-sm inline-flex items-center justify-center disabled:opacity-60"
                >
                  <FiMail className="mr-1.5"/>Envoyer par Email
                </button>
            </div>
        </div>
      )}

      {!isGenerating && !releveGenere && !errorMessage && filtresComplets && (
           <div className="bg-white p-6 rounded-lg shadow-md text-center py-10">
            <p className="text-gray-500">Cliquez sur "Générer Relevé" pour afficher les informations.</p>
          </div>
      )}

          </DashboardLayout>
        );
      };
      
      export default GerantRelevesEntreprisesPage;