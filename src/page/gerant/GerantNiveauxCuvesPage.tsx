// src/page/gerant/GerantNiveauxCuvesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import CuveStatCard, { type CuveStatData } from '../../components/cards/CuveStatCard'; // <= Importer la nouvelle carte
import { FiClipboard, FiDroplet, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Simuler la récupération des données de toutes les cuves pour le gérant
const fetchAllCuvesDataForGerant = async (): Promise<CuveStatData[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simuler latence API
  return [
    { id: 'cuve1', nomCuve: 'Cuve SP95 - Principale', typeCarburant: 'Essence SP95', capaciteMax: 20000, niveauActuel: 12500, seuilSecurite: 4000, unite: 'L', temperature: 28, derniereLivraisonDate: '2024-07-10T00:00:00Z'},
    { id: 'cuve2', nomCuve: 'Cuve Diesel - A', typeCarburant: 'Diesel', capaciteMax: 15000, niveauActuel: 3500, seuilSecurite: 3000, unite: 'L', temperature: 29, derniereLivraisonDate: '2024-07-12T00:00:00Z'},
    { id: 'cuve3', nomCuve: 'Cuve SP98 - Réserve', typeCarburant: 'Essence SP98', capaciteMax: 10000, niveauActuel: 8200, seuilSecurite: 2000, unite: 'L', temperature: 27 },
    { id: 'cuve4', nomCuve: 'Cuve Diesel - B (Flotte)', typeCarburant: 'Diesel', capaciteMax: 25000, niveauActuel: 7000, seuilSecurite: 5000, unite: 'L'},
    { id: 'cuve5', nomCuve: 'Cuve Kérosène JET-A1', typeCarburant: 'Kérosène', capaciteMax: 50000, niveauActuel: 11500, seuilSecurite: 10000, unite: 'L', temperature: 26, derniereLivraisonDate: '2024-07-05T00:00:00Z'},
  ].map(cuve => { // Pré-calculer certains champs pour la carte
      const pourcentageRemplissage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
      const volumeDisponibleAvantSeuil = Math.max(0, cuve.niveauActuel - cuve.seuilSecurite);
      let statutNiveau: CuveStatData['statutNiveau'] = 'OK';
      if (cuve.niveauActuel <= cuve.seuilSecurite) {
        statutNiveau = 'CRITIQUE';
      } else if (cuve.niveauActuel <= cuve.seuilSecurite * 1.25) { // Alerte si < 25% au-dessus du seuil
        statutNiveau = 'ALERTE_BASSE';
      }
      return {...cuve, pourcentageRemplissage, volumeDisponibleAvantSeuil, statutNiveau};
  });
};

const GerantNiveauxCuvesPage: React.FC = () => {
  const [cuves, setCuves] = useState<CuveStatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtreCarburant, setFiltreCarburant] = useState<string>(''); // Pour filtrer par type de carburant
  const [filtreStatut, setFiltreStatut] = useState<string>(''); // Pour filtrer par statut (OK, ALERTE_BASSE, CRITIQUE)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);


  const chargerDonneesCuves = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCuvesDataForGerant();
      setCuves(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur de chargement des données des cuves pour le gérant:", error);
      // Gérer l'erreur d'affichage à l'utilisateur si nécessaire
    }
    setIsLoading(false);
  };

  useEffect(() => {
    chargerDonneesCuves();
    // Optionnel: Mettre en place un rafraîchissement automatique
    const intervalId = setInterval(chargerDonneesCuves, 300000); // Toutes les 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  const typesCarburantUniques = useMemo(() => {
    return Array.from(new Set(cuves.map(c => c.typeCarburant))) as string[];
  }, [cuves]);

  const statusOptions: {value: CuveStatData['statutNiveau'] | '', label: string}[] = [
    {value: '', label: 'Tous les Statuts'},
    {value: 'OK', label: 'Niveau OK'},
    {value: 'ALERTE_BASSE', label: 'Alerte Basse'},
    {value: 'CRITIQUE', label: 'Niveau Critique'},
  ]

  const cuvesFiltrees = useMemo(() => {
    return cuves
      .filter(cuve => filtreCarburant === '' || cuve.typeCarburant === filtreCarburant)
      .filter(cuve => filtreStatut === '' || cuve.statutNiveau === filtreStatut)
      .sort((a, b) => { // Trier pour mettre les critiques et alertes en premier
          const order = { 'CRITIQUE': 0, 'ALERTE_BASSE': 1, 'OK': 2 };
          return (order[a.statutNiveau!] ?? 99) - (order[b.statutNiveau!] ?? 99) || a.nomCuve.localeCompare(b.nomCuve);
      });
  }, [cuves, filtreCarburant, filtreStatut]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          <FiDroplet className="inline-block mr-2 mb-1 h-6 w-6" /> Niveaux des Cuves & Seuils
        </h1>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {lastUpdated && <span>Dernière MàJ: {lastUpdated.toLocaleTimeString('fr-FR')}</span>}
          <button onClick={chargerDonneesCuves} disabled={isLoading} className="p-1.5 hover:text-purple-600 disabled:opacity-50" title="Rafraîchir les données">
            <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <FiFilter className="h-5 w-5 text-gray-400 shrink-0" />
        <div className="w-full sm:w-auto">
            <label htmlFor="filtreCarburant" className="sr-only">Filtrer par type de carburant</label>
            <select
                id="filtreCarburant"
                value={filtreCarburant}
                onChange={(e) => setFiltreCarburant(e.target.value)}
                className="block w-full sm:w-48 text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
            >
                <option value="">Tous les Carburants</option>
                {typesCarburantUniques.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
        <div className="w-full sm:w-auto">
            <label htmlFor="filtreStatut" className="sr-only">Filtrer par statut</label>
             <select
                id="filtreStatut"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="block w-full sm:w-48 text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
            >
                {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
      </div>

      {isLoading && cuves.length === 0 ? (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      ) : !isLoading && cuvesFiltrees.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Aucune cuve ne correspond aux filtres sélectionnés ou aucune donnée disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {cuvesFiltrees.map((cuve: CuveStatData) => (
            <CuveStatCard key={cuve.id} cuve={cuve} />
          ))}
        </div>
      )}
        <div className="mt-8 text-center">
             <Link 
                to="/gerant/commandes/nouveau" // Ou une page spécifique pour les commandes carburant
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
            >
                <FiClipboard className="mr-2 h-5 w-5" />
                Planifier une Livraison / Bon de Commande
            </Link>
        </div>
    </DashboardLayout>
  );
};

export default GerantNiveauxCuvesPage;