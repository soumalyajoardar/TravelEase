import React from 'react';
import { TravelRecord, TrainRecord, BusRecord } from '@/types/travel';
import { Train, Bus, X, Check } from 'lucide-react';

interface ComparisonViewProps {
  records: TravelRecord[];
  onRemove: (id: string) => void;
}

export default function ComparisonView({ records, onRemove }: ComparisonViewProps) {
  if (records.length < 2) {
    return (
      <div className="bg-white border border-border rounded-lg p-12 text-center">
        <h3 className="text-xl font-bold text-primary mb-2">Choose another option to compare</h3>
        <p className="text-secondary">Please select at least two travel options to see them side-by-side.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 md:p-6 border-b border-r border-border bg-background w-48 min-w-[150px]">
                <span className="font-semibold text-primary">Compare Features</span>
              </th>
              {records.map(record => (
                <th key={record.id} className="p-4 md:p-6 border-b border-border min-w-[250px] relative align-top">
                  <button 
                    onClick={() => onRemove(record.id)}
                    className="absolute top-4 right-4 text-secondary hover:text-primary bg-background p-1 rounded-full"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-2 text-primary font-bold text-lg mb-2 mt-4">
                    {record.type === 'train' ? <Train className="w-5 h-5 text-secondary" /> : <Bus className="w-5 h-5 text-secondary" />}
                    <span>{record.operator}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-4">
                    ₹{record.fare?.total || 'N/A'}
                  </div>
                  <button className="w-full bg-primary text-white font-medium py-2 rounded hover:bg-opacity-90 transition-opacity">
                    Select
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">Departure</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border font-semibold text-primary">
                  {record.departureTime} <span className="block text-xs font-normal text-secondary mt-1">{record.origin}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">Arrival</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border font-semibold text-primary">
                  {record.arrivalTime} <span className="block text-xs font-normal text-secondary mt-1">{record.destination}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">Duration</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border font-semibold text-primary">{record.duration}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">Travel type</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border text-primary capitalize">{record.type}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">Class / Category</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border text-primary">
                  {record.type === 'train' ? (record as TrainRecord).classCategory : `${(record as BusRecord).busType} - ${(record as BusRecord).seatType}`}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-b border-r border-border font-medium text-secondary bg-background">AC / Non-AC</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-b border-border text-primary flex items-center">
                  {record.type === 'bus' ? (
                    (record as BusRecord).acStatus === 'AC' ? <Check className="w-4 h-4 text-success mr-2" /> : <X className="w-4 h-4 text-secondary mr-2" />
                  ) : <Check className="w-4 h-4 text-success mr-2" />}
                  {record.type === 'bus' ? (record as BusRecord).acStatus : 'AC'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 md:p-6 border-r border-border font-medium text-secondary bg-background">Availability</td>
              {records.map(record => (
                <td key={record.id} className="p-4 md:p-6 border-border font-medium text-success">
                  {record.availability > 0 ? `${record.availability} Seats` : <span className="text-secondary">Sold out</span>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
