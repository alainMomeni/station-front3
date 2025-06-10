// src/types/logs.ts

export type LogActionType = 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 
                            'CREATE' | 'UPDATE' | 'DELETE' | 
                            'PRICE_CHANGE' | 'STOCK_ADJUSTMENT' | 'PERMISSION_CHANGE' | 'SYSTEM_ACTION';
                            
export type LogActionResult = 'succes' | 'echec';

export interface LogActivite {
  id: number; // BIGSERIAL
  timestamp_log: string; // ISO String
  utilisateur_id_log?: string; // UUID
  utilisateur_nom?: string; // Nom pour affichage facile
  action_log: LogActionType;
  details_log?: Record<string, any> | string; // JSONB peut contenir avant/après, ou un message
  entite_concernee_log?: string; // Ex: "produits", "ventes"
  entite_id_concernee_log?: string; // Ex: ID du produit modifié
  resultat_action_log: LogActionResult;
}