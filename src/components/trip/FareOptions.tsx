import React from 'react';
import { TravelRecord } from '@/types/travel';

export default function FareOptions({ record, selectedClass, onSelectClass }: { record: TravelRecord, selectedClass: string, onSelectClass: (c: string) => void }) {
  // If the backend supported multiple classes per record, we'd iterate over them.
  // For the foundation, we map the current record's specific class to demonstrate the UI.
  
  const options = [];
  
  if (record.type === 'train') {
    // Train has classCategory
    options.push({
      id: 'opt_1',
      label: (record as any).classCategory,
      availability: record.availability,
      price: record.fare.total
    });
  } else {
    // Bus has seatType and acStatus
    options.push({
      id: 'opt_1',
      label: `${(record as any).acStatus} ${(record as any).seatType}`,
      availability: record.availability,
      price: record.fare.total
    });
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4">Class / Fare Options</h2>
      
      <div className="grid gap-4">
        {options.map((opt) => (
          <label 
            key={opt.id}
            className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-colors ${
              selectedClass === opt.id 
                ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input 
                type="radio" 
                name="fareClass" 
                value={opt.id} 
                checked={selectedClass === opt.id}
                onChange={() => onSelectClass(opt.id)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <div>
                <div className="font-bold text-primary">{opt.label}</div>
                <div className={`text-xs mt-1 font-medium ${opt.availability > 10 ? 'text-success' : (opt.availability > 0 ? 'text-accent' : 'text-red-500')}`}>
                  {opt.availability > 0 ? `${opt.availability} seats available` : 'Sold out'}
                </div>
              </div>
            </div>
            <div className="text-xl font-bold text-primary">
              ₹{opt.price}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
