
import React from 'react';

interface RestoreConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  salespersonIdToRestore: string | null;
}

const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  salespersonIdToRestore 
}) => {
  if (!isOpen || !salespersonIdToRestore) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4 screen-only"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-confirm-title"
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <h2 id="restore-confirm-title" className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          Potwierdzenie Przywracania Danych
        </h2>
        <p className="mb-6 text-sm md:text-base text-gray-600">
          Czy na pewno chcesz przywrócić dane dla handlowca "{salespersonIdToRestore}"? 
          Spowoduje to nadpisanie wszystkich istniejących danych dla tego handlowca. Ta operacja jest nieodwracalna.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Anuluj przywracanie danych"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Potwierdź przywrócenie danych dla ${salespersonIdToRestore}`}
          >
            Przywróć Dane
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreConfirmModal;
