// src/page/gerant/GerantGestionCuvesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiHardDrive, FiPlusCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import CuveFormModal from '../../components/modals/CuveFormModal'; // NOUVEL IMPORT
import type { Cuve, StatutCuve, TypeCarburant } from '../../types/equipements'; // Adapter

// --- Données Mock ---
const dummyTypesCarburant: TypeCarburant[] = [
    {
        id: 'SP95', nom: 'SP95',
        unite: ''
    },
    {
        id: 'DIESEL', nom: 'Diesel',
        unite: ''
    },
    {
        id: 'SP98', nom: 'SP98',
        unite: ''
    },
];
let dummyCuvesData: Cuve[] = [
    { id: 'cuve1', nom: 'Cuve SP95 - Principale', typeCarburantId: 'SP95', capaciteMax: 20000, seuilAlerteBas: 4000, statut: 'operationnelle', niveauActuel: 12500 },
    { id: 'cuve2', nom: 'Cuve Diesel - A', typeCarburantId: 'DIESEL', capaciteMax: 15000, seuilAlerteBas: 3000, statut: 'operationnelle', niveauActuel: 3500 },
    { id: 'cuve3', nom: 'Cuve SP98 - Réserve', typeCarburantId: 'SP98', capaciteMax: 10000, seuilAlerteBas: 2500, statut: 'maintenance' },
];
// --------------------

const GerantGestionCuvesPage: React.FC = () => {
    const [cuves, setCuves] = useState<Cuve[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [isCreationMode, setIsCreationMode] = useState(true);
    const [cuveEnEdition, setCuveEnEdition] = useState<Cuve | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => { // Simuler le chargement
            setCuves(dummyCuvesData.map(c => ({...c, typeCarburantNom: dummyTypesCarburant.find(tc => tc.id === c.typeCarburantId)?.nom || 'Inconnu' })));
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredCuves = useMemo(() => {
        return cuves.filter(c => c.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [cuves, searchTerm]);

    const handleOpenModal = (cuve?: Cuve) => {
        setIsCreationMode(!cuve);
        setCuveEnEdition(cuve || null);
        setShowModal(true);
    };

    const handleSaveCuve = async (cuveData: Cuve) => {
        console.log("Saving cuve:", cuveData);
        await new Promise(r => setTimeout(r, 1000));
        if (isCreationMode) {
            dummyCuvesData = [...dummyCuvesData, cuveData];
        } else {
            dummyCuvesData = dummyCuvesData.map(c => c.id === cuveData.id ? cuveData : c);
        }
        // Re-map pour ajouter le nom du carburant pour l'affichage
        const updatedData = dummyCuvesData.map(c => ({...c, typeCarburantNom: dummyTypesCarburant.find(tc => tc.id === c.typeCarburantId)?.nom || 'Inconnu' }));
        setCuves(updatedData);
        setShowModal(false);
    };

    const handleDeleteCuve = async (cuveId: string) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette cuve ? Assurez-vous qu'elle n'est plus liée à aucune pompe.")) {
            console.log("Deleting cuve:", cuveId);
            await new Promise(r => setTimeout(r, 500));
            dummyCuvesData = dummyCuvesData.filter(c => c.id !== cuveId);
            setCuves(dummyCuvesData);
        }
    };
    
    const getStatutColor = (statut: StatutCuve) => {
        switch(statut) {
            case 'operationnelle': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'hors_service': return 'bg-red-100 text-red-800';
        }
    };
    
    if (isLoading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg"/></div></DashboardLayout>
    
    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                    <FiHardDrive className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion des Cuves de Carburant
                </h1>
                <button onClick={() => handleOpenModal()} className="btn-primary-sm inline-flex items-center shrink-0">
                    <FiPlusCircle className="mr-2 h-4 w-4"/> Ajouter une Cuve
                </button>
            </div>
             <div className="mb-4">
                <input type="text" placeholder="Rechercher une cuve..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} 
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md text-sm" />
            </div>

            <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="th-class">Nom de la Cuve</th>
                                <th className="th-class">Type Carburant</th>
                                <th className="th-class text-right">Capacité Max. (L)</th>
                                <th className="th-class text-right">Seuil Alerte (L)</th>
                                <th className="th-class text-center">Statut</th>
                                <th className="th-class text-center">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                         {filteredCuves.map(cuve => (
                             <tr key={cuve.id} className="hover:bg-purple-50/20 text-sm">
                                <td className="px-3 py-3 font-medium text-gray-800">{cuve.nom}</td>
                                <td className="px-3 py-3">{cuve.typeCarburantNom}</td>
                                <td className="px-3 py-3 text-right">{cuve.capaciteMax.toLocaleString('fr-FR')}</td>
                                <td className="px-3 py-3 text-right text-orange-600">{cuve.seuilAlerteBas.toLocaleString('fr-FR')}</td>
                                <td className="px-3 py-3 text-center">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(cuve.statut)}`}>
                                        {cuve.statut.replace('_',' ')}
                                    </span>
                                </td>
                                 <td className="px-3 py-3 text-center space-x-2 whitespace-nowrap">
                                    <button onClick={() => handleOpenModal(cuve)} className="p-1 text-indigo-600 hover:text-indigo-900" title="Modifier"><FiEdit size={16}/></button>
                                    <button onClick={() => handleDeleteCuve(cuve.id)} className="p-1 text-red-600 hover:text-red-900" title="Supprimer"><FiTrash2 size={16}/></button>
                                </td>
                             </tr>
                         ))}
                          {filteredCuves.length === 0 && !isLoading && (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">Aucune cuve trouvée.</td></tr>
                          )}
                         </tbody>
                     </table>
                </div>
            </div>

             {showModal && (
                <CuveFormModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveCuve}
                    cuveInitiale={cuveEnEdition}
                    isCreationMode={isCreationMode}
                    typesCarburantDisponibles={dummyTypesCarburant}
                />
            )}
            <style>{`
                .th-class {
                    padding: 0.75rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </DashboardLayout>
    );
};
export default GerantGestionCuvesPage;