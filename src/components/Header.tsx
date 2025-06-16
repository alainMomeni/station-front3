// src/components/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import DeconnexionModal from './DeconnexionModal';
import { useAuthContext } from '../contexts/AuthContext'; // Import du contexte

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuthContext(); // Utilisation du contexte
  const [isDeconnexionModalOpen, setIsDeconnexionModalOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la navigation du <Link>
    setIsDeconnexionModalOpen(true);
  };

  const confirmDeconnexion = () => {
    setIsDeconnexionModalOpen(false);
    logout(); // Appel de la fonction logout du contexte
  };

  const navLinkBaseClasses = "p-2 rounded-md text-gray-500 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500";
  const navLinkTextClasses = "text-sm font-medium";

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={toggleMobileSidebar} className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-gray-100" aria-label="Ouvrir le menu">
                <FiMenu className="h-6 w-6" />
              </button>
              <span className="text-xl font-semibold text-gray-700 ml-3 md:hidden">STATION LOGO</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Link to={user ? (user.role === 'pompiste' ? '/dashboard' : user.role === 'caissier' ? '/dashboard-caissier' : user.role === 'chef_de_piste' ? '/dashboard-chef-de-piste' : '/gerant/dashboard') : '/login'} className={navLinkBaseClasses} aria-label="Accueil">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Accueil</span>
              </Link>
              <Link to="/profil" className={navLinkBaseClasses} aria-label="Profil">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Profil</span>
                <FiUser className="h-5 w-5 md:hidden" />
              </Link>
              <Link to="/notifications" className={`${navLinkBaseClasses} relative`} aria-label="Notifications">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Notifications</span>
                <FiBell className="h-5 w-5 md:hidden" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Link>
              <button onClick={handleOpenModal} className={navLinkBaseClasses} aria-label="Déconnexion">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Déconnexion</span>
                <FiLogOut className="h-5 w-5 md:hidden" />
              </button>
              
              <div className="flex ml-2 items-center justify-center h-9 w-9 rounded-full bg-purple-600 text-white font-bold text-sm" aria-label="Menu utilisateur">
                {user?.initial || '?'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <DeconnexionModal
        isOpen={isDeconnexionModalOpen}
        onClose={() => setIsDeconnexionModalOpen(false)}
        onConfirm={confirmDeconnexion}
      />
    </>
  );
};

export default Header;