import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'; // Removed getDay, parseISO if not directly used for now
import { fr } from 'date-fns/locale';
import DashboardLayout from '../../layouts/DashboardLayout';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// ** Import the modal component **
import ShiftDetailModal from '../../components/ShiftDetailModal';

// Define Shift type (or import if defined elsewhere)
interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    type?: string;
    notes?: string;
}

const userShifts: Shift[] = [
    { id: 's1', date: '2024-07-15', startTime: '07:00', endTime: '15:00', type: 'Matin', notes: "Penser à vérifier le niveau d'huile du générateur." },
    { id: 's2', date: '2024-07-16', startTime: '07:00', endTime: '15:00', type: 'Matin' },
    { id: 's3', date: '2024-07-18', startTime: '14:00', endTime: '22:00', type: 'Soir' },
    { id: 's4', date: '2024-07-19', startTime: '14:00', endTime: '22:00', type: 'Soir', notes: "Livraison de carburant prévue.\n- Superviser la réception." },
    { id: 's5', date: '2024-07-22', startTime: '07:00', endTime: '15:00', type: 'Matin' },
    // Adding a shift in the current month for testing
    { id: 's6', date: format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '17:00', type: 'Test', notes: "Shift d'aujourd'hui pour tester le modal." },
    { id: 's7', date: '2024-08-01', startTime: '22:00', endTime: '06:00', type: 'Nuit' },
];

const AgendaPage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();
    // ** State for modal visibility and selected shift **
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(null);


    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const daysInGrid = eachDayOfInterval({ start: startDate, end: endDate });
    const dayNames = Array.from({ length: 7 }, (_, i) =>
        // To get correct week days starting Monday, ensure a date within the week is used
        format(addMonths(startDate, i % 7), 'eee', { locale: fr }) // Use mod 7 if startOfWeek could be Sunday depending on locale
    );

    const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const getShiftForDay = (day: Date): Shift | undefined => {
        const dateString = format(day, 'yyyy-MM-dd');
        return userShifts.find(shift => shift.date === dateString);
    };

    // ** Function to handle day click **
    const handleDayClick = (day: Date, shift: Shift | undefined) => {
        if (shift) {
            setSelectedShift(shift);
            setSelectedDateForModal(day);
        }
    };

    const closeModal = () => {
        setSelectedShift(null);
        setSelectedDateForModal(null);
    };

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                    Mon Planning
                </h1>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    {/* Month Navigation... remains same */}
                    <button
                        onClick={goToPreviousMonth}
                        aria-label="Mois précédent"
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition duration-150"
                    >
                        <FiChevronLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-700 capitalize">
                        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                    </h2>
                    <button
                        onClick={goToNextMonth}
                        aria-label="Mois suivant"
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition duration-150"
                    >
                        <FiChevronRight className="h-6 w-6" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-px border-l border-t border-gray-200 bg-gray-200">
                    {dayNames.map((dayName) => (
                        <div key={dayName} className="text-center py-2 text-xs font-semibold text-gray-600 uppercase bg-gray-50 border-r border-b border-gray-200 capitalize">
                            {dayName}
                        </div>
                    ))}

                    {daysInGrid.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, today);
                        const shift = getShiftForDay(day);

                        return (
                            <div
                                key={index}
                                className={`
                                    relative p-2 min-h-[80px] md:min-h-[100px] text-left
                                    border-r border-b border-gray-200 transition duration-150
                                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                                    ${isToday ? 'bg-purple-50' : ''}
                                    ${shift && isCurrentMonth ? 'cursor-pointer hover:bg-purple-100' : ''}
                                `}
                                // ** Add onClick handler **
                                onClick={() => handleDayClick(day, shift)}
                                role={shift && isCurrentMonth ? "button" : undefined} // Semantics
                                tabIndex={shift && isCurrentMonth ? 0 : undefined} // Accessibility
                                onKeyDown={(e) => { // Keyboard accessibility for button-like divs
                                    if ((e.key === 'Enter' || e.key === ' ') && shift && isCurrentMonth) {
                                        handleDayClick(day, shift);
                                    }
                                }}
                            >
                                <time
                                    dateTime={format(day, 'yyyy-MM-dd')}
                                    className={`
                                        text-xs md:text-sm font-semibold select-none
                                        ${isToday ? 'text-purple-700 rounded-full bg-purple-200 w-6 h-6 flex items-center justify-center' : ''}
                                        ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                                    `}
                                >
                                    {format(day, 'd')}
                                </time>

                                {shift && isCurrentMonth && (
                                    <div className="mt-1.5 p-1.5 rounded-md bg-purple-200 border border-purple-300 text-purple-800 text-xs leading-tight shadow-sm select-none">
                                        <p className="font-semibold">{shift.type || 'Travail'}</p>
                                        <p>{shift.startTime} - {shift.endTime}</p>
                                        {shift.notes && <p className="text-xxs italic mt-0.5 truncate">{shift.notes.split('\n')[0]}</p>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 text-xs text-gray-600 flex items-center space-x-4">
                    {/* Legend... remains same */}
                    <div className="flex items-center">
                       <span className="w-3 h-3 rounded-sm bg-purple-100 border border-purple-200 mr-1.5"></span>
                       <span>Quart Assigné</span>
                    </div>
                </div>
            </div>

            {/* ** Render the Modal ** */}
            <ShiftDetailModal
                shift={selectedShift}
                onClose={closeModal}
                selectedDate={selectedDateForModal}
            />
        </DashboardLayout>
    );
};

export default AgendaPage;