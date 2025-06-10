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
import GerantRapportsActivitePage from '../types/GerantRapportsActivitePage';
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



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ----- Authentification et Racine ----- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* ----- Routes Principales (Post-Login) ----- */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard-caissier" element={<DashboardCaissierPage />} />
      <Route path="/dashboard-chef-de-piste" element={<DashboardChefDePistePage />} />
      <Route path="/gerant/dashboard" element={<DashboardGerantPage />} />

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

      {/* --- Routes Spécifiques Chef de Piste --- */}
      <Route path="/chef-de-piste" element={<Navigate replace to="/dashboard-chef-de-piste" />} />
      <Route path="/chef-de-piste/saisie-index" element={<SaisieIndexChefDePistePage />} />
      <Route path="/chef-de-piste/affectations" element={<AffectationPersonnelPage />} />
      <Route path="/chef-de-piste/presences" element={<SuiviPresencesPage />} />
      <Route path="/chef-de-piste/saisie-caisse" element={<SaisieCaissePhysiquePage />} />
      <Route path="/chef-de-piste/signalements/ecarts" element={<SignalementEcartsChefDePistePage />} />
      <Route path="/chef-de-piste/signalements/materiel" element={<SignalementMaterielChefDePistePage />} />

      
      {/* --- Routes Spécifiques Gérant --- */}
      <Route path="/gerant" element={<Navigate replace to="/gerant/dashboard" />} />
      <Route path="/gerant/stocks/cuves" element={<GerantNiveauxCuvesPage />} />
      <Route path="/gerant/commandes/nouveau" element={<GerantBonsCommandePage />} /> 
      <Route path="/gerant/livraisons/suivi" element={<GerantSuiviLivraisonsPage />} /> 
      <Route path="/gerant/stocks/produits" element={<GerantStocksProduitsPage />} />
      <Route path="/gerant/catalogue/gestion" element={<GerantCataloguePage />} /> 
      <Route path="/gerant/ventes/personnel" element={<GerantVentesPersonnelPage />} />
      <Route path="/gerant/rapports/activite" element={<GerantRapportsActivitePage />} />   
      <Route path="/gerant/ventes/credit" element={<GerantVentesCreditPage />} />   
      <Route path="/gerant/finance/marges" element={<GerantMargesPage />} />
      <Route path="/gerant/finance/depenses" element={<GerantDepensesPage />} />
      <Route path="/gerant/config/prix" element={<GerantConfigPage />} /> {/* Pour l'onglet prix carburant par défaut */}
      <Route path="/gerant/config/seuils" element={<GerantConfigPage />} /> 
      <Route path="/gerant/finance/facturation" element={<GerantFacturationPage />} />
      <Route path="/gerant/personnel/performance" element={<GerantPerfPersonnelPage />} />
      <Route path="/gerant/personnel/comptes" element={<GerantComptesUtilisateursPage />} /> 
      <Route path="/gerant/clients/gestion" element={<GerantGestionClientsPage />} />
      <Route path="/gerant/clients/releves" element={<GerantRelevesEntreprisesPage />} />
      <Route path="/gerant/clients/reclamations" element={<GerantReclamationsPage />} />
      <Route path="/gerant/maintenance/suivi" element={<GerantMaintenancePage />} />
      <Route path="/gerant/maintenance/plans" element={<GerantPlansMaintenancePage />} />
      <Route path="/gerant/maintenance/affectations" element={<GerantAffectationPage />} />
      <Route path="/gerant/equipements/pompes" element={<GerantGestionPompesPage />} /> 
      <Route path="/gerant/equipements/cuves" element={<GerantGestionCuvesPage />} />
      <Route path="/gerant/securite/logs" element={<GerantLogsActivitePage />} /> 
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
                to="/login" // Ou dynamiquement vers le dashboard du rôle actuel si l'utilisateur est connecté
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