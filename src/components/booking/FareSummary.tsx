import React from 'react';
import { TravelRecord } from '@/types/travel';
import { ShieldAlert } from 'lucide-react';

interface FareSummaryProps {
  record: TravelRecord;
  passengerCount: number;
}

export default function FareSummary({ record, passengerCount }: FareSummaryProps) {
  const baseFare = record.fare.base * passengerCount;
  const taxes = record.fare.taxes * passengerCount;
  const serviceFee = record.fare.serviceFee * passengerCount;
  const totalPayable = baseFare + taxes + serviceFee;

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden sticky top-8">
      <div className="p-6">
        <h2 className="text-lg font-bold text-primary mb-6 border-b border-border pb-4">Fare Summary</h2>
        
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between text-secondary">
            <span>Base fare ({passengerCount} x ₹{record.fare.base})</span>
            <span className="font-medium text-primary">₹{baseFare}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Taxes ({passengerCount} x ₹{record.fare.taxes})</span>
            <span className="font-medium text-primary">₹{taxes}</span>
          </div>
          <div className="flex justify-between text-secondary">
            <span>Service fee ({passengerCount} x ₹{record.fare.serviceFee})</span>
            <span className="font-medium text-primary">₹{serviceFee}</span>
          </div>
        </div>
      </div>

      <div className="bg-background px-6 py-5 border-t border-border">
        <div className="flex justify-between items-end mb-2">
          <span className="font-bold text-primary">Total payable</span>
          <span className="text-3xl font-bold text-primary">₹{totalPayable}</span>
        </div>
        <p className="text-xs text-secondary flex items-start space-x-1.5 mt-3">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-secondary" />
          <span>Includes all mandatory charges. No hidden fees.</span>
        </p>
      </div>
    </div>
  );
}
