
import React from 'react';
import { ReportType } from '../types';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reportType: ReportType) => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirmSelection = (reportType: ReportType) => {
    onConfirm(reportType);
    // Modal zostanie zamknięty przez App.tsx po zakończeniu eksportu
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 screen-only p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Wybierz typ raportu do CSV</h2>
        <div className="space-y-3">
          <button
            onClick={() => handleConfirmSelection('monthly')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Podsumowanie Miesięczne
          </button>
          <button
            onClick={() => handleConfirmSelection('weekly')}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Podsumowanie Tygodniowe
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default PrintModal;