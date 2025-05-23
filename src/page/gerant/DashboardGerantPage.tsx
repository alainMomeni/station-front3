// src/page/gerant/DashboardGerantPage.tsx
import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout'; // Ajustez le chemin relatif si besoin
import { Link } from 'react-router-dom';

const DashboardGerantPage: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Tableau de Bord Global - Gérant
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">
          Bienvenue, Gérant. Ce tableau de bord vous offre une vue d'ensemble des indicateurs clés
          de performance de la station, des finances, de la gestion des stocks et du personnel.
        </p>
        {/* Contenu spécifique au dashboard du Gérant (indicateurs, graphiques, etc.) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Exemples de cartes KPI pour le gérant */}
            <div className="bg-blue-50 p-4 rounded-lg shadow">
                <h3 className="text-blue-700 font-semibold">Chiffre d'Affaires (Mois en cours)</h3>
                <p className="text-2xl font-bold text-blue-800">XAF 15.2M</p>
                <p className="text-xs text-green-600">+5% vs. Mois N-1</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
                <h3 className="text-green-700 font-semibold">Marge Brute (Mois en cours)</h3>
                <p className="text-2xl font-bold text-green-800">XAF 3.1M</p>
                <p className="text-xs text-green-600">Objectif: XAF 3.5M</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
                <h3 className="text-yellow-700 font-semibold">Alertes Stock Basses</h3>
                <p className="text-2xl font-bold text-yellow-800">3 Cuves / 5 Produits</p>
                <p className="text-xs text-yellow-600">Nécessitent réapprovisionnement</p>
            </div>
             <div className="bg-red-50 p-4 rounded-lg shadow">
                <h3 className="text-red-700 font-semibold">Tickets Maintenance Ouverts</h3>
                <p className="text-2xl font-bold text-red-800">2 Critiques</p>
                <p className="text-xs text-red-600">Dont 1 depuis {'>'} 24h</p>
            </div>
        </div>
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Autres Raccourcis Gérant:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <Link to="/gerant/rapports/activite" className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center">Rapports d'Activité</Link>
                <Link to="/gerant/personnel/comptes" className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center">Gestion Utilisateurs</Link>
                <Link to="/gerant/config/prix" className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center">Configuration Prix</Link>
                <Link to="/gerant/securite/logs" className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center">Logs Système</Link>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardGerantPage;