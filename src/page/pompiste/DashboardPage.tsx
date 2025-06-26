// src/page/pompiste/DashboardPage.tsx (FINAL & COHÉRENT)
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiGrid, FiClock, FiDroplet, FiDollarSign, FiLayers, FiAlertTriangle, FiList, 
    FiBarChart2, FiShoppingCart, FiFileText, FiTool 
} from 'react-icons/fi';

// Écosystème et UI Kit
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import TopFuelVolumeChart from '../../components/charts/TopFuelVolumeChart'; // Composant supposé exister
import { dummyCuvesData } from '../../_mockData/equipements'; // Assure-toi que ce mock existe
import type { CuveData } from '../../types/equipements';

// --- Données Mock (inchangées) ---
const shiftInfo = { startTime: '07:00', endTime: '15:00', pompes: 'P01, P02', transactions: 62 };
const salesSummary = { totalLitres: 1850.75, totalVentes: 1355250, changeVsN1: "+2.9%" };
const cuvesCritiques = [{ nom: 'Cuve Diesel A', niveau: 25 }];
const topCarburantsData = [{ name: "Diesel", volume: 980 }, { name: "SP95", volume: 750 }, { name: "SP98", volume: 120 }];
// ------------------------------------


const DashboardPompistePage: React.FC = () => {
  const [, setCuves] = useState<CuveData[]>([]);
  const [, setIsLoading] = useState(true);
  const [] = useState<CuveData | null>(null);

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

  return (

      <div className="space-y-6">
        <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                <FiGrid className="text-white text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Mon Tableau de Bord</h1>
                <p className="text-gray-600">Bienvenue, voici un aperçu de votre quart de travail.</p>
            </div>
        </div>

        {/* LIGNE 1: KPIs principaux de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FiClock} title="Mon Quart Actuel" value={`${shiftInfo.startTime} - ${shiftInfo.endTime}`} footer={<span className="text-xs text-gray-500">Pompes: {shiftInfo.pompes}</span>} />
            <StatCard icon={FiShoppingCart} title="Transactions Réalisées" value={shiftInfo.transactions.toLocaleString()} unit="ventes"/>
            <StatCard icon={FiDroplet} title="Mon Volume Vendu" value={salesSummary.totalLitres.toLocaleString('fr-FR', {maximumFractionDigits:0})} unit="Litres" footer={<span className="text-xs text-green-600">{salesSummary.changeVsN1}</span>}/>
            <StatCard icon={FiDollarSign} title="Mes Ventes Totales" value={salesSummary.totalVentes.toLocaleString()} unit="XAF" variant="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Colonne Principale: Actions et Graphique */}
            <div className="lg:col-span-2 space-y-6">
                 <Card title="Mes Actions Principales" icon={FiList}>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link to="/ventes/nouveau" className="col-span-1">
                            <Button variant="primary" className="w-full h-full text-left p-4"><FiShoppingCart className="h-5 w-5 mr-3"/>Enregistrer une Vente</Button>
                        </Link>
                         <Link to="/ventes/terme/nouveau" className="col-span-1">
                             <Button variant="secondary" className="w-full h-full text-left p-4"><FiFileText className="h-5 w-5 mr-3"/>Vente à Terme</Button>
                        </Link>
                         <Link to="/signalements/dysfonctionnement" className="col-span-1">
                             <Button variant="warning" className="w-full h-full text-left p-4"><FiTool className="h-5 w-5 mr-3"/>Signaler Panne</Button>
                        </Link>
                    </div>
                </Card>

                 <Card title="Mes Ventes par Carburant" icon={FiBarChart2}>
                    <div className="p-6">
                        <TopFuelVolumeChart data={topCarburantsData} />
                    </div>
                </Card>
            </div>
            
            {/* Colonne Latérale: Infos Système */}
            <div className="lg:col-span-1 space-y-6">
                 <Card title="État du Système" icon={FiLayers}>
                    <div className="p-4 divide-y divide-gray-100">
                        <div className="py-3">
                            <h4 className="text-sm font-semibold text-gray-700">Niveaux des Cuves</h4>
                            {cuvesCritiques.length > 0 ? (
                                <div className="mt-2 space-y-2">
                                {cuvesCritiques.map(cuve => (
                                     <div key={cuve.nom} className="flex items-center p-2 bg-yellow-50 rounded-md">
                                         <FiAlertTriangle className="h-4 w-4 text-yellow-600 mr-2"/>
                                         <p className="text-xs text-yellow-800"><span className="font-medium">{cuve.nom}</span> à {cuve.niveau}%</p>
                                    </div>
                                ))}
                                </div>
                            ): <p className="text-xs text-green-600 mt-1">Tous les niveaux sont OK.</p>}
                        </div>
                         <div className="py-3">
                            <h4 className="text-sm font-semibold text-gray-700">Tâches ou Messages</h4>
                             <p className="text-xs text-gray-500 mt-1 italic">(Aucun nouveau message du chef de piste)</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
      </div>
  );
};

export default DashboardPompistePage;