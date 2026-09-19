import React from 'react';
import { Train, Bus, Clock, User, HelpCircle } from 'lucide-react';
import { TrainRecord, BusRecord, TravelRecord } from '@/types/travel';
import Link from 'next/link';

interface ResultCardProps {
  record: TravelRecord;
  onCompareToggle: (id: string) => void;
  isComparing: boolean;
}

export function TrainResultCard({ record, onCompareToggle, isComparing }: ResultCardProps & { record: TrainRecord }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Time & Route */}
      <div className="flex-1">
        <div className="flex items-center space-x-2 text-primary font-bold text-lg mb-1">
          <Train className="w-5 h-5 text-secondary" />
          <span>{record.operator}</span>
          <span className="text-sm font-normal text-secondary ml-2">({record.trainNumber})</span>
        </div>
        <div className="text-secondary text-sm mb-4">Class: {record.classCategory}</div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-xl text-primary">{record.departureTime}</div>
            <div className="text-xs text-secondary">{record.origin}</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs text-secondary">{record.duration}</span>
            <div className="w-full h-px bg-border relative my-1">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-secondary">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs text-secondary">Direct</span>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-primary">{record.arrivalTime}</div>
            <div className="text-xs text-secondary">{record.destination}</div>
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <div>
          <div className="text-2xl font-bold text-primary mb-1">
            {record.fare ? `₹${record.fare.total}` : 'Price unavailable'}
          </div>
          <div className="flex items-center text-xs text-secondary mb-3 group relative cursor-help">
            <span>Total payable</span>
            <HelpCircle className="w-3 h-3 ml-1" />
            <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 bg-primary text-white text-xs p-3 rounded shadow-lg w-48 z-10">
              <div className="flex justify-between mb-1"><span>Base fare:</span><span>₹{record.fare?.base}</span></div>
              <div className="flex justify-between mb-1"><span>Taxes:</span><span>₹{record.fare?.taxes}</span></div>
              <div className="flex justify-between border-b border-white/20 pb-1 mb-1"><span>Service fee:</span><span>₹{record.fare?.serviceFee}</span></div>
              <div className="flex justify-between font-bold"><span>Total:</span><span>₹{record.fare?.total}</span></div>
            </div>
          </div>
          
          <div className="text-sm font-medium mb-4 flex items-center space-x-1">
            <User className="w-4 h-4 text-success" />
            <span className="text-success">{record.availability > 0 ? `${record.availability} Seats Available` : 'Sold out'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={`/trip/${record.id}`} className="block w-full bg-accent hover:bg-[#e09b00] text-primary text-center font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent">
            View details
          </Link>
          <label className="flex items-center justify-center space-x-2 w-full border border-border py-2 rounded cursor-pointer hover:bg-background transition-colors">
            <input 
              type="checkbox" 
              checked={isComparing} 
              onChange={() => onCompareToggle(record.id)} 
              className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
            />
            <span className="text-sm font-medium text-primary">Compare</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function BusResultCard({ record, onCompareToggle, isComparing }: ResultCardProps & { record: BusRecord }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Time & Route */}
      <div className="flex-1">
        <div className="flex items-center space-x-2 text-primary font-bold text-lg mb-1">
          <Bus className="w-5 h-5 text-secondary" />
          <span>{record.operator}</span>
        </div>
        <div className="text-secondary text-sm mb-4">
          {record.busType} • {record.acStatus} • {record.seatType}
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-xl text-primary">{record.departureTime}</div>
            <div className="text-xs text-secondary max-w-[100px] truncate" title={record.boardingInfo}>{record.boardingInfo}</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-xs text-secondary">{record.duration}</span>
            <div className="w-full h-px bg-border relative my-1">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-secondary">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs text-secondary">Direct</span>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-primary">{record.arrivalTime}</div>
            <div className="text-xs text-secondary max-w-[100px] truncate" title={record.droppingInfo}>{record.droppingInfo}</div>
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <div>
          <div className="text-2xl font-bold text-primary mb-1">
            {record.fare ? `₹${record.fare.total}` : 'Price unavailable'}
          </div>
          <div className="flex items-center text-xs text-secondary mb-3 group relative cursor-help">
            <span>Total payable</span>
            <HelpCircle className="w-3 h-3 ml-1" />
            <div className="hidden group-hover:block absolute bottom-full mb-2 right-0 bg-primary text-white text-xs p-3 rounded shadow-lg w-48 z-10">
              <div className="flex justify-between mb-1"><span>Base fare:</span><span>₹{record.fare?.base}</span></div>
              <div className="flex justify-between mb-1"><span>Taxes:</span><span>₹{record.fare?.taxes}</span></div>
              <div className="flex justify-between border-b border-white/20 pb-1 mb-1"><span>Service fee:</span><span>₹{record.fare?.serviceFee}</span></div>
              <div className="flex justify-between font-bold"><span>Total:</span><span>₹{record.fare?.total}</span></div>
            </div>
          </div>
          
          <div className="text-sm font-medium mb-4 flex items-center space-x-1">
            <User className="w-4 h-4 text-success" />
            <span className="text-success">{record.availability > 0 ? `${record.availability} Seats Available` : 'Sold out'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={`/trip/${record.id}`} className="block w-full bg-accent hover:bg-[#e09b00] text-primary text-center font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-accent">
            View details
          </Link>
          <label className="flex items-center justify-center space-x-2 w-full border border-border py-2 rounded cursor-pointer hover:bg-background transition-colors">
            <input 
              type="checkbox" 
              checked={isComparing} 
              onChange={() => onCompareToggle(record.id)} 
              className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
            />
            <span className="text-sm font-medium text-primary">Compare</span>
          </label>
        </div>
      </div>
    </div>
  );
}
