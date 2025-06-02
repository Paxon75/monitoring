
import React from 'react';
import { MONTH_NAMES_PL, START_YEAR, START_MONTH_INDEX, END_MONTH_INDEX } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from './icons';

interface MonthNavigatorProps {
  currentYear: number;
  currentMonth: number; // 0-indexed
  onMonthChange: (newMonth: number) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentYear, currentMonth, onMonthChange }) => {
  const handlePrevMonth = () => {
    if (currentMonth > START_MONTH_INDEX) {
      onMonthChange(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < END_MONTH_INDEX) {
      onMonthChange(currentMonth + 1);
    }
  };

  const isPrevDisabled = currentYear === START_YEAR && currentMonth === START_MONTH_INDEX;
  const isNextDisabled = currentYear === START_YEAR && currentMonth === END_MONTH_INDEX;

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
      <button
        onClick={handlePrevMonth}
        disabled={isPrevDisabled}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Poprzedni miesiąc"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <div className="flex items-center text-xl font-semibold text-indigo-700">
        <CalendarDaysIcon className="h-6 w-6 mr-2 text-indigo-500" />
        {MONTH_NAMES_PL[currentMonth]} {currentYear}
      </div>
      <button
        onClick={handleNextMonth}
        disabled={isNextDisabled}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Następny miesiąc"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MonthNavigator;