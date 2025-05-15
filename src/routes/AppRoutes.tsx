// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

// --- Importations des Pages ---

// Communes / Login / Non Trouvé
import LoginPage from '../page/login/LoginPage';
import ProfilPage from '../page/pompiste/ProfilPage';
import NotificationsPage from '../page/pompiste/NotificationsPage';
import AgendaPage from '../page/pompiste/AgendaPage';
import SignalerAbsencePage from '../page/pompiste/SignalerAbsencePage';

// Pompiste
import DashboardPage from '../page/pompiste/DashboardPage';
import VentesListPage from '../page/pompiste/VentesListPage';
import VentesFormPage from '../page/pompiste/VentesFormPage';
import VentesTermeListPage from '../page/pompiste/VentesTermeListPage';
import VentesTermeFormPage from '../page/pompiste/VentesTermeFormPage';
import CarburantsPompistePage from '../page/pompiste/CarburantsPompistePage';
import SignalerDysfonctionnementPage from '../page/pompiste/SignalerDysfonctionnementPage';
import HistoriqueQuartsPompistePage from '../page/pompiste/HistoriqueQuartsPompistePage'; // <= NOUVEL IMPORT

// Caissier
import DashboardCaissierPage from '../page/caisssier/DashboardCaissierPage';// Corrigé le chemin si besoin (était caisssier)
import VentesCaisseListPage from '../page/caisssier/VentesCaisseListPage';
import VentesCaisseFormPage from '../page/caisssier/VentesCaisseFormPage';
import VentesTermeCaisseListPage from '../page/caisssier/VentesTermeCaisseListPage';
import VentesTermeCaisseFormPage from '../page/caisssier/VentesTermeCaisseFormPage';
import StockBoutiquePage from '../page/caisssier/StockBoutiquePage';
import SignalementEcartPage from '../page/caisssier/SignalementEcartPage';
import SignalerDysfonctionnementCaissePage from '../page/caisssier/SignalerDysfonctionnementCaissePage';
import HistoriqueCloturesCaissePage from '../page/caisssier/HistoriqueCloturesCaissePage';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ----- Authentification et Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* ----- Routes Principales (Post-Login) ----- */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard-caissier" element={<DashboardCaissierPage />} />

      {/* Communes */}
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/signalements/absence" element={<SignalerAbsencePage />} />


      {/* --- Routes Spécifiques Pompiste --- */}
      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={<VentesListPage />} />
      <Route path="/ventes/nouveau" element={<VentesFormPage />} />
      <Route path="/ventes/terme" element={<VentesTermeListPage />} />
      <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />
      <Route path="/carburants" element={<CarburantsPompistePage />} />
      <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />
      {/* NOUVELLE ROUTE POUR L'HISTORIQUE POMPISTE */}
      <Route path="/historique-quarts" element={<HistoriqueQuartsPompistePage />} />


      {/* --- Routes Spécifiques Caissier --- */}
      <Route path="/caisse" element={<Navigate replace to="/dashboard-caissier" />} />
      <Route path="/caisse/ventes" element={<Navigate replace to="/caisse/ventes/directes" />} />
      <Route path="/caisse/ventes/directes" element={<VentesCaisseListPage />} />
      <Route path="/caisse/ventes/nouveau" element={<VentesCaisseFormPage />} />
      <Route path="/caisse/ventes/terme" element={<VentesTermeCaisseListPage />} />
      <Route path="/caisse/ventes/terme/nouveau" element={<VentesTermeCaisseFormPage />} />
      <Route path="/caisse/stock" element={<StockBoutiquePage />} />
      <Route path="/signalements/ecart-caisse" element={<SignalementEcartPage />} />
      <Route path="/caisse/signalements/dysfonctionnement" element={<SignalerDysfonctionnementCaissePage />} />
      <Route path="/caisse/historique/clotures" element={<HistoriqueCloturesCaissePage />} />

      {/* ----- Page Non Trouvée (404) ----- */}
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
                to="/dashboard"
                className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                Retour à l'accueil
              </Link>
            </div>
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;