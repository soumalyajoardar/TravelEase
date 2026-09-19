import React from 'react';
import { TravelRecord, BusRecord } from '@/types/travel';

export default function JourneyTimeline({ record }: { record: TravelRecord }) {
  const isBus = record.type === 'bus';
  const bus = record as BusRecord;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-6">Journey Timeline</h2>
      
      <div className="relative border-l-2 border-border ml-3 space-y-8">
        
        {/* Departure */}
        <div className="relative pl-6">
          <div className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full -left-[9px] top-1"></div>
          <div className="font-bold text-lg text-primary">{record.departureTime}</div>
          <div className="font-semibold text-primary mb-1">Boarding: {record.origin}</div>
          {isBus && bus.boardingInfo && (
            <div className="text-sm text-secondary bg-background p-3 rounded mt-2 border border-border">
              {bus.boardingInfo}
            </div>
          )}
        </div>

        {/* Arrival */}
        <div className="relative pl-6">
          <div className="absolute w-4 h-4 bg-primary border-2 border-primary rounded-full -left-[9px] top-1"></div>
          <div className="font-bold text-lg text-primary">{record.arrivalTime}</div>
          <div className="font-semibold text-primary mb-1">Dropping: {record.destination}</div>
          {isBus && bus.droppingInfo && (
            <div className="text-sm text-secondary bg-background p-3 rounded mt-2 border border-border">
              {bus.droppingInfo}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
