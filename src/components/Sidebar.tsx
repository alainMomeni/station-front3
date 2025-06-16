import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiX, FiChevronDown, FiChevronUp, FiLogOut } from 'react-icons/fi'; // Utiliser Up/Down pour plus de clarté
import { menuConfig } from '../config/menuConfig';
import { useAuthContext } from '../contexts/AuthContext';
import type { NavItem } from '../config/menuConfig';
import DeconnexionModal from './DeconnexionModal';

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

// Helper pour combiner les classes CSS
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  
  // State pour les sous-menus ouverts et le modal de déconnexion
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Si pas d'utilisateur, on n'affiche rien. C'est une sécurité.
  if (!user) return null;
  
  // C'est ici qu'on récupère la bonne liste de menus en fonction du rôle.
  const navigation: NavItem[] = menuConfig[user.role] || [];

  // Ouvre le sous-menu parent de la page active au chargement
  useEffect(() => {
    const activeParent = navigation.find(item => 
      item.subItems?.some(sub => location.pathname.startsWith(sub.href))
    );
    if (activeParent) {
      setOpenSubmenus(prev => ({ ...prev, [activeParent.name]: true }));
    }
  }, [location.pathname, navigation]);

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };
  
  const handleLogout = () => {
      setIsLogoutModalOpen(false);
      logout();
  };

  // Le JSX qui contient toute la logique d'affichage
  const sidebarContent = (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between border-b border-gray-200 flex-shrink-0 px-4">
        <span className="text-xl font-semibold text-gray-700">STATION LOGO</span>
        <button onClick={toggleMobileSidebar} className="md:hidden p-1 rounded-md text-gray-500">
          <FiX className="h-6 w-6" />
        </button>
      </div>

      {/* Profil utilisateur */}
      <div className="px-6 py-5 flex items-center space-x-4 border-b border-gray-200">
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
          {user.initial}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-800 truncate">{user.name}</p>
          <p className="text-sm text-gray-500">{user.roleLabel}</p>
        </div>
      </div>

      {/* ========== LA PARTIE CRUCIALE : LA NAVIGATION ========== */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
        {/* La boucle qui construit le menu */}
        {navigation.map((item) => {
          const isSubmenuOpen = openSubmenus[item.name] || false;
          // Si l'élément a des sous-éléments
          if (item.subItems) {
            const isParentActive = item.subItems.some(subItem => location.pathname.startsWith(subItem.href));
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className={classNames(
                    'group w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition duration-150',
                    isParentActive ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className={classNames(isParentActive ? 'text-purple-500' : 'text-gray-400', 'mr-3 h-5 w-5')} />
                    <span>{item.name}</span>
                  </div>
                  {isSubmenuOpen ? <FiChevronUp className="h-5 w-5 text-gray-400" /> : <FiChevronDown className="h-5 w-5 text-gray-400" />}
                </button>
                {/* Affiche les sous-menus si ouverts */}
                {isSubmenuOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200">
                    {item.subItems.map((subItem) => {
                      const isSubItemActive = location.pathname.startsWith(subItem.href);
                      return (
                        <Link key={subItem.name} to={subItem.href} onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                          className={classNames(
                            'group flex items-center w-full px-3 py-2 text-sm rounded-md transition-all duration-150',
                             isSubItemActive ? 'text-purple-600 font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          )}
                          aria-current={isSubItemActive ? 'page' : undefined}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          // Si c'est un lien direct
          const isDirectLinkActive = item.href ? location.pathname === item.href : false;
          return (
            <Link key={item.name} to={item.href!} onClick={isMobileOpen ? toggleMobileSidebar : undefined}
              className={classNames(
                'group flex items-center px-3 py-2.5 text-sm rounded-md transition duration-150',
                isDirectLinkActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              aria-current={isDirectLinkActive ? 'page' : undefined}
            >
              <item.icon className={classNames(isDirectLinkActive ? 'text-purple-500' : 'text-gray-400', 'mr-3 h-5 w-5')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bouton de Déconnexion */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition group"
        >
          <FiLogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-600" />
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay pour le mode mobile */}
      {isMobileOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileSidebar} />}
      
      {/* Sidebar Mobile */}
      <div className={classNames( 'fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden', isMobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        {sidebarContent}
      </div>
      
      {/* Sidebar Desktop */}
      <aside className="w-72 flex-shrink-0 hidden md:block">
        {sidebarContent}
      </aside>

      <DeconnexionModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;