import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import CuveCard from '../components/CuveCard';
import Spinner from '../components/Spinner';
import SaisieIndexModal from '../components/SaisieIndexModal'; // Import the modal
import { FiRefreshCw } from 'react-icons/fi';

interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  pompesAssociees?: string[];
  unite?: string;
  dernierIndexDebut?: number;
  dernierIndexFin?: number;
}

const getCuvesAssigneesPompiste = async (): Promise<CuveData[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: 'cuve1', nomCuve: 'Cuve Principale 1', typeCarburant: 'Essence SP95', capaciteMax: 20000, niveauActuel: 12500, seuilSecurite: 4000, dernierIndexFin: 123450.25 },
    { id: 'cuve2', nomCuve: 'Cuve Diesel A', typeCarburant: 'Diesel', capaciteMax: 15000, niveauActuel: 3500, seuilSecurite: 3000, dernierIndexFin: 88760.90 },
    { id: 'cuve3', nomCuve: 'Réserve SP98', typeCarburant: 'Essence SP98', capaciteMax: 10000, niveauActuel: 8200, seuilSecurite: 2000 }, // No last index for example
  ];
};

const CarburantsPompistePage: React.FC = () => {
  const [cuves, setCuves] = useState<CuveData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // State for SaisieIndexModal
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);
  const [selectedCuveForIndex, setSelectedCuveForIndex] = useState<CuveData | null>(null);

  const fetchCuvesData = async (isInitialLoad = false) => {
    setIsLoading(true);
    try {
      const data = await getCuvesAssigneesPompiste();
      const updatedData = data.map(cuve => ({
        ...cuve,
        niveauActuel: isInitialLoad ? cuve.niveauActuel : Math.max(0, cuve.niveauActuel - Math.floor(Math.random() * (cuve.capaciteMax * 0.005)))
      }));
      setCuves(updatedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCuvesData(true);
    const intervalId = setInterval(() => fetchCuvesData(false), 300000);
    return () => clearInterval(intervalId);
  }, []);

  // --- Modal Handler Functions ---
  const handleOpenIndexModal = (cuve: CuveData) => {
    setSelectedCuveForIndex(cuve);
    setIsIndexModalOpen(true);
  };

  const handleCloseIndexModal = () => {
    setIsIndexModalOpen(false);
    setSelectedCuveForIndex(null);
  };

  const handleSubmitIndex = async (cuveId: string, indexDebut: number, indexFin: number, notes?: string) => {
    console.log(`Index soumis pour cuve ${cuveId}: Début=${indexDebut}, Fin=${indexFin}, Notes=${notes}`);
    // TODO: API call to save the indexes
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fix: Change 'fin' to 'indexFin'
    setCuves(prevCuves =>
      prevCuves.map(c =>
        c.id === cuveId ? { ...c, dernierIndexDebut: indexDebut, dernierIndexFin: indexFin } : c
      )
    );
    alert(`Index enregistrés pour la cuve ${cuveId}!`); // Remplacer par un toast/notification
    handleCloseIndexModal(); // Fermer le modal après soumission réussie
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        {/* ... (title & refresh button) ... */}
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Niveaux des Cuves (Mon Quart)
        </h1>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Dernière MàJ: {lastUpdated.toLocaleTimeString('fr-FR')}
            </p>
          )}
          <button
            onClick={() => fetchCuvesData(false)}
            disabled={isLoading}
            className="p-2 rounded-md text-purple-600 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rafraîchir les données"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading && cuves.length > 0 ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading && cuves.length === 0 ? (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      ) : !isLoading && cuves.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow p-6">...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cuves.map((cuve) => (
            <CuveCard
                key={cuve.id}
                cuve={cuve}
                onOpenIndexModal={handleOpenIndexModal} // Pass the handler
            />
          ))}
        </div>
      )}

      {/* Saisie Index Modal */}
      {selectedCuveForIndex && ( // Conditionner l'affichage du modal sur la présence de selectedCuveForIndex
        <SaisieIndexModal
          cuve={selectedCuveForIndex}
          onClose={handleCloseIndexModal}
          onSubmitIndex={handleSubmitIndex}
        />
      )}
    </DashboardLayout>
  );
};

export default CarburantsPompistePage;