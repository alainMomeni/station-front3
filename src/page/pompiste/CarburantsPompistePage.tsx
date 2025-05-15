// src/page/pompiste/CarburantsPompistePage.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import CuveCard from '../../components/CuveCard';
import Spinner from '../../components/Spinner';
import SaisieIndexModal from '../../components/SaisieIndexModal';

interface CuveData {
  id: string;
  nomCuve: string;
  typeCarburant: string;
  capaciteMax: number;
  niveauActuel: number;
  seuilSecurite: number;
  stockOuvertureQuart?: number;
  prixVenteUnitaire?: number; // NOUVEAU: Prix pour le calcul
  pompesAssociees?: string[];
  unite?: string;
  dernierIndexDebut?: number;
  dernierIndexFin?: number;
}

// MISE À JOUR DES DONNÉES MOCK pour inclure prixVenteUnitaire
const getCuvesAssigneesPompiste = async (): Promise<CuveData[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    {
      id: 'cuve1', nomCuve: 'Cuve Principale 1', typeCarburant: 'Essence SP95',
      capaciteMax: 20000, niveauActuel: 12500, seuilSecurite: 4000,
      stockOuvertureQuart: 14200,
      prixVenteUnitaire: 820, // Prix de vente pour SP95
      dernierIndexDebut: 120000.00, dernierIndexFin: 123450.25,
      unite: 'L'
    },
    {
      id: 'cuve2', nomCuve: 'Cuve Diesel A', typeCarburant: 'Diesel',
      capaciteMax: 15000, niveauActuel: 3500, seuilSecurite: 3000,
      stockOuvertureQuart: 5100,
      prixVenteUnitaire: 780, // Prix de vente pour Diesel
      dernierIndexDebut: 85000.50, dernierIndexFin: 88760.90,
      unite: 'L'
    },
    {
      id: 'cuve3', nomCuve: 'Réserve SP98', typeCarburant: 'Essence SP98',
      capaciteMax: 10000, niveauActuel: 8200, seuilSecurite: 2000,
      stockOuvertureQuart: 8500,
      prixVenteUnitaire: 850, // Prix de vente pour SP98
      unite: 'L'
    },
     {
      id: 'cuve4', nomCuve: 'Cuve Kérosène JET-A1', typeCarburant: 'Kérosène',
      capaciteMax: 50000, niveauActuel: 45000, seuilSecurite: 10000,
      stockOuvertureQuart: 48000,
      prixVenteUnitaire: 650, // Prix de vente pour Kérosène (exemple)
      dernierIndexDebut: 250000.00, dernierIndexFin: 258000.75,
      unite: 'L'
    },
  ];
};

const CarburantsPompistePage: React.FC = () => {
  const [cuves, setCuves] = useState<CuveData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLastUpdated] = useState<Date | null>(null);
  const [selectedCuveForIndex, setSelectedCuveForIndex] = useState<CuveData | null>(null);

  const fetchCuvesData = async (isInitialLoad = false) => {
    setIsLoading(true);
    try {
      const data = await getCuvesAssigneesPompiste();
      const updatedData = data.map(cuve => ({
        ...cuve,
        // Simulation d'une baisse du niveau, le stockOuverture et le prixVenteUnitaire restent fixes pour le quart
        niveauActuel: isInitialLoad ? cuve.niveauActuel : Math.max(0, cuve.niveauActuel - Math.floor(Math.random() * (cuve.capaciteMax * 0.001)))
      }));
      setCuves(updatedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erreur lors de la récupération des données des cuves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCuvesData(true);
    const intervalId = setInterval(() => fetchCuvesData(false), 300000);
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenIndexModal = (cuve: CuveData) => {
    setSelectedCuveForIndex(cuve);
  };

  const handleCloseIndexModal = () => {
    setSelectedCuveForIndex(null);
  };

  const handleSubmitIndex = async (cuveId: string, indexDebut: number, indexFin: number, notes?: string) => {
    console.log(`Index soumis pour cuve ${cuveId}: Début=${indexDebut}, Fin=${indexFin}, Notes=${notes}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const cuveModifiee = cuves.find(c => c.id === cuveId);

    // Calcul du nouveau niveau basé sur le volume réellement vendu (selon les index)
    // plutot que de soustraire une valeur aléatoire
    if (cuveModifiee && cuveModifiee.stockOuvertureQuart !== undefined) {
        const volumeVenduParIndex = indexFin - indexDebut;
        // Important: cette logique assume que stockOuvertureQuart est le niveau exact au moment où indexDebut a été pris.
        // Si le système doit être très précis, indexDebut devrait être pris au même moment que stockOuvertureQuart.
        const nouveauNiveauCalcule = cuveModifiee.stockOuvertureQuart - volumeVenduParIndex;

        setCuves(prevCuves =>
            prevCuves.map(c =>
            c.id === cuveId ? { 
                ...c, 
                niveauActuel: Math.max(0, nouveauNiveauCalcule), // Le niveau actuel est mis à jour
                dernierIndexDebut: indexDebut, 
                dernierIndexFin: indexFin 
            } : c
            )
        );
    }


    alert(`Index enregistrés pour la cuve ${cuveModifiee?.nomCuve || cuveId}!`);
    handleCloseIndexModal();
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Niveaux des Cuves & Saisie Index
        </h1>
        <div className="flex items-center space-x-3">
        </div>
      </div>

      {isLoading && cuves.length === 0 ? (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      ) : !isLoading && cuves.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Aucune donnée de cuve disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {cuves.map((cuve) => (
            <CuveCard
                key={cuve.id}
                cuve={cuve}
                onOpenIndexModal={handleOpenIndexModal}
            />
          ))}
        </div>
      )}

      {selectedCuveForIndex && (
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