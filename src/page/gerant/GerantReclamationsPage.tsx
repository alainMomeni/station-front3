// src/page/gerant/GerantReclamationsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { 
    FiMessageSquare, FiPlusCircle, FiEdit, FiSearch, FiFilter, FiX, FiAlertCircle
} from 'react-icons/fi';
import type { ReclamationClient, StatutReclamation, TypeReclamation, PrioriteReclamation, ActionReclamation } from '../../types/reclamations'; // Adapter chemin
import ReclamationTraitementModal from '../../components/modals/ReclamationTraitementModal'; // Import du modal
import { format, subDays, startOfMonth, parseISO, subMonths } from 'date-fns'; // parseISO ajouté
import { v4 as uuidv4 } from 'uuid';

// --- Données Mock ---
let dummyReclamationsData: ReclamationClient[] = [
  { id: 'RECL-20240720-001', dateSoumission: subDays(new Date(), 2).toISOString(), nomClient: 'Mme. Aida Thiam', contactClientTelephone: '771112233', typeReclamation: 'qualite_carburant', descriptionDetaillee: 'Mon véhicule a eu des ratés après avoir pris du SP95 hier. Le moteur broute.', priorite: 'haute', statut: 'nouvelle', historiqueActions: [] },
  { id: 'RECL-20240718-002', dateSoumission: subDays(new Date(), 4).toISOString(), clientId: 'CLI001', nomClient: 'Transport Express Plus', contactClientEmail:'compta@transportexpress.com', typeReclamation: 'erreur_paiement', descriptionDetaillee: 'J\'ai été débité deux fois pour la transaction TPE_XYZ du 17/07.', priorite: 'moyenne', statut: 'en_cours', assigneANom: 'Service Compta', historiqueActions: [{id: uuidv4(), dateAction: subDays(new Date(),3).toISOString(), auteurNom:'Gérant Diallo', actionEffectuee:'Transmis à la compta pour vérification TPE.'}]},
  { id: 'RECL-20240715-001', dateSoumission: subDays(new Date(), 7).toISOString(), nomClient: 'Mr. Ousmane Fall', typeReclamation: 'service_client', descriptionDetaillee: 'Le pompiste de la pompe 3 était impoli et n\'a pas voulu vérifier mon niveau d\'huile.', priorite: 'basse', statut: 'resolue', solutionApportee: 'Pompiste rappelé à l\'ordre. Excuses présentées au client par téléphone.', dateCloture: subDays(new Date(), 6).toISOString(), historiqueActions: [{id: uuidv4(), dateAction: subDays(new Date(),6).toISOString(), auteurNom:'Chef de Piste Amina', actionEffectuee:'Discussion avec le pompiste. Client contacté.'}]},
];

const typeReclamationOptions: { value: TypeReclamation | ''; label: string }[] = [
    {value: '', label: 'Tous Types'}, {value: 'qualite_carburant', label: 'Qualité Carburant'},
    {value: 'erreur_paiement', label: 'Erreur de Paiement'}, {value: 'service_client', label: 'Service Client'},
    {value: 'equipement', label: 'Équipement Station'}, {value: 'produit_boutique', label: 'Produit Boutique'},
    {value: 'autre', label: 'Autre'},
];
const statutReclamationOptions: { value: StatutReclamation | ''; label: string }[] = [
    {value: '', label: 'Tous Statuts'}, {value: 'nouvelle', label: 'Nouvelle'},
    {value: 'en_cours', label: 'En Cours'}, {value: 'en_attente_client', label: 'Attente Client'},
    {value: 'resolue', label: 'Résolue'}, {value: 'cloturee', label: 'Clôturée'}, {value: 'rejetee', label: 'Rejetée'},
];
// --------------------


const GerantReclamationsPage: React.FC = () => {
  const [reclamations, setReclamations] = useState<ReclamationClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [reclamationEnTraitement, setReclamationEnTraitement] = useState<ReclamationClient | null>(null);
  const [isCreationModeModal, setIsCreationModeModal] = useState(false);
  const [actionStatus, setActionStatus] = useState<{type:'success'|'error', message:string}|null>(null);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreType, setFiltreType] = useState<TypeReclamation | ''>('');
  const [filtreStatut, setFiltreStatut] = useState<StatutReclamation | ''>('');
  const [filtreDateDebut, setFiltreDateDebut] = useState(format(startOfMonth(subMonths(new Date(),1)), 'yyyy-MM-dd'));
  const [filtreDateFin, setFiltreDateFin] = useState(format(new Date(), 'yyyy-MM-dd'));


  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { 
      setReclamations(dummyReclamationsData.sort((a,b) => parseISO(b.dateSoumission).getTime() - parseISO(a.dateSoumission).getTime()));
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredReclamations = useMemo(() => {
    return reclamations
      .filter(r => 
        (r.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.descriptionDetaillee.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (r.contactClientEmail && r.contactClientEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
         (r.contactClientTelephone && r.contactClientTelephone.includes(searchTerm)))
      )
      .filter(r => filtreType === '' || r.typeReclamation === filtreType)
      .filter(r => filtreStatut === '' || r.statut === filtreStatut)
      .filter(r => {
        const dateR = parseISO(r.dateSoumission);
        const dateDebutOk = !filtreDateDebut || dateR >= parseISO(filtreDateDebut + 'T00:00:00Z');
        const dateFinOk = !filtreDateFin || dateR <= parseISO(filtreDateFin + 'T23:59:59Z');
        return dateDebutOk && dateFinOk;
      });
  }, [reclamations, searchTerm, filtreType, filtreStatut, filtreDateDebut, filtreDateFin]);

  const handleOpenModal = (reclamation?: ReclamationClient, isCreation = false) => {
    setActionStatus(null);
    setReclamationEnTraitement(reclamation || null);
    setIsCreationModeModal(isCreation);
    setShowModal(true);
  };

  const handleSaveReclamation = async (data: ReclamationClient, actionsAAjouter?: ActionReclamation[]) => {
    console.log("Sauvegarde Réclamation:", data, "Actions à ajouter:", actionsAAjouter);
    // Simuler l'attente d'une API
    await new Promise(resolve => setTimeout(resolve, 700)); 
    
    let message = "";
    let nouvellesReclamations = [...reclamations];

    if (isCreationModeModal || !data.id) { // Pour la création
      const nouvelleReclamation: ReclamationClient = { 
        ...data, 
        id: data.id || `RECL-${uuidv4().slice(0,8).toUpperCase()}`, // Assurer un ID si la création ne le fait pas
        dateSoumission: data.dateSoumission || new Date().toISOString(),
        historiqueActions: actionsAAjouter || [],
      };
      nouvellesReclamations = [nouvelleReclamation, ...nouvellesReclamations];
      message = `Réclamation "${nouvelleReclamation.id}" enregistrée.`;
    } else { // Modification
      nouvellesReclamations = nouvellesReclamations.map(r => 
        r.id === data.id 
        ? {...r, ...data, historiqueActions: [...(r.historiqueActions || []), ...(actionsAAjouter || [])] } 
        : r
      );
      message = `Réclamation "${data.id}" mise à jour.`;
    }
    // Mettre à jour l'état React et dummyData pour la persistance de la démo
    dummyReclamationsData = nouvellesReclamations.sort((a,b) => parseISO(b.dateSoumission).getTime() - parseISO(a.dateSoumission).getTime());
    setReclamations(dummyReclamationsData);
    
    setActionStatus({type:'success', message});
    setShowModal(false);
  };
  

  const getStatutColor = (statut: StatutReclamation) => { /* ... (inchangé) ... */ 
     switch(statut) {
        case 'nouvelle': return 'bg-blue-100 text-blue-800';
        case 'en_cours': return 'bg-yellow-100 text-yellow-800';
        case 'en_attente_client': return 'bg-orange-100 text-orange-800';
        case 'resolue': return 'bg-green-100 text-green-800';
        case 'cloturee': return 'bg-gray-100 text-gray-700';
        case 'rejetee': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getPrioriteColor = (priorite: PrioriteReclamation) => { /* ... (inchangé) ... */
     if (priorite === 'haute') return 'text-red-600 font-semibold';
    if (priorite === 'critique') return 'text-red-700 font-bold animate-pulse';
    if (priorite === 'moyenne') return 'text-orange-600';
    return 'text-gray-600';
   };


  const inputClass = "block w-full text-sm border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500";
  const thClass = "px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap";
  const tdClass = "px-3 py-2.5 whitespace-nowrap text-sm";


  return (
    <DashboardLayout>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
                <FiMessageSquare className="inline-block mr-2 mb-1 h-6 w-6" /> Gestion des Réclamations Clients
            </h1>
            <button onClick={() => handleOpenModal(undefined, true)} 
                    className="btn-primary-sm inline-flex items-center shrink-0">
                <FiPlusCircle className="mr-2 h-4 w-4"/> Enregistrer une Réclamation
            </button>
        </div>
        
        {actionStatus && (
             <div className={`p-3 rounded-md mb-4 flex items-center text-sm ${actionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" /> {actionStatus.message}
                 <button onClick={() => setActionStatus(null)} className="ml-auto p-1 text-inherit hover:bg-black/10 rounded-full"> <FiX size={16}/> </button>
            </div>
        )}

        {/* Filtres */}
        <div className="mb-6 bg-white p-3 rounded-md shadow-sm flex flex-col lg:flex-row gap-3 items-center flex-wrap">
            {/* ... (Contenu des filtres - identique à la version précédente) ... */}
            <FiFilter className="h-5 w-5 text-gray-400 shrink-0 hidden lg:block"/>
            <div className="relative flex-grow lg:flex-grow-0 lg:w-52">
                <FiSearch className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`${inputClass} pl-9 w-full`}/>
            </div>
            <input type="date" value={filtreDateDebut} onChange={e => setFiltreDateDebut(e.target.value)} className={`${inputClass} lg:w-auto`}/>
            <input type="date" value={filtreDateFin} onChange={e => setFiltreDateFin(e.target.value)} className={`${inputClass} lg:w-auto`}/>
            <select value={filtreType} onChange={e => setFiltreType(e.target.value as TypeReclamation | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                {typeReclamationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value as StatutReclamation | '')} className={`${inputClass} cursor-pointer lg:w-auto`}>
                {statutReclamationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
      
       <div className="bg-white p-0 md:p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          {/* ... (Contenu du tableau des réclamations - identique à la version précédente) ... */}
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className={thClass}>ID / Date</th>
                    <th className={thClass}>Client / Contact</th>
                    <th className={`${thClass} hidden md:table-cell`}>Type</th>
                    <th className={thClass}>Description (Extrait)</th>
                    <th className={`${thClass} text-center`}>Priorité</th>
                    <th className={`${thClass} text-center`}>Statut</th>
                    <th className={`${thClass} hidden lg:table-cell`}>Assigné à</th>
                    <th className={`${thClass} text-center`}>Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
                <tr><td colSpan={8} className="text-center py-10"><Spinner/></td></tr>
            ): filteredReclamations.length > 0 ? filteredReclamations.map(r => (
                <tr key={r.id} className="hover:bg-purple-50/20">
                    <td className={tdClass}>
                        <div className="font-medium text-gray-800">{r.id}</div>
                        <div className="text-xs text-gray-500">{format(parseISO(r.dateSoumission), 'dd/MM/yy HH:mm')}</div>
                    </td>
                    <td className={tdClass}>
                        <div className="font-medium text-gray-800">{r.nomClient}</div>
                        <div className="text-xs text-gray-500">{r.contactClientTelephone || r.contactClientEmail || ''}</div>
                    </td>
                    <td className={`${tdClass} hidden md:table-cell`}>{typeReclamationOptions.find(t=>t.value === r.typeReclamation)?.label || r.typeReclamation}</td>
                    <td className={`${tdClass} max-w-xs truncate`}>{r.descriptionDetaillee}</td>
                    <td className={`${tdClass} text-center font-medium ${getPrioriteColor(r.priorite)}`}>{r.priorite.toUpperCase()}</td>
                    <td className={`${tdClass} text-center`}>
                        <span className={`px-2 py-0.5 inline-flex text-xxs leading-5 font-semibold rounded-full ${getStatutColor(r.statut)}`}>
                           {statutReclamationOptions.find(s=>s.value === r.statut)?.label || r.statut}
                        </span>
                    </td>
                    <td className={`${tdClass} hidden lg:table-cell`}>{r.assigneANom || '-'}</td>
                    <td className={`${tdClass} text-center whitespace-nowrap`}>
                        <button onClick={() => handleOpenModal(r, false)} className="text-indigo-600 hover:text-indigo-800 p-1" title="Traiter/Voir Détails"><FiEdit size={16}/></button>
                    </td>
                </tr>
            )) : (
                 <tr><td colSpan={8} className="text-center py-10 text-gray-500 italic">Aucune réclamation trouvée.</td></tr>
            )}
            </tbody>
          </table>
        </div>
       </div>

       {showModal && (
           <ReclamationTraitementModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                reclamationInitial={reclamationEnTraitement}
                onSave={handleSaveReclamation}
                isCreationMode={isCreationModeModal}
           />
       )}
    </DashboardLayout>
  );
};

export default GerantReclamationsPage;