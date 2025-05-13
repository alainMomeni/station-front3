// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout'; // Vérifiez/Adaptez le chemin

// --- Importations des Pages ---

// Communes / Login
import LoginPage from '../page/login/LoginPage';
import DashboardPage from '../page/pompiste/DashboardPage';
import ProfilPage from '../page/pompiste/ProfilPage';
import NotificationsPage from '../page/pompiste/NotificationsPage';
import AgendaPage from '../page/pompiste/AgendaPage';
import SignalerAbsencePage from '../page/pompiste/SignalerAbsencePage';
// La 404 est gérée directement dans le JSX

// Pompiste (vérifiez les chemins réels si dans un dossier pompiste/)
import VentesListPage from '../page/pompiste/VentesListPage';
import VentesFormPage from '../page/pompiste/VentesFormPage';
import VentesTermeListPage from '../page/pompiste/VentesTermeListPage';
import VentesTermeFormPage from '../page/pompiste/VentesTermeFormPage';
import CarburantsPompistePage from '../page/pompiste/CarburantsPompistePage';
import SignalerDysfonctionnementPage from '../page/pompiste/SignalerDysfonctionnementPage';

// Caissier (vérifiez les chemins réels dans page/caissier/)
import DashboardCaissierPage from '../page/caisssier/DashboardCaissierPage';
import VentesCaisseListPage from '../page/caisssier/VentesCaisseListPage';
import VentesCaisseFormPage from '../page/caisssier/VentesCaisseFormPage';
import VentesTermeCaisseListPage from '../page/caisssier/VentesTermeCaisseListPage';
import VentesTermeCaisseFormPage from '../page/caisssier/VentesTermeCaisseFormPage';
import StockBoutiquePage from '../page/caisssier/StockBoutiquePage';
import SignalementEcartPage from '../page/caisssier/SignalementEcartPage';


// --- Configuration des Routes ---

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ----- Authentification et Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} /> {/* Redirige vers login par défaut */}

      {/* ----- Routes Principales (Post-Login) ----- */}

      {/* Dashboards Spécifiques */}
      <Route path="/dashboard" element={<DashboardPage />} />           {/* Défaut / Pompiste */}
      <Route path="/dashboard-caissier" element={<DashboardCaissierPage />} /> {/* Caissier */}

      {/* Routes Accessibles aux Deux Rôles (potentiellement) */}
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/signalements/absence" element={<SignalerAbsencePage />} />

      {/* --- Routes Spécifiques Pompiste --- */}
      {/* Section Ventes Carburant */}
      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={<VentesListPage />} />
      <Route path="/ventes/nouveau" element={<VentesFormPage />} />
      <Route path="/ventes/terme" element={<VentesTermeListPage />} />
      <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />
      {/* Ajouter '/ventes/modifier/:id', '/ventes/details/:id' si nécessaire */}
      {/* Gestion Cuves */}
      <Route path="/carburants" element={<CarburantsPompistePage />} />
      {/* Signalement Matériel */}
      <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />

      {/* --- Routes Spécifiques Caissier --- */}
      {/* Section Ventes Boutique */}
      <Route path="/caisse/ventes" element={<Navigate replace to="/caisse/ventes/directes" />} />
      <Route path="/caisse/ventes/directes" element={<VentesCaisseListPage />} />
      <Route path="/caisse/ventes/nouveau" element={<VentesCaisseFormPage />} />
      <Route path="/caisse/ventes/terme" element={<VentesTermeCaisseListPage />} />
      <Route path="/caisse/ventes/terme/nouveau" element={<VentesTermeCaisseFormPage />} />
       {/* Ajouter '/caisse/ventes/modifier/:id', '/caisse/ventes/details/:id' si nécessaire */}
      {/* Stock Boutique */}
      <Route path="/caisse/stock" element={<StockBoutiquePage />} />
      {/* Signalement Écart Caisse */}
      <Route path="/signalements/ecart-caisse" element={<SignalementEcartPage />} />


      {/* ----- Page Non Trouvée (404) - Doit être la dernière ----- */}
      <Route
        path="*"
        element={
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <h1 className="text-6xl font-bold text-purple-600">404</h1>
              <p className="mt-4 text-2xl font-medium text-gray-700">
                Oops! Page non trouvée.
              </p>
              <p className="mt-2 text-gray-500">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link
                to="/dashboard" // Retour générique
                className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                Retour au Dashboard
              </Link>
            </div>
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;