// src/page/common/NotificationsPage.tsx (FINAL & COHÉRENT)
import React, { useState } from 'react';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types et Données Mock
import type { Notification } from '../../types/notifications';
import { dummyNotifications } from '../../_mockData/notifications';

// Écosystème et UI Kit
import { Button } from '../../components/ui/Button';
import { Alert, type AlertProps } from '../../components/ui/Alert';
import { Card } from '../../components/ui/Card';


// --- Sous-composant pour un seul item de notification ---
const NotificationItem: React.FC<{
  notification: Notification;
  onMarquerCommeLue: (id: string) => void;
  onSupprimer: (id: string) => void;
}> = ({ notification, onMarquerCommeLue, onSupprimer }) => {
  
  // Mapping du type de notification à la variante de notre Alert
  const getVariant = (): AlertProps['variant'] => {
    switch (notification.type) {
      case 'alerte': return 'error';
      case 'succes': return 'success';
      case 'info':
      default: return 'info';
    }
  };

  return (
    <div className={`transition-opacity duration-300 ${notification.lue ? 'opacity-60 hover:opacity-100' : ''}`}>
        <Alert variant={getVariant()} title={notification.titre}>
            <div className="space-y-2">
                <p className="text-sm">{notification.message}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: fr })}
                    </span>
                    <div className="flex items-center space-x-2">
                         {!notification.lue && (
                            <Button variant="link" size="sm" onClick={() => onMarquerCommeLue(notification.id)}>
                                Marquer comme lue
                            </Button>
                        )}
                        <Button variant="link" size="sm" className="!text-red-500" onClick={() => onSupprimer(notification.id)}>
                            Supprimer
                        </Button>
                    </div>
                </div>
            </div>
        </Alert>
    </div>
  );
};


// --- Page Principale ---
const NotificationsPage: React.FC = () => {
    const [notifications] = useState<Notification[]>(dummyNotifications);

    const marquerCommeLue = () => { /*...*/ };
    const supprimerNotification = () => { /*...*/ };
    const marquerToutCommeLu = () => { /*...*/ };

    const notificationsNonLues = notifications.filter(n => !n.lue);

    return (
        <>
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                            <FiBell className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Mes Notifications</h1>
                            <p className="text-gray-600">Retrouvez ici toutes les alertes et informations importantes.</p>
                        </div>
                    </div>
                     {notificationsNonLues.length > 0 && (
                        <Button variant="secondary" onClick={marquerToutCommeLu} leftIcon={<FiCheckCircle/>}>
                            Marquer tout comme lu ({notificationsNonLues.length})
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <Card>
                        <div className="p-12 text-center text-gray-500">
                            <FiBell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="font-semibold">Boîte de réception vide</h3>
                            <p>Vous n'avez aucune nouvelle notification pour le moment.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications
                            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(notif => (
                                <NotificationItem 
                                    key={notif.id}
                                    notification={notif}
                                    onMarquerCommeLue={marquerCommeLue}
                                    onSupprimer={supprimerNotification}
                                />
                            ))
                        }
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationsPage;