// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layout Import (pour la page 404 par exemple)
import DashboardLayout from '../layouts/DashboardLayout'; // Assurez-vous que ce chemin est correct

// Page Imports - Assurez-vous que ces chemins sont corrects par rapport à 'src/routes/'
import DashboardPage from '../page/DashboardPage';
import VentesListPage from '../page/VentesListPage';
import VentesFormPage from '../page/VentesFormPage';
import AgendaPage from '../page/AgendaPage';
import VentesTermeListPage from '../page/VentesTermeListPage';
import VentesTermeFormPage from '../page/VentesTermeFormPage';
import SignalerAbsencePage from '../page/SignalerAbsencePage';
import SignalerDysfonctionnementPage from '../page/SignalerDysfonctionnementPage';
import CarburantsPompistePage from '../page/CarburantsPompistePage';
import ProfilPage from '../page/ProfilPage';
import NotificationsPage from '../page/NotificationsPage';
import LoginPage from '../page/login/LoginPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* La route /login affiche le composant LoginPage */}
      <Route path="/login" element={<LoginPage />} />

      {/* La racine "/" redirige maintenant vers /login par défaut */}
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* Les autres routes pour les interfaces du dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={<VentesListPage />} />
      <Route path="/ventes/nouveau" element={<VentesFormPage />} />
      <Route path="/ventes/terme" element={<VentesTermeListPage />} />
      <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />

      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/carburants" element={<CarburantsPompistePage />} />

      <Route path="/signalements" element={<Navigate replace to="/signalements/absence" />} />
      <Route path="/signalements/absence" element={<SignalerAbsencePage />} />
      <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />

      {/* Page 404 - Route de secours */}
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