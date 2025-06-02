
import React from 'react';
import { SALESPEOPLE_IDS } from '../constants';
import { UserIcon } from './icons';

interface SalespersonSelectorProps {
  selectedSalesperson: string;
  onSalespersonChange: (salespersonId: string) => void;
}

const SalespersonSelector: React.FC<SalespersonSelectorProps> = ({ selectedSalesperson, onSalespersonChange }) => {
  return (
    <div className="">
      <label htmlFor="salesperson-select" className="block text-sm font-medium text-gray-700 mb-1">
        Wybierz handlowca:
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserIcon className="h-5 w-5 text-gray-400" />
        </div>
        <select
          id="salesperson-select"
          value={selectedSalesperson}
          onChange={(e) => onSalespersonChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          {SALESPEOPLE_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SalespersonSelector;