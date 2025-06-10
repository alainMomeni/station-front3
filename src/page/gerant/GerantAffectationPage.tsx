// src/page/gerant/GerantAffectationPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiCalendar, FiSave, FiXCircle, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format, addDays, subDays, startOfDay } from 'date-fns';

// --- Interfaces (peuvent être déplacées dans un fichier partagé si nécessaire) ---
interface Employe {
  id: string;
  nomComplet: string;
  role: 'pompiste' | 'caissier' | 'polyvalent' | 'chef_de_piste';
  estDisponible: boolean;
}

interface PosteDeTravail {
  id: string;
  libelle: string;
  typeRequis: 'pompiste' | 'caissier';
}

interface QuartDefinition {
  id: string;
  libelle: string;
  heureDebut: string;
  heureFin: string;
  postesAConfigurer: PosteDeTravail[];
}

interface Affectation {
  quartId: string;
  posteId: string;
  employeId: string | null;
}

// --- Données Mock (simulent ce que votre backend Supabase fournirait) ---
const dummyEmployes: Employe[] = [
  { id: 'emp1', nomComplet: 'Natalya P.', role: 'pompiste', estDisponible: true },
  { id: 'emp2', nomComplet: 'Jean C.', role: 'caissier', estDisponible: true },
  { id: 'emp3', nomComplet: 'Ali K.', role: 'pompiste', estDisponible: true },
  { id: 'emp4', nomComplet: 'Fatima B.', role: 'caissier', estDisponible: false }, // En congé, pour démonstration
  { id: 'emp5', nomComplet: 'Moussa D.', role: 'polyvalent', estDisponible: true },
  { id: 'emp6', nomComplet: 'Aisha S.', role: 'pompiste', estDisponible: true },
  { id: 'emp7', nomComplet: 'Aminata C.', role: 'chef_de_piste', estDisponible: true}, // Gérant peut aussi voir chefs de piste
];

const dummyPostes: PosteDeTravail[] = [
  { id: 'p12', libelle: 'Pompes 1 & 2', typeRequis: 'pompiste' },
  { id: 'p34', libelle: 'Pompes 3 & 4', typeRequis: 'pompiste' },
  { id: 'cp1', libelle: 'Caisse Principale', typeRequis: 'caissier' },
  { id: 'cs1', libelle: 'Caisse Secondaire', typeRequis: 'caissier' },
];

const getQuartsPourDate = (date: Date): QuartDefinition[] => {
  const dateStr = format(date, 'ddMMyy');
  return [
    { id: `matin_${dateStr}`, libelle: 'Matin (07h-15h)', heureDebut: '07:00', heureFin: '15:00', postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2]] },
    { id: `soir_${dateStr}`, libelle: 'Soir (15h-23h)', heureDebut: '15:00', heureFin: '23:00', postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2], dummyPostes[3]] },
    { id: `nuit_${dateStr}`, libelle: 'Nuit (23h-07h)', heureDebut: '23:00', heureFin: '07:00', postesAConfigurer: [dummyPostes[0], dummyPostes[2]] },
  ];
};
// -------------------------------------------------------------------------------------

const GerantAffectationPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartDefinition[]>([]);
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [personnel] = useState<Employe[]>(dummyEmployes);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchedQuarts = getQuartsPourDate(selectedDate);
    setQuartsDuJour(fetchedQuarts);

    // Simuler le chargement d'affectations existantes
    const dateStr = format(selectedDate, 'ddMMyy');
    let existingAffects: Affectation[] = [];
    if (format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        existingAffects = [
            { quartId: `matin_${dateStr}`, posteId: 'p12', employeId: 'emp1' },
            { quartId: `matin_${dateStr}`, posteId: 'cp1', employeId: 'emp2' },
            { quartId: `soir_${dateStr}`, posteId: 'p12', employeId: 'emp5' },
        ];
    }
    const initialAffectations: Affectation[] = [];
    fetchedQuarts.forEach(quart => {
        quart.postesAConfigurer.forEach(poste => {
            const existing = existingAffects.find(a => a.quartId === quart.id && a.posteId === poste.id);
            initialAffectations.push({ quartId: quart.id, posteId: poste.id, employeId: existing ? existing.employeId : null });
        });
    });
    setAffectations(initialAffectations);
    setSaveStatus(null);
    setIsLoading(false);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = startOfDay(new Date(e.target.value));
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
    }
  };

  const handleAffectationChange = (quartId: string, posteId: string, employeId: string | null) => {
    setAffectations(prev =>
      prev.map(aff =>
        (aff.quartId === quartId && aff.posteId === posteId)
          ? { ...aff, employeId: employeId === "" ? null : employeId }
          : aff
      )
    );
    setSaveStatus(null);
  };

  const getEmployesCompatiblesPourPoste = (typeRequis: 'pompiste' | 'caissier'): Employe[] => {
    // Le gérant voit tout le monde, même les non disponibles, pour pouvoir les réassigner si besoin.
    return personnel.filter(emp => emp.role === typeRequis || emp.role === 'polyvalent');
  };
  
  const handleSaveAffectations = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    console.log("Affectations à sauvegarder (Vue Gérant):", {
        date: format(selectedDate, 'yyyy-MM-dd'),
        details: affectations.filter(a => a.employeId !== null)
    });
    // TODO: Logique Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaveStatus({ type: 'success', message: 'Planning des affectations enregistré avec succès !'});
    setIsSaving(false);
  };

  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1 shrink-0">
          <FiCalendar className="inline-block mr-2 mb-1 h-6 w-6" /> Planning & Affectations des Équipes
        </h1>
        <div className="flex items-center space-x-2">
            <button onClick={() => setSelectedDate(prev => subDays(prev, 1))} className="p-2.5 rounded-l-md border border-r-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour précédent" disabled={isSaving || isLoading}>
                <FiChevronLeft className="h-4 w-4"/>
            </button>
            <input type="date" value={inputDateValue} onChange={handleDateChange} disabled={isSaving || isLoading} className="p-2 border-y border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm text-center"/>
            <button onClick={() => setSelectedDate(prev => addDays(prev, 1))} className="p-2.5 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-100 disabled:opacity-50" aria-label="Jour suivant" disabled={isSaving || isLoading}>
                <FiChevronRight className="h-4 w-4"/>
            </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      )}

      {!isLoading && (
        <div className="space-y-8">
          {quartsDuJour.map(quart => (
            <div key={quart.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-purple-700 mb-4">
                Quart: {quart.libelle}
              </h2>
              <div className="space-y-4">
                {quart.postesAConfigurer.map(poste => {
                  const affectationActuelle = affectations.find(a => a.quartId === quart.id && a.posteId === poste.id);
                  const employesCompatibles = getEmployesCompatiblesPourPoste(poste.typeRequis);

                  return (
                    <div key={poste.id} className="p-3 border border-gray-200 rounded-md hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-gray-800 mb-1 sm:mb-0">
                          {poste.libelle} <span className="text-xs text-gray-500">({poste.typeRequis})</span>
                        </p>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                           <select
                            value={affectationActuelle?.employeId || ""}
                            onChange={(e) => handleAffectationChange(quart.id, poste.id, e.target.value || null)}
                            className="w-full sm:w-56 text-sm pl-3 pr-8 py-2 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer bg-white"
                            aria-label={`Affecter à ${poste.libelle}`}
                            disabled={isSaving}
                          >
                            <option value="">-- Non Affecté --</option>
                            {employesCompatibles.map(emp => (
                              <option key={emp.id} value={emp.id} disabled={!emp.estDisponible} className={!emp.estDisponible ? 'text-gray-400' : ''}>
                                {emp.nomComplet} {!emp.estDisponible && '(Indisponible)'}
                              </option>
                            ))}
                          </select>
                          {affectationActuelle?.employeId && (
                                <button onClick={() => handleAffectationChange(quart.id, poste.id, null)} 
                                    className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50" title="Désaffecter" disabled={isSaving}>
                                    <FiXCircle size={16} />
                                </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {saveStatus && (
            <div className={`mt-6 p-3 rounded-md flex items-center text-sm ${saveStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 shrink-0" />
                {saveStatus.message}
            </div>
          )}

          {quartsDuJour.length > 0 && (
             <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                <button onClick={handleSaveAffectations} disabled={isSaving || isLoading} className="btn-primary inline-flex items-center justify-center px-6 py-2.5">
                    {isSaving ? <Spinner size="sm" color="text-white"/> : (
                    <><FiSave className="-ml-1 mr-2 h-5 w-5" /> Enregistrer les Affectations du Jour</>
                    )}
                </button>
            </div>
          )}
        </div>
      )}
      {/* Move these styles to your global CSS file or use a CSS module */}
    </DashboardLayout>
  );
};

export default GerantAffectationPage;