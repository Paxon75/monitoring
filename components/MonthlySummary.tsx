
import React from 'react';
import { MonthData, ContactSource } from '../types';
import { CONTACT_SOURCES_LIST } from '../constants';

interface MonthlySummaryProps {
  monthData: MonthData | undefined;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ monthData }) => {
  const summary: Partial<Record<ContactSource, number>> = {};
  let totalContacts = 0;

  CONTACT_SOURCES_LIST.forEach(source => summary[source] = 0);

  if (monthData) {
    Object.values(monthData).forEach(dayEntry => {
      CONTACT_SOURCES_LIST.forEach(source => {
        if (dayEntry[source]) {
          summary[source]! += dayEntry[source]!.count;
          totalContacts += dayEntry[source]!.count;
        }
      });
    });
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4 border-b pb-2">Podsumowanie Miesięczne</h2>
      {totalContacts === 0 ? (
         <p className="text-gray-500">Brak zarejestrowanych kontaktów w tym miesiącu.</p>
      ) : (
        <ul className="space-y-2">
          {CONTACT_SOURCES_LIST.map(source => (
            <li key={source} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-800">{source}:</span>
              <span className="font-semibold text-indigo-600 text-lg">{summary[source]}</span>
            </li>
          ))}
           <li className="flex justify-between items-center p-3 bg-indigo-100 rounded-md mt-4">
              <span className="font-bold text-indigo-800 text-lg">Łącznie kontaktów:</span>
              <span className="font-bold text-indigo-800 text-xl">{totalContacts}</span>
            </li>
        </ul>
      )}
    </div>
  );
};

export default MonthlySummary;