// src/types/notifications.ts

/**
 * Définit les différents types de notifications possibles dans le système.
 * Utilisé pour déterminer l'icône et la couleur de la notification.
 */
export type NotificationType = 'info' | 'alerte' | 'succes';

/**
 * Représente la structure de données d'une seule notification.
 */
export interface Notification {
  id: string;                 // Identifiant unique de la notification
  titre: string;              // Le titre principal de la notification
  message: string;            // Le corps détaillé du message
  date: string;               // La date de création de la notification au format ISOString
  lue: boolean;               // Indique si l'utilisateur a déjà marqué cette notification comme lue
  type?: NotificationType;    // Le type de notification, optionnel (par défaut 'info')
  lien?: string;              // Un lien optionnel vers une page pertinente (ex: '/maintenance/ticket/123')
}