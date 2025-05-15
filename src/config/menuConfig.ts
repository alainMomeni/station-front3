// src/config/menuConfig.ts
import React from 'react';
import {
    FiGrid, FiShoppingCart, FiDroplet, FiCalendar, FiAlertTriangle,
    FiUserX, FiTool, FiDollarSign, FiPackage, FiSliders, FiArchive, // FiArchive ajouté pour l'historique
    FiBarChart2, // Quelques icônes supplémentaires pour illustrer
    FiLayers
} from 'react-icons/fi';

// --- Interfaces pour les éléments de navigation ---
export interface SubNavItem {
    name: string;
    href: string;
    icon?: React.ElementType; // Icône optionnelle pour les sous-éléments
}

export interface NavItem {
    name: string;
    icon: React.ElementType;
    href?: string;          // Si c'est un lien direct
    subItems?: SubNavItem[]; // Si c'est un parent avec des sous-menus
}

// --- Définition des Rôles ---
// Si vous avez plus de rôles, ajoutez-les ici (ex: 'admin', 'manager')
export type RoleType = 'pompiste' | 'caissier';

// --- Définition des Menus par Rôle ---

// Menu pour le rôle 'pompiste'
const pompisteMenu: NavItem[] = [
    { name: 'Tableau de Bord', href: '/dashboard', icon: FiGrid },
    {
        name: 'Ventes Carburant',
        icon: FiDroplet, // Maintenu FiDroplet car spécifique au carburant
        subItems: [
            { name: 'Ventes Directes', href: '/ventes/directes', icon: FiShoppingCart },
            { name: 'Ventes à Terme', href: '/ventes/terme', icon: FiDollarSign },
        ]
    },
    { name: 'Gestion Cuves', href: '/carburants', icon: FiLayers }, // Changé pour FiLayers pour cuves/stock
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
    // Nouvelle ligne pour l'historique des quarts
    { name: 'Historique Quarts', href: '/historique-quarts', icon: FiBarChart2 },
    {
        name: 'Mes Signalements',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX },
            { name: 'Dysfonctionnement Piste', href: '/signalements/dysfonctionnement', icon: FiTool },
        ]
    },
];

// Menu pour le rôle 'caissier'
const caissierMenu: NavItem[] = [
    { name: 'Dashboard Caisse', href: '/dashboard-caissier', icon: FiGrid },
    {
        name: 'Ventes Boutique',
        icon: FiShoppingCart,
        subItems: [
            { name: 'Ventes Directes', href: '/caisse/ventes/directes', icon: FiArchive },
            { name: 'Ventes à Terme', href: '/caisse/ventes/terme', icon: FiDollarSign },
        ]
    },
    { name: 'Stock Boutique', href: '/caisse/stock', icon: FiPackage },
    { name: 'Historique Clôtures', href: '/caisse/historique/clotures', icon: FiBarChart2 },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
    {
        name: 'Signalements Caisse',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX }, // Route commune
            { name: 'Écart Caisse', href: '/signalements/ecart-caisse', icon: FiDollarSign },
            { name: 'Dysfonctionnement', href: '/caisse/signalements/dysfonctionnement', icon: FiSliders },
        ]
    },
];

// --- Configuration principale des menus ---
// Ici, on mappe chaque rôle à son menu spécifique.
export const menuConfig: { [key in RoleType]: NavItem[] } = {
    pompiste: pompisteMenu,
    caissier: caissierMenu,
    // Si vous aviez un rôle 'admin' :
    // admin: [
    //   { name: 'Vue Globale', href: '/admin/overview', icon: FiGrid },
    //   { name: 'Gestion Utilisateurs', href: '/admin/users', icon: FiUsers },
    //   { name: 'Paramètres Station', href: '/admin/settings', icon: FiSettings },
    //   ...pompisteMenu, // Un admin pourrait avoir accès aux menus pompistes...
    //   ...caissierMenu, // ...et caissiers
    // ],
};