import React from 'react';
import { Train, Bus } from 'lucide-react';
import { TravelRecord, TrainRecord, BusRecord } from '@/types/travel';

export default function OperatorInfo({ record }: { record: TravelRecord }) {
  const isTrain = record.type === 'train';
  const train = record as TrainRecord;
  const bus = record as BusRecord;

  return (
    <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center space-x-2">
        {isTrain ? <Train className="w-5 h-5 text-secondary" /> : <Bus className="w-5 h-5 text-secondary" />}
        <span>Operator Information</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
        <div>
          <span className="block text-secondary mb-1">Operator Name</span>
          <span className="font-semibold text-primary">{record.operator}</span>
        </div>
        
        {isTrain ? (
          <>
            <div>
              <span className="block text-secondary mb-1">Train Number</span>
              <span className="font-semibold text-primary">{train.trainNumber}</span>
            </div>
            <div>
              <span className="block text-secondary mb-1">Class / Category</span>
              <span className="font-semibold text-primary">{train.classCategory}</span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="block text-secondary mb-1">Bus Type</span>
              <span className="font-semibold text-primary">{bus.busType}</span>
            </div>
            <div>
              <span className="block text-secondary mb-1">Vehicle Category</span>
              <span className="font-semibold text-primary">{bus.acStatus} • {bus.seatType}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
