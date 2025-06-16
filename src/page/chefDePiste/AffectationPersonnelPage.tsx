// src/page/chefDePiste/AffectationPersonnelPage.tsx (FINAL & COHÉRENT)
import React, { useState, useMemo, type FC } from 'react';
import { FiCalendar, FiSave, FiUsers, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format, addDays, subDays, startOfDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types et Données Mock (inchangés)
import type { Affectation, Employe, PosteDeTravail } from '../../types/personnel';
import { dummyEmployes, getQuartsPourDate } from '../../_mockData/planning';

// Écosystème et UI Kit
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/Spinner';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';

// --- Sous-composant pour une seule ligne d'affectation ---
const AffectationRow: FC<{
  quartId: string;
  poste: PosteDeTravail;
  employesCompatibles: Employe[];
  affectationActuelle?: Affectation;
  onAffectationChange: (quartId: string, posteId: string, employeId: string | null) => void;
  isSaving: boolean;
}> = ({ quartId, poste, employesCompatibles, affectationActuelle, onAffectationChange, isSaving }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-gray-800 mb-2 sm:mb-0">
            <FiMapPin className="inline mr-2 text-purple-500" />
            {poste.libelle}
            <span className="ml-2 text-xs font-normal text-gray-500">({poste.typeRequis})</span>
        </div>
        <div className="w-full sm:w-64">
            <Select
                value={affectationActuelle?.employeId || ""}
                onChange={(e) => onAffectationChange(quartId, poste.id, e.target.value || null)}
                options={[ { value: "", label: "-- Non Affecté --" }, ...employesCompatibles.map(e => ({ value: e.id, label: `${e.nomComplet} (${e.role})`, disabled: !e.estDisponible })) ]}
                disabled={isSaving}
            />
        </div>
    </div>
);


// --- Page Principale ---
const AffectationPersonnelPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
    const [affectations, setAffectations] = useState<Affectation[]>([]);
    const [isLoading] = useState(false);
    const [isSaving] = useState(false);
    const [saveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const quartsDuJour = useMemo(() => getQuartsPourDate(selectedDate), [selectedDate]);
    const personnelDisponible = useMemo(() => dummyEmployes.filter(e => e.estDisponible), []);

    // Add handleAffectationChange implementation
    const handleAffectationChange = (quartId: string, posteId: string, employeId: string | null) => {
        setAffectations(prev => {
            // Remove existing affectation if any
            const filtered = prev.filter(a => !(a.quartId === quartId && a.posteId === posteId));
            
            // Add new affectation if employee is selected
            if (employeId) {
                return [...filtered, { quartId, posteId, employeId }];
            }
            
            return filtered;
        });
    };

    const getEmployesCompatibles = (typeRequis: 'pompiste' | 'caissier'): Employe[] => {
        return personnelDisponible.filter(emp => emp.role === typeRequis || emp.role === 'polyvalent');
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4"><FiCalendar className="text-white text-2xl" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Affectations des Équipes</h1>
                            <p className="text-gray-600">Planifiez qui travaille à quel poste pour chaque quart.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                         <Button variant="ghost" onClick={() => setSelectedDate(subDays(selectedDate, 1))} disabled={isSaving || isLoading}><FiChevronLeft size={20}/></Button>
                         <Input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={e => setSelectedDate(startOfDay(parseISO(e.target.value)))} disabled={isSaving || isLoading}/>
                         <Button variant="ghost" onClick={() => setSelectedDate(addDays(selectedDate, 1))} disabled={isSaving || isLoading}><FiChevronRight size={20}/></Button>
                    </div>
                </div>

                {saveStatus && <Alert variant={saveStatus.type} title="Statut" dismissible>{saveStatus.message}</Alert>}
                
                {isLoading ? (
                    <div className="p-20 flex justify-center"><Spinner size="lg" /></div>
                ) : quartsDuJour.length === 0 ? (
                    <Card><p className="p-12 text-center text-gray-500">Aucun quart défini pour le {format(selectedDate, 'eeee dd MMMM', { locale: fr })}.</p></Card>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); /* handleSaveAffectations() */ }}>
                         <div className="space-y-6">
                            {quartsDuJour.map(quart => (
                                <Card key={quart.id} title={`Quart: ${quart.libelle}`} icon={FiUsers}>
                                    <div className="divide-y divide-gray-100">
                                    {quart.postesAConfigurer.map(poste => (
                                        <AffectationRow
                                            key={poste.id}
                                            quartId={quart.id}
                                            poste={poste}
                                            employesCompatibles={getEmployesCompatibles(poste.typeRequis)}
                                            affectationActuelle={affectations.find(a => 
                                                a.quartId === quart.id && a.posteId === poste.id
                                            )}
                                            onAffectationChange={handleAffectationChange}
                                            isSaving={isSaving}
                                        />
                                    ))}
                                    </div>
                                </Card>
                            ))}
                            <div className="flex justify-end pt-4 border-t">
                                 <Button type="submit" size="lg" loading={isSaving} disabled={isLoading || isSaving} leftIcon={<FiSave />}>
                                    Enregistrer les Affectations
                                 </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AffectationPersonnelPage;