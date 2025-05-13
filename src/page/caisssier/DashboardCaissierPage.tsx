// src/page/caissier/DashboardCaissierPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
// Ajustez le chemin relatif vers DashboardLayout
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    FiClock, FiDollarSign, FiShoppingCart, FiCreditCard, FiSmartphone, FiEdit, // Remplacement de FiDroplet par FiShoppingCart
    FiFileText, FiAlertCircle, FiCheckCircle,
    FiArchive
} from 'react-icons/fi';
import TopSellingChart from '../../components/charts/TopSellingChart';

// Composant réutilisable pour les cartes de statistiques
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBgColor?: string;
    change?: string;
    changeColor?: string;
    unit?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconBgColor = 'bg-purple-100', change, changeColor = 'text-gray-500', unit }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-start space-x-4">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
            <Icon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
                {unit && <span className="text-base font-medium ml-1">{unit}</span>}
            </p>
            {change && (
                 <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
            )}
        </div>
    </div>
);

// Page principale du Dashboard Caissier
const DashboardCaissierPage: React.FC = () => {
  // --- Données Mock adaptées pour le caissier (ventes boutique) ---
  const shiftInfo = {
    startTime: '08:00',
    endTime: '16:00', // Exemple
    // Ces chiffres ne concernent que les ventes traitées par la caisse (boutique)
    totalSalesXAF: 85300,
    transactionsCount: 42, // Nombre de transactions caisse
  };

  // Le résumé des paiements reste pertinent pour le caissier
  const paymentSummary = {
      especes: 35000,
      carte: 30300,
      mobile: 20000,
  };

  // Mock data for low stock items
  const lowOrOutOfStockItems = [
    { id: 1, name: "Huile moteur", currentStock: 0, minStock: 10, unit: "L" },
    { id: 2, name: "Filtres à air", currentStock: 2, minStock: 5, unit: "pcs" },
    { id: 3, name: "Liquide de frein", currentStock: 1, minStock: 5, unit: "L" }
  ];

  // Mock data for top selling products
  const topSellingProducts = [
    { name: "Huile Moteur XYZ (1L)", quantity: 15 },
    { name: "Boisson Gazeuse", quantity: 12 },
    { name: "Filtre à air ABC", quantity: 8 },
    { name: "Lave-glace (5L)", quantity: 6 },
    { name: "Essuie-glace TUV", quantity: 4 }
  ];

  const formatXAF = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
        Tableau de Bord - Caisse Boutique
      </h1>

      {/* Même structure de grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Carte: Informations sur le quart actuel */}
        {/* (Reste similaire, mais les chiffres reflètent l'activité caisse) */}
        <div className="md:col-span-2 lg:col-span-1 bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <FiClock className="mr-2 h-5 w-5" /> Informations du Quart
            </h2>
            <div className="space-y-3 text-sm text-purple-700">
                <p><strong>Début :</strong> {shiftInfo.startTime}</p>
                <p><strong>Fin Prévue :</strong> {shiftInfo.endTime}</p>
                {/* Le nombre de transactions concerne maintenant la caisse */}
                <p><strong>Transactions Caisse :</strong> {shiftInfo.transactionsCount} articles/services vendus</p>
                 <button className="mt-3 w-full text-left flex items-center px-4 py-2 bg-white text-purple-700 text-sm font-medium rounded-md hover:bg-purple-100 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500">
                     <FiCheckCircle className="mr-2 h-4 w-4"/> Terminer le quart & Clôturer la caisse
                 </button>
            </div>
        </div>

         {/* Carte: Résumé des Paiements (reste identique en structure) */}
         <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiDollarSign className="mr-2 h-5 w-5 text-green-600" /> Résumé des Encaissements (Quart Actuel)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md border border-green-200">
                     <FiDollarSign className="h-6 w-6 text-green-600 flex-shrink-0"/>
                     <div>
                         <p className="text-xs text-green-700 font-medium">Espèces</p>
                         <p className="text-lg font-semibold text-green-900">{formatXAF(paymentSummary.especes)}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                     <FiCreditCard className="h-6 w-6 text-blue-600 flex-shrink-0"/>
                    <div>
                         <p className="text-xs text-blue-700 font-medium">Carte Bancaire</p>
                        <p className="text-lg font-semibold text-blue-900">{formatXAF(paymentSummary.carte)}</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-md border border-orange-200">
                    <FiSmartphone className="h-6 w-6 text-orange-600 flex-shrink-0"/>
                     <div>
                         <p className="text-xs text-orange-700 font-medium">Mobile Money</p>
                        <p className="text-lg font-semibold text-orange-900">{formatXAF(paymentSummary.mobile)}</p>
                    </div>
                 </div>
            </div>
         </div>

         {/* Carte Stat: Ventes Totales XAF (concerne maintenant la boutique) */}
         <StatCard
             title="Total Ventes Boutique (XAF)" // Titre clarifié
             value={shiftInfo.totalSalesXAF}
             icon={FiShoppingCart} // Icône changée pour refléter la boutique/panier
             unit="XAF"
             iconBgColor='bg-green-100'
         />

         {/* --- La carte Volume Carburant a été SUPPRIMÉE --- */}

        {/* Carte: Actions Rapides (reste identique car vente directe = vente boutique) */}
        {/* On suppose que 'Vente Directe' est le mécanisme pour enregistrer une vente boutique */}
        {/* On suppose que 'Vente à terme' PEUT s'appliquer à la boutique */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Actions Rapides Caisse</h2>
          <div className="space-y-3">
            <Link to="/caisse/ventes/nouveau" className="block w-full text-left px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition duration-150 ease-in-out">
              <FiEdit className="inline mr-2 h-4 w-4" /> Enregistrer Vente Boutique
            </Link>
            {/* Si les ventes à terme sont AUSSI pour la boutique */}
            <Link to="/caisse/ventes/terme/nouveau" className="block w-full text-left px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-150 ease-in-out">
                 <FiFileText className="inline mr-2 h-4 w-4"/> Nouvelle Vente à Terme (Boutique)
            </Link>
            {/* --- Fin Si --- */}
             <Link to="/signalements/ecart-caisse" className="block w-full text-left px-4 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500 transition duration-150 ease-in-out">
               <FiAlertCircle className="inline mr-2 h-4 w-4" /> Signaler un Écart de Caisse
             </Link>
          </div>
        </div>

        {/* 6. CARTE: ALERTES STOCK BAS / RUPTURE */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md"> {/* lg:col-span-1 pour occuper le dernier quart */}
            <h2 className="text-base md:text-lg font-semibold text-red-700 mb-3 flex items-center">
                <FiArchive className="mr-2 h-4 w-4 md:h-5 md:w-5"/> Alertes Stock
            </h2>
            {lowOrOutOfStockItems.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar"> {/* max-h-48 pour plus de compacité */}
                    {lowOrOutOfStockItems.map(item => (
                        <div key={item.id} className={`p-2 rounded-md border ${item.currentStock <= 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                            <div className="flex justify-between items-center">
                                <p className="text-xs md:text-sm font-medium">{item.name}</p>
                                <span className={`text-xs font-semibold`}>
                                    {item.currentStock <= 0 ? 'RUPTURE' : 'FAIBLE'}
                                </span>
                            </div>
                            <p className="text-xxs md:text-xs text-gray-600">
                                Actuel: {item.currentStock} {item.unit} (Min: {item.minStock})
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                    <FiCheckCircle className="h-8 w-8 text-green-400 mb-1" />
                    <p className="text-xs md:text-sm text-gray-600">Aucune alerte de stock.</p>
                </div>
            )}
             <Link
                to="/caisse/stock"
                className="mt-3 block w-full text-center px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-md hover:bg-purple-200 border border-purple-200"
            >
                Voir Tout le Stock
            </Link>
        </div>

        {/* Carte: Top des Ventes Boutique */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <FiShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5"/> 
                Top des Ventes Boutique
            </h2>
            <TopSellingChart 
                data={topSellingProducts}
                title="Produits les plus vendus (Quart actuel)"
            />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardCaissierPage;