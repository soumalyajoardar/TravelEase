import React from 'react';
import { Wifi, Snowflake, Plug, Coffee } from 'lucide-react';
import { TravelRecord, BusRecord } from '@/types/travel';

export default function Amenities({ record }: { record: TravelRecord }) {
  const isBus = record.type === 'bus';
  const hasAC = isBus ? (record as BusRecord).acStatus === 'AC' : true;
  
  // Simulated amenities strictly derived from data flags (in a real app, read from record.amenities array)
  // For the foundation, we just look at AC status and type to demonstrate
  const availableAmenities = [];
  
  if (hasAC) availableAmenities.push({ icon: Snowflake, label: 'AC' });
  if (record.type === 'train') {
    availableAmenities.push({ icon: Coffee, label: 'Pantry / Food Available' });
    availableAmenities.push({ icon: Plug, label: 'Charging Points' });
  }

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4">Amenities</h2>
      
      {availableAmenities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableAmenities.map((amenity, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 bg-background rounded border border-border text-center">
              <amenity.icon className="w-6 h-6 text-secondary mb-2" strokeWidth={1.5} />
              <span className="text-sm font-medium text-primary">{amenity.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary text-sm">Travel amenities are not currently available.</p>
      )}
    </div>
  );
}
