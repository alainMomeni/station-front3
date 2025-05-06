import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
// Icons for this specific page content
import { FiArrowUp, FiChevronLeft, FiChevronRight, FiCircle } from 'react-icons/fi';

// Placeholder for chart data/config - In real app, use a charting library
const ChartPlaceholder: React.FC = () => (
    <div className="h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        Chart Area Placeholder
        {/* Actual chart implementation (e.g., using Recharts, Chart.js) would go here */}
    </div>
);

// Placeholder for the mini calendar
const MiniCalendarPlaceholder: React.FC = () => {
    // Simplified static data for demonstration
    const dates = [
        [null, null, null, null, 1, 1, 1], // Assuming '1' represents a date cell
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, null, null, null],
    ];
    const highlightedDates = [4, 11]; // Example: 4th and 11th day cells are highlighted
    let dayIndex = 0; // To track which '1' we are on for highlighting

    return (
        <div className="p-4 bg-white rounded-lg shadow "> {/* Calendar container */}
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                    <FiChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-gray-700">Dec 2020</span>
                <button className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                    <FiChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Day Headers */}
            {/* Image uses "DAY", changing to match */}
            {/* <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                {days.map(day => <div key={day}>{day}</div>)}
            </div> */}
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center text-xs text-gray-500 mb-2">
                {Array(7).fill(0).map((_, i) => <div key={i}>DAY</div>)}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center text-sm">
                {dates.flat().map((date, index) => {
                    const isPlaceholder = date === null;
                    let isHighlighted = false;
                    if (date === 1) {
                        dayIndex++;
                        isHighlighted = highlightedDates.includes(dayIndex);
                    }

                    return (
                        <div
                            key={index}
                            className={`
                                h-6 w-6 flex items-center justify-center rounded-md
                                ${isPlaceholder ? 'text-transparent' : 'text-gray-700'}
                                ${isHighlighted ? 'bg-purple-600 text-white font-semibold' : ''}
                            `}
                        >
                            {date}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      {/* Page Title */}
       <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-purple-600 inline-block pr-4 pb-1">
                Vue d'ensemble
            </h1>
       </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Chart Section) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          {/* Chart Header Info */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Ventes hebdomadaire</p>
            <p className="text-2xl font-bold text-gray-800 mb-1">XAF 7.852.000</p>
            <div className="flex items-center text-sm text-green-600">
              <FiArrowUp className="h-4 w-4 mr-1" />
              <span>2.1% vs semaine passé</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Ventes du 1-12 Dec, 2020</p>
          </div>

          {/* Chart Placeholder */}
          <ChartPlaceholder />

           {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-gray-500">
                <div className="flex items-center">
                    <FiCircle className="h-2 w-2 mr-1.5 text-purple-600 fill-current" /> {/* Using fill color */}
                     6 derniers jours
                 </div>
                 <div className="flex items-center">
                    <FiCircle className="h-2 w-2 mr-1.5 text-gray-300 fill-current" /> {/* Using fill color */}
                     Semaine passé
                 </div>
             </div>
        </div>

        {/* Right Column (Calendar Section) */}
        <div className="lg:col-span-1">
           <MiniCalendarPlaceholder />
            {/* Add other widgets here if needed */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;