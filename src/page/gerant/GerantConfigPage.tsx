// src/page/gerant/GerantComptesUtilisateursPage.tsx (LOGIQUE DE FILTRAGE CORRIGÉE)

// ... (tous les imports et définitions de colonnes restent identiques)
import React, { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiFilter, FiSearch, FiEdit, FiKey } from 'react-icons/fi';
import type { UtilisateurSysteme, RoleType, StatutCompteUtilisateur } from '../../types/personnel';
import { dummyUtilisateursData, rolesPourFiltre, generateNomComplet } from '../../_mockData/personnel';

// Import components
import DashboardLayout from '../../layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import Spinner from '../../components/Spinner';

const GerantConfigPage: React.FC = () => {
    // --- États et Handlers (inchangés) ---
    const [utilisateurs, setUtilisateurs] = useState<UtilisateurSysteme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtreRole, setFiltreRole] = useState<RoleType | ''>('');
    const [filtreStatut, setFiltreStatut] = useState<StatutCompteUtilisateur | ''>('');

    // --- Logique (useEffect corrigé) ---
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const utilisateursInitiaux = dummyUtilisateursData.map(u => ({
                ...u,
                nomComplet: generateNomComplet(u.prenom, u.nom) // On s'assure que `nomComplet` est toujours présent
            }));
            setUtilisateurs(utilisateursInitiaux);
            setIsLoading(false);
        }, 500);
    }, []);

    // ====== LOGIQUE useMemo CORRIGÉE ======
    const filteredUtilisateurs = useMemo(() => {
        // Garde-fou pour s'assurer que `utilisateurs` est un tableau
        if (!Array.isArray(utilisateurs)) return [];

        const lowerCaseSearch = searchTerm.toLowerCase();

        return utilisateurs
            .filter(u => {
                // Filtre par texte de recherche
                const matchSearch = lowerCaseSearch === '' || // Si la recherche est vide, on garde tout
                    (u.nomComplet?.toLowerCase().includes(lowerCaseSearch)) ||
                    (u.prenom?.toLowerCase().includes(lowerCaseSearch)) ||
                    (u.nom?.toLowerCase().includes(lowerCaseSearch)) ||
                    (u.email?.toLowerCase().includes(lowerCaseSearch));
                
                // Filtre par rôle
                const matchRole = !filtreRole || u.roles.includes(filtreRole);

                // Filtre par statut
                const matchStatut = !filtreStatut || u.statutCompte === filtreStatut;

                return matchSearch && matchRole && matchStatut;
            })
            .sort((a, b) => (a.nomComplet || '').localeCompare(b.nomComplet || ''));
    }, [utilisateurs, searchTerm, filtreRole, filtreStatut]);
    // ===================================

    // Add table columns definition
    const tableColumns = useMemo(() => [
            { 
                key: 'user', 
                title: 'Utilisateur',
                align: 'left' as const,
                render: (_: any, user: UtilisateurSysteme) => (
                    <div>
                        <div className="font-medium text-gray-900">{user.nomComplet}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                )
            },
            { 
                key: 'roles', 
                title: 'Rôles',
                align: 'left' as const,
                render: (_: any, user: UtilisateurSysteme) => (
                    <div className="space-x-1">
                        {user.roles.map(role => (
                            <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                {role}
                            </span>
                        ))}
                    </div>
                )
            },
            {
                key: 'status',
                title: 'Statut',
                align: 'center' as const,
                render: (_: any, user: UtilisateurSysteme) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.statutCompte === 'actif' ? 'bg-green-100 text-green-800' :
                        user.statutCompte === 'inactif' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {user.statutCompte.toUpperCase()}
                    </span>
                )
            },
            {
                key: 'actions',
                title: 'Actions',
                align: 'center' as const,
                render: (_: any) => (
                    <div className="flex justify-center space-x-1">
                        <button className="p-1 text-blue-600 hover:text-blue-800" title="Modifier">
                            <FiEdit size={16}/>
                        </button>
                        <button className="p-1 text-purple-600 hover:text-purple-800" title="Réinitialiser mot de passe">
                            <FiKey size={16}/>
                        </button>
                    </div>
                )
            }
        ], []);

    // --- Rendu ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiUsers className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
                            <p className="text-gray-600">Créez, modifiez et gérez les accès de votre équipe.</p>
                        </div>
                    </div>
                </div>

                <Card icon={FiFilter} title="Filtres">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Rechercher" placeholder="Nom, prénom, email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<FiSearch />} />
                        <Select label="Rôle" value={filtreRole} onChange={e => setFiltreRole(e.target.value as RoleType | '')} options={rolesPourFiltre} />
                        <Select label="Statut du compte" value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as StatutCompteUtilisateur | '')} options={[ { value: '', label: 'Tous les statuts' }, { value: 'actif', label: 'Actif' }, { value: 'inactif', label: 'Inactif' }, { value: 'bloque', label: 'Bloqué' } ]}/>
                    </div>
                </Card>

                <Card 
                    title={`Liste des Utilisateurs (${filteredUtilisateurs?.length ?? 0})`} 
                    icon={FiUsers}
                >
                    {isLoading ? (
                         <div className="flex justify-center p-20"><Spinner size="lg" /></div>
                    ) : (
                         <Table<UtilisateurSysteme>
                            columns={tableColumns}
                            data={filteredUtilisateurs}
                            emptyText="Aucun utilisateur ne correspond à vos filtres."
                        />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

// Add default export
export default GerantConfigPage;