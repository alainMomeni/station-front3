// src/page/gerant/GerantNiveauxCuvesPage.tsx (REFACTORISÉ)
import React, { useState, useEffect, useMemo, type FC } from 'react';
import { FiDroplet, FiFilter, FiClipboard } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Ecosystème et composants UI
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

// Composants Métier
import CuveStatCard, { type CuveStatData } from '../../components/cards/CuveStatCard';


// Simuler la récupération des données de toutes les cuves pour le gérant
const fetchAllCuvesDataForGerant = async (): Promise<CuveStatData[]> => {
    // La logique de fetch et de calcul reste la même
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: 'cuve1', nomCuve: 'Cuve SP95 - Principale', typeCarburant: 'Essence SP95', capaciteMax: 20000, niveauActuel: 12500, seuilSecurite: 4000, unite: "L" as const, temperature: 28},
      { id: 'cuve2', nomCuve: 'Cuve Diesel - A', typeCarburant: 'Diesel', capaciteMax: 15000, niveauActuel: 3500, seuilSecurite: 3000, unite: "L" as const, temperature: 29},
      { id: 'cuve3', nomCuve: 'Cuve SP98 - Réserve', typeCarburant: 'Essence SP98', capaciteMax: 10000, niveauActuel: 8200, seuilSecurite: 2000, unite: "L" as const, temperature: 27 },
      { id: 'cuve4', nomCuve: 'Cuve Diesel - B (Flotte)', typeCarburant: 'Diesel', capaciteMax: 25000, niveauActuel: 7000, seuilSecurite: 5000, unite: "L" as const},
      { id: 'cuve5', nomCuve: 'Cuve Kérosène JET-A1', typeCarburant: 'Kérosène', capaciteMax: 50000, niveauActuel: 11500, seuilSecurite: 10000, unite: "L" as const, temperature: 26},
    ].map(cuve => {
        const pourcentageRemplissage = (cuve.niveauActuel / cuve.capaciteMax) * 100;
        let statutNiveau: CuveStatData['statutNiveau'] = 'OK';
        if (cuve.niveauActuel <= cuve.seuilSecurite) statutNiveau = 'CRITIQUE';
        else if (cuve.niveauActuel <= cuve.seuilSecurite * 1.25) statutNiveau = 'ALERTE_BASSE';
        return {...cuve, pourcentageRemplissage, statutNiveau, volumeDisponibleAvantSeuil:0}; // Mocks simplifiés
    });
};

const NiveauxCuvesFilters: FC<{
    filtreCarburant: string; onFiltreCarburantChange: (value: string) => void;
    filtreStatut: string; onFiltreStatutChange: (value: string) => void;
    typesCarburantUniques: string[];
}> = ({ filtreCarburant, onFiltreCarburantChange, filtreStatut, onFiltreStatutChange, typesCarburantUniques }) => (
    <Card title="Filtres" icon={FiFilter}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
                label="Filtrer par carburant"
                value={filtreCarburant}
                onChange={(e) => onFiltreCarburantChange(e.target.value)}
                options={[{ value: '', label: 'Tous les carburants' }, ...typesCarburantUniques.map(type => ({ value: type, label: type }))]}
            />
             <Select 
                label="Filtrer par statut"
                value={filtreStatut}
                onChange={(e) => onFiltreStatutChange(e.target.value)}
                options={[
                    { value: '', label: 'Tous les statuts' },
                    { value: 'OK', label: 'Niveau OK' },
                    { value: 'ALERTE_BASSE', label: 'Alerte Basse' },
                    { value: 'CRITIQUE', label: 'Niveau Critique' }
                ]}
            />
        </div>
    </Card>
);

const GerantNiveauxCuvesPage: React.FC = () => {
    const [cuves, setCuves] = useState<CuveStatData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtreCarburant, setFiltreCarburant] = useState<string>('');
    const [filtreStatut, setFiltreStatut] = useState<string>('');

    useEffect(() => {
        const chargerDonnees = async () => {
            if (!isLoading) setIsLoading(true); // Afficher spinner si rechargement
            const data = await fetchAllCuvesDataForGerant();
            setCuves(data);
            setIsLoading(false);
        };
        chargerDonnees();
        // Optionnel : Recharger périodiquement
        // const intervalId = setInterval(chargerDonnees, 300000); 
        // return () => clearInterval(intervalId);
    }, []);

    const typesCarburantUniques = useMemo(() => Array.from(new Set(cuves.map(c => c.typeCarburant))), [cuves]);
    const cuvesFiltrees = useMemo(() => {
        return cuves
            .filter(cuve => !filtreCarburant || cuve.typeCarburant === filtreCarburant)
            .filter(cuve => !filtreStatut || cuve.statutNiveau === filtreStatut)
            .sort((a, b) => {
                const order = { 'CRITIQUE': 0, 'ALERTE_BASSE': 1, 'OK': 2 };
                return (order[a.statutNiveau] ?? 99) - (order[b.statutNiveau] ?? 99) || a.nomCuve.localeCompare(b.nomCuve);
            });
    }, [cuves, filtreCarburant, filtreStatut]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiDroplet className="text-white text-2xl" /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Niveaux des Cuves</h1>
                        <p className="text-gray-600">Vue d'ensemble des niveaux de carburant et des seuils de sécurité.</p>
                    </div>
                </div>

                <NiveauxCuvesFilters
                    filtreCarburant={filtreCarburant} onFiltreCarburantChange={setFiltreCarburant}
                    filtreStatut={filtreStatut} onFiltreStatutChange={setFiltreStatut}
                    typesCarburantUniques={typesCarburantUniques}
                />
                
                {isLoading ? (
                    <div className="flex justify-center p-20"><Spinner size="lg" /></div>
                ) : cuvesFiltrees.length === 0 ? (
                    <Card title="Aucune cuve" icon={FiDroplet}>
                        <div className="p-12 text-center text-gray-500">
                           <p>Aucune cuve ne correspond aux filtres sélectionnés.</p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {cuvesFiltrees.map(cuve => <CuveStatCard key={cuve.id} cuve={cuve} />)}
                        </div>
                        <div className="mt-4 text-center">
                           <Link to="/gerant/commandes/nouveau">
                                <Button size="lg" variant="primary" leftIcon={<FiClipboard />}>
                                    Planifier une Livraison
                                </Button>
                           </Link>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default GerantNiveauxCuvesPage;