import React, { useState } from 'react';
import { FiBell, FiTrash2, FiEye, FiCheckCircle, FiInfo, FiAlertTriangle as FiAlertTriangleIcon } from 'react-icons/fi'; // Renamed one FiAlertTriangle for clarity if needed elsewhere

interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  type?: 'info' | 'alerte' | 'succes';
}

const dummyNotifications: Notification[] = [
  { id: 'n1', titre: 'Maintenance programmée', message: 'Une maintenance du système est prévue ce soir à 23h00.', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), lue: false, type: 'info' },
  { id: 'n2', titre: 'Niveau cuve Diesel bas', message: 'Le niveau de la cuve Diesel A est inférieur au seuil de sécurité.', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), lue: false, type: 'alerte' },
  { id: 'n3', titre: 'Rapport de ventes généré', message: 'Votre rapport de ventes hebdomadaire est disponible.', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), lue: true, type: 'succes' },
  { id: 'n4', titre: 'Nouvelle fonctionnalité', message: 'Découvrez la nouvelle interface pour la gestion des carburants !', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), lue: true, type: 'info' },
  { id: 'n5', titre: 'Demande de congé approuvée', message: 'Votre demande de congé du 10/08 au 15/08 a été approuvée.', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), lue: false, type: 'succes'},
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const marquerCommeLue = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, lue: true } : notif))
    );
  };

  const supprimerNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const marquerToutCommeLu = () => {
    setNotifications(prev => prev.map(n => ({...n, lue: true})));
  };

  const getNotificationTypeProps = (type?: Notification['type'], lue?: boolean) => {
    let icon = <FiBell className="h-5 w-5 text-gray-500" />;
    let baseBg = lue ? 'bg-white hover:bg-gray-50' : 'bg-purple-50 hover:bg-purple-100';
    let borderColor = 'border-gray-200';
    let titleColor = lue ? 'text-gray-700' : 'text-purple-700';

    if (!lue) {
        switch (type) {
            case 'info':   icon = <FiInfo className="h-5 w-5 text-blue-500" />; borderColor = 'border-blue-400'; baseBg = 'bg-blue-50 hover:bg-blue-100'; titleColor = 'text-blue-700'; break;
            case 'alerte': icon = <FiAlertTriangleIcon className="h-5 w-5 text-red-500" />; borderColor = 'border-red-400'; baseBg = 'bg-red-50 hover:bg-red-100'; titleColor = 'text-red-700'; break;
            case 'succes': icon = <FiCheckCircle className="h-5 w-5 text-green-500" />; borderColor = 'border-green-400'; baseBg = 'bg-green-50 hover:bg-green-100'; titleColor = 'text-green-700'; break;
            default:       icon = <FiBell className="h-5 w-5 text-purple-500" />; borderColor = 'border-purple-400';
        }
    } else { // For read notifications, use generic icons but distinct border for type
        switch (type) {
            case 'info':   borderColor = 'border-blue-300'; icon = <FiInfo className="h-5 w-5 text-gray-400" />; break;
            case 'alerte': borderColor = 'border-red-300'; icon = <FiAlertTriangleIcon className="h-5 w-5 text-gray-400" />; break;
            case 'succes': borderColor = 'border-green-300'; icon = <FiCheckCircle className="h-5 w-5 text-gray-400" />; break;
            default: icon = <FiBell className="h-5 w-5 text-gray-400" />;
        }
    }
    return { icon, bg: baseBg, border: `border-l-4 ${borderColor}`, titleColor };
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
          Mes Notifications
        </h1>
        {notifications.some(n => !n.lue) && (
            <button
              onClick={marquerToutCommeLu}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
                Tout marquer comme lu
            </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center py-12">
          <FiBell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Vous n'avez aucune notification.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(notif => {
            const {icon, bg, border, titleColor} = getNotificationTypeProps(notif.type, notif.lue);
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-md shadow-sm flex items-start space-x-3 transition-all ${bg} ${border}`}
              >
                <span className="flex-shrink-0 mt-0.5">{icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-semibold ${titleColor}`}>{notif.titre}</h3>
                    <time className={`text-xs ${notif.lue ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(notif.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short'})} à {new Date(notif.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'})}
                    </time>
                  </div>
                  <p className={`text-sm mt-1 ${notif.lue ? 'text-gray-500' : 'text-gray-700'}`}>{notif.message}</p>
                  <div className="mt-2 flex items-center space-x-3">
                    {!notif.lue && (
                      <button
                        onClick={() => marquerCommeLue(notif.id)}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium inline-flex items-center"
                      >
                        <FiEye className="mr-1 h-3 w-3" /> Marquer comme lue
                      </button>
                    )}
                    <button
                      onClick={() => supprimerNotification(notif.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center"
                    >
                      <FiTrash2 className="mr-1 h-3 w-3" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NotificationsPage;