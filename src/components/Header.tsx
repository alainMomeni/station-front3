import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { FiBell, FiMenu, FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import DeconnexionModal from './DeconnexionModal'; // Import the modal

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const userAvatarUrl = 'https://via.placeholder.com/40';
  const navigate = useNavigate();

  const [isDeconnexionModalOpen, setIsDeconnexionModalOpen] = useState(false);

  const handleDeconnexion = () => {
    setIsDeconnexionModalOpen(true);
  };

  const confirmDeconnexion = () => {
    setIsDeconnexionModalOpen(false);
    // Ici, vous appelleriez la fonction de déconnexion de votre contexte/service d'authentification
    console.log("Déconnexion confirmée");
    // Simuler la déconnexion en redirigeant simplement pour cette démo
    navigate('/login');
  };

  const navLinkBaseClasses = "p-2 rounded-md text-gray-500 hover:text-purple-600  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500";
  const navLinkTextClasses = "text-sm font-medium";

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={toggleMobileSidebar} className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-gray-100" aria-label="Ouvrir le menu">
                <FiMenu className="h-6 w-6" />
              </button>
              <span className="text-xl font-semibold text-gray-700 ml-3 md:hidden">STATION LOGO</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <Link to="/dashboard" className={navLinkBaseClasses} aria-label="Accueil">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Accueil</span>
                <FiHome className="h-5 w-5 md:hidden" />
              </Link>
              <Link to="/profil" className={navLinkBaseClasses} aria-label="Profil">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Profil</span>
                <FiUser className="h-5 w-5 md:hidden" />
              </Link>
              <Link to="/notifications" className={`${navLinkBaseClasses} relative`} aria-label="Notifications">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Notifications</span>
                <FiBell className="h-5 w-5 md:hidden" />
                <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full text-white shadow-solid bg-red-500 text-xs flex items-center justify-center">5</span>
              </Link>
              {/* Bouton de déconnexion qui ouvre le modal */}
              <Link to="#" onClick={handleDeconnexion} className={navLinkBaseClasses} aria-label="Déconnexion">
                <span className={`hidden md:inline ${navLinkTextClasses}`}>Déconnexion</span>
                <FiLogOut className="h-5 w-5 md:hidden" />
              </Link>
              <button className="flex ml-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" aria-label="Menu utilisateur">
                <img className="h-9 w-9 rounded-full" src={userAvatarUrl} alt="User avatar" />
              </button>
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