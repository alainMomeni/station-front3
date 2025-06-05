// src/page/gerant/GerantComptesUtilisateursPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiUsers, FiPlusCircle, FiEdit, FiKey, FiToggleLeft, FiToggleRight, FiSearch, FiFilter, FiAlertCircle, FiX } from 'react-icons/fi';
import type { UtilisateurSysteme, RoleType, StatutCompteUtilisateur } from '../../types/personnel'; // Adapter chemin
import UtilisateurFormModal from '../../components/modals/UtilisateurFormModal'; // Import du modal
import { menuConfig } from '../../config/menuConfig'; // Pour les labels de rôles
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// --- Données Mock ---
// Réutiliser rolesDisponibles de UtilisateurFormModal ou le définir ici aussi si besoin pour filtres
const rolesPourFiltre: { value: RoleType | ''; label: string }[] = [
    { value: '', label: 'Tous les Rôles'},
    ...Object.keys(menuConfig).map(roleKey => ({
        value: roleKey as RoleType,
        label: roleKey.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }))
];

// Fonction utilitaire pour générer le nom complet
const generateNomComplet = (prenom: string, nom: string): string => {
    return `${prenom} ${nom}`;
};

let dummyUtilisateursData: UtilisateurSysteme[] = [ // `let` pour pouvoir modifier/supprimer pour la démo
  { 
    id: uuidv4(), 
    prenom: 'Natalya', 
    nom: 'Pompiste', 
    email: 'natalya@station.com', 
    roles: ['pompiste'], 
    statutCompte: 'actif', 
    derniereConnexion: new Date(Date.now() - 86400000 * 1).toISOString(), 
    dateCreation: new Date(Date.now() - 86400000 * 30).toISOString(),
    nomComplet: generateNomComplet('Natalya', 'Pompiste')
  },
  { 
    id: uuidv4(), 
    prenom: 'Jean', 
    nom: 'Caissier', 
    email: 'jean.c@station.com', 
    roles: ['caissier'], 
    statutCompte: 'actif', 
    derniereConnexion: new Date(Date.now() - 3600000 * 5).toISOString(), 
    dateCreation: new Date(Date.now() - 86400000 * 60).toISOString(),
    nomComplet: generateNomComplet('Jean', 'Caissier')
  },
  { 
    id: uuidv4(), 
    prenom: 'Amina', 
    nom: 'ChefDePiste', 
    email: 'amina.cdp@station.com', 
    roles: ['chef_de_piste'], 
    statutCompte: 'actif', 
    dateCreation: new Date(Date.now() - 86400000 * 10).toISOString(),
    nomComplet: generateNomComplet('Amina', 'ChefDePiste')
  },
  { 
    id: uuidv4(), 
    prenom: 'Moussa', 
    nom: 'Polyvalent', 
    email: 'moussa.d@station.com', 
    roles: ['pompiste', 'caissier'], 
    statutCompte: 'inactif', 
    dateCreation: new Date(Date.now() - 86400000 * 5).toISOString(),
    nomComplet: generateNomComplet('Moussa', 'Polyvalent')
  },
  { 
    id: 'gerant_admin_001', 
    prenom: 'M.', 
    nom: 'Diallo (Admin)', 
    email: 'gerant@station.com', 
    roles: ['gerant'], 
    statutCompte: 'actif', 
    derniereConnexion: new Date().toISOString(), 
    dateCreation: new Date(Date.now() - 86400000 * 100).toISOString(),
    nomComplet: generateNomComplet('M.', 'Diallo (Admin)')
  },
];
// --------------------

const GerantComptesUtilisateursPage: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurSysteme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isCreationModeModal, setIsCreationModeModal] = useState(true);
  const [utilisateurEnEdition, setUtilisateurEnEdition] = useState<UtilisateurSysteme | null>(null);
  const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreRole, setFiltreRole] = useState<RoleType | ''>('');
  const [filtreStatut, setFiltreStatut] = useState<StatutCompteUtilisateur | ''>('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simuler le chargement
      setUtilisateurs(dummyUtilisateursData.map(u => ({
        ...u, 
        nomComplet: u.nomComplet || generateNomComplet(u.prenom, u.nom)
      })));
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredUtilisateurs = useMemo(() => {
    return utilisateurs
      .filter(u => 
        (u.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (u.nomComplet && u.nomComplet.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .filter(u => filtreRole === '' || u.roles.includes(filtreRole))
      .filter(u => filtreStatut === '' || u.statutCompte === filtreStatut)
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, [utilisateurs, searchTerm, filtreRole, filtreStatut]);
  
  const handleOpenModalForCreate = () => {
    setActionStatus(null);
    setIsCreationModeModal(true);
    setUtilisateurEnEdition(null);
    setShowModal(true);
  };
  
  const handleOpenModalForEdit = (user: UtilisateurSysteme) => {
    setActionStatus(null);
    setIsCreationModeModal(false);
    setUtilisateurEnEdition(user);
    setShowModal(true);
  };

  const handleSaveUtilisateur = async (userData: UtilisateurSysteme, motDePasse?: string) => {
    // TODO: Appel API Directus pour créer ou mettre à jour l'utilisateur.
    // Gérer la création/mise à jour du mot de passe via l'API /users de Directus.
    console.log("Sauvegarde Utilisateur:", userData, "Avec MDP (si fourni):", motDePasse ? "****" : "Non changé/défini");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler latence

    if (isCreationModeModal) {
      const nouvelUtilisateur: UtilisateurSysteme = { 
        ...userData, 
        id: uuidv4(), 
        dateCreation: new Date().toISOString(), 
        nomComplet: generateNomComplet(userData.prenom, userData.nom)
      };
      dummyUtilisateursData = [nouvelUtilisateur, ...dummyUtilisateursData]; // Maj la source mock
      setUtilisateurs(prev => [nouvelUtilisateur, ...prev].map(u => ({
        ...u, 
        nomComplet: u.nomComplet || generateNomComplet(u.prenom, u.nom)
      })));
      setActionStatus({type: 'success', message: `Utilisateur ${nouvelUtilisateur.nomComplet} créé avec succès.`});
    } else if (utilisateurEnEdition) {
      const updatedUser: UtilisateurSysteme = {
        ...utilisateurEnEdition, 
        ...userData, 
        nomComplet: generateNomComplet(userData.prenom, userData.nom)
      };
      dummyUtilisateursData = dummyUtilisateursData.map(u => u.id === updatedUser.id ? updatedUser : u); // Maj la source mock
      setUtilisateurs(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u).map(u => ({
        ...u, 
        nomComplet: u.nomComplet || generateNomComplet(u.prenom, u.nom)
      })));
      setActionStatus({type: 'success', message: `Utilisateur ${updatedUser.nomComplet} mis à jour.`});
    }
    setShowModal(false);
  };

  const handleToggleStatutCompte = async (user: UtilisateurSysteme) => {
    const nouveauStatut = user.statutCompte === 'actif' ? 'inactif' : 'actif';
    const nomComplet = user.nomComplet || generateNomComplet(user.prenom, user.nom);
    
    if (window.confirm(`Voulez-vous vraiment ${nouveauStatut === 'actif' ? 'activer' : 'désactiver'} le compte de ${nomComplet} ?`)) {
        console.log(`Toggle statut pour ${user.id} à ${nouveauStatut}`);
        // TODO: API Call pour patcher le statut de l'utilisateur
        await new Promise(resolve => setTimeout(resolve, 500));
        dummyUtilisateursData = dummyUtilisateursData.map(u => u.id === user.id ? {...u, statutCompte: nouveauStatut} : u);
        setUtilisateurs(prev => prev.map(u => u.id === user.id ? {...u, statutCompte: nouveauStatut} : u));
        setActionStatus({type: 'success', message: `Compte de ${nomComplet} ${nouveauStatut === 'actif' ? 'activé' : 'désactivé'}.`});
    }
  };

  const handleResetPassword = async (user: UtilisateurSysteme) => {
    const nomComplet = user.nomComplet || generateNomComplet(user.prenom, user.nom);
    
    if(window.confirm(`Réinitialiser le mot de passe pour ${nomComplet} ? Un nouveau mot de passe temporaire sera généré/envoyé (simulation).`)){
        console.log(`Reset MDP pour ${user.email}`);
        // TODO: Appel API Directus pour initier la réinitialisation de mot de passe (POST /auth/password/request)
        // Ou si l'admin définit un MDP temporaire: PATCH /users/:id avec le nouveau mot de passe hashé
        await new Promise(resolve => setTimeout(resolve, 500));
        setActionStatus({type: 'success', message: `Procédure de réinitialisation du mot de passe initiée pour ${nomComplet}.`});
    }
  };

  const getRoleLabels = (roles: RoleType[]): string => {
    return roles.map(roleKey => 
        rolesPourFiltre.find(r => r.value === roleKey)?.label || roleKey
    ).join(', ');
  };
  
  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  const thClass = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap";

  return (
    <DashboardLayout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                <FiUsers className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion des Comptes Utilisateurs
            </h1>
            <button onClick={handleOpenModalForCreate} className="btn-primary-sm inline-flex items-center shrink-0">
                <FiPlusCircle className="mr-2 h-4 w-4"/> Créer Utilisateur
            </button>
        </div>
        
        {actionStatus && (
            <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {actionStatus.message}
                <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"><FiX size={16}/></button>
            </div>
        )}

        {/* Filtres */}
        <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col lg:flex-row gap-3 items-center flex-wrap">
            <FiFilter className="h-5 w-5 text-gray-400 shrink-0 hidden lg:block"/>
            <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" placeholder="Rechercher (nom, email...)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputClass} pl-9 w-full`}/>
            </div>
            <select value={filtreRole} onChange={e => setFiltreRole(e.target.value as RoleType | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                 {rolesPourFiltre.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as StatutCompteUtilisateur | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                <option value="">Tous les Statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="bloque">Bloqué</option>
            </select>
        </div>

        <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className={thClass}>Nom Complet</th>
                            <th className={thClass + " hidden sm:table-cell"}>Email (Identifiant)</th>
                            <th className={thClass}>Rôle(s)</th>
                            <th className={thClass + " text-center"}>Statut Compte</th>
                            <th className={thClass + " hidden md:table-cell"}>Dern. Connexion</th>
                            <th className={thClass + " text-center"}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr><td colSpan={6} className="text-center py-10"><Spinner /></td></tr>
                    ) : filteredUtilisateurs.length > 0 ? filteredUtilisateurs.map(user => {
                        const nomCompletAffiche = user.nomComplet || generateNomComplet(user.prenom, user.nom);
                        return (
                        <tr key={user.id} className="hover:bg-purple-50/20">
                            <td className="px-3 py-2.5 whitespace-nowrap font-medium text-gray-800">{nomCompletAffiche}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-gray-500 hidden sm:table-cell">{user.email}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-gray-500 text-xs">{getRoleLabels(user.roles)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center">
                                <button onClick={() => handleToggleStatutCompte(user)} 
                                    className={`p-1 rounded-full ${user.statutCompte === 'actif' ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                                    title={user.statutCompte === 'actif' ? 'Désactiver le compte' : 'Activer le compte'}>
                                    {user.statutCompte === 'actif' ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                                </button>
                                <span className="ml-1 text-xxs align-middle">{user.statutCompte.toUpperCase()}</span>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-gray-500 hidden md:table-cell">
                                {user.derniereConnexion ? format(new Date(user.derniereConnexion), 'dd/MM/yy HH:mm') : 'Jamais'}
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap text-center text-xs space-x-2">
                                <button onClick={() => handleOpenModalForEdit(user)} className="text-indigo-600 hover:text-indigo-800" title="Modifier Utilisateur"><FiEdit size={16}/></button>
                                <button onClick={() => handleResetPassword(user)} className="text-orange-500 hover:text-orange-700" title="Réinitialiser Mot de Passe"><FiKey size={16}/></button>
                                {/* Suppression à gérer avec précaution, surtout si des données sont liées */}
                            </td>
                        </tr>
                        );
                    }) : (
                         <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Aucun utilisateur trouvé ou ne correspond aux filtres.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
             {/* TODO: Pagination si la liste est longue */}
        </div>
        
        {showModal && (
            <UtilisateurFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveUtilisateur}
                utilisateurInitial={utilisateurEnEdition}
                isCreationMode={isCreationModeModal}
            />
        )}
    </DashboardLayout>
  );
};

export default GerantComptesUtilisateursPage;