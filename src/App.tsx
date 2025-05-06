import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; // Added Link for 404 page

// Layout Import (assuming DashboardLayout exists and might be needed for 404 page consistency)
import DashboardLayout from './layouts/DashboardLayout'; // Make sure this path is correct

// Page Imports
import DashboardPage from './page/DashboardPage';
import VentesListPage from './page/VentesListPage';
import VentesFormPage from './page/VentesFormPage';
import AgendaPage from './page/AgendaPage';
import VentesTermeListPage from './page/VentesTermeListPage';
import VentesTermeFormPage from './page/VentesTermeFormPage';
import SignalerAbsencePage from './page/SignalerAbsencePage';
import SignalerDysfonctionnementPage from './page/SignalerDysfonctionnementPage';
import CarburantsPompistePage from './page/CarburantsPompistePage';
import ProfilPage from './page/ProfilPage';
import NotificationsPage from './page/NotificationsPage';
import LoginPage from './page/login/LoginPage'; // Your path
import './App.css'; // Your global styles

function App() {
  // Aucune logique d'authentification ici - purement pour afficher les interfaces
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pour la page de connexion */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirection par défaut vers le dashboard si aucune autre route ne correspond (ou login si on voulait le comportement précédent) */}
        <Route path="/" element={<Navigate replace to="/dashboard" />} />

        {/* Définition des routes pour chaque page/interface */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Pour les ventes, une route de base qui redirige vers "ventes directes" par exemple */}
        <Route path="/ventes" element={<Navigate replace to="/ventes/directes" />} />
        <Route path="/ventes/directes" element={<VentesListPage />} />
        <Route path="/ventes/nouveau" element={<VentesFormPage />} /> {/* Formulaire pour ventes directes */}
        <Route path="/ventes/terme" element={<VentesTermeListPage />} />
        <Route path="/ventes/terme/nouveau" element={<VentesTermeFormPage />} />

        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/carburants" element={<CarburantsPompistePage />} />

        {/* Pour les signalements, une route de base qui redirige vers "signaler absence" */}
        <Route path="/signalements" element={<Navigate replace to="/signalements/absence" />} />
        <Route path="/signalements/absence" element={<SignalerAbsencePage />} />
        <Route path="/signalements/dysfonctionnement" element={<SignalerDysfonctionnementPage />} />

        {/* Page 404 (Route de secours) - peut utiliser DashboardLayout pour un look cohérent */}
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
    </BrowserRouter>
  );
}

export default App;