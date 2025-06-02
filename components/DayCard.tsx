import React, { useState, useEffect } from 'react';
import { ContactSource, DayData, SourceEntry } from '../types.ts';
import { CONTACT_SOURCES_LIST, CONTACT_SOURCES_ENUM, DAY_NAMES_PL_SHORT } from '../constants.ts';
import { PlusIcon, MinusIcon } from './icons.tsx';

interface DayCardProps {
  day: number;
  month: number; // 0-indexed
  year: number;
  dayData: DayData | undefined;
  onAddContact: (day: number, source: ContactSource, note?: string) => void;
  onRemoveContact: (day: number, source: ContactSource) => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, month, year, dayData, onAddContact, onRemoveContact }) => {
  const [notes, setNotes] = useState<Record<ContactSource, string>>(() => {
    const initialNotes: Partial<Record<ContactSource, string>> = {};
    if (dayData && dayData[CONTACT_SOURCES_ENUM.OTHER]?.note) {
      initialNotes[CONTACT_SOURCES_ENUM.OTHER] = dayData[CONTACT_SOURCES_ENUM.OTHER]!.note;
    }
    return initialNotes as Record<ContactSource, string>;
  });

  useEffect(() => {
    if (dayData && dayData[CONTACT_SOURCES_ENUM.OTHER]?.note) {
      setNotes(prev => ({...prev, [CONTACT_SOURCES_ENUM.OTHER]: dayData[CONTACT_SOURCES_ENUM.OTHER]!.note}));
    } else if (dayData && !dayData[CONTACT_SOURCES_ENUM.OTHER]?.note && notes[CONTACT_SOURCES_ENUM.OTHER]) {
       // If note was removed externally (e.g. count became 0)
       setNotes(prev => ({...prev, [CONTACT_SOURCES_ENUM.OTHER]: ''}));
    } else if (!dayData && notes[CONTACT_SOURCES_ENUM.OTHER]) {
        // If all dayData is cleared
        setNotes(prev => ({...prev, [CONTACT_SOURCES_ENUM.OTHER]: ''}));
    }
  }, [dayData, notes]);


  const handleNoteChange = (source: ContactSource, value: string) => {
    setNotes(prev => ({ ...prev, [source]: value }));
  };

  const handleIncrement = (source: ContactSource) => {
    const note = source === CONTACT_SOURCES_ENUM.OTHER ? notes[source] || '' : undefined;
    onAddContact(day, source, note);
  };
  
  const handleDecrement = (source: ContactSource) => {
    onRemoveContact(day, source);
  };
  
  const date = new Date(year, month, day);
  const dayName = DAY_NAMES_PL_SHORT[date.getDay()];

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3 border-b pb-2">
        {day} {dayName}
      </h3>
      <div className="space-y-3">
        {CONTACT_SOURCES_LIST.map((source) => {
          const entry: SourceEntry | undefined = dayData?.[source];
          const count = entry?.count || 0;

          return (
            <div key={source} className="p-2 border border-gray-200 rounded-md bg-slate-50">
              <div className="flex items-center justify-between ">
                <span className="text-sm font-medium text-gray-700">{source}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrement(source)}
                    disabled={count === 0}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    aria-label={`Odejmij kontakt dla ${source}`}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full w-8 text-center">{count}</span>
                  <button
                    onClick={() => handleIncrement(source)}
                    className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                    aria-label={`Dodaj kontakt dla ${source}`}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {source === CONTACT_SOURCES_ENUM.OTHER && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Uwagi (opcjonalne)"
                    value={notes[source] || ''}
                    onChange={(e) => handleNoteChange(source, e.target.value)}
                    onBlur={() => { // Update note in parent when input loses focus, if count > 0
                      if (count > 0) {
                        onAddContact(day, source, notes[source] || ''); // This will update note without incrementing if count exists
                      }
                    }}
                    className="w-full text-xs p-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={count === 0 && !(dayData?.[CONTACT_SOURCES_ENUM.OTHER]?.note)} // disable if count is 0 and no note persisted
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCard;