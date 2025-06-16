// src/page/chefDePiste/DashboardChefDePistePage.tsx (FINAL & COHÉRENT)
import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FiGrid, 
    FiClock, 
    FiUsers, 
    FiDroplet, 
    FiDollarSign, 
    FiAlertTriangle, 
    FiList, 
    FiBarChart2,
    FiMessageSquare // Add this import
} from 'react-icons/fi';

// Écosystème et UI Kit
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard'; // On réutilise massivement notre StatCard !
import { Button } from '../../components/ui/Button';
import TopFuelVolumeChart from '../../components/charts/TopFuelVolumeChart'; // Supposons que ce composant existe

// --- Données Mock (inchangées) ---
const shiftInfo = {
    quartActuel: 'Matin (07:00 - 15:00)',
    personnelTotal: 7,
    personnelPresent: 6,
};
const salesSummary = {
    totalLitres: 4580,
    totalVentes: 3350750,
    changeVsN1: "+2.9%",
};
const cuvesCritiques = [
    { id: 'cuve2', nom: 'Cuve Diesel A', niveau: 25 },
    { id: 'cuve5', nom: 'Réserve SP95 B', niveau: 35 },
];
const signalementsActifs = 3;
const topCarburantsData = [
    { name: "Diesel", volume: 2200 },
    { name: "SP95", volume: 1980 },
    { name: "SP98", volume: 400 },
];
// ------------------------------------


const DashboardChefDePistePage: React.FC = () => {

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                <FiGrid className="text-white text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord - Chef de Piste</h1>
                <p className="text-gray-600">Vue d'ensemble opérationnelle de votre quart de travail.</p>
            </div>
        </div>

        {/* LIGNE 1: KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FiClock} title="Quart Actuel" value={shiftInfo.quartActuel} variant="primary" />
            <StatCard icon={FiUsers} title="Personnel Présent" value={`${shiftInfo.personnelPresent} / ${shiftInfo.personnelTotal}`} variant={shiftInfo.personnelPresent < shiftInfo.personnelTotal ? 'warning' : 'success'} />
            <StatCard icon={FiDroplet} title="Volume Vendu (Quart)" value={salesSummary.totalLitres.toLocaleString()} unit="Litres" footer={<span className="text-xs text-green-600">{salesSummary.changeVsN1}</span>} />
            <StatCard icon={FiDollarSign} title="Ventes (Quart)" value={salesSummary.totalVentes.toLocaleString()} unit="XAF" variant="success" />
        </div>

        {/* LIGNE 2: Alertes et Actions Rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Colonne 1: Alertes Opérationnelles */}
            <div className="lg:col-span-1 space-y-6">
                <Card title="Alertes Opérationnelles" icon={FiAlertTriangle}>
                    <div className="p-4 space-y-3">
                        <Link to="/gerant/maintenance" className="block p-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200">
                           <p className="font-semibold text-red-800">Pannes Matériel</p>
                           <p className="text-sm text-red-700">{signalementsActifs} signalement(s) ouvert(s)</p>
                        </Link>
                         <Link to="/gerant/stocks/cuves" className="block p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 border border-yellow-200">
                           <p className="font-semibold text-yellow-800">Niveaux Cuves Bas</p>
                           <p className="text-sm text-yellow-700">{cuvesCritiques.length} cuve(s) à surveiller</p>
                        </Link>
                    </div>
                </Card>
            </div>
            
            {/* Colonne 2: Actions Principales */}
             <div className="lg:col-span-2">
                <Card title="Actions et Suivi" icon={FiList}>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link to="/chef-de-piste/saisie-index">
                           <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiDroplet className="h-6 w-6 mb-2"/>
                                <span className="text-center">Saisie des Index</span>
                           </Button>
                        </Link>
                        <Link to="/chef-de-piste/affectations">
                            <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiUsers className="h-6 w-6 mb-2"/>
                                <span className="text-center">Gérer Affectations</span>
                            </Button>
                        </Link>
                        <Link to="/chef-de-piste/saisie-caisse">
                             <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiDollarSign className="h-6 w-6 mb-2"/>
                                <span className="text-center">Fonds de Caisse</span>
                           </Button>
                        </Link>
                         <Link to="/chef-de-piste/presences">
                             <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiUsers className="h-6 w-6 mb-2"/>
                                <span className="text-center">Suivre Présences</span>
                           </Button>
                        </Link>
                        <Link to="/chef-de-piste/rapports/quarts">
                             <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiBarChart2 className="h-6 w-6 mb-2"/>
                                <span className="text-center">Voir Rapports</span>
                           </Button>
                        </Link>
                         <Link to="/gerant/reclamations">
                             <Button variant="secondary" className="w-full h-full p-4 flex-col justify-center items-center">
                                <FiMessageSquare className="h-6 w-6 mb-2"/>
                                <span className="text-center">Réclamations</span>
                           </Button>
                        </Link>
                    </div>
                </Card>
             </div>
        </div>

        {/* LIGNE 3: Graphiques */}
         <div className="grid grid-cols-1">
             <Card title="Volumes Vendus par Carburant (Quart)" icon={FiBarChart2}>
                 <div className="p-6">
                    <TopFuelVolumeChart data={topCarburantsData} />
                 </div>
             </Card>
         </div>

      </div>
    </>
  );
};

export default DashboardChefDePistePage;