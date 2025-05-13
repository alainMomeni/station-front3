// src/config/menuConfig.ts
import React from 'react';
import {
    FiGrid, FiShoppingCart, FiDroplet, FiCalendar, FiAlertTriangle,
    FiUserX, FiTool, FiDollarSign, FiPackage // Ajout FiPackage pour Stock
} from 'react-icons/fi';

// --- Interfaces pour les éléments de navigation ---
export interface SubNavItem {
    name: string;
    href: string;
    icon?: React.ElementType; // Icône optionnelle pour sous-éléments
}

export interface NavItem {
    name: string;
    icon: React.ElementType;
    href?: string;          // Présent si c'est un lien direct
    subItems?: SubNavItem[]; // Présent s'il y a un sous-menu
}

// --- Définition des Rôles ---
export type RoleType = 'pompiste' | 'caissier'; // Étendez ceci avec plus de rôles si nécessaire

// --- Définition des Menus par Rôle ---

// Menu pour le rôle 'pompiste'
const pompisteMenu: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
    {
        name: 'Ventes Carburant',
        icon: FiDroplet, // Ou FiShoppingCart si préféré
        subItems: [
            { name: 'Ventes Directes', href: '/ventes/directes' }, // Utilise /ventes/*
            { name: 'Ventes à Terme', href: '/ventes/terme' },     // Utilise /ventes/*
        ]
    },
    { name: 'Gestion Cuves', href: '/carburants', icon: FiDroplet },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
    {
        name: 'Signalements',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX },
            { name: 'Dysfonctionnement', href: '/signalements/dysfonctionnement', icon: FiTool },
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
            // Pointer vers les routes caissier spécifiques
            { name: 'Ventes Directes', href: '/caisse/ventes/directes' },
            { name: 'Ventes à Terme', href: '/caisse/ventes/terme' },
        ]
    },
    // Nouvel item pour le stock
    { name: 'Stock Boutique', href: '/caisse/stock', icon: FiPackage },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar }, // Accès commun
    {
        name: 'Signalements',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX }, // Accès commun
            { name: 'Écart de Caisse', href: '/signalements/ecart-caisse', icon: FiDollarSign }, // Spécifique Caisse
        ]
    },
];


// --- Configuration principale des menus ---
export const menuConfig: { [key in RoleType]: NavItem[] } = {
    pompiste: pompisteMenu,
    caissier: caissierMenu,
    // Ajoutez d'autres rôles et leurs menus ici
};