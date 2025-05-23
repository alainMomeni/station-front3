// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { menuConfig } from '../config/menuConfig'; // Assurez-vous que ce chemin est correct
import type { NavItem, RoleType } from '../config/menuConfig';

// --- !! CONSTANTE POUR SIMULER LE RÔLE CONNECTÉ !! ---
// --- !! MODIFIEZ CETTE VALEUR ('pompiste', 'caissier', 'chef_de_piste' ou 'gerant') POUR TESTER !! ---
const SIMULATED_ROLE: RoleType = 'caissier';
// --- !! -------------------------------------------------- !! ---

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

// Helper pour classNames
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
    const location = useLocation();
    const currentRole = SIMULATED_ROLE;

    const userInfo = {
        pompiste: { name: 'Natalya P.', initial: 'N', roleLabel: 'Pompiste' },
        caissier: { name: 'Jean C.', initial: 'J', roleLabel: 'Caissier' },
        chef_de_piste: { name: 'Amina C.', initial: 'A', roleLabel: 'Chef de Piste' },
        gerant: { name: 'M. Diallo', initial: 'D', roleLabel: 'Gérant' },
    }[currentRole];

    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
    const navigation: NavItem[] = menuConfig[currentRole] || [];

    useEffect(() => {
        const activeParent = navigation.find(isParentActive);
        if (activeParent && activeParent.subItems) {
            setOpenSubmenus(prev => ({...prev, [activeParent.name]: true}));
        }
    }, [navigation, location.pathname]);

    const toggleSubmenu = (itemName: string) => {
        setOpenSubmenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const isParentActive = (item: NavItem): boolean => {
        if (item.subItems) {
            return item.subItems.some(subItem => location.pathname.startsWith(subItem.href));
        }
        return false;
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-white shadow-lg">
            {/* Logo / Header */}
            <div className="h-16 flex items-center justify-between border-b border-gray-200 flex-shrink-0 px-4">
                <span className="text-xl font-semibold text-gray-700">STATION LOGO</span>
                 <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden p-1 -mr-1 rounded-md text-gray-500 hover:text-purple-600 hover:bg-gray-100"
                    aria-label="Fermer le menu"
                 >
                    <FiX className="h-6 w-6" />
                </button>
            </div>

            {/* User Profile */}
            <div className="px-6 py-5 flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-medium">
                    {userInfo.initial}
                </div>
                <div>
                    <p className="text-base font-semibold text-gray-800">{userInfo.name}</p>
                    <p className="text-sm text-gray-500">{userInfo.roleLabel}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                 <p className="px-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Menu 
                </p>
                {navigation.map((item) => {
                    const isCurrentParentActive = isParentActive(item);
                    // Ajustement pour inclure tous les dashboards principaux potentiels
                    const mainDashboardPaths = ['/dashboard', '/dashboard-caissier', '/dashboard-chef-de-piste', '/gerant/dashboard'];
                    const isDirectLinkActive = item.href
                      ? (mainDashboardPaths.includes(item.href) ? location.pathname === item.href : location.pathname.startsWith(item.href))
                      : false;
                    const isActive = isDirectLinkActive || isCurrentParentActive;
                    const isSubmenuOpen = openSubmenus[item.name] || false;

                    if (item.subItems) {
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleSubmenu(item.name)}
                                    className={classNames(
                                        'group w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition duration-150 ease-in-out',
                                        isActive ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                    aria-expanded={isSubmenuOpen}
                                >
                                    <div className="flex items-center">
                                        <item.icon className={classNames( isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 flex-shrink-0 h-5 w-5')} aria-hidden="true" />
                                        {item.name}
                                    </div>
                                    {isSubmenuOpen ? <FiChevronDown className="h-5 w-5 text-gray-400" /> : <FiChevronRight className="h-5 w-5 text-gray-400" />}
                                </button>
                                {isSubmenuOpen && (
                                    <div className="mt-1 space-y-1 pl-5 border-l-2 border-gray-200 ml-3 mr-1">
                                        {item.subItems.map((subItem) => {
                                            const isSubItemActive = location.pathname.startsWith(subItem.href);
                                            return (
                                                <Link key={subItem.name} to={subItem.href} onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                                                    className={classNames( isSubItemActive ? 'bg-purple-100 text-purple-700 font-medium border-l-4 border-purple-600 -ml-[2px]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent', 'group flex items-center w-full pl-3 pr-2 py-2 text-sm rounded-r-md transition duration-150 ease-in-out' )}
                                                    aria-current={isSubItemActive ? 'page' : undefined} >
                                                  {subItem.icon && ( <subItem.icon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500 flex-shrink-0" aria-hidden="true" /> )}
                                                  {subItem.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return (
                        <Link key={item.name} to={item.href!} onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                            className={classNames( isActive ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent', 'group flex items-center px-3 py-2.5 text-sm rounded-md transition duration-150 ease-in-out')}
                            aria-current={isActive ? 'page' : undefined} >
                            <item.icon className={classNames(isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 flex-shrink-0 h-5 w-5')} aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

     return (
        <>
            {isMobileOpen && ( <div className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden" onClick={toggleMobileSidebar} aria-hidden="true" /> )}
            <div className={classNames( 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform ease-in-out duration-300 md:hidden', isMobileOpen ? 'translate-x-0' : '-translate-x-full' )} >
                {sidebarContent}
            </div>
            <aside className="w-64 flex-shrink-0 hidden md:block">
                 {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;