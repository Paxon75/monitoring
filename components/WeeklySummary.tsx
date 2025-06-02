import React from 'react';
import { MonthData, ContactSource, Week, SingleSummary } from '../types';
import { CONTACT_SOURCES_LIST } from '../constants';

interface WeeklySummaryProps {
  monthData: MonthData | undefined;
  weeks: Week[];
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ monthData, weeks }) => {
  if (!weeks.length) {
    return null;
  }

  const calculateWeeklyData = (week: Week): SingleSummary => {
    const weeklySummary: Partial<Record<ContactSource, number>> = {};
    let weeklyTotalContacts = 0;
    CONTACT_SOURCES_LIST.forEach(source => weeklySummary[source] = 0);

    if (monthData) {
      week.days.forEach(dayNum => {
        const dayEntry = monthData[dayNum];
        if (dayEntry) {
          CONTACT_SOURCES_LIST.forEach(source => {
            if (dayEntry[source]) {
              weeklySummary[source]! += dayEntry[source]!.count;
              weeklyTotalContacts += dayEntry[source]!.count;
            }
          });
        }
      });
    }
    return { summary: weeklySummary, totalContacts: weeklyTotalContacts };
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg screen-only">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">Podsumowania Tygodniowe</h2>
      {weeks.map(week => {
        const weeklyData = calculateWeeklyData(week);
        return (
          <div key={week.weekNumber} className="mb-6 p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-indigo-600 mb-3">{week.label}</h3>
            {weeklyData.totalContacts === 0 ? (
              <p className="text-gray-500">Brak zarejestrowanych kontaktów w tym tygodniu.</p>
            ) : (
              <ul className="space-y-1">
                {CONTACT_SOURCES_LIST.map(source => (
                  <li key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                    <span className="font-medium text-gray-700">{source}:</span>
                    <span className="font-semibold text-indigo-500">{weeklyData.summary[source]}</span>
                  </li>
                ))}
                <li className="flex justify-between items-center p-2 bg-indigo-50 rounded-md mt-2">
                  <span className="font-bold text-indigo-700">Łącznie w tygodniu:</span>
                  <span className="font-bold text-indigo-700 text-md">{weeklyData.totalContacts}</span>
                </li>
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeeklySummary;