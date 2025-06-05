// src/page/gerant/GerantNiveauxCuvesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import CuveStatCard, { type CuveStatData } from '../../components/cards/CuveStatCard';
import { FiClipboard, FiFilter } from 'react-icons/fi';
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
  ].map(cuve => {
      const pourcentageRemplissage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
      const volumeDisponibleAvantSeuil = Math.max(0, cuve.niveauActuel - cuve.seuilSecurite);
      let statutNiveau: CuveStatData['statutNiveau'] = 'OK';
      if (cuve.niveauActuel <= cuve.seuilSecurite) {
        statutNiveau = 'CRITIQUE';
      } else if (cuve.niveauActuel <= cuve.seuilSecurite * 1.25) {
        statutNiveau = 'ALERTE_BASSE';
      }
      return {...cuve, pourcentageRemplissage, volumeDisponibleAvantSeuil, statutNiveau};
  });
};

const GerantNiveauxCuvesPage: React.FC = () => {
  const [cuves, setCuves] = useState<CuveStatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtreCarburant, setFiltreCarburant] = useState<string>('');
  const [filtreStatut, setFiltreStatut] = useState<string>('');
  const [, setLastUpdated] = useState<Date | null>(null);


  const chargerDonneesCuves = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCuvesDataForGerant();
      setCuves(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur de chargement des données des cuves pour le gérant:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    chargerDonneesCuves();
    const intervalId = setInterval(chargerDonneesCuves, 300000);
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
      .sort((a, b) => {
          const order = { 'CRITIQUE': 0, 'ALERTE_BASSE': 1, 'OK': 2 };
          // Si statutNiveau est undefined, on le met à la fin (99)
          const orderA = order[a.statutNiveau as keyof typeof order] ?? 99;
          const orderB = order[b.statutNiveau as keyof typeof order] ?? 99;
          return orderA - orderB || a.nomCuve.localeCompare(b.nomCuve);
      });
  }, [cuves, filtreCarburant, filtreStatut]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
           Niveaux des Cuves & Seuils
        </h1>
      </div>

      {/* Filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center text-gray-500 sm:w-auto whitespace-nowrap">
            <FiFilter className="h-5 w-5" />
            <span className="text-sm font-medium ml-2">Filtres</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Filtre Carburant */}
            <div className="relative w-full sm:w-56">
              <select
                id="filtreCarburant"
                value={filtreCarburant}
                onChange={(e) => setFiltreCarburant(e.target.value)}
                className="block w-full text-sm border border-gray-300 rounded-lg py-2 pl-3 pr-10
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                        cursor-pointer bg-white transition-all duration-200
                        hover:border-purple-400"
              >
                <option value="">Tous les Carburants</option>
                {typesCarburantUniques.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Filtre Statut */}
            <div className="relative w-full sm:w-56">
              <select
                id="filtreStatut"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="block w-full text-sm border border-gray-300 rounded-lg py-2 pl-3 pr-10
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                        cursor-pointer bg-white transition-all duration-200
                        hover:border-purple-400"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading && cuves.length === 0 ? (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      ) : !isLoading && cuvesFiltrees.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Aucune cuve ne correspond aux filtres sélectionnés ou aucune donnée disponible.</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {cuvesFiltrees.map((cuve: CuveStatData) => (
                <CuveStatCard key={cuve.id} cuve={cuve} />
              ))}
            </div>
            <div className="mt-8 text-center">
                <Link
                  to="/gerant/commandes/nouveau"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                >
                  <FiClipboard className="mr-2 h-5 w-5" />
                  Planifier une Livraison / Bon de Commande
                </Link>
            </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default GerantNiveauxCuvesPage;