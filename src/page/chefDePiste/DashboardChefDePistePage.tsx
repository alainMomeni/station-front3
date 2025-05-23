// src/page/chefDePiste/DashboardChefDePistePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import TopFuelVolumeChart from '../../components/charts/TopFuelVolumeChart'; // Réutiliser si pertinent
import {
    FiClock, FiDroplet, FiLayers, FiUsers, FiAlertTriangle, FiDollarSign,
     FiClipboard, FiUserCheck, FiBarChart2, FiList, FiCheckCircle, FiArrowRightCircle
} from 'react-icons/fi';

// Composant StatCard réutilisé (doit être importé ou défini ici s'il n'est pas global)
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    unit?: string;
    iconBgColor?: string;
    change?: string;
    changeColor?: string;
    link?: string;
    linkText?: string;
    subValue?: string; // Pour afficher une info complémentaire
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, unit, iconBgColor = 'bg-purple-100 text-purple-600', change, changeColor = 'text-gray-500', link, linkText, subValue }) => (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between min-h-[130px] hover:shadow-lg transition-shadow duration-150">
        <div className="flex items-start space-x-3">
            <div className={`p-3 rounded-full ${iconBgColor}`}>
                <Icon className="h-6 w-6" /> {/* Taille d'icône un peu plus grande */}
            </div>
            <div>
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
                    {unit && <span className="text-base font-normal ml-1">{unit}</span>}
                </p>
                {subValue && <p className="text-xs text-gray-500 -mt-0.5">{subValue}</p>}
            </div>
        </div>
         {change && ( <p className={`text-xs mt-1 self-start ${changeColor}`}>{change}</p> )}
        {link && linkText && (
            <Link to={link} className="text-xs text-purple-600 hover:text-purple-800 font-semibold mt-2 self-start inline-flex items-center">
                {linkText} <FiArrowRightCircle className="ml-1 h-3 w-3"/>
            </Link>
        )}
    </div>
);


const DashboardChefDePistePage: React.FC = () => {
  // --- Données Mock pour le Chef de Piste ---
  const shiftInfoGlobal = {
    quartActuelLibelle: 'Matin (07:00 - 15:00)',
    chefDePisteNom: 'Amina C.',
    personnelTotalAffecte: 7,
    personnelPresent: 6,
  };

  const stationSalesSummary = {
    totalLitresGlobal: 4580.25,
    totalVentesXAFGlobal: 3350750,
    prevQuartLitres: 4450.00,
  };
  
  const encaissementsGlobauxSimules = {
      especes: 1850500,
      carte: 1000250,
      mobile: 500000,
  };

  const cuvesCritiques = [
    { id: 'cuve2', nom: 'Cuve Diesel A', niveauPourcentage: 25, alerte: true, type: 'Diesel' },
    { id: 'cuve5', nom: 'Réserve SP95 B', niveauPourcentage: 35, alerte: false, type: 'SP95'}, // Proche seuil
  ];

  const signalementsEnCours = {
      total: 3,
      materielUrgent: 1,
      ecartsNonClotures: 1,
  };
  
  const topCarburantsGlobal = [
    { name: "Diesel", volume: 2200.50 },
    { name: "SP95", volume: 1980.75 },
    { name: "SP98", volume: 400.00 },
  ];

  const getSalesChange = () => {
      const change = ((stationSalesSummary.totalLitresGlobal - stationSalesSummary.prevQuartLitres) / stationSalesSummary.prevQuartLitres) * 100;
      if (isNaN(change) || !isFinite(change)) return "N/A";
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% vs. N-1`;
  };

  const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);


  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        Tableau de Bord - Chef de Piste 
      </h1>

      {/* LIGNE 1: INFO QUART & STATS PERSONNEL/SIGNALEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
            <FiClock className="mr-2 h-5 w-5" /> Quart Actuel
          </h2>
          <div className="space-y-2 text-sm text-purple-700">
            <p><strong>Libellé:</strong> {shiftInfoGlobal.quartActuelLibelle}</p>
            <p><strong>Personnel Planifié:</strong> {shiftInfoGlobal.personnelTotalAffecte}</p>
            <p><strong>Personnel Présent:</strong> 
                <span className={`font-semibold ${shiftInfoGlobal.personnelPresent < shiftInfoGlobal.personnelTotalAffecte ? 'text-red-600' : 'text-green-600'}`}>
                    {shiftInfoGlobal.personnelPresent} / {shiftInfoGlobal.personnelTotalAffecte}
                </span>
            </p>
          </div>
           <Link to="/chef-de-piste/presences" className="mt-4 w-full text-center block px-4 py-2 bg-white text-purple-700 text-sm font-medium rounded-md hover:bg-purple-100 border border-purple-300">
                <FiUserCheck className="inline mr-2 h-4 w-4" /> Suivre les Présences
            </Link>
        </div>

        <StatCard
          title="Volume Carburant Global (Quart)"
          value={stationSalesSummary.totalLitresGlobal.toLocaleString('fr-FR', {maximumFractionDigits:0})}
          unit="Litres"
          icon={FiDroplet}
          iconBgColor="bg-blue-100 text-blue-600"
          change={getSalesChange()}
          changeColor={stationSalesSummary.totalLitresGlobal >= stationSalesSummary.prevQuartLitres ? "text-green-600" : "text-red-600"}
          link="/chef-de-piste/historique/index"
          linkText="Voir détails index"
        />
        <StatCard
          title="Total Ventes Carburant (Quart)"
          value={formatXAF(stationSalesSummary.totalVentesXAFGlobal)}
          icon={FiDollarSign}
          iconBgColor="bg-green-100 text-green-700"
          // 'change' pourrait être vs objectif ou N-1
          subValue="Tous carburants confondus"
        />
      </div>

      {/* LIGNE 2: CUVES CRITIQUES & SIGNALEMENTS & ACTIONS RAPIDES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                <FiLayers className="mr-2 h-5 w-5 text-red-500" /> Cuves à Surveiller
            </h2>
            {cuvesCritiques.length > 0 ? (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar-thin">
                    {cuvesCritiques.map(cuve => (
                        <div key={cuve.id} className={`p-2.5 rounded-md border text-sm ${cuve.alerte ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
                            <div className="flex justify-between items-center">
                                <span className={`font-medium ${cuve.alerte ? 'text-red-700' : 'text-yellow-700'}`}>{cuve.nom} ({cuve.type})</span>
                                <span className={`font-semibold ${cuve.alerte ? 'text-red-600' : 'text-yellow-600'}`}>{cuve.niveauPourcentage}%</span>
                            </div>
                            {cuve.alerte && <p className="text-xs text-red-600 mt-0.5">Niveau bas critique !</p>}
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <FiCheckCircle className="h-10 w-10 text-green-400 mb-2" />
                    <p className="text-sm text-gray-600">Niveaux cuves OK.</p>
                </div>
            )}
             <Link to="/chef-de-piste/saisie-index" className="mt-3 block w-full text-center px-3 py-2 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-md hover:bg-indigo-200 border border-indigo-200">
                Saisir / Voir tous les Index
            </Link>
        </div>

        <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-md">
             <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                <FiAlertTriangle className="mr-2 h-5 w-5 text-orange-500" /> Signalements Actifs
            </h2>
            <div className="space-y-3 text-sm">
                <p className="flex justify-between">Signalements Matériel: <span className="font-bold text-orange-600">{signalementsEnCours.materielUrgent}</span></p>
                <p className="flex justify-between">Écarts Constatés: <span className="font-bold text-red-600">{signalementsEnCours.ecartsNonClotures}</span></p>
                <p className="flex justify-between text-gray-800 font-semibold border-t pt-2 mt-2">Total Ouverts: <span className="text-lg">{signalementsEnCours.total}</span></p>
            </div>
             <Link to="/chef-de-piste/signalements/ecarts" className="mt-3 block w-full text-center px-3 py-2 bg-red-100 text-red-700 text-xs font-medium rounded-md hover:bg-red-200 border border-red-200 mb-1.5">
                Gérer les Écarts
            </Link>
             <Link to="/chef-de-piste/signalements/materiel" className="block w-full text-center px-3 py-2 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md hover:bg-yellow-200 border border-yellow-200">
                Suivre Pannes Matériel
            </Link>
        </div>
        
        <div className="lg:col-span-1 bg-gray-50 p-5 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                    <FiList className="mr-2 h-5 w-5" /> Actions Principales
                </h2>
                <div className="space-y-2">
                    <Link to="/chef-de-piste/saisie-index" className="block w-full text-left px-3 py-2.5 bg-purple-500 text-white text-sm font-medium rounded-md hover:bg-purple-600 transition shadow-sm">
                        <FiClipboard className="inline mr-2 h-4 w-4" /> Saisie Index Cuves
                    </Link>
                    <Link to="/chef-de-piste/affectations" className="block w-full text-left px-3 py-2.5 bg-teal-500 text-white text-sm font-medium rounded-md hover:bg-teal-600 transition shadow-sm">
                        <FiUsers className="inline mr-2 h-4 w-4" /> Gérer Affectations
                    </Link>
                    <Link to="/chef-de-piste/saisie-caisse" className="block w-full text-left px-3 py-2.5 bg-cyan-500 text-white text-sm font-medium rounded-md hover:bg-cyan-600 transition shadow-sm">
                        <FiDollarSign className="inline mr-2 h-4 w-4" /> Saisie Fond de Caisse
                    </Link>
                </div>
            </div>
             <Link to="/chef-de-piste/rapports/quarts" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center">
                Voir Tous les Rapports <FiArrowRightCircle className="ml-1.5"/>
            </Link>
        </div>
      </div>

      {/* LIGNE 3: GRAPHIQUE VENTES & (potentiellement) RÉSUMÉ ENCAISSEMENTS SI PAS MIS EN HAUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-5 rounded-lg shadow-md">
           <h2 className="text-lg font-semibold text-gray-700 mb-1 flex items-center">
                <FiBarChart2 className="mr-2 h-5 w-5 text-indigo-600"/> Volumes Vendus par Carburant (Quart Actuel)
            </h2>
            <TopFuelVolumeChart data={topCarburantsGlobal} title="" />
        </div>
        <div className="lg:col-span-2 bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiDollarSign className="mr-2 h-5 w-5 text-green-600" /> Répartition Encaissements Globaux (Estimé Quart)
            </h2>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>Espèces:</span>
                    <span className="font-semibold text-green-700">{formatXAF(encaissementsGlobauxSimules.especes)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>Carte Bancaire:</span>
                    <span className="font-semibold text-blue-700">{formatXAF(encaissementsGlobauxSimules.carte)}</span>
                </div>
                 <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>Mobile Money:</span>
                    <span className="font-semibold text-orange-700">{formatXAF(encaissementsGlobauxSimules.mobile)}</span>
                </div>
                 <div className="flex justify-between items-center p-2 border-t mt-2 pt-2">
                    <span className="font-bold text-gray-800">TOTAL ENCAISSÉ (Estimé):</span>
                    <span className="font-bold text-lg text-gray-800">{formatXAF(encaissementsGlobauxSimules.especes + encaissementsGlobauxSimules.carte + encaissementsGlobauxSimules.mobile)}</span>
                </div>
            </div>
             <p className="text-xs text-gray-500 mt-3 italic">*Estimations basées sur les données de vente. Clôture de caisse pour chiffres exacts.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardChefDePistePage;