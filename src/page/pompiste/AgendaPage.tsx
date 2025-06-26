// src/page/pompiste/AgendaPage.tsx (VERSION FINALE AVEC IMPORTS CORRIGÉS)
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiEye, FiAlertCircle } from 'react-icons/fi';

// Types et composants
import type { Shift } from '../../types/personnel';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import ShiftDetailModal from '../../components/ShiftDetailModal';

// CHOISISSEZ L'UNE DES DEUX IMPORTS SUIVANTES :
// Option 1 : Si vous avez un fichier planning.ts séparé
import { userShifts } from '../../_mockData/planning';
// Option 2 : Si vous utilisez le fichier personnel.ts (commentez la ligne au-dessus et décommentez celle-ci)
// import { userShifts } from '../../_mockData/personnel';

const AgendaPage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const today = new Date();

    // ====== EFFET DE DEBUG AU CHARGEMENT ======
    useEffect(() => {
        console.log('🔍 DIAGNOSTIC AGENDA PAGE:');
        console.log('📅 Shifts disponibles:', userShifts);
        console.log('📅 Nombre de shifts:', userShifts.length);
        console.log('📅 Mois courant:', format(currentMonth, 'MMMM yyyy', { locale: fr }));
        console.log('📅 Aujourd\'hui:', format(today, 'yyyy-MM-dd'));
        
        // Vérifier si des shifts existent pour le mois courant
        const currentMonthShifts = userShifts.filter(shift => {
            const shiftDate = new Date(shift.date + 'T00:00:00');
            return isSameMonth(shiftDate, currentMonth);
        });
        
        const debugText = `Shifts ce mois: ${currentMonthShifts.length}/${userShifts.length}`;
        setDebugInfo(debugText);
        console.log('📊', debugText, currentMonthShifts);
    }, [currentMonth]);

    // ====== LOGIQUE DU CALENDRIER ======
    const monthStart = startOfMonth(currentMonth);
    const weekStartForDayNames = startOfWeek(new Date(), { locale: fr, weekStartsOn: 1 });
    const dayNames = Array.from({ length: 7 }, (_, i) => 
        format(addDays(weekStartForDayNames, i), 'eee', { locale: fr })
    );

    const daysInGrid = eachDayOfInterval({ 
        start: startOfWeek(monthStart, { locale: fr, weekStartsOn: 1 }), 
        end: endOfWeek(endOfMonth(monthStart), { locale: fr, weekStartsOn: 1 }) 
    });
    
    // ====== FONCTION DE RECHERCHE DE SHIFT RENFORCÉE ======
    const getShiftForDay = (day: Date): Shift | undefined => {
        const dayFormatted = format(day, 'yyyy-MM-dd');
        
        // Recherche directe
        let shift = userShifts.find(s => s.date === dayFormatted);
        
        // Recherche alternative avec comparaison de dates
        if (!shift) {
            shift = userShifts.find(s => {
                const shiftDate = new Date(s.date + 'T00:00:00');
                return isSameDay(shiftDate, day);
            });
        }
        
        if (shift) {
            console.log(`✅ Shift trouvé pour ${dayFormatted}:`, shift);
        }
        
        return shift;
    };
    
    // ====== GESTIONNAIRES D'ÉVÉNEMENTS ======
    const handleDayClick = (day: Date) => {
        const shift = getShiftForDay(day);
        console.log('🖱️ Clic sur le jour:', format(day, 'yyyy-MM-dd'), 'Shift:', shift);
        
        if (shift) {
            setSelectedShift(shift);
            setSelectedDateForModal(day);
        } else {
            console.warn('❌ Aucun shift trouvé pour', format(day, 'yyyy-MM-dd'));
        }
    };

    const closeModal = () => {
        setSelectedShift(null);
        setSelectedDateForModal(null);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    return (
        <>
            <div className="space-y-6">
                {/* ====== EN-TÊTE ====== */}
                <div className="flex items-center">
                    <div className="p-3 bg-purple-600 rounded-2xl shadow-lg mr-4">
                        <FiCalendar className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Mon Planning</h1>
                        <p className="text-gray-600">Consultez vos prochains quarts de travail.</p>
                        {/* Debug info */}
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <FiAlertCircle className="mr-1" />
                            {debugInfo}
                        </p>
                    </div>
                </div>

                {/* ====== CALENDRIER ====== */}
                <Card 
                    title={format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    headerContent={
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={goToPreviousMonth}
                                aria-label="Mois précédent"
                            >
                                <FiChevronLeft size={20}/>
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={goToToday}
                            >
                                Aujourd'hui
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={goToNextMonth}
                                aria-label="Mois suivant"
                            >
                                <FiChevronRight size={20}/>
                            </Button>
                        </div>
                    }
                >
                    <div className="grid grid-cols-7 border-t border-l border-gray-200">
                        {/* En-têtes des jours de la semaine */}
                        {dayNames.map(day => (
                            <div 
                                key={day} 
                                className="py-2 text-center text-xs font-semibold text-gray-600 bg-gray-50 border-r border-b border-gray-200 capitalize"
                            >
                                {day}
                            </div>
                        ))}

                        {/* Grille des jours du mois */}
                        {daysInGrid.map((day, i) => {
                            const shift = getShiftForDay(day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const hasShift = !!shift;
                            const isToday = isSameDay(day, today);
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`relative p-2 min-h-[120px] border-r border-b border-gray-200 flex flex-col transition-colors duration-200
                                        ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                                        ${hasShift && isCurrentMonth ? 'ring-1 ring-purple-200 hover:bg-purple-50' : ''}
                                        ${hasShift && isCurrentMonth ? 'cursor-pointer' : ''}`
                                    }
                                    onClick={() => hasShift && isCurrentMonth && handleDayClick(day)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        {/* Numéro du jour */}
                                        <time 
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                            className={`font-semibold text-sm ${
                                                isToday 
                                                    ? 'flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white' 
                                                    : ''
                                            } ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}
                                        >
                                            {format(day, 'd')}
                                        </time>

                                        {/* Bouton de détail */}
                                        {hasShift && isCurrentMonth && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="!p-1 h-6 w-6 bg-purple-100 hover:bg-purple-200 border border-purple-300 opacity-80 hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDayClick(day);
                                                }}
                                                title={`Voir les détails: ${shift.type}`}
                                            >
                                                <FiEye className="text-purple-700 text-sm" />
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {/* Bloc d'information du shift */}
                                    {hasShift && isCurrentMonth && (
                                        <div className="mt-1 p-2 rounded-md bg-purple-100 text-purple-800 text-xs leading-tight flex-grow">
                                            <p className="font-semibold truncate">{shift.type}</p>
                                            <p className="text-purple-600">{shift.startTime} - {shift.endTime}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
                
                {/* Message si aucun shift */}
                {userShifts.length === 0 && (
                    <Card title="Aucun planning">
                        <div className="text-center py-8 text-gray-500">
                            <FiCalendar className="mx-auto mb-4 text-4xl" />
                            <p>Aucun quart de travail programmé pour le moment.</p>
                        </div>
                    </Card>
                )}
            </div>
            
            {/* Modal de détail */}
            <ShiftDetailModal
                shift={selectedShift}
                onClose={closeModal}
                selectedDate={selectedDateForModal}
            />
        </>
    );
};

export default AgendaPage;