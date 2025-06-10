// src/page/gerant/GerantLogsActivitePage.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiShield, FiCalendar, FiUser, FiCode, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { format, parseISO, subDays } from 'date-fns';
import type { LogActivite, LogActionType } from '../../types/logs'; // Adapter


interface UtilisateurSysteme {
    id: string;
    prenom: string;
    nom: string;
}
// --- Données Mock ---
const dummyUtilisateursLog: Pick<UtilisateurSysteme, 'id' | 'prenom' | 'nom'>[] = [
    { id: 'usr_pompiste_natalya', prenom: 'Natalya', nom: 'Pompiste'},
    { id: 'usr_caissier_jean', prenom: 'Jean', nom: 'Caissier'},
    { id: 'usr_cdp_amina', prenom: 'Amina', nom: 'Chef de Piste'},
    { id: 'usr_gerant_diallo', prenom: 'M.', nom: 'Diallo'},
];

const dummyLogsData: LogActivite[] = [
    { id: 101, timestamp_log: new Date().toISOString(), utilisateur_id_log: 'usr_gerant_diallo', action_log: 'LOGIN_SUCCESS', details_log: { ip: '192.168.1.10' }, resultat_action_log: 'succes' },
    { id: 100, timestamp_log: subDays(new Date(), 0).toISOString(), utilisateur_id_log: 'usr_pompiste_natalya', action_log: 'UPDATE', entite_concernee_log: 'ventes', entite_id_concernee_log: 'V-2024-123', details_log: { champ: 'mode_paiement', avant: 'especes', apres: 'carte_bancaire' }, resultat_action_log: 'succes' },
    { id: 99, timestamp_log: subDays(new Date(), 1).toISOString(), utilisateur_id_log: 'usr_gerant_diallo', action_log: 'UPDATE', entite_concernee_log: 'types_carburant', entite_id_concernee_log: 'SP95', details_log: { champ: 'prix_vente_actuel_ttc', avant: 815, apres: 820 }, resultat_action_log: 'succes' },
    { id: 98, timestamp_log: subDays(new Date(), 1).toISOString(), action_log: 'SYSTEM_ACTION', details_log: "Calcul de fin de journée des stocks", resultat_action_log: 'succes' },
    { id: 97, timestamp_log: subDays(new Date(), 2).toISOString(), utilisateur_id_log: 'unknown_user', action_log: 'LOGIN_FAILED', details_log: { ip: '10.0.0.5', email_tentative: 'admin@station.com' }, resultat_action_log: 'echec' },
    { id: 96, timestamp_log: subDays(new Date(), 2).toISOString(), utilisateur_id_log: 'usr_caissier_jean', action_log: 'CREATE', entite_concernee_log: 'produits', entite_id_concernee_log: 'PROD-NEW-456', details_log: { nom: "Nouvelle boisson Energy", prix: 1500 }, resultat_action_log: 'succes' },
];
const logActionTypes: LogActionType[] = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PRICE_CHANGE', 'STOCK_ADJUSTMENT', 'PERMISSION_CHANGE', 'SYSTEM_ACTION'];
// --------------------

const GerantLogsActivitePage: React.FC = () => {
    const [logs, setLogs] = useState<LogActivite[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filtres
    const [dateDebut, setDateDebut] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    const [dateFin, setDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [filtreUtilisateurId, setFiltreUtilisateurId] = useState('');
    const [filtreAction, setFiltreAction] = useState<LogActionType | ''>('');

    useEffect(() => {
        setIsLoading(true);
        // Simuler le fetch avec filtres (normalement passé à l'API)
        console.log("Fetching logs avec filtres:", {dateDebut, dateFin, filtreUtilisateurId, filtreAction});
        setTimeout(() => {
            const enrichedLogs = dummyLogsData.map(log => ({
                ...log,
                utilisateur_nom: dummyUtilisateursLog.find(u => u.id === log.utilisateur_id_log)
                    ? `${dummyUtilisateursLog.find(u => u.id === log.utilisateur_id_log)!.prenom} ${dummyUtilisateursLog.find(u => u.id === log.utilisateur_id_log)!.nom}`
                    : log.utilisateur_id_log || 'Système/Anonyme'
            }));
            setLogs(enrichedLogs);
            setIsLoading(false);
        }, 800);
    }, [dateDebut, dateFin, filtreUtilisateurId, filtreAction]); // Re-fetch quand les filtres changent

    const handleVoirDetailsLog = (log: LogActivite) => {
        alert(`Détails du Log #${log.id}:\n\n` + JSON.stringify(log.details_log, null, 2));
    };

    const thClass = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
    const tdClass = "px-3 py-2.5 whitespace-nowrap text-sm";
    const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";


    return (
        <DashboardLayout>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 mb-6">
                <FiShield className="inline-block mr-2 mb-1 h-6 w-6" /> Journal des Activités (Logs)
            </h1>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                    <div><label className="block text-xs text-gray-600 mb-1"><FiCalendar className="inline mr-1"/>Début</label><input type="date" value={dateDebut} onChange={e=>setDateDebut(e.target.value)} className={inputClass}/></div>
                    <div><label className="block text-xs text-gray-600 mb-1"><FiCalendar className="inline mr-1"/>Fin</label><input type="date" value={dateFin} onChange={e=>setDateFin(e.target.value)} className={inputClass}/></div>
                    <div><label className="block text-xs text-gray-600 mb-1"><FiUser className="inline mr-1"/>Utilisateur</label>
                        <select value={filtreUtilisateurId} onChange={e=>setFiltreUtilisateurId(e.target.value)} className={`${inputClass} cursor-pointer`}>
                            <option value="">Tous les Utilisateurs</option>
                            <option value="SYSTEM">Système</option> {/* Cas spécial pour les actions système */}
                            {dummyUtilisateursLog.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                        </select>
                    </div>
                     <div><label className="block text-xs text-gray-600 mb-1"><FiCode className="inline mr-1"/>Type d'Action</label>
                        <select value={filtreAction} onChange={e=>setFiltreAction(e.target.value as any)} className={`${inputClass} cursor-pointer`}>
                            <option value="">Toutes les Actions</option>
                            {logActionTypes.map(action => <option key={action} value={action}>{action}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className={thClass}>Horodatage</th>
                                <th className={thClass}>Utilisateur</th>
                                <th className={thClass}>Action</th>
                                <th className={`${thClass} hidden md:table-cell`}>Entité Affectée</th>
                                <th className={`${thClass} hidden lg:table-cell`}>ID Entité</th>
                                <th className={`${thClass} text-center`}>Résultat</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                         {isLoading ? (
                            <tr><td colSpan={6} className="text-center py-20"><Spinner/></td></tr>
                         ) : logs.length > 0 ? logs.map(log => (
                            <tr key={log.id} className="hover:bg-purple-50/20 cursor-pointer" onClick={() => handleVoirDetailsLog(log)} title="Voir les détails">
                                <td className={tdClass}>{format(parseISO(log.timestamp_log), 'dd/MM/yy HH:mm:ss')}</td>
                                <td className={`${tdClass} font-medium`}>{log.utilisateur_nom}</td>
                                <td className={tdClass}>
                                    <span className="font-semibold">{log.action_log}</span>
                                </td>
                                <td className={`${tdClass} hidden md:table-cell`}>{log.entite_concernee_log || '-'}</td>
                                <td className={`${tdClass} hidden lg:table-cell text-gray-500`}>{log.entite_id_concernee_log || '-'}</td>
                                <td className={`${tdClass} text-center`}>
                                    {log.resultat_action_log === 'succes' ? 
                                    <FiCheckCircle className="text-green-500 mx-auto" title="Succès"/> :
                                    <FiXCircle className="text-red-500 mx-auto" title="Échec"/>
                                    }
                                </td>
                            </tr>
                         )) : (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Aucun log ne correspond aux filtres.</td></tr>
                         )}
                         </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination si la liste des logs est très longue (essentiel) */}
        </DashboardLayout>
    );
};

export default GerantLogsActivitePage;