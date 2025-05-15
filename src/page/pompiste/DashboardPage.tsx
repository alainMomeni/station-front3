// src/page/pompiste/DashboardPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import TopFuelVolumeChart from '../../components/charts/TopFuelVolumeChart';
import {
    FiClock, FiDroplet, FiLayers,  FiTrendingUp,
    FiFileText, FiTool, FiList, FiAlertTriangle,
    FiCheckCircle, FiShoppingCart, FiDollarSign, FiCreditCard, FiSmartphone // Ajout des icônes pour les paiements
} from 'react-icons/fi';

// Composant StatCard (Identique à votre version, aucun changement ici)
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
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, unit, iconBgColor = 'bg-purple-100 text-purple-600', change, changeColor = 'text-gray-500', link, linkText }) => (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start space-x-3">
            <div className={`p-3 rounded-full ${iconBgColor}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{title}</p>
                <p className="text-xl font-semibold text-gray-800">
                    {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
                    {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
                </p>
                {change && (
                    <p className={`text-xs mt-0.5 ${changeColor}`}>{change}</p>
                )}
            </div>
        </div>
        {link && linkText && (
            <Link to={link} className="text-xs text-purple-600 hover:text-purple-800 font-medium mt-2 self-start hover:underline">
                {linkText} →
            </Link>
        )}
    </div>
);


const DashboardPompistePage: React.FC = () => {
  // --- Données Mock pour Pompiste ---
  const shiftInfoPompiste = {
    startTime: '07:00',
    endTime: '15:00',
    pompesAttribuees: ['P01', 'P02'],
    anomaliesSignaleesQuart: 1, // Ajusté
    transactionsTotal: 62, // Total des transactions
  };

  const fuelSalesSummary = {
    totalLitresVendus: 1850.75,
    totalVentesXAF: 1355250, // NOUVEAU: Montant total des ventes de carburant en XAF
    litresSemainePrecedente: 1780.50, // Pour le % de changement en litres
    ventesXAFSemainePrecedente: 1300000, // Pour le % de changement en XAF
  };

  // NOUVEAU: Résumé des paiements pour le pompiste (similaire à celui du caissier)
  const paymentSummaryPompiste = {
      especes: 750250,
      carte: 400000,
      mobile: 205000,
  };

  const getSalesLitresChange = () => {
      const change = ((fuelSalesSummary.totalLitresVendus - fuelSalesSummary.litresSemainePrecedente) / fuelSalesSummary.litresSemainePrecedente) * 100;
      if (isNaN(change) || !isFinite(change)) return undefined;
      const prefix = change >= 0 ? '+' : '';
      return `${prefix}${change.toFixed(1)}% vs. sem. passée`;
  };
  const salesLitresChangeColor = fuelSalesSummary.totalLitresVendus >= fuelSalesSummary.litresSemainePrecedente ? 'text-green-600' : 'text-red-600';

  const getSalesXAFChange = () => {
    const change = ((fuelSalesSummary.totalVentesXAF - fuelSalesSummary.ventesXAFSemainePrecedente) / fuelSalesSummary.ventesXAFSemainePrecedente) * 100;
    if (isNaN(change) || !isFinite(change)) return undefined;
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}% vs. sem. passée`;
  };
  const salesXAFChangeColor = fuelSalesSummary.totalVentesXAF >= fuelSalesSummary.ventesXAFSemainePrecedente ? 'text-green-600' : 'text-red-600';


  const cuvesApercu = [
    { id: 'cuve1', nom: 'Cuve SP95-A', niveauPourcentage: 62, typeCarburant: 'SP95', alerte: false },
    { id: 'cuve2', nom: 'Cuve Diesel-1', niveauPourcentage: 25, typeCarburant: 'Diesel', alerte: true },
    { id: 'cuve3', nom: 'Cuve SP98', niveauPourcentage: 80, typeCarburant: 'SP98', alerte: false },
  ];

  const topFuelVolumes = [
    { name: "Diesel", volume: 980.25 },
    { name: "SP95", volume: 750.50 },
    { name: "SP98", volume: 120.00 },
  ];

  const formatLitres = (litres: number) => litres.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        Tableau de Bord - Pompiste
      </h1>

      {/* LIGNE 1: INFO QUART & RESUME ENCAISSEMENTS (Inspiré du Caissier) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 1. Informations sur le Quart Actuel */}
        <div className="lg:col-span-1 bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200 flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <FiClock className="mr-2 h-5 w-5" /> Informations du Quart
                </h2>
                <div className="space-y-2 text-sm text-purple-700">
                    <p><strong>Début :</strong> {shiftInfoPompiste.startTime}</p>
                    <p><strong>Fin Prévue :</strong> {shiftInfoPompiste.endTime}</p>
                    <p><strong>Pompes assignées :</strong> {shiftInfoPompiste.pompesAttribuees.join(', ')}</p>
                    <p><strong>Total Transactions :</strong> {shiftInfoPompiste.transactionsTotal}</p>
                </div>
            </div>
            <Link // Changé le bouton en Link pour mener vers la page des cuves
                to="/carburants"
                className="mt-4 w-full text-center block px-4 py-2 bg-white text-purple-700 text-sm font-medium rounded-md hover:bg-purple-100 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 transition"
                aria-label="Saisir les index et gérer les cuves"
            >
                 <FiCheckCircle className="inline mr-2 h-4 w-4"/> Terminer & Saisir Index Cuves
            </Link>
        </div>

        {/* 2. Résumé des Encaissements Pompiste */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiDollarSign className="mr-2 h-5 w-5 text-green-600" /> Résumé des Encaissements (Carburant)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md border border-green-200">
                     <FiDollarSign className="h-6 w-6 text-green-600 flex-shrink-0"/>
                     <div>
                         <p className="text-xs text-green-700 font-medium">Espèces</p>
                         <p className="text-lg font-semibold text-green-900">{formatXAF(paymentSummaryPompiste.especes)}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                     <FiCreditCard className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                    <div>
                         <p className="text-xs text-blue-700 font-medium">Carte Bancaire</p>
                        <p className="text-lg font-semibold text-blue-900">{formatXAF(paymentSummaryPompiste.carte)}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-md border border-orange-200">
                    <FiSmartphone className="h-6 w-6 text-orange-600 flex-shrink-0"/>
                     <div>
                         <p className="text-xs text-orange-700 font-medium">Mobile Money</p>
                        <p className="text-lg font-semibold text-orange-900">{formatXAF(paymentSummaryPompiste.mobile)}</p>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* LIGNE 2: STATS CLÉS CARBURANT & ACTIONS RAPIDES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* 3. StatCard: Total Ventes Carburant (XAF) */}
        <StatCard
            title="Total Ventes Carburant (XAF)"
            value={formatXAF(fuelSalesSummary.totalVentesXAF)}
            icon={FiTrendingUp} // Icone pour indiquer une valeur monétaire / performance
            iconBgColor="bg-yellow-100 text-yellow-700" // Couleur distincte
            unit="XAF"
            change={getSalesXAFChange()}
            changeColor={salesXAFChangeColor}
        />

        {/* 4. StatCard: Total Carburant Vendu (Litres) */}
        <StatCard
            title="Total Carburant Vendu (Litres)"
            value={formatLitres(fuelSalesSummary.totalLitresVendus)}
            unit="Litres"
            icon={FiDroplet}
            iconBgColor="bg-blue-100 text-blue-600"
            change={getSalesLitresChange()}
            changeColor={salesLitresChangeColor}
        />

        {/* 5. Actions Rapides */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-md flex flex-col justify-center"> {/* Ajout de flex pour aligner */}
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <FiList className="mr-2 h-5 w-5" /> Actions Rapides
            </h2>
            <div className="space-y-2.5">
                <Link to="/ventes/nouveau" className="block w-full text-left px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition shadow-sm">
                    <FiShoppingCart className="inline mr-2 h-4 w-4" /> Enregistrer Vente Carburant
                </Link>
                <Link to="/ventes/terme/nouveau" className="block w-full text-left px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition shadow-sm">
                    <FiFileText className="inline mr-2 h-4 w-4" /> Nouvelle Vente à Terme
                </Link>
                <Link to="/signalements/dysfonctionnement" className="block w-full text-left px-4 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition shadow-sm">
                    <FiTool className="inline mr-2 h-4 w-4" /> Signaler Dysfonctionnement
                </Link>
            </div>
        </div>
      </div>


      {/* LIGNE 3: APERCU CUVES & GRAPHIQUE VOLUME (Comme avant) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 6. Aperçu Niveaux Cuves */}
        <div className="md:col-span-1 bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <FiLayers className="mr-2 h-5 w-5 text-indigo-600" /> Aperçu Niveaux Cuves
            </h2>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar-thin">
                {cuvesApercu.map(cuve => (
                    <div key={cuve.id} className={`p-2.5 rounded-md border ${cuve.alerte ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center text-sm">
                            <span className={`font-medium ${cuve.alerte ? 'text-red-700' : 'text-gray-700'}`}>{cuve.nom} ({cuve.typeCarburant})</span>
                            <span className={`font-semibold ${cuve.alerte ? 'text-red-600' : cuve.niveauPourcentage < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {cuve.niveauPourcentage}%
                                {cuve.alerte && <FiAlertTriangle className="inline ml-1.5 h-4 w-4 text-red-500" />}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                                className={`h-1.5 rounded-full ${cuve.alerte ? 'bg-red-500' : cuve.niveauPourcentage < 50 ? 'bg-yellow-400' : 'bg-green-500'}`}
                                style={{ width: `${Math.max(0, Math.min(100, cuve.niveauPourcentage))}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/carburants" className="mt-3 block w-full text-center px-3 py-3 bg-purple-100 text-purple-700 text-xs font-medium rounded-md hover:bg-purple-200 border border-purple-200">
                Gérer les Cuves & Index
            </Link>
        </div>

        {/* 7. Graphique des Ventes de Carburant par Type */}
        <div className="md:col-span-1 bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <FiDroplet className="mr-2 h-4 w-4 md:h-5 md:w-5 text-purple-600"/> {/* Changé l'icône pour FiDroplet pour être plus thématique carburant */}
                Volume Carburant Vendu (Quart)
            </h2>
           <TopFuelVolumeChart data={topFuelVolumes} title="" /> {/* Titre retiré du graphique car déjà dans le h2 de la carte */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPompistePage;