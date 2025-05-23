// src/page/chefDePiste/AffectationPersonnelPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { FiCalendar, FiSave, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- Interfaces ---
interface Employe {
  id: string;
  nomComplet: string;
  role: 'pompiste' | 'caissier' | 'polyvalent'; // Polyvalent peut faire les deux
  estDisponible: boolean; // Pour filtrer ceux qui sont en congé, etc.
}

interface PosteDeTravail {
  id: string; // Ex: "pompe_1_2", "caisse_principale"
  libelle: string; // Ex: "Pompes 1 & 2", "Caisse Principale"
  typeRequis: 'pompiste' | 'caissier'; // Rôle nécessaire pour ce poste
}

interface QuartDefinition {
  id: string; // Ex: "matin_160724"
  libelle: string; // Ex: "Matin (07h-15h)"
  heureDebut: string; // "07:00"
  heureFin: string; // "15:00"
  postesAConfigurer: PosteDeTravail[];
}

interface Affectation {
  quartId: string;
  posteId: string;
  employeId: string | null; // null si personne n'est affecté
}

// --- Données Mock ---
const dummyEmployes: Employe[] = [
  { id: 'emp1', nomComplet: 'Natalya P.', role: 'pompiste', estDisponible: true },
  { id: 'emp2', nomComplet: 'Jean C.', role: 'caissier', estDisponible: true },
  { id: 'emp3', nomComplet: 'Ali K.', role: 'pompiste', estDisponible: true },
  { id: 'emp4', nomComplet: 'Fatima B.', role: 'caissier', estDisponible: false }, // En congé
  { id: 'emp5', nomComplet: 'Moussa D.', role: 'polyvalent', estDisponible: true },
  { id: 'emp6', nomComplet: 'Aisha S.', role: 'pompiste', estDisponible: true },
];

const dummyPostes: PosteDeTravail[] = [
  { id: 'p12', libelle: 'Pompes 1 & 2', typeRequis: 'pompiste' },
  { id: 'p34', libelle: 'Pompes 3 & 4', typeRequis: 'pompiste' },
  { id: 'cp1', libelle: 'Caisse Principale', typeRequis: 'caissier' },
  { id: 'cs1', libelle: 'Caisse Secondaire (si ouverte)', typeRequis: 'caissier' },
];

const getQuartsPourDate = (date: Date): QuartDefinition[] => {
  // Dans une vraie app, ceci viendrait d'une config ou API
  const dateStr = format(date, 'ddMMyy');
  return [
    { id: `matin_${dateStr}`, libelle: 'Matin (07h-15h)', heureDebut: '07:00', heureFin: '15:00', postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2]] },
    { id: `soir_${dateStr}`, libelle: 'Soir (15h-23h)', heureDebut: '15:00', heureFin: '23:00', postesAConfigurer: [dummyPostes[0], dummyPostes[1], dummyPostes[2], dummyPostes[3]] },
    { id: `nuit_${dateStr}`, libelle: 'Nuit (23h-07h)', heureDebut: '23:00', heureFin: '07:00', postesAConfigurer: [dummyPostes[0], dummyPostes[2]] }, // Moins de postes la nuit
  ];
};
// --------------------

const AffectationPersonnelPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [quartsDuJour, setQuartsDuJour] = useState<QuartDefinition[]>([]);
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [personnelDisponible] = useState<Employe[]>(dummyEmployes.filter(e => e.estDisponible));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simuler le chargement des quarts et des affectations existantes pour la date
    const fetchedQuarts = getQuartsPourDate(selectedDate);
    setQuartsDuJour(fetchedQuarts);

    // Simuler des affectations existantes pour le jour (pour démo)
    // Dans une vraie app, vous les chargeriez depuis Directus pour cette date.
    const dateStr = format(selectedDate, 'ddMMyy');
    let existingAffects: Affectation[] = [];
    if (format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) { // Affectations pour aujourd'hui
        existingAffects = [
            { quartId: `matin_${dateStr}`, posteId: 'p12', employeId: 'emp1' },
            { quartId: `matin_${dateStr}`, posteId: 'p34', employeId: 'emp3' },
            { quartId: `matin_${dateStr}`, posteId: 'cp1', employeId: 'emp2' },
            { quartId: `soir_${dateStr}`, posteId: 'p12', employeId: 'emp5' }, // Polyvalent en pompiste
        ];
    }
    // Initialiser les affectations pour tous les postes des quarts du jour (avec null si non affecté)
    const initialAffectations: Affectation[] = [];
    fetchedQuarts.forEach(quart => {
        quart.postesAConfigurer.forEach(poste => {
            const existing = existingAffects.find(a => a.quartId === quart.id && a.posteId === poste.id);
            initialAffectations.push({
                quartId: quart.id,
                posteId: poste.id,
                employeId: existing ? existing.employeId : null,
            });
        });
    });
    setAffectations(initialAffectations);
    setSaveStatus(null);
    setIsLoading(false);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(startOfDay(new Date(e.target.value)));
  };

  const handleAffectationChange = (quartId: string, posteId: string, employeId: string | null) => {
    setAffectations(prev =>
      prev.map(aff =>
        aff.quartId === quartId && aff.posteId === posteId
          ? { ...aff, employeId: employeId === "" ? null : employeId } // Convertir "" en null
          : aff
      )
    );
    setSaveStatus(null);
  };

  const getEmployesCompatiblesPourPoste = (typeRequis: 'pompiste' | 'caissier'): Employe[] => {
    return personnelDisponible.filter(emp => emp.role === typeRequis || emp.role === 'polyvalent');
  };
  
  const handleSaveAffectations = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    console.log("Affectations à sauvegarder:", {
        date: format(selectedDate, 'yyyy-MM-dd'),
        details: affectations.filter(a => a.employeId !== null) // On ne sauvegarde que les affectations réelles
    });
    // TODO: Envoyer à Directus.
    // Logique possible:
    // 1. Supprimer les anciennes affectations pour cette date (ou ce quart).
    // 2. Créer les nouvelles affectations.
    // Ou faire un UPSERT basé sur un ID unique par affectation (quartId + posteId + date).
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaveStatus({ type: 'success', message: 'Affectations enregistrées avec succès !'});
    setIsSaving(false);
  };

  const inputDateValue = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
           Affectation du Personnel aux Quarts
        </h1>
        <div className="flex items-center space-x-2">
            <button onClick={() => setSelectedDate(prev => subDays(prev, 1))} className="p-2 rounded-md hover:bg-gray-100" aria-label="Jour précédent">
                <FiCalendar className="inline-block mr-1"/> Préc.
            </button>
            <input
                type="date"
                value={inputDateValue}
                onChange={handleDateChange}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
            <button onClick={() => setSelectedDate(prev => addDays(prev, 1))} className="p-2 rounded-md hover:bg-gray-100" aria-label="Jour suivant">
                Suiv. <FiCalendar className="inline-block ml-1"/>
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-8">
          {quartsDuJour.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">Aucun quart défini pour le {format(selectedDate, 'eeee dd MMMM yyyy', { locale: fr })}.</p>
            </div>
          )}

          {quartsDuJour.map(quart => (
            <div key={quart.id} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-purple-700 mb-4">
                Quart: {quart.libelle} ({quart.heureDebut} - {quart.heureFin})
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({format(selectedDate, 'eeee dd MMMM yyyy', { locale: fr })})
                </span>
              </h2>
              <div className="space-y-4">
                {quart.postesAConfigurer.map(poste => {
                  const affectationActuelle = affectations.find(
                    a => a.quartId === quart.id && a.posteId === poste.id
                  );
                  const employesPourCePoste = getEmployesCompatiblesPourPoste(poste.typeRequis);

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
                            className="w-full sm:w-56 text-sm pl-3 pr-8 py-2 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer"
                            aria-label={`Affecter à ${poste.libelle}`}
                            disabled={isSaving}
                          >
                            <option value="">-- Non Affecté --</option>
                            {employesPourCePoste.map(emp => (
                              <option key={emp.id} value={emp.id}>
                                {emp.nomComplet} ({emp.role})
                              </option>
                            ))}
                          </select>
                          {affectationActuelle?.employeId && (
                                <button onClick={() => handleAffectationChange(quart.id, poste.id, null)} 
                                    className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50" 
                                    title="Désaffecter"
                                    disabled={isSaving}
                                >
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
            <div className={`mt-6 p-3 rounded-md flex items-center text-sm ${saveStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {saveStatus.message}
            </div>
          )}

          {quartsDuJour.length > 0 && (
             <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                <button
                    onClick={handleSaveAffectations}
                    disabled={isSaving || isLoading}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 min-w-[180px]"
                >
                    {isSaving ? <Spinner size="sm" color="text-white" /> : (
                    <>
                        <FiSave className="-ml-1 mr-2 h-5 w-5" />
                        Enregistrer les Affectations
                    </>
                    )}
                </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AffectationPersonnelPage;