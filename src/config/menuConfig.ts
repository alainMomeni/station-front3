// src/config/menuConfig.ts
import React from 'react';
import {
    FiGrid, FiShoppingCart, FiDroplet, FiCalendar, FiAlertTriangle,
    FiUserX, FiTool, FiDollarSign, FiPackage, FiSliders // FiSliders ajoutée
} from 'react-icons/fi';

// --- Interfaces pour les éléments de navigation ---
export interface SubNavItem {
    name: string;
    href: string;
    icon?: React.ElementType;
}

export interface NavItem {
    name: string;
    icon: React.ElementType;
    href?: string;
    subItems?: SubNavItem[];
}

// --- Définition des Rôles ---
export type RoleType = 'pompiste' | 'caissier';

// --- Définition des Menus par Rôle ---

// Menu pour le rôle 'pompiste'
const pompisteMenu: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
    {
        name: 'Ventes Carburant',
        icon: FiDroplet,
        subItems: [
            { name: 'Ventes Directes', href: '/ventes/directes' },
            { name: 'Ventes à Terme', href: '/ventes/terme' },
        ]
    },
    { name: 'Gestion Cuves', href: '/carburants', icon: FiDroplet },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
    {
        name: 'Signalements',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX },
            { name: 'Dysfonctionnement Piste', href: '/signalements/dysfonctionnement', icon: FiTool }, // Précisé pour Piste
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
            { name: 'Ventes Directes', href: '/caisse/ventes/directes' },
            { name: 'Ventes à Terme', href: '/caisse/ventes/terme' },
        ]
    },
    { name: 'Stock Boutique', href: '/caisse/stock', icon: FiPackage },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
    {
        name: 'Signalements Caisse', // Titre principal du sous-menu clarifié
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Absence', href: '/signalements/absence', icon: FiUserX }, // Peut rester commun
            { name: 'Écart de Caisse', href: '/signalements/ecart-caisse', icon: FiDollarSign },
            // Nouvel item pour dysfonctionnement caisse
            { name: 'Dysfonctionnement', href: '/caisse/signalements/dysfonctionnement', icon: FiSliders },
        ]
    },
];


// --- Configuration principale des menus ---
export const menuConfig: { [key in RoleType]: NavItem[] } = {
    pompiste: pompisteMenu,
    caissier: caissierMenu,
};