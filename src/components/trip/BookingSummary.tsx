import React from 'react';
import { TravelRecord } from '@/types/travel';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface BookingSummaryProps {
  record: TravelRecord;
  selectedClass: string;
  isMobileSticky?: boolean;
}

export default function BookingSummary({ record, selectedClass, isMobileSticky = false }: BookingSummaryProps) {
  const containerClasses = isMobileSticky 
    ? "fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 lg:hidden flex flex-row items-center justify-between gap-4"
    : "bg-white border border-border rounded-lg p-6 shadow-sm hidden lg:block sticky top-24";

  if (isMobileSticky) {
    return (
      <div className={containerClasses}>
        <div>
          <div className="text-xs text-secondary mb-0.5">Total payable</div>
          <div className="text-2xl font-bold text-primary">₹{record.fare.total}</div>
        </div>
        <Link 
          href={`/booking/passengers?tripId=${record.id}&classId=${selectedClass}`}
          className="bg-primary hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded transition-opacity flex-1 max-w-[250px] text-center whitespace-nowrap"
        >
          Continue
        </Link>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h2 className="text-lg font-bold text-primary mb-6 border-b border-border pb-4">Booking Summary</h2>
      
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary">Travel option</span>
          <span className="font-medium text-primary text-right max-w-[150px] truncate" title={record.operator}>{record.operator}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">Passengers</span>
          <span className="font-medium text-primary">1 Adult</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">Seat selection</span>
          <span className="font-medium text-primary">Not selected</span>
        </div>
      </div>

      <div className="border-t border-border pt-6 mb-6">
        <h3 className="text-sm font-bold text-primary mb-3">Fare Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Base fare</span>
            <span className="font-medium text-primary">₹{record.fare.base}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Taxes</span>
            <span className="font-medium text-primary">₹{record.fare.taxes}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Service fee</span>
            <span className="font-medium text-primary">₹{record.fare.serviceFee}</span>
          </div>
        </div>
      </div>

      <div className="bg-background -mx-6 px-6 py-4 border-y border-border mb-6">
        <div className="flex justify-between items-end">
          <span className="font-bold text-primary">Total payable</span>
          <span className="text-3xl font-bold text-primary">₹{record.fare.total}</span>
        </div>
        <div className="flex items-start space-x-2 mt-3 text-xs text-secondary">
          <ShieldAlert className="w-4 h-4 shrink-0 text-accent" />
          <p>See the complete price before booking. Fare may change based on availability.</p>
        </div>
      </div>

      <Link 
        href={`/booking/passengers?tripId=${record.id}&classId=${selectedClass}`}
        className="block text-center w-full bg-primary hover:bg-opacity-90 text-white font-medium py-4 px-4 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Continue to passenger details
      </Link>
    </div>
  );
}
