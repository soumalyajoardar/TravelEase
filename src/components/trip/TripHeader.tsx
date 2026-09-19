import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { TravelRecord } from '@/types/travel';

export default function TripHeader({ record }: { record: TravelRecord }) {
  return (
    <div className="mb-8">
      <Link href="/search" className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to results
      </Link>
      
      <div className="bg-primary text-white rounded-lg p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 font-medium uppercase tracking-wider text-xs">{record.type} Details</span>
          <span className="bg-white/20 px-3 py-1 rounded text-xs font-medium">Availability: {record.availability}</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="text-3xl font-bold mb-1">{record.departureTime}</div>
            <div className="text-white/80">{record.origin}</div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full md:w-auto">
            <span className="text-sm font-medium mb-2">{record.duration}</span>
            <div className="w-full max-w-[200px] h-px bg-white/30 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-2">
                <Clock className="w-5 h-5 text-white/80" />
              </div>
            </div>
            <span className="text-xs text-white/80 mt-2">Direct</span>
          </div>
          
          <div className="flex-1 text-center md:text-right">
            <div className="text-3xl font-bold mb-1">{record.arrivalTime}</div>
            <div className="text-white/80">{record.destination}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
