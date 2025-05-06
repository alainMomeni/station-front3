import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    FiGrid,
    FiShoppingCart,
    FiDroplet,
    FiCalendar,
    // FiFileText, // Replaced by FiAlertTriangle or similar for Signalements
    FiAlertTriangle, // Example for Signalements
    FiUserX, // Example for Absence
    FiTool,    // Example for Dysfonctionnement
    FiX,
    FiChevronDown,
    FiChevronRight
} from 'react-icons/fi';

interface SubNavItem {
    name: string;
    href: string;
    icon?: React.ElementType; // Optional icon for sub-items
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  href?: string;
  subItems?: SubNavItem[];
}

interface SidebarProps {
  isMobileOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, toggleMobileSidebar }) => {
    const location = useLocation();
    const userName = 'Natalya'; // Example, ideally from context/auth
    const userRole = 'pompiste'; // Example
    const userAvatarInitial = 'N';

    const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

    const toggleSubmenu = (itemName: string) => {
        setOpenSubmenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const navigation: NavItem[] = [
        { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
        {
            name: 'Ventes',
            icon: FiShoppingCart,
            subItems: [
                { name: 'Ventes Directes', href: '/ventes/directes' },
                { name: 'Ventes à Terme', href: '/ventes/terme' },
            ]
        },
        { name: 'Carburants', href: '/carburants', icon: FiDroplet },
        { name: 'Agenda', href: '/agenda', icon: FiCalendar },
        // ** Replaced Rapports with Signalements **
        {
            name: 'Signalements',
            icon: FiAlertTriangle, // Main icon for Signalements
            subItems: [
                { name: 'Absence', href: '/signalements/absence', icon: FiUserX },
                { name: 'Dysfonctionnement', href: '/signalements/dysfonctionnement', icon: FiTool },
            ]
        },
    ];

    const isParentActive = (item: NavItem): boolean => {
        if (item.subItems) {
            return item.subItems.some(subItem => location.pathname.startsWith(subItem.href));
        }
        return false;
    };

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ');
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo / Header */}
            {/* ... (same as before) ... */}
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
            {/* ... (same as before) ... */}
            <div className="px-6 py-5 flex items-center space-x-4">
                 <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-medium">
                   {userAvatarInitial}
                </div>
                <div>
                    <p className="text-base font-semibold text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-500">{userRole}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <p className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                   Menu
                </p>
                {navigation.map((item) => {
                    const isItemActive = item.href ? location.pathname.startsWith(item.href) : false;
                    const isCurrentParentActive = isParentActive(item);
                    const isSubmenuOpen = openSubmenus[item.name] || false;

                    if (item.subItems) {
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() => toggleSubmenu(item.name)}
                                    className={/* ... (same styling as before for parent menu button) ... */
                                        classNames(
                                        'group w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition duration-150 ease-in-out',
                                        isCurrentParentActive
                                            ? 'bg-purple-50 text-purple-700 font-semibold' // Style for active parent
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                    aria-expanded={isSubmenuOpen}
                                >
                                    <div className="flex items-center">
                                        <item.icon
                                            className={/* ... */ classNames(
                                                isCurrentParentActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500',
                                                'mr-3 flex-shrink-0 h-5 w-5'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </div>
                                    {isSubmenuOpen ? <FiChevronDown className="h-5 w-5" /> : <FiChevronRight className="h-5 w-5" />}
                                </button>
                                {isSubmenuOpen && (
                                    <div className="mt-1 space-y-1 pl-5 border-l-2 border-gray-200 ml-3">
                                        {item.subItems.map((subItem) => {
                                            const isSubItemActive = location.pathname.startsWith(subItem.href);
                                            return (
                                                <Link
                                                    key={subItem.name}
                                                    to={subItem.href}
                                                    onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                                                    className={/* ... (same styling for sub-item links) ... */
                                                    classNames(
                                                        isSubItemActive
                                                            ? 'bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600'
                                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent',
                                                        'group flex items-center w-full pl-3 pr-2 py-2 text-sm rounded-md transition duration-150 ease-in-out'
                                                    )}
                                                    aria-current={isSubItemActive ? 'page' : undefined}
                                                >
                                                  {/* Optionally add subItem.icon here */}
                                                  {subItem.icon && (
                                                      <subItem.icon className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                                  )}
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
                        <Link 
                            key={item.name} 
                            to={item.href!} 
                            onClick={isMobileOpen ? toggleMobileSidebar : undefined}
                            className={classNames(
                                (item.href === '/dashboard' ? location.pathname === item.href : isItemActive)
                                    ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent',
                                'group flex items-center px-3 py-2.5 text-sm rounded-md transition duration-150 ease-in-out'
                            )}
                            aria-current={isItemActive ? 'page' : undefined}
                        >
                            <item.icon
                                className={classNames(
                                    isItemActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500',
                                    'mr-3 flex-shrink-0 h-5 w-5'
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    // Mobile and Desktop Sidebar structure remains the same
     return (
        <>
            {/* Backdrop */}
            {isMobileOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileSidebar} />}
            {/* Mobile Panel */}
            <div className={classNames('fixed inset-y-0 left-0 z-40 w-64 transform transition-transform md:hidden bg-white shadow-xl rounded-r-lg', isMobileOpen ? 'translate-x-0' : '-translate-x-full')}>
                {sidebarContent}
            </div>
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white shadow-lg rounded-r-lg hidden md:block">
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;