// src/page/gerant/GerantRapportsActivitePage.tsx
import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import { FiCalendar, FiBarChart2, FiDownload, FiPlayCircle, FiAlertCircle } from 'react-icons/fi';
import { format, subDays } from 'date-fns';
import type { RapportFiltres, TypeRapportGlobal, RapportResultat } from '../../types/rapports'; // Adapter chemin

// --- Données Mock pour les types de rapports ---
const typesDeRapportsDisponibles: { value: TypeRapportGlobal; label: string }[] = [
  { value: 'ventes_globales_carburant', label: 'Ventes Globales Carburant (Volume & Valeur)' },
  { value: 'ventes_globales_boutique', label: 'Ventes Globales Boutique (Articles & Valeur)' },
  { value: 'synthese_encaissements', label: 'Synthèse des Encaissements (par type)' },
  { value: 'inventaire_valeur_stock_boutique', label: 'Inventaire et Valorisation Stock Boutique' },
  // { value: 'analyse_marges_carburant', label: 'Analyse des Marges sur Carburants' }, // V2
  { value: 'rapport_activite_journalier_complet', label: 'Rapport d\'Activité Journalier Détaillé' },
];

// Simuler la génération de rapport côté "backend"
const genererRapportSimule = async (filtres: RapportFiltres): Promise<RapportResultat> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simule le temps de génération
  
  const periodeStr = `Du ${format(new Date(filtres.dateDebut+'T00:00:00'), 'dd/MM/yyyy')} au ${format(new Date(filtres.dateFin+'T00:00:00'), 'dd/MM/yyyy')}`;
  let rapport: RapportResultat = {
    titre: `Rapport non défini pour le type: ${filtres.typeRapport}`,
    periode: periodeStr,
    indicateursCles: [{libelle: "Données", valeur: "Indisponibles"}]
  };

  switch (filtres.typeRapport) {
    case 'ventes_globales_carburant':
      rapport = {
        titre: 'Rapport des Ventes Globales de Carburant',
        periode: periodeStr,
        indicateursCles: [
          { libelle: 'Volume Total Vendu', valeur: (Math.random() * 50000 + 10000).toFixed(2), unite: 'L' },
          { libelle: 'Chiffre d\'Affaires Carburant', valeur: (Math.random() * 30000000 + 5000000).toLocaleString('fr-FR', {style:'currency', currency:'XAF', minimumFractionDigits:0}), unite: '' },
          { libelle: 'Nombre de transactions carburant', valeur: Math.floor(Math.random() * 2000 + 500), unite: '' },
        ],
        tableauDonnees: {
          entetes: ['Type Carburant', 'Volume Vendu (L)', 'CA (XAF)'],
          lignes: [
            ['SP95', (Math.random()*20000).toFixed(2), (Math.random()*15000000).toFixed(0)],
            ['Diesel', (Math.random()*30000).toFixed(2), (Math.random()*20000000).toFixed(0)],
            ['SP98', (Math.random()*5000).toFixed(2), (Math.random()*3000000).toFixed(0)],
          ],
        },
      };
      break;
    case 'synthese_encaissements':
      const totalEnc = Math.random() * 40000000 + 10000000;
      rapport = {
        titre: 'Synthèse des Encaissements',
        periode: periodeStr,
        indicateursCles: [{libelle: "Total Encaissé", valeur: totalEnc.toLocaleString('fr-FR', {style:'currency', currency:'XAF', minimumFractionDigits:0})}],
        tableauDonnees: {
          entetes: ['Mode de Paiement', 'Montant Encaissé (XAF)', '% du Total'],
          lignes: [
            ['Espèces', (totalEnc * 0.45).toFixed(0), '45%'],
            ['Carte Bancaire', (totalEnc * 0.35).toFixed(0), '35%'],
            ['Mobile Money', (totalEnc * 0.15).toFixed(0), '15%'],
            ['Ventes à Crédit (Nettes)', (totalEnc * 0.05).toFixed(0), '5%'],
          ],
        },
      };
      break;
    // Ajouter d'autres cas pour les autres types de rapports
  }
  return rapport;
};
// --------------------


const GerantRapportsActivitePage: React.FC = () => {
  const [filtres, setFiltres] = useState<RapportFiltres>({
    typeRapport: typesDeRapportsDisponibles[0]?.value || '', // Sélectionne le premier par défaut
    dateDebut: format(subDays(new Date(), 7), 'yyyy-MM-dd'), // 7 derniers jours par défaut
    dateFin: format(new Date(), 'yyyy-MM-dd'),
  });
  const [rapportGenere, setRapportGenere] = useState<RapportResultat | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiltreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltres(prev => ({ ...prev, [name]: value }));
    setRapportGenere(null); // Réinitialiser le rapport si les filtres changent
    setErrorMessage(null);
  };

  const handleGenererRapport = async () => {
    if (!filtres.typeRapport) {
        setErrorMessage("Veuillez sélectionner un type de rapport.");
        return;
    }
    if (!filtres.dateDebut || !filtres.dateFin) {
        setErrorMessage("Veuillez sélectionner une période complète (date de début et de fin).");
        return;
    }
     if (new Date(filtres.dateDebut) > new Date(filtres.dateFin)) {
        setErrorMessage("La date de début ne peut pas être ultérieure à la date de fin.");
        return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setRapportGenere(null);
    try {
      const resultat = await genererRapportSimule(filtres);
      setRapportGenere(resultat);
    } catch (error) {
      console.error("Erreur génération rapport:", error);
      setErrorMessage("Une erreur est survenue lors de la génération du rapport.");
    }
    setIsGenerating(false);
  };

  const handleTelechargerSimule = (format: 'CSV' | 'PDF') => {
      if (!rapportGenere) return;
      alert(`Simulation du téléchargement du rapport "${rapportGenere.titre}" au format ${format}.`);
      // Dans une vraie app: appel à une fonction qui formate les rawData et initie le téléchargement.
  }
  
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-purple-500 focus:border-purple-500";

  return (
    <>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        <FiBarChart2 className="inline-block mr-2 mb-1 h-6 w-6" /> Génération de Rapports d'Activité
      </h1>

      {/* Section des Filtres */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Critères du Rapport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="typeRapport" className="block text-xs font-medium text-gray-700 mb-1">Type de Rapport</label>
            <select id="typeRapport" name="typeRapport" value={filtres.typeRapport} onChange={handleFiltreChange} className={`${inputClass} cursor-pointer`}>
              <option value="" disabled>-- Sélectionner un type --</option>
              {typesDeRapportsDisponibles.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="dateDebut" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><FiCalendar className="mr-1.5 h-4 w-4"/>Date de Début</label>
            <input type="date" id="dateDebut" name="dateDebut" value={filtres.dateDebut} onChange={handleFiltreChange} className={inputClass}/>
          </div>
          <div>
            <label htmlFor="dateFin" className="block text-xs font-medium text-gray-700 mb-1 flex items-center"><FiCalendar className="mr-1.5 h-4 w-4"/>Date de Fin</label>
            <input type="date" id="dateFin" name="dateFin" value={filtres.dateFin} onChange={handleFiltreChange} className={inputClass}/>
          </div>
          {/* Potentiels filtres spécifiques ici selon le type de rapport */}
           <div className="lg:col-span-3 flex justify-start pt-3">
             <button
                onClick={handleGenererRapport}
                disabled={isGenerating || !filtres.typeRapport}
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
                {isGenerating ? <Spinner size="sm" color="text-white" /> : <><FiPlayCircle className="mr-2 h-5 w-5"/> Générer le Rapport</>}
            </button>
          </div>
        </div>
         {errorMessage && (
            <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-center">
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0"/> {errorMessage}
            </div>
        )}
      </div>

      {/* Section d'Affichage du Rapport */}
      {isGenerating && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center py-12">
            <Spinner size="lg"/>
            <p className="mt-4 text-gray-600">Génération du rapport en cours...</p>
        </div>
      )}

      {!isGenerating && rapportGenere && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-3 border-b">
            <div>
                <h2 className="text-xl font-semibold text-purple-700">{rapportGenere.titre}</h2>
                <p className="text-sm text-gray-500">{rapportGenere.periode}</p>
            </div>
            <div className="flex space-x-2 mt-3 sm:mt-0">
                <button onClick={()=>handleTelechargerSimule('CSV')} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"><FiDownload className="mr-1.5"/>CSV</button>
                <button onClick={()=>handleTelechargerSimule('PDF')} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"><FiDownload className="mr-1.5"/>PDF</button>
            </div>
          </div>
          
          {rapportGenere.indicateursCles && rapportGenere.indicateursCles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {rapportGenere.indicateursCles.map((kpi, idx) => (
                <div key={idx} className="bg-indigo-50 p-3 rounded-md border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-medium uppercase">{kpi.libelle}</p>
                  <p className="text-xl font-bold text-indigo-900">
                    {kpi.valeur} {kpi.unite && <span className="text-sm font-normal">{kpi.unite}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}

          {rapportGenere.tableauDonnees && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {rapportGenere.tableauDonnees.entetes.map((entete, idx) => (
                      <th key={idx} className={`px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wider ${idx > 0 ? 'text-right' : ''}`}>{entete}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rapportGenere.tableauDonnees.lignes.map((ligne, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      {ligne.map((cell, cellIdx) => (
                        <td key={cellIdx} className={`px-3 py-2 whitespace-nowrap ${cellIdx > 0 ? 'text-right' : ''}`}>
                          {typeof cell === 'number' ? cell.toLocaleString('fr-FR') : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
           {rapportGenere.notes && (
            <p className="mt-4 text-xs text-gray-500 italic">{rapportGenere.notes}</p>
           )}
        </div>
      )}
      {!isGenerating && !rapportGenere && filtres.typeRapport && !errorMessage &&(
           <div className="bg-white p-6 rounded-lg shadow-md text-center py-10">
            <p className="text-gray-500">Sélectionnez vos critères et cliquez sur "Générer le Rapport".</p>
          </div>
      )}

    </>
  );
};

export default GerantRapportsActivitePage;