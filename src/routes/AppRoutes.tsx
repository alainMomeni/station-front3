// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout'; // Ajustez le chemin

// --- Importations des Pages ---

// Communes / Login / 404 gérée dans le JSX
import LoginPage from '../page/login/LoginPage';
import ProfilPage from '../page/pompiste/ProfilPage'; // Ou un profil commun, ex: ../page/ProfilPage
import NotificationsPage from '../page/pompiste/NotificationsPage'; // Ou commun
import AgendaPage from '../page/pompiste/AgendaPage'; // Ou commun
import SignalerAbsencePage from '../page/pompiste/SignalerAbsencePage'; // Ou commun

// Pompiste
import DashboardPage from '../page/pompiste/DashboardPage';
import VentesListPage from '../page/pompiste/VentesListPage';
import VentesFormPage from '../page/pompiste/VentesFormPage';
import VentesTermeListPage from '../page/pompiste/VentesTermeListPage';
import VentesTermeFormPage from '../page/pompiste/VentesTermeFormPage';
import CarburantsPompistePage from '../page/pompiste/CarburantsPompistePage';
import SignalerDysfonctionnementPage from '../page/pompiste/SignalerDysfonctionnementPage';

// Caissier
import DashboardCaissierPage from '../page/caisssier/DashboardCaissierPage'; // Attention, 3 's' dans 'caisssier' - Corriger si typo
import VentesCaisseListPage from '../page/caisssier/VentesCaisseListPage'; // Idem
import VentesCaisseFormPage from '../page/caisssier/VentesCaisseFormPage';   // Idem
import VentesTermeCaisseListPage from '../page/caisssier/VentesTermeCaisseListPage'; // Idem
import VentesTermeCaisseFormPage from '../page/caisssier/VentesTermeCaisseFormPage'; // Idem
import StockBoutiquePage from '../page/caisssier/StockBoutiquePage';          // Idem
import SignalementEcartPage from '../page/caisssier/SignalementEcartPage';        // Idem
import SignalerDysfonctionnementCaissePage from '../page/caisssier/SignalerDysfonctionnementCaissePage'; // NOUVEAU, Idem pour typo


// --- Composant de Configuration des Routes ---
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ----- Authentification et Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* ----- Routes Principales (Post-Login) ----- */}

      {/* Dashboards */}
      <Route path="/dashboard" element={<DashboardPage />} /> {/* Défaut / Pompiste */}
      <Route path="/dashboard-caissier" element={<DashboardCaissierPage />} />

      {/* Communes (Si vos pages Profil, Notifications, Agenda, Absence sont bien dans /pompiste/ et non /page/ ) */}
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/signalements/absence" element={<SignalerAbsencePage />} />


      {/* --- Routes Spécifiques Pompiste --- */}
      {/* Ventes Carburant */}
      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={<VentesListPage />} />
      <Route path="/ventes/nouveau" element={<VentesFormPage />} />
      <Route path="/ventes/terme" element={<VentesTermeListPage />} />
      <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />
      {/* Gestion Cuves */}
      <Route path="/carburants" element={<CarburantsPompistePage />} />
      {/* Signalement Dysfonctionnement (Piste/Équipement) */}
      <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />


      {/* --- Routes Spécifiques Caissier --- */}
      {/* Ventes Boutique */}
      <Route path="/caisse/ventes" element={<Navigate replace to="/caisse/ventes/directes" />} />
      <Route path="/caisse/ventes/directes" element={<VentesCaisseListPage />} />
      <Route path="/caisse/ventes/nouveau" element={<VentesCaisseFormPage />} />
      <Route path="/caisse/ventes/terme" element={<VentesTermeCaisseListPage />} />
      <Route path="/caisse/ventes/terme/nouveau" element={<VentesTermeCaisseFormPage />} />
      {/* Stock Boutique */}
      <Route path="/caisse/stock" element={<StockBoutiquePage />} />
      {/* Signalements Caisse */}
      <Route path="/signalements/ecart-caisse" element={<SignalementEcartPage />} />
      {/* NOUVELLE ROUTE : Dysfonctionnement Caisse */}
      <Route path="/caisse/signalements/dysfonctionnement" element={<SignalerDysfonctionnementCaissePage />} />


      {/* ----- Page Non Trouvée (404) - Toujours à la fin ----- */}
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