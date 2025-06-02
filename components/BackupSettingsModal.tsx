import React, { useState, useEffect } from 'react';
import { BackupSettings } from '../types';

interface BackupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: BackupSettings;
  onSave: (newSettings: BackupSettings) => void;
}

const BackupSettingsModal: React.FC<BackupSettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
  const [enabled, setEnabled] = useState(currentSettings.enabled);
  const [time1, setTime1] = useState(currentSettings.time1);
  const [time2, setTime2] = useState(currentSettings.time2);

  useEffect(() => {
    setEnabled(currentSettings.enabled);
    setTime1(currentSettings.time1);
    setTime2(currentSettings.time2);
  }, [currentSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ enabled, time1, time2 });
    onClose();
  };

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => { // Every 30 minutes
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Ustawienia Automatycznej Kopii Zapasowej</h2>
        
        <div className="mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">Włącz automatyczne kopie zapasowe</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">Kopie będą tworzone dla aktualnie wybranego handlowca, jeśli aplikacja będzie otwarta o wybranej godzinie.</p>
        </div>

        {enabled && (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="backupTime1" className="block text-sm font-medium text-gray-700 mb-1">Godzina pierwszej kopii:</label>
              <select
                id="backupTime1"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {timeSlots.map(slot => <option key={`t1-${slot}`} value={slot}>{slot}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="backupTime2" className="block text-sm font-medium text-gray-700 mb-1">Godzina drugiej kopii:</label>
              <select
                id="backupTime2"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                 {timeSlots.map(slot => <option key={`t2-${slot}`} value={slot}>{slot}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Zapisz Ustawienia
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupSettingsModal;