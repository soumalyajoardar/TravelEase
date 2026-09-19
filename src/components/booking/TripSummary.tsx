import React from 'react';
import Link from 'next/link';
import { Train, Bus, MapPin } from 'lucide-react';
import { TravelRecord, TrainRecord, BusRecord } from '@/types/travel';

export default function TripSummary({ record, classId }: { record: TravelRecord, classId: string }) {
  const isTrain = record.type === 'train';
  
  // Deriving the selected category name based on the record type for the summary
  let selectedCategory = '';
  if (isTrain) {
    selectedCategory = (record as TrainRecord).classCategory;
  } else {
    const bus = record as BusRecord;
    selectedCategory = `${bus.acStatus} ${bus.seatType}`;
  }

  return (
    <div className="bg-white border border-border rounded-lg p-5 md:p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold text-primary flex items-center space-x-2">
          {isTrain ? <Train className="w-5 h-5 text-secondary" /> : <Bus className="w-5 h-5 text-secondary" />}
          <span>{record.operator}</span>
        </h2>
        <Link 
          href={`/trip/${record.id}`} 
          className="text-sm font-medium text-secondary hover:text-primary underline underline-offset-2"
        >
          View trip details
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 bg-background p-4 rounded border border-border">
        <div>
          <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Date & Time</span>
          <span className="font-semibold text-primary">{record.departureTime}</span>
        </div>
        <div>
          <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Route</span>
          <span className="font-semibold text-primary flex items-center space-x-1">
            <span className="truncate max-w-[80px]" title={record.origin}>{record.origin}</span>
            <span>→</span>
            <span className="truncate max-w-[80px]" title={record.destination}>{record.destination}</span>
          </span>
        </div>
        <div>
          <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Category</span>
          <span className="font-semibold text-primary">{selectedCategory}</span>
        </div>
        <div>
          <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Travel Type</span>
          <span className="font-semibold text-primary capitalize">{record.type}</span>
        </div>
      </div>
    </div>
  );
}
