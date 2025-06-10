// src/page/gerant/GerantGestionPompesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiZap, FiPlusCircle, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import PompeFormModal from '../../components/modals/PompeFormModal'; // NOUVEL IMPORT
import type { Pompe, StatutPompe, PompeRowData } from '../../types/equipements'; // Adapter
import type { TypeCarburant, Cuve } from '../../types/equipements'; // Fichier de types centralisé (supposé)
import { v4 as uuidv4 } from 'uuid';

// --- Données Mock Unifiées (représente les données qui viendraient de la DB) ---
const dummyTypesCarburant: TypeCarburant[] = [ {
    id: 'SP95', nom: 'SP95',
    unite: ''
}, {
    id: 'DIESEL', nom: 'Diesel',
    unite: ''
}, {
    id: 'SP98', nom: 'SP98',
    unite: ''
} ];
const dummyCuves: Cuve[] = [
    { 
        id: 'cuve1', 
        nom: 'Cuve SP95 - Principale', 
        typeCarburantId: 'SP95', 
        capaciteMax: 20000, 
        seuilAlerteBas: 4000,
        statut: 'operationnelle' // Added required statut
    },
    { 
        id: 'cuve2', 
        nom: 'Cuve Diesel - A', 
        typeCarburantId: 'DIESEL', 
        capaciteMax: 15000, 
        seuilAlerteBas: 3000,
        statut: 'operationnelle' // Added required statut
    },
    { 
        id: 'cuve3', 
        nom: 'Cuve SP98 - Réserve', 
        typeCarburantId: 'SP98', 
        capaciteMax: 10000, 
        seuilAlerteBas: 2000,
        statut: 'operationnelle' // Added required statut
    },
];
let dummyPompesData: Pompe[] = [
    { id: 'POMPE-01', nom: 'Pompe N°1 - Piste 1', statut: 'active', distributions: [
        { id: uuidv4(), typeCarburantId: 'SP95', cuveId: 'cuve1'},
        { id: uuidv4(), typeCarburantId: 'DIESEL', cuveId: 'cuve2'},
    ], dateInstallation: '2022-01-15' },
    { id: 'POMPE-02', nom: 'Pompe N°2 - Piste 1', statut: 'active', distributions: [ { id: uuidv4(), typeCarburantId: 'SP98', cuveId: 'cuve3' } ]},
    { id: 'POMPE-03', nom: 'Pompe N°3 - Piste 2', statut: 'en_maintenance', distributions: [ { id: uuidv4(), typeCarburantId: 'DIESEL', cuveId: 'cuve2' } ]},
    { id: 'POMPE-04', nom: 'Pompe N°4 - Piste 2', statut: 'inactive', distributions: [ { id: uuidv4(), typeCarburantId: 'SP95', cuveId: 'cuve1' } ]},
];
// --------------------


const GerantGestionPompesPage: React.FC = () => {
    const [pompes, setPompes] = useState<Pompe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [showModal, setShowModal] = useState(false);
    const [isCreationMode, setIsCreationMode] = useState(true);
    const [pompeEnEdition, setPompeEnEdition] = useState<Pompe | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        setIsLoading(true);
        // Simuler le chargement des pompes, carburants, et cuves
        setTimeout(() => {
            setPompes(dummyPompesData);
            setIsLoading(false);
        }, 500);
    }, []);

    const preparedDataForTable: PompeRowData[] = useMemo(() => {
        return pompes
          .filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(pompe => {
            const carburantsDistribues = pompe.distributions
                .map(d => dummyTypesCarburant.find(tc => tc.id === d.typeCarburantId)?.nom)
                .filter(Boolean)
                .join(', ');
            const cuvesSources = pompe.distributions
                .map(d => dummyCuves.find(c => c.id === d.cuveId)?.nom)
                .filter(Boolean)
                .join(', ');
            // Keep all original Pompe properties and add the display properties
            return {
                ...pompe,
                carburantsDistribues,
                cuvesSources
            } as PompeRowData;
        }).sort((a,b) => a.nom.localeCompare(b.nom));
    }, [pompes, searchTerm]);


    const handleOpenModal = (pompe?: Pompe) => {
        setIsCreationMode(!pompe);
        setPompeEnEdition(pompe || null);
        setShowModal(true);
    };

    const handleSavePompe = async (pompeData: Pompe) => {
        console.log("Saving pompe:", pompeData);
        // Simuler sauvegarde
        await new Promise(r => setTimeout(r, 1000));
        if (isCreationMode) {
            dummyPompesData = [...dummyPompesData, pompeData];
        } else {
            dummyPompesData = dummyPompesData.map(p => p.id === pompeData.id ? pompeData : p);
        }
        setPompes(dummyPompesData);
        setShowModal(false);
    };

    const handleDeletePompe = async (pompeId: string) => {
        if(window.confirm("Voulez-vous vraiment supprimer cette pompe ?")) {
            console.log("Deleting pompe:", pompeId);
            await new Promise(r => setTimeout(r, 500));
            dummyPompesData = dummyPompesData.filter(p => p.id !== pompeId);
            setPompes(dummyPompesData);
        }
    }
    const togglePompeStatut = async (pompe: Pompe) => {
        const nouveauStatut: StatutPompe = pompe.statut === 'active' ? 'inactive' : 'active';
         if(window.confirm(`Voulez-vous vraiment passer la pompe "${pompe.nom}" en statut "${nouveauStatut}" ?`)) {
            console.log(`Updating statut for ${pompe.id} to ${nouveauStatut}`);
            await new Promise(r => setTimeout(r, 500));
            const updatedPompe = {...pompe, statut: nouveauStatut};
            dummyPompesData = dummyPompesData.map(p => p.id === pompe.id ? updatedPompe : p);
            setPompes(dummyPompesData);
        }
    };
    
    const getStatutColor = (statut: StatutPompe) => {
        switch(statut){
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-200 text-gray-700';
            case 'en_maintenance': return 'bg-yellow-100 text-yellow-800';
        }
    };

    const thClass = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
    const tdClass = "px-3 py-2.5 whitespace-nowrap text-sm";
    

    if(isLoading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>
    
    return (
    <DashboardLayout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                <FiZap className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion des Pompes
            </h1>
            <button onClick={() => handleOpenModal()} className="btn-primary-sm inline-flex items-center shrink-0">
                <FiPlusCircle className="mr-2 h-4 w-4"/> Ajouter une Pompe
            </button>
        </div>
        <div className="mb-4">
             <input type="text" placeholder="Rechercher une pompe..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} 
                className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className={thClass}>Pompe</th>
                            <th className={thClass}>Carburant(s) Distribué(s)</th>
                            <th className={thClass}>Cuve(s) Source(s)</th>
                            <th className={thClass + " text-center"}>Statut</th>
                            <th className={thClass + " text-center"}>Actions</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                     {preparedDataForTable.length > 0 ? preparedDataForTable.map(p => (
                         <tr key={p.id} className="hover:bg-purple-50/20">
                             <td className={`${tdClass} font-medium text-gray-800`}>{p.nom}</td>
                             <td className={`${tdClass} text-gray-600`}>{p.carburantsDistribues}</td>
                             <td className={`${tdClass} text-gray-600`}>{p.cuvesSources}</td>
                             <td className={`${tdClass} text-center`}>
                                 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(p.statut)}`}>
                                     {p.statut.replace('_',' ')}
                                </span>
                             </td>
                             <td className={`${tdClass} text-center space-x-2 whitespace-nowrap`}>
                                <button onClick={() => togglePompeStatut(pompes.find(pomp => pomp.id === p.id)!)} title={p.statut === 'active' ? 'Désactiver' : 'Activer'}>
                                   {p.statut === 'active' ? <FiToggleRight className="text-green-500 hover:text-green-700" size={20}/> : <FiToggleLeft className="text-gray-500 hover:text-gray-700" size={20}/>}
                                </button>
                                <button onClick={() => handleOpenModal(pompes.find(pomp => pomp.id === p.id))} className="text-indigo-600 hover:text-indigo-900 p-1" title="Modifier"><FiEdit size={16}/></button>
                                <button onClick={() => handleDeletePompe(p.id)} className="text-red-600 hover:text-red-800 p-1" title="Supprimer"><FiTrash2 size={16}/></button>
                            </td>
                         </tr>
                     )) : (
                         <tr><td colSpan={5} className="text-center py-10 text-gray-500 italic">Aucune pompe trouvée.</td></tr>
                     )}
                    </tbody>
                </table>
            </div>
        </div>

        {showModal && (
            <PompeFormModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSavePompe}
                pompeInitial={pompeEnEdition}
                isCreationMode={isCreationMode}
                typesCarburant={dummyTypesCarburant}
                cuves={dummyCuves}
            />
        )}
        
         <style>{`
            .btn-primary-sm {
                @apply inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50;
            }
            .btn-secondary-sm {
                @apply inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50;
            }
        `}</style>
    </DashboardLayout>
  );
};
export default GerantGestionPompesPage;