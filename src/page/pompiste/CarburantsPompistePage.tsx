// src/page/pompiste/CarburantsPompistePage.tsx (FINAL & COHÉRENT)
import React, { useState, useEffect } from 'react';
import { FiDroplet } from 'react-icons/fi';

// Écosystème et UI Kit
import Spinner from '../../components/Spinner';
import { Card } from '../../components/ui/Card'; // On utilise notre Card de base
import CuveStatCardPompiste from '../../components/equipements/CuveStatCardPompiste';
import SaisieIndexModal from '../../components/modals/SaisieIndexModal';
import { dummyCuvesData } from '../../_mockData/equipements'; // Assure-toi que ce mock existe
// Make sure CuveData is exported from '../../types/equipements', or import the correct type name
import type { CuveData } from '../../types/equipements';

const CarburantsPompistePage: React.FC = () => {
  const [cuves, setCuves] = useState<CuveData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuve, setSelectedCuve] = useState<CuveData | null>(null);

  useEffect(() => {
    // Simuler un chargement asynchrone
    setTimeout(() => {
      setCuves(
        dummyCuvesData.map((cuve: any) => ({
          ...cuve,
          nomCuve: cuve.nomCuve ?? cuve.nom ?? '',
          typeCarburant: cuve.typeCarburant ?? cuve.typeCarburantNom ?? '',
        }))
      ); // Remplace par l'appel API réel si besoin
      setIsLoading(false);
    }, 800);
  }, []);
  const handleSubmitIndex = async (_id: string, _debut: number) => { /*...*/ };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                <FiDroplet className="text-white text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Niveaux & Saisie Index</h1>
                <p className="text-gray-600">Consultez l'état des cuves et saisissez vos index de fin de quart.</p>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center p-20"><Spinner size="lg" /></div>
        ) : cuves.length === 0 ? (
            <Card><div className="text-center p-12 text-gray-500">Aucune cuve assignée ou données indisponibles.</div></Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {cuves.map((cuve) => (
                <CuveStatCardPompiste key={cuve.id} cuve={cuve} onOpenIndexModal={setSelectedCuve} />
              ))}
            </div>
        )}
      </div>

      {selectedCuve && (
        <SaisieIndexModal cuve={selectedCuve} onClose={() => setSelectedCuve(null)} onSubmitIndex={handleSubmitIndex} />
      )}
    </>
  );
};

export default CarburantsPompistePage;