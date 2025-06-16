// src/page/chefDePiste/SuiviPresencesPage.tsx (FINAL, CORRIGÉ & COHÉRENT)
import React, { useState, useEffect, useMemo } from 'react';
import { FiUserCheck, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format, startOfDay, addDays, subDays, parseISO } from 'date-fns';

// Types, Mocks et Composants
import type { SuiviPresenceEmploye, StatutPresence } from '../../types/personnel';
import { generateDummyQuartsPourDate, fetchPersonnelAffecteEtPresence } from '../../_mockData/presences';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Textarea } from '../../components/ui/Textarea';

// Assurez-vous d'importer le badge si vous l'avez créé
// import StatutPresenceBadge from '../../components/personnel/StatutPresenceBadge';

const statutPresenceOptions: { value: StatutPresence; label: string }[] = [
    { value: 'non_defini', label: '-- Sélectionner --' }, { value: 'present', label: 'Présent(e)' },
    { value: 'retard', label: 'En Retard' }, { value: 'absent_justifie', label: 'Absent(e) (Justifié)' },
    { value: 'absent_non_justifie', label: 'Absent(e) (Non Justifié)' },
];


// --- Sous-composant pour un bloc de saisie ---
const PresenceSaisieCard: React.FC<{
  employe: SuiviPresenceEmploye;
  onPresenceChange: (employeId: string, field: keyof SuiviPresenceEmploye, value: string) => void;
  isReadOnly: boolean;
}> = ({ employe, onPresenceChange, isReadOnly }) => {
  return (
    // La card individuelle pour chaque employé n'a pas besoin de titre, c'est comme une ligne de formulaire riche.
    // La correction concerne les Card principales qui structurent la page.
    <Card> 
      <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b">
        <div>
          <h3 className="font-semibold text-purple-800">{employe.nomComplet}</h3>
          <p className="text-xs text-gray-500">{employe.posteLibelle} ({employe.rolePrevU})</p>
        </div>
        <div className="w-full sm:w-56">
          <Select 
            value={employe.statut}
            onChange={(e) => onPresenceChange(employe.id, 'statut', e.target.value as StatutPresence)}
            options={statutPresenceOptions}
            disabled={isReadOnly}
          />
        </div>
      </div>
      {(employe.statut === 'present' || employe.statut === 'retard' || employe.statut.startsWith('absent_')) && (
        <div className="p-4 space-y-4">
          {(employe.statut === 'present' || employe.statut === 'retard') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Heure Arrivée" type="time" value={employe.heureArriveeReelle || ''} onChange={e => onPresenceChange(employe.id, 'heureArriveeReelle', e.target.value)} disabled={isReadOnly} />
                <Input label="Heure Départ" type="time" value={employe.heureDepartReelle || ''} onChange={e => onPresenceChange(employe.id, 'heureDepartReelle', e.target.value)} disabled={isReadOnly} />
            </div>
          )}
          {(employe.statut.startsWith('absent_') || employe.statut === 'retard') && (
             <Textarea label="Motif / Justification" value={employe.motifAbsenceRetard || ''} onChange={e => onPresenceChange(employe.id, 'motifAbsenceRetard', e.target.value)} disabled={isReadOnly} placeholder="Préciser le motif..." rows={2}/>
          )}
        </div>
      )}
    </Card>
  );
};


// --- Page Principale ---
const SuiviPresencesPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [quartActifId, setQuartActifId] = useState<string | null>(null);
    const [personnelPresence, setPersonnelPresence] = useState<SuiviPresenceEmploye[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const quartsDuJour = useMemo(() => generateDummyQuartsPourDate(selectedDate), [selectedDate]);
    
    // Chargement du personnel quand le quart change
    useEffect(() => {
        const loadPersonnel = async () => {
            if (!quartActifId || !selectedDate) {
                setPersonnelPresence([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await fetchPersonnelAffecteEtPresence(quartActifId, selectedDate);
                setPersonnelPresence(data);
            } catch (error) {
                console.error("Erreur chargement personnel:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPersonnel();
    }, [quartActifId, selectedDate]);

    const handlePresenceChange = (_id: string, _field: keyof SuiviPresenceEmploye) => { /*...*/ };
    const isQuartModifiablePourPresence = () => true;
    const handleSubmitPresences = async () => { /*...*/ };
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiUserCheck className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Suivi des Présences</h1>
                            <p className="text-gray-600">Enregistrez la présence, les retards et les absences des équipes.</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Button variant="ghost" onClick={() => setSelectedDate(subDays(selectedDate, 1))} disabled={isSubmitting || isLoading}><FiChevronLeft size={20}/></Button>
                        <Input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(startOfDay(parseISO(e.target.value)))} disabled={isSubmitting || isLoading}/>
                        <Button variant="ghost" onClick={() => setSelectedDate(addDays(selectedDate, 1))} disabled={isSubmitting || isLoading}><FiChevronRight size={20}/></Button>
                     </div>
                </div>

                {submitStatus && <Alert variant={submitStatus.type} title="Notification" dismissible onDismiss={() => setSubmitStatus(null)}>{submitStatus.message}</Alert>}
                
                {/* ====== CARTE DE SÉLECTION CORRIGÉE ====== */}
                <Card icon={FiClock} title="Contexte de la Saisie">
                    <div className="p-6">
                        <Select label="Sélectionnez le quart de travail"
                            value={quartActifId || ''}
                            onChange={e => setQuartActifId(e.target.value)}
                            disabled={isSubmitting || isLoading}
                            options={[{value: '', label: '-- Choisir un quart --'}, ...quartsDuJour.map(q => ({value: q.id, label: q.libelle, disabled: q.statut === 'planifie'}))]}
                        />
                    </div>
                </Card>

                {isLoading ? <div className="p-20 flex justify-center"><Spinner size="lg" /></div> :
                 !quartActifId ? <Card><div className="text-center p-12 text-gray-500">Veuillez sélectionner un quart pour commencer.</div></Card> :
                 personnelPresence.length === 0 ? <Card><div className="text-center p-12 text-gray-500">Aucun personnel n'est affecté à ce quart.</div></Card> :
                 <form onSubmit={handleSubmitPresences} className="space-y-6">
                    {/* Les cartes individuelles des employés n'ont pas besoin de titre car elles agissent comme des lignes de formulaire riches */}
                     {personnelPresence.map(emp => (
                         <PresenceSaisieCard key={emp.id} employe={emp} onPresenceChange={handlePresenceChange} isReadOnly={!isQuartModifiablePourPresence() || isSubmitting} />
                     ))}


                             <div className="p-6 border-t text-right">
                                  <Button 
                                    type="submit"
                                    loading={isSubmitting} 
                                    disabled={isSubmitting}
                                    size="lg"
                                 >
                                    Enregistrer les Présences
                                 </Button>
                            </div>

                 </form>
                }
            </div>
        </>
    );
};

export default SuiviPresencesPage;