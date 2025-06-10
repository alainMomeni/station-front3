// src/page/gerant/GerantPlansMaintenancePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiTool, FiPlusCircle, FiEdit, FiSearch, FiFilter } from 'react-icons/fi';
import InterventionFormModal from '../../components/modals/InterventionFormModal'; // Import du modal
import type { InterventionMaintenance, Equipement, StatutIntervention } from '../../types/maintenance'; // Adapter chemin
import { format, parseISO, subDays } from 'date-fns';

// --- Données Mock ---
const dummyEquipements: Equipement[] = [
    { id: 'POMPE_01', nom: 'Pompe N°1 (SP95/Diesel)', categorie: 'Pompe'},
    { id: 'POMPE_02', nom: 'Pompe N°2 (SP98)', categorie: 'Pompe'},
    { id: 'CUVE_DIESEL_A', nom: 'Cuve Diesel Principale', categorie: 'Cuve'},
    { id: 'TPE_CAISSE_1', nom: 'Terminal de Paiement (Caisse 1)', categorie: 'TPE'},
];
let dummyInterventions: InterventionMaintenance[] = [
  { id: 'T2024-001', dateCreation: subDays(new Date(), 5).toISOString(), equipementId: 'POMPE_01', equipementNom: 'Pompe N°1', typeIntervention: 'curative', descriptionProblemeTache: 'Le pistolet SP95 ne s\'arrête plus automatiquement (problème de retour de vapeur).', priorite: 'haute', statut: 'terminee', assigneA: 'Technicien Ali', dateInterventionReelle: subDays(new Date(), 4).toISOString(), coutReel: 75000, rapportIntervention:'Remplacement du système de retour de vapeur. Testé OK.'},
  { id: 'T2024-002', dateCreation: subDays(new Date(), 2).toISOString(), equipementId: 'CUVE_DIESEL_A', equipementNom: 'Cuve Diesel Principale', typeIntervention: 'preventive', descriptionProblemeTache: 'Nettoyage et jaugeage annuel de la cuve.', priorite: 'moyenne', statut: 'en_cours', assigneA: 'CleanTank Inc.', dateInterventionPrevue: new Date().toISOString()},
  { id: 'T2024-003', dateCreation: new Date().toISOString(), equipementId: 'TPE_CAISSE_1', equipementNom: 'TPE (Caisse 1)', typeIntervention: 'curative', descriptionProblemeTache: 'Le TPE ne lit plus les cartes sans contact.', priorite: 'urgente', statut: 'planifiee', assigneA: 'Service Monétique', dateInterventionPrevue: new Date().toISOString()},
];
// --------------------


const GerantMaintenancePage: React.FC = () => {
  const [interventions, setInterventions] = useState<InterventionMaintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [interventionEnEdition, setInterventionEnEdition] = useState<InterventionMaintenance | null>(null);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<StatutIntervention | ''>('');
  
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simuler le chargement
      setInterventions(dummyInterventions);
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredInterventions = useMemo(() => {
    return interventions
      .filter(i => 
        i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.equipementNom && i.equipementNom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        i.descriptionProblemeTache.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(i => filtreStatut === '' || i.statut === filtreStatut)
      .sort((a,b) => parseISO(b.dateCreation).getTime() - parseISO(a.dateCreation).getTime());
  }, [interventions, searchTerm, filtreStatut]);

  const handleOpenModal = (intervention?: InterventionMaintenance) => {
    setInterventionEnEdition(intervention || null);
    setShowModal(true);
  };
  
  const handleSaveIntervention = async (data: InterventionMaintenance) => {
      // Simulation sauvegarde
      console.log("Sauvegarde intervention:", data);
      await new Promise(resolve => setTimeout(resolve, 500));
      if(interventionEnEdition) { // Modification
          setInterventions(prev => prev.map(i => i.id === data.id ? data : i));
      } else { // Création
          setInterventions(prev => [data, ...prev]);
      }
      setShowModal(false);
      // setActionStatus(...)
  };

  const getStatutColor = (statut: StatutIntervention) => {
    switch(statut) {
        case 'planifiee': return 'bg-blue-100 text-blue-800';
        case 'en_cours': return 'bg-yellow-100 text-yellow-800';
        case 'terminee': return 'bg-green-100 text-green-800';
        case 'annulee': return 'bg-gray-100 text-gray-700';
        case 'en_attente_pieces': return 'bg-orange-100 text-orange-800';
        default: return '';
    }
  };

  if(isLoading) return <DashboardLayout><Spinner size="lg" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          <FiTool className="inline-block mr-2 mb-1 h-6 w-6" /> Suivi des Interventions de Maintenance
        </h1>
        <button onClick={() => handleOpenModal()} className="btn-primary-sm inline-flex items-center shrink-0">
          <FiPlusCircle className="mr-2 h-4 w-4"/> Nouvelle Intervention
        </button>
      </div>
       {/* Pour V2: Onglets entre "Suivi Interventions" et "Gestion des Plans" */}

      <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col sm:flex-row gap-3 items-center flex-wrap">
          <FiFilter className="h-5 w-5 text-gray-400 shrink-0 hidden sm:block"/>
           <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" placeholder="Rechercher (ID, équipement...)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full text-sm pl-9 pr-3 py-2 border rounded-md"/>
            </div>
             <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as any)} className="w-full sm:w-auto text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 cursor-pointer flex-grow sm:flex-grow-0">
                <option value="">Tous les Statuts</option>
                <option value="planifiee">Planifiée</option>
                <option value="en_cours">En Cours</option>
                <option value="terminee">Terminée</option>
            </select>
      </div>

       <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="th-class">Ticket / Date</th>
                    <th className="th-class">Équipement</th>
                    <th className="th-class">Type</th>
                    <th className="th-class hidden md:table-cell">Description (Extrait)</th>
                    <th className="th-class text-center">Statut</th>
                    <th className="th-class text-center">Actions</th>
                </tr>
            </thead>
             <tbody className="bg-white divide-y divide-gray-200">
             {filteredInterventions.length > 0 ? filteredInterventions.map(i => (
                <tr key={i.id} className="hover:bg-purple-50/20">
                    <td className="td-class">
                        <div className="font-semibold text-purple-700">{i.id}</div>
                        <div className="text-xs text-gray-500">{format(parseISO(i.dateCreation), 'dd/MM/yy HH:mm')}</div>
                    </td>
                    <td className="td-class">{i.equipementNom}</td>
                    <td className="td-class">
                        <span className={`px-2 py-0.5 inline-flex text-xxs font-semibold rounded-full ${i.typeIntervention === 'curative' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                           {i.typeIntervention === 'curative' ? 'Curative' : 'Préventive'}
                        </span>
                    </td>
                    <td className="td-class max-w-sm truncate hidden md:table-cell">{i.descriptionProblemeTache}</td>
                    <td className="td-class text-center">
                        <span className={`px-2 py-0.5 inline-flex text-xxs font-semibold rounded-full ${getStatutColor(i.statut)}`}>
                            {i.statut.replace('_',' ').toUpperCase()}
                        </span>
                    </td>
                     <td className="td-class text-center">
                        <button onClick={() => handleOpenModal(i)} className="text-indigo-600 hover:text-indigo-800" title="Traiter / Voir détails"><FiEdit size={16}/></button>
                    </td>
                </tr>
             )):(
                <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Aucune intervention ne correspond aux critères.</td></tr>
             )}
            </tbody>
          </table>
        </div>
      </div>

      <InterventionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveIntervention}
        interventionInitial={interventionEnEdition}
        isCreationMode={!interventionEnEdition}
        equipementsDisponibles={dummyEquipements}
      />
       <style>
        {`
        .th-class { @apply px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
        .td-class { @apply px-3 py-2.5 whitespace-nowrap text-sm; }
        .btn-primary-sm { @apply inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50; }
        `}
      </style>
    </DashboardLayout>
  );
};

export default GerantMaintenancePage;