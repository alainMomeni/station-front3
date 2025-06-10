// src/page/gerant/GerantPlansMaintenancePage.tsx (Renommée implicitement en GerantMaintenancePage dans la logique)
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiTool, FiPlusCircle, FiEdit, FiClipboard, FiToggleLeft, FiToggleRight, FiClock } from 'react-icons/fi';
import InterventionFormModal from '../../components/modals/InterventionFormModal'; // Modal existant
import PlanMaintenanceFormModal from '../../components/modals/PlanMaintenanceFormModal'; // NOUVEAU MODAL
import type { InterventionMaintenance, Equipement, StatutIntervention, PlanMaintenance } from '../../types/maintenance';
import { format, parseISO, addMonths } from 'date-fns';

// --- Données Mock Unifiées ---
const dummyEquipements: Equipement[] = [ /* ... comme avant ... */ ];
let dummyInterventions: InterventionMaintenance[] = [ /* ... comme avant ... */ ];
let dummyPlansMaintenance: PlanMaintenance[] = [
  { id: 'PLAN01', nomPlan: 'Nettoyage et Jaugeage Annuel des Cuves', descriptionTaches: 'Vider, nettoyer, inspecter et re-jauger chaque cuve.', ciblesIds: ['CUVE_DIESEL_A'], ciblesNoms: 'Cuve Diesel Principale', frequence: 'annuel', dateDebutCycle: '2025-01-15', prochaineEcheance: '2025-01-15', estActif: true, assigneParDefautA: 'CleanTank Inc.'},
  { id: 'PLAN02', nomPlan: 'Contrôle Mensuel des Extincteurs', descriptionTaches: 'Vérifier la pression, l\'état général et la date de péremption de tous les extincteurs de la station.', ciblesIds: [], ciblesNoms: 'Tous les extincteurs', frequence: 'mensuel', dateDebutCycle: format(addMonths(new Date(),1), 'yyyy-MM-01'), prochaineEcheance: format(addMonths(new Date(),1), 'yyyy-MM-01'), estActif: true },
  { id: 'PLAN03', nomPlan: 'Maintenance Préventive Pompes', descriptionTaches: 'Changement filtres, vérification étalonnage, nettoyage buses.', ciblesIds: ['POMPE_01', 'POMPE_02'], ciblesNoms: 'Pompe N°1 (SP95/Diesel), Pompe N°2 (SP98)', frequence: 'semestriel', dateDebutCycle: '2024-10-01', estActif: false, assigneParDefautA: 'TechniService SARL'}
];
// --------------------

type ActiveMaintenanceTab = 'suivi_interventions' | 'gestion_plans';

const GerantPlansMaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveMaintenanceTab>('suivi_interventions');

  const [, setInterventions] = useState<InterventionMaintenance[]>([]);
  const [plans, setPlans] = useState<PlanMaintenance[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // States pour les modals
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [interventionEnEdition, setInterventionEnEdition] = useState<InterventionMaintenance | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planEnEdition, setPlanEnEdition] = useState<PlanMaintenance | null>(null);
  
  // États des filtres pour l'onglet Interventions
  const [] = useState('');
  const [] = useState<StatutIntervention | ''>('');

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simuler le chargement des deux listes
      setInterventions(dummyInterventions);
      setPlans(dummyPlansMaintenance);
      setIsLoading(false);
    }, 600);
  }, []);
  
  // Memoized lists

  const filteredPlans = useMemo(() => {
      // Pour l'instant, on retourne tous les plans, un filtre pourrait être ajouté
      return plans.sort((a,b) => (a.prochaineEcheance || '').localeCompare(b.prochaineEcheance || ''));
  }, [plans]);

  // Handlers pour modals
  const handleOpenInterventionModal = (intervention?: InterventionMaintenance) => { /* ... (inchangé) ... */ 
      setInterventionEnEdition(intervention || null);
      setShowInterventionModal(true);
  };
  const handleOpenPlanModal = (plan?: PlanMaintenance) => {
    setPlanEnEdition(plan || null);
    setShowPlanModal(true);
  };

  const handleSaveIntervention = async (data: InterventionMaintenance) => { /* ... (inchangé) ... */
      if(interventionEnEdition) { setInterventions(prev => prev.map(i => i.id === data.id ? data : i)); }
      else { setInterventions(prev => [data, ...prev]); }
      setShowInterventionModal(false);
  };
  const handleSavePlan = async (data: PlanMaintenance) => {
    // Simuler la sauvegarde
    console.log("Sauvegarde Plan Maintenance:", data);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (planEnEdition) {
      setPlans(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      setPlans(prev => [data, ...prev]);
    }
    setShowPlanModal(false);
  };

  const togglePlanActif = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? {...p, estActif: !p.estActif} : p));
    // Ajouter un message de confirmation
  };

  // Fonctions de rendu des onglets
  const renderInterventionsTab = () => (
    <>
      {/* ... (Filtres et tableau des interventions, identiques à la version précédente) ... */}
       <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center flex-wrap">
          {/* ... Filtres ici ... */}
       </div>
       <div className="overflow-x-auto">
          {/* ... Table ici ... */}
       </div>
    </>
  );

  const renderPlansTab = () => (
     <div className="overflow-x-auto">
      <p className="text-xs text-gray-500 italic mb-3">Les plans de maintenance actifs généreront automatiquement des tickets d'intervention lorsque leur prochaine échéance approche.</p>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="th-class">Plan de Maintenance</th>
            <th className="th-class hidden lg:table-cell">Équipements Ciblés</th>
            <th className="th-class text-center">Fréquence</th>
            <th className="th-class text-center">Prochaine Échéance</th>
            <th className="th-class text-center">Statut</th>
            <th className="th-class text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {filteredPlans.length > 0 ? filteredPlans.map(p => (
          <tr key={p.id} className="hover:bg-purple-50/20">
            <td className="td-class">
              <div className="font-medium text-gray-900">{p.nomPlan}</div>
              <div className="text-xs text-gray-500 max-w-sm truncate">{p.descriptionTaches}</div>
            </td>
            <td className="td-class max-w-xs truncate hidden lg:table-cell">{p.ciblesNoms}</td>
            <td className="td-class text-center capitalize">{p.frequence}</td>
            <td className="td-class text-center">{p.prochaineEcheance ? format(parseISO(p.prochaineEcheance+'T00:00:00'), 'dd/MM/yyyy') : 'À définir'}</td>
            <td className="td-class text-center">
              <button onClick={() => togglePlanActif(p.id)} title={p.estActif ? 'Désactiver le plan' : 'Activer le plan'}
                      className={`p-1 rounded-full ${p.estActif ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>
                  {p.estActif ? <FiToggleRight size={22}/> : <FiToggleLeft size={22}/>}
              </button>
            </td>
            <td className="td-class text-center whitespace-nowrap">
              <button onClick={() => handleOpenPlanModal(p)} className="text-indigo-600 hover:text-indigo-800 p-1" title="Modifier Plan"><FiEdit size={16}/></button>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={6} className="text-center py-10 text-gray-500 italic">Aucun plan de maintenance configuré.</td></tr>
        )}
        </tbody>
      </table>
     </div>
  );
  

  if(isLoading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg"/></div></DashboardLayout>;

  return (
    <DashboardLayout>
       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          <FiTool className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion de la Maintenance
        </h1>
        <button onClick={() => activeTab === 'suivi_interventions' ? handleOpenInterventionModal() : handleOpenPlanModal()} className="btn-primary-sm inline-flex items-center shrink-0">
          <FiPlusCircle className="mr-2 h-4 w-4"/> {activeTab === 'suivi_interventions' ? 'Nouvelle Intervention' : 'Nouveau Plan'}
        </button>
      </div>

       {/* Onglets */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('suivi_interventions')}
            className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'suivi_interventions' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <FiClock className="mr-1.5 h-4 w-4" /> Suivi des Interventions
          </button>
           <button onClick={() => setActiveTab('gestion_plans')}
            className={`whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-medium text-sm flex items-center ${activeTab === 'gestion_plans' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            <FiClipboard className="mr-1.5 h-4 w-4" /> Plans de Maintenance Préventive
          </button>
        </nav>
      </div>
      
       <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
        {activeTab === 'suivi_interventions' ? renderInterventionsTab() : renderPlansTab()}
      </div>

      <InterventionFormModal /* ...props... */ isOpen={showInterventionModal} onClose={()=>setShowInterventionModal(false)} onSave={handleSaveIntervention} interventionInitial={interventionEnEdition} isCreationMode={!interventionEnEdition} equipementsDisponibles={dummyEquipements} />
      <PlanMaintenanceFormModal isOpen={showPlanModal} onClose={()=>setShowPlanModal(false)} onSave={handleSavePlan} planInitial={planEnEdition} equipementsDisponibles={dummyEquipements}/>
       <style>{`
        .th-class { @apply px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
        .td-class { @apply px-3 py-2.5 whitespace-nowrap text-sm; }
        .btn-primary-sm { @apply inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50; }
      `}</style>
    </DashboardLayout>
  );
};

export default GerantPlansMaintenancePage;