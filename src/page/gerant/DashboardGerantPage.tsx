// src/page/gerant/DashboardGerantPage.tsx (FINAL & COHÉRENT)
import React from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiTrendingUp, FiAlertTriangle, FiTool, FiBarChart2, FiUsers, FiDollarSign, FiShield } from 'react-icons/fi';

// Écosystème et UI Kit
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard'; // On réutilise notre composant clé !
import { Button } from '../../components/ui/Button';


const DashboardGerantPage: React.FC = () => {
  return (

      <div className="space-y-6">
        {/* === En-tête de Page Standardisé === */}
        <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                <FiGrid className="text-white text-2xl" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Global</h1>
                <p className="text-gray-600">Bienvenue, M. Diallo. Voici un aperçu de l'activité de votre station.</p>
            </div>
        </div>

        {/* === Section des KPIs === */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard 
                variant="primary" 
                icon={FiTrendingUp} 
                title="CA (Mois en cours)"
                value="15.2M"
                unit="XAF"
                footer={<span className="text-xs text-green-600">+5% vs. Mois N-1</span>}
            />
             <StatCard 
                variant="success"
                icon={FiDollarSign} 
                title="Marge Brute (Mois)"
                value="3.1M"
                unit="XAF"
                footer={<span className="text-xs text-gray-500">Objectif: 3.5M</span>}
            />
            <StatCard 
                variant="warning"
                icon={FiAlertTriangle} 
                title="Alertes Stock Bas"
                value="8"
                unit="articles"
                footer={<span className="text-xs text-yellow-600">3 Cuves / 5 Produits</span>}
            />
            <StatCard 
                variant="error"
                icon={FiTool} 
                title="Maintenance Active"
                value="2"
                unit="tickets ouverts"
                footer={<span className="text-xs text-red-600">Dont 1 critique {'>'} 24h</span>}
            />
        </div>

        {/* === Section des Accès Rapides === */}
        <Card title="Accès Rapides" icon={FiGrid}>
             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Link to="/gerant/rapports/activite">
                    <Button variant="secondary" className="w-full h-full text-left justify-start p-4">
                        <FiBarChart2 className="mr-3 h-5 w-5"/>
                        <div>
                            <div className="font-semibold">Rapports</div>
                            <div className="text-xs font-normal">Générer les analyses</div>
                        </div>
                    </Button>
                 </Link>
                 <Link to="/gerant/personnel/comptes">
                     <Button variant="secondary" className="w-full h-full text-left justify-start p-4">
                        <FiUsers className="mr-3 h-5 w-5"/>
                        <div>
                            <div className="font-semibold">Utilisateurs</div>
                            <div className="text-xs font-normal">Gérer les comptes</div>
                        </div>
                    </Button>
                 </Link>
                 <Link to="/gerant/config/prix">
                     <Button variant="secondary" className="w-full h-full text-left justify-start p-4">
                        <FiDollarSign className="mr-3 h-5 w-5"/>
                         <div>
                            <div className="font-semibold">Prix & Marges</div>
                            <div className="text-xs font-normal">Configurer les tarifs</div>
                        </div>
                    </Button>
                 </Link>
                 <Link to="/gerant/securite/logs">
                     <Button variant="secondary" className="w-full h-full text-left justify-start p-4">
                        <FiShield className="mr-3 h-5 w-5"/>
                        <div>
                            <div className="font-semibold">Logs Système</div>
                            <div className="text-xs font-normal">Auditer les activités</div>
                        </div>
                    </Button>
                 </Link>
             </div>
        </Card>
        
        {/* Une section pour les graphiques pourrait venir ici */}
        <Card title="Évolution du Chiffre d'Affaires" icon={FiTrendingUp}>
            <div className="p-6">
                <p className="text-center text-gray-500 italic">(Zone réservée pour un graphique des ventes sur 30 jours)</p>
                {/* Ici, on intégrerait un composant de graphique, par exemple avec Recharts */}
            </div>
        </Card>

      </div>

  );
};

export default DashboardGerantPage;