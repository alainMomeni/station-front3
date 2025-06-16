import React from 'react';
import {
    FiGrid, FiShoppingCart, FiDroplet, FiCalendar, FiAlertTriangle, FiUserX,
    FiTool, FiDollarSign, FiPackage, FiSliders, FiArchive, FiBarChart2, FiLayers,
    FiUsers, FiUserCheck, FiDatabase, FiList, FiAlertOctagon, FiSettings, FiBriefcase,
    FiTrendingUp, FiCreditCard, FiFileText, FiMessageSquare, FiShield, FiClipboard,
    FiHardDrive, FiZap // Ajout d'icônes pour les équipements
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
export type RoleType = 'pompiste' | 'caissier' | 'chef_de_piste' | 'gerant'; 

// --- Menu pour le rôle 'pompiste' ---
const pompisteMenu: NavItem[] = [
    { name: 'Tableau de Bord', href: '/dashboard', icon: FiGrid },
    {
        name: 'Ventes Carburant',
        icon: FiDroplet,
        subItems: [
            { name: 'Ventes Directes', href: '/ventes/directes', icon: FiShoppingCart },
            { name: 'Ventes à Terme', href: '/ventes/terme', icon: FiDollarSign },
        ]
    },
    { name: 'Gestion Cuves', href: '/carburants', icon: FiLayers },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },
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

// --- Menu pour le rôle 'caissier' ---
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
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar }, // Partagé
    {
        name: 'Signalements Caisse',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Mon Absence', href: '/signalements/absence', icon: FiUserX }, // Partagé
            { name: 'Écart Caisse', href: '/signalements/ecart-caisse', icon: FiDollarSign },
            { name: 'Dysfonctionnement', href: '/caisse/signalements/dysfonctionnement', icon: FiSliders },
        ]
    },
];

// --- Menu pour le Chef de Piste ---
const chefDePisteMenu: NavItem[] = [
    { name: 'Dashboard Chef de Piste', href: '/dashboard-chef-de-piste', icon: FiGrid },
    {
        name: 'Gestion des Quarts',
        icon: FiCalendar,
        subItems: [
            { name: 'Saisie Index Cuves', href: '/chef-de-piste/saisie-index', icon: FiDatabase },
            { name: 'Affectation Personnel', href: '/chef-de-piste/affectations', icon: FiUsers },
            { name: 'Suivi Présences', href: '/chef-de-piste/presences', icon: FiUserCheck },
            { name: 'Saisie Caisse Physique', href: '/chef-de-piste/saisie-caisse', icon: FiDollarSign },
        ]
    },
    {
        name: 'Signalements & Suivi',
        icon: FiAlertTriangle,
        subItems: [
            { name: 'Signaler Écarts (Index/Caisse)', href: '/chef-de-piste/signalements/ecarts', icon: FiAlertOctagon },
            { name: 'Signaler Problème Matériel', href: '/chef-de-piste/signalements/materiel', icon: FiTool },
            { name: 'Signaler Mon Absence', href: '/signalements/absence', icon: FiUserX },
        ]
    },
    {
        name: 'Rapports & Historique',
        icon: FiArchive,
        subItems: [
            { name: 'Historique Index & Volumes', href: '/chef-de-piste/historique/index', icon: FiList },
            { name: 'Rapports de Quarts (Global)', href: '/chef-de-piste/rapports/quarts', icon: FiBarChart2 },
        ]
    },
    { name: 'Mon Planning', href: '/agenda', icon: FiCalendar },

];

// --- Menu pour le Gérant ---
const gerantMenu: NavItem[] = [
    { name: 'Tableau de Bord', href: '/gerant/dashboard', icon: FiGrid },
    {
        name: 'Approvisionnement',
        icon: FiPackage,
        subItems: [
            { name: 'Niveaux Cuves', href: '/gerant/stocks/cuves', icon: FiDroplet },
            { name: 'Stocks Boutique', href: '/gerant/stocks/produits', icon: FiArchive },
            { name: 'Bons de Commande', href: '/gerant/commandes/nouveau', icon: FiFileText },
            { name: 'Suivi Livraisons', href: '/gerant/livraisons/suivi', icon: FiClipboard },
            { name: 'Catalogue Produits', href: '/gerant/catalogue/gestion', icon: FiList },
        ]
    },
    {
        name: 'Suivi des Ventes',
        icon: FiTrendingUp,
        subItems: [
            { name: 'Ventes par Employé', href: '/gerant/ventes/personnel', icon: FiUsers },
            { name: 'Ventes à Crédit', href: '/gerant/ventes/credit', icon: FiCreditCard },
            { name: 'Rapports d\'Activité', href: '/gerant/rapports/activite', icon: FiBarChart2 },
        ]
    },
    {
        name: 'Analyse Financière',
        icon: FiDollarSign,
        subItems: [
            { name: 'Marges', href: '/gerant/finance/marges', icon: FiSliders },
            { name: 'Dépenses', href: '/gerant/finance/depenses', icon: FiBriefcase },
            { name: 'Facturation Clients', href: '/gerant/finance/facturation', icon: FiFileText },
        ]
    },
    {
        name: 'Personnel',
        icon: FiUsers,
        subItems: [
            { name: 'Performance', href: '/gerant/personnel/performance', icon: FiUserCheck },
            { name: 'Gestion Comptes', href: '/gerant/personnel/comptes', icon: FiSettings },
        ]
    },
    {
        name: 'Relation Client',
        icon: FiMessageSquare,
        subItems: [
            { name: 'Gestion Base Clients', href: '/gerant/clients/gestion', icon: FiUsers },
            { name: 'Comptes Entreprises', href: '/gerant/clients/releves', icon: FiFileText },
            { name: 'Réclamations', href: '/gerant/clients/reclamations', icon: FiAlertOctagon },
        ]
    },
    {
        name: 'Équipements',
        icon: FiTool,
        subItems: [
            { name: 'Plans de Maintenance', href: '/gerant/maintenance/plans', icon: FiClipboard },
            { name: 'Affectations', href: '/gerant/maintenance/affectations', icon: FiUsers },
            { name: 'Gestion des Pompes', href: '/gerant/equipements/pompes', icon: FiZap },
            { name: 'Gestion des Cuves', href: '/gerant/equipements/cuves', icon: FiHardDrive },
        ]
    },
    {
        name: 'Configuration',
        icon: FiSettings,
        subItems: [
            { name: 'Prix', href: '/gerant/config/prix', icon: FiDollarSign },
            { name: 'Seuils & Alertes', href: '/gerant/config/seuils', icon: FiAlertTriangle },
            { name: 'Logs d\'Activité', href: '/gerant/securite/logs', icon: FiShield },
        ]
    },
];

// --- Configuration principale des menus ---
export const menuConfig: { [key in RoleType]: NavItem[] } = {
    pompiste: pompisteMenu,
    caissier: caissierMenu,
    chef_de_piste: chefDePisteMenu,
    gerant: gerantMenu,
};