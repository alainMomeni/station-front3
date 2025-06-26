// src/_mockData/notifications.ts
import { subHours, subDays } from 'date-fns';
import type { Notification } from '../types/notifications';

export const dummyNotifications: Notification[] = [
  { 
    id: 'n1', 
    titre: 'Maintenance programmée', 
    message: 'Une maintenance du système est prévue ce soir à 23h00.', 
    date: subHours(new Date(), 1).toISOString(), 
    lue: false, 
    type: 'info' 
  },
  { 
    id: 'n2', 
    titre: 'Niveau cuve Diesel bas', 
    message: 'Le niveau de la cuve Diesel A est inférieur au seuil de sécurité.', 
    date: subHours(new Date(), 2).toISOString(), 
    lue: false, 
    type: 'alerte',
    lien: '/gerant/stocks/cuves' 
  },
  { 
    id: 'n3', 
    titre: 'Rapport de ventes généré', 
    message: 'Votre rapport de ventes hebdomadaire est disponible.', 
    date: subDays(new Date(), 1).toISOString(), 
    lue: true, 
    type: 'succes' 
  },
  { 
    id: 'n4', 
    titre: 'Nouvelle fonctionnalité', 
    message: 'Découvrez la nouvelle interface pour la gestion des carburants !', 
    date: subDays(new Date(), 2).toISOString(), 
    lue: true, 
    type: 'info' 
  },
  { 
    id: 'n5', 
    titre: 'Demande de congé approuvée', 
    message: 'Votre demande de congé du 10/08 au 15/08 a été approuvée.', 
    date: subDays(new Date(), 3).toISOString(), 
    lue: false, 
    type: 'succes'
  },
];