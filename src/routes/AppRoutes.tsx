// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

// --- Importations des Pages ---

// Communes / Login / Non Trouvé
import LoginPage from '../page/login/LoginPage'; // J'assume qu'il est dans page/login/
import ProfilPage from '../page/pompiste/ProfilPage'; // Partagé pour l'instant, pourrait être '../page/ProfilPage'
import NotificationsPage from '../page/pompiste/NotificationsPage'; // Partagé, pourrait être '../page/NotificationsPage'
import AgendaPage from '../page/pompiste/AgendaPage'; // Partagé, pourrait être '../page/AgendaPage'
import SignalerAbsencePage from '../page/pompiste/SignalerAbsencePage'; // Partagé, pourrait être '../page/SignalerAbsencePage'

// Pompiste
import DashboardPage from '../page/pompiste/DashboardPage'; // Dashboard spécifique Pompiste
import VentesListPage from '../page/pompiste/VentesListPage';
import VentesFormPage from '../page/pompiste/VentesFormPage';
import VentesTermeListPage from '../page/pompiste/VentesTermeListPage';
import VentesTermeFormPage from '../page/pompiste/VentesTermeFormPage';
import CarburantsPompistePage from '../page/pompiste/CarburantsPompistePage';
import SignalerDysfonctionnementPage from '../page/pompiste/SignalerDysfonctionnementPage';

// Caissier (Chemins corrigés pour 'caissier' au lieu de 'caisssier')
import DashboardCaissierPage from '../page/caisssier/DashboardCaissierPage';
import VentesCaisseListPage from '../page/caisssier/VentesCaisseListPage';
import VentesCaisseFormPage from '../page/caisssier/VentesCaisseFormPage';
import VentesTermeCaisseListPage from '../page/caisssier/VentesTermeCaisseListPage';
import VentesTermeCaisseFormPage from '../page/caisssier/VentesTermeCaisseFormPage';
import StockBoutiquePage from '../page/caisssier/StockBoutiquePage';
import SignalementEcartPage from '../page/caisssier/SignalementEcartPage';
import SignalerDysfonctionnementCaissePage from '../page/caisssier/SignalerDysfonctionnementCaissePage';
import HistoriqueCloturesCaissePage from '../page/caisssier/HistoriqueCloturesCaissePage';

// --- Composant de Configuration des Routes ---
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ----- Authentification et Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} /> {/* Ou vers /dashboard si déjà loggué */}

      {/* ----- Routes Principales (Post-Login) ----- */}
      {/* Les dashboards sont généralement les premières pages après le login */}
      <Route path="/dashboard" element={<DashboardPage />} /> {/* Dashboard Pompiste (ou générique si pas de rôle) */}
      <Route path="/dashboard-caissier" element={<DashboardCaissierPage />} />

      {/* Communes (accessibles potentiellement par plusieurs rôles après login) */}
      <Route path="/profil" element={<ProfilPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      {/* Pour 'SignalerAbsencePage', le lien est '/signalements/absence' des deux côtés,
          donc une seule route suffit si la page est la même. */}
      <Route path="/signalements/absence" element={<SignalerAbsencePage />} />


      {/* --- Routes Spécifiques Pompiste --- */}
      {/* Redirection pour la base des ventes pompiste */}
      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={<VentesListPage />} />
      <Route path="/ventes/nouveau" element={<VentesFormPage />} /> {/* Route pour créer une vente directe carburant */}
      <Route path="/ventes/terme" element={<VentesTermeListPage />} />
      <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />
      <Route path="/carburants" element={<CarburantsPompistePage />} />
      <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />


      {/* --- Routes Spécifiques Caissier --- */}
      {/* Redirection pour la base des ventes caisse */}
      <Route path="/caisse" element={<Navigate replace to="/dashboard-caissier" />} /> {/* ou /caisse/ventes/directes */}
      <Route path="/caisse/ventes" element={<Navigate replace to="/caisse/ventes/directes" />} />
      <Route path="/caisse/ventes/directes" element={<VentesCaisseListPage />} />
      <Route path="/caisse/ventes/nouveau" element={<VentesCaisseFormPage />} /> {/* Route pour créer une vente boutique */}
      <Route path="/caisse/ventes/terme" element={<VentesTermeCaisseListPage />} />
      <Route path="/caisse/ventes/terme/nouveau" element={<VentesTermeCaisseFormPage />} />
      <Route path="/caisse/stock" element={<StockBoutiquePage />} />
      {/* Signalements spécifiquement caisse */}
      <Route path="/signalements/ecart-caisse" element={<SignalementEcartPage />} /> {/* Signalement Écart caisse */}
      <Route path="/caisse/signalements/dysfonctionnement" element={<SignalerDysfonctionnementCaissePage />} /> {/* Dysfonctionnement Caisse/Matériel */}

      {/* NOUVELLE ROUTE: Historique des clôtures de caisse */}
      <Route path="/caisse/historique/clotures" element={<HistoriqueCloturesCaissePage />} />
      {/* Exemple: <Route path="/caisse/historique/ecarts" element={<ListeEcartsCaissierPage />} /> */}


      {/* ----- Page Non Trouvée (404) - Toujours à la fin ----- */}
      <Route
        path="*"
        element={
          // Pour une 404 dans le layout du dashboard
          // Si l'utilisateur n'est pas censé être loggué, vous mettriez un layout différent
          <DashboardLayout> {/* Assurez-vous que DashboardLayout gère bien children */}
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <h1 className="text-6xl font-bold text-purple-600">404</h1>
              <p className="mt-4 text-2xl font-medium text-gray-700">
                Oops! Page non trouvée.
              </p>
              <p className="mt-2 text-gray-500">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link
                to="/dashboard" // ou un chemin plus pertinent si le dashboard par défaut n'est pas universel
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