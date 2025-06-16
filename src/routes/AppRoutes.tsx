// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

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
import HistoriqueQuartsPompistePage from '../page/pompiste/HistoriqueQuartsPompistePage';

// Caissier (Vérifiez que le chemin du dossier est 'caissier' et non 'caisssier')
import DashboardCaissierPage from '../page/caisssier/DashboardCaissierPage';
import VentesCaisseListPage from '../page/caisssier/VentesCaisseListPage';
import VentesCaisseFormPage from '../page/caisssier/VentesCaisseFormPage';
import VentesTermeCaisseListPage from '../page/caisssier/VentesTermeCaisseListPage';
import VentesTermeCaisseFormPage from '../page/caisssier/VentesTermeCaisseFormPage';
import StockBoutiquePage from '../page/caisssier/StockBoutiquePage';
import SignalementEcartPage from '../page/caisssier/SignalementEcartPage';
import SignalerDysfonctionnementCaissePage from '../page/caisssier/SignalerDysfonctionnementCaissePage';
import HistoriqueCloturesCaissePage from '../page/caisssier/HistoriqueCloturesCaissePage';

// Chef de Piste
import DashboardChefDePistePage from '../page/chefDePiste/DashboardChefDePistePage';
import SaisieIndexChefDePistePage from '../page/chefDePiste/SaisieIndexChefDePistePage';
import AffectationPersonnelPage from '../page/chefDePiste/AffectationPersonnelPage';
import SuiviPresencesPage from '../page/chefDePiste/SuiviPresencesPage';
import SaisieCaissePhysiquePage from '../page/chefDePiste/SaisieCaissePhysiquePage';
import SignalementEcartsChefDePistePage from '../page/chefDePiste/SignalementEcartsChefDePistePage';
import SignalementMaterielChefDePistePage from '../page/chefDePiste/SignalementMaterielChefDePistePage';


// --- Imports des pages Gérant ---
import DashboardGerantPage from '../page/gerant/DashboardGerantPage';
import GerantNiveauxCuvesPage from '../page/gerant/GerantNiveauxCuvesPage';
import GerantBonsCommandePage from '../page/gerant/GerantBonsCommandePage';
import GerantSuiviLivraisonsPage from '../page/gerant/GerantSuiviLivraisonsPage';
import GerantStocksProduitsPage from '../page/gerant/GerantStocksProduitsPage';
import GerantCataloguePage from '../page/gerant/GerantCataloguePage';
import GerantVentesPersonnelPage from '../page/gerant/GerantVentesPersonnelPage';
import GerantRapportsActivitePage from '../page/gerant/GerantRapportsActivitePage';
import GerantVentesCreditPage from '../page/gerant/GerantVentesCreditPage';
import GerantMargesPage from '../page/gerant/GerantMargesPage';
import GerantDepensesPage from '../page/gerant/GerantDepensesPage';
import GerantConfigPage from '../page/gerant/GerantConfigPage';
import GerantFacturationPage from '../page/gerant/GerantFacturationPage';
import GerantPerfPersonnelPage from '../page/gerant/GerantPerfPersonnelPage';
import GerantComptesUtilisateursPage from '../page/gerant/GerantComptesUtilisateursPage';
import GerantGestionClientsPage from '../page/gerant/GerantGestionClientsPage';
import GerantRelevesEntreprisesPage from '../page/gerant/GerantRelevesEntreprisesPage';
import GerantReclamationsPage from '../page/gerant/GerantReclamationsPage';
import GerantPlansMaintenancePage from '../page/gerant/GerantMaintenancePage';
import GerantMaintenancePage from '../page/gerant/GerantMaintenancePage';
import GerantAffectationPage from '../page/gerant/GerantAffectationPage';
import GerantGestionPompesPage from '../page/gerant/GerantGestionPompesPage';
import GerantGestionCuvesPage from '../page/gerant/GerantGestionCuvesPage';
import GerantLogsActivitePage from '../page/gerant/GerantLogsActivitePage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import type { RoleType } from '../contexts/AuthContext';

// ---- FIN DES IMPORTS -----

const AppRoutes: React.FC = () => {
  // Fonction d'aide pour envelopper une page dans la protection et le layout
  const protect = (Page: React.ElementType, roles: RoleType[]) => (
    <ProtectedRoute roles={roles}>
      <DashboardLayout>
        <Page />
      </DashboardLayout>
    </ProtectedRoute>
  );

  const ALL_ROLES: RoleType[] = ['pompiste', 'caissier', 'chef_de_piste', 'gerant'];

  return (
    <Routes>
      {/* ----- Route Publique (Login) et Redirection Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* ========== ROUTES PROTÉGÉES ========== */}

      {/* --- Pages Communes à tous les rôles authentifiés --- */}
      <Route path="/profil" element={protect(ProfilPage, ALL_ROLES)} />
      <Route path="/notifications" element={protect(NotificationsPage, ALL_ROLES)} />
      <Route path="/agenda" element={protect(AgendaPage, ALL_ROLES)} />
      <Route path="/signalements/absence" element={protect(SignalerAbsencePage, ALL_ROLES)} />

      {/* --- Routes Pompiste --- */}
      <Route path="/dashboard" element={protect(DashboardPage, ['pompiste'])} />
      <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
      <Route path="/ventes/directes" element={protect(VentesListPage, ['pompiste'])} />
      <Route path="/ventes/nouveau" element={protect(VentesFormPage, ['pompiste'])} />
      <Route path="/ventes/terme" element={protect(VentesTermeListPage, ['pompiste'])} />
      <Route path="/ventes/terme/nouveau" element={protect(VentesTermeFormPage, ['pompiste'])} />
      <Route path="/carburants" element={protect(CarburantsPompistePage, ['pompiste'])} />
      <Route path="/signalements/dysfonctionnement" element={protect(SignalerDysfonctionnementPage, ['pompiste'])} />
      <Route path="/historique-quarts" element={protect(HistoriqueQuartsPompistePage, ['pompiste'])} />

      {/* --- Routes Caissier --- */}
      <Route path="/dashboard-caissier" element={protect(DashboardCaissierPage, ['caissier'])} />
      <Route path="/caisse" element={<Navigate replace to="/dashboard-caissier" />} />
      <Route path="/caisse/ventes" element={<Navigate replace to="/caisse/ventes/directes" />} />
      <Route path="/caisse/ventes/directes" element={protect(VentesCaisseListPage, ['caissier'])} />
      <Route path="/caisse/ventes/nouveau" element={protect(VentesCaisseFormPage, ['caissier'])} />
      <Route path="/caisse/ventes/terme" element={protect(VentesTermeCaisseListPage, ['caissier'])} />
      <Route path="/caisse/ventes/terme/nouveau" element={protect(VentesTermeCaisseFormPage, ['caissier'])} />
      <Route path="/caisse/stock" element={protect(StockBoutiquePage, ['caissier'])} />
      <Route path="/signalements/ecart-caisse" element={protect(SignalementEcartPage, ['caissier'])} />
      <Route path="/caisse/signalements/dysfonctionnement" element={protect(SignalerDysfonctionnementCaissePage, ['caissier'])} />
      <Route path="/caisse/historique/clotures" element={protect(HistoriqueCloturesCaissePage, ['caissier'])} />

      {/* --- Routes Chef de Piste --- */}
      <Route path="/dashboard-chef-de-piste" element={protect(DashboardChefDePistePage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste" element={<Navigate replace to="/dashboard-chef-de-piste" />} />
      <Route path="/chef-de-piste/saisie-index" element={protect(SaisieIndexChefDePistePage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste/affectations" element={protect(AffectationPersonnelPage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste/presences" element={protect(SuiviPresencesPage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste/saisie-caisse" element={protect(SaisieCaissePhysiquePage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste/signalements/ecarts" element={protect(SignalementEcartsChefDePistePage, ['chef_de_piste'])} />
      <Route path="/chef-de-piste/signalements/materiel" element={protect(SignalementMaterielChefDePistePage, ['chef_de_piste'])} />
      
      {/* --- Routes Gérant --- */}
      <Route path="/gerant/dashboard" element={protect(DashboardGerantPage, ['gerant'])} />
      <Route path="/gerant" element={<Navigate replace to="/gerant/dashboard" />} />
      <Route path="/gerant/stocks/cuves" element={protect(GerantNiveauxCuvesPage, ['gerant'])} />
      <Route path="/gerant/commandes/nouveau" element={protect(GerantBonsCommandePage, ['gerant'])} /> 
      <Route path="/gerant/livraisons/suivi" element={protect(GerantSuiviLivraisonsPage, ['gerant'])} /> 
      <Route path="/gerant/stocks/produits" element={protect(GerantStocksProduitsPage, ['gerant'])} />
      <Route path="/gerant/catalogue/gestion" element={protect(GerantCataloguePage, ['gerant'])} /> 
      <Route path="/gerant/ventes/personnel" element={protect(GerantVentesPersonnelPage, ['gerant'])} />
      <Route path="/gerant/rapports/activite" element={protect(GerantRapportsActivitePage, ['gerant'])} />   
      <Route path="/gerant/ventes/credit" element={protect(GerantVentesCreditPage, ['gerant'])} />   
      <Route path="/gerant/finance/marges" element={protect(GerantMargesPage, ['gerant'])} />
      <Route path="/gerant/finance/depenses" element={protect(GerantDepensesPage, ['gerant'])} />
      <Route path="/gerant/config/prix" element={protect(GerantConfigPage, ['gerant'])} />
      <Route path="/gerant/config/seuils" element={protect(GerantConfigPage, ['gerant'])} /> 
      <Route path="/gerant/finance/facturation" element={protect(GerantFacturationPage, ['gerant'])} />
      <Route path="/gerant/personnel/performance" element={protect(GerantPerfPersonnelPage, ['gerant'])} />
      <Route path="/gerant/personnel/comptes" element={protect(GerantComptesUtilisateursPage, ['gerant'])} /> 
      <Route path="/gerant/clients/gestion" element={protect(GerantGestionClientsPage, ['gerant'])} />
      <Route path="/gerant/clients/releves" element={protect(GerantRelevesEntreprisesPage, ['gerant'])} />
      <Route path="/gerant/clients/reclamations" element={protect(GerantReclamationsPage, ['gerant'])} />
      <Route path="/gerant/maintenance/suivi" element={protect(GerantMaintenancePage, ['gerant'])} />
      <Route path="/gerant/maintenance/plans" element={protect(GerantPlansMaintenancePage, ['gerant'])} />
      <Route path="/gerant/maintenance/affectations" element={protect(GerantAffectationPage, ['gerant'])} />
      <Route path="/gerant/equipements/pompes" element={protect(GerantGestionPompesPage, ['gerant'])} /> 
      <Route path="/gerant/equipements/cuves" element={protect(GerantGestionCuvesPage, ['gerant'])} />
      <Route path="/gerant/securite/logs" element={protect(GerantLogsActivitePage, ['gerant'])} /> 

      {/* ----- Route "Non Trouvée" (404) pour les utilisateurs connectés ----- */}
      <Route
        path="*"
        element={
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <h1 className="text-6xl font-bold text-purple-600">404</h1>
              <p className="mt-4 text-2xl font-medium text-gray-700">Oops! Page non trouvée.</p>
              <p className="mt-2 text-gray-500">La page que vous recherchez n'existe pas ou a été déplacée.</p>
              <Link
                to="/login" // Redirection sécurisée vers la page de connexion
                className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 transition-colors"
              >
                Retour à la page de connexion
              </Link>
            </div>
          </DashboardLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;