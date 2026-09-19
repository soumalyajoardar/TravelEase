import React from 'react';
import { BookingRecord, TrainRecord, BusRecord } from '@/types/travel';
import { Train, Bus, ChevronRight, XCircle } from 'lucide-react';
import Link from 'next/link';

interface TripCardProps {
  booking: BookingRecord;
  onCancel: () => void;
}

export default function TripCard({ booking, onCancel }: TripCardProps) {
  const isTrain = booking.trip.type === 'train';
  
  // Status styling map
  const getStatusDisplay = (status: BookingRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', style: 'bg-success/10 text-success border-success/20' };
      case 'cancelled':
        return { label: 'Cancelled', style: 'bg-gray-100 text-secondary border-gray-200' };
      case 'payment_pending':
        return { label: 'Payment pending', style: 'bg-accent/10 text-accent border-accent/20' };
      default:
        return { label: status.replace('_', ' '), style: 'bg-gray-100 text-secondary border-gray-200' };
    }
  };

  const statusDisplay = getStatusDisplay(booking.status);

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
      
      {/* Main Content Area */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        
        {/* Top row: Transport type & Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-secondary">
            {isTrain ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
            <span className="uppercase">{booking.trip.type}</span>
            <span>•</span>
            <span className="truncate max-w-[150px]" title={booking.trip.operator}>{booking.trip.operator}</span>
          </div>
          <div className={`px-2.5 py-1 rounded text-xs font-bold border ${statusDisplay.style}`}>
            {statusDisplay.label}
          </div>
        </div>

        {/* Middle row: Journey & Time */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center space-x-2 text-lg md:text-xl font-bold text-primary mb-1">
            <span className="truncate max-w-[120px] md:max-w-none" title={booking.trip.origin}>{booking.trip.origin}</span>
            <span className="text-secondary">→</span>
            <span className="truncate max-w-[120px] md:max-w-none" title={booking.trip.destination}>{booking.trip.destination}</span>
          </div>
          <div className="text-primary font-medium">
            20 September 2026 {/* Hardcoded for foundation mockup layout, usually from date field */}
          </div>
          <div className="text-secondary text-sm mt-1">
            {booking.trip.departureTime} — {booking.trip.arrivalTime} ({booking.trip.duration})
          </div>
        </div>

        {/* Bottom row: Booking Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary bg-gray-50 p-3 rounded border border-border">
          <div>
            <span className="block text-xs uppercase tracking-wider mb-0.5">Booking ID</span>
            <span className="font-bold text-primary">{booking.id}</span>
          </div>
          {booking.pnr && (
            <div>
              <span className="block text-xs uppercase tracking-wider mb-0.5">PNR</span>
              <span className="font-bold text-primary">{booking.pnr}</span>
            </div>
          )}
          <div>
            <span className="block text-xs uppercase tracking-wider mb-0.5">Total</span>
            <span className="font-bold text-primary">₹{booking.totalPaid}</span>
          </div>
        </div>

      </div>

      {/* Actions Area */}
      <div className="border-t md:border-t-0 md:border-l border-border bg-gray-50/50 p-5 md:p-6 flex flex-col justify-center md:w-56 space-y-3">
        {booking.status === 'confirmed' && (
          <Link 
            href={`/booking/confirmation/${booking.id}`}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white font-medium py-2.5 px-4 rounded hover:bg-opacity-90 transition-opacity"
          >
            <span>View ticket</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}

        {booking.status === 'cancelled' && (
          <div className="text-center p-3 border border-border bg-white rounded text-sm mb-2">
            <span className="block text-xs text-secondary uppercase mb-1">Refund status</span>
            <span className="font-bold text-primary">Refund initiated</span>
          </div>
        )}

        <Link 
          href={`/trip/${booking.trip.id}`}
          className="w-full flex items-center justify-center bg-white border border-border text-primary font-medium py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm"
        >
          View trip details
        </Link>
        
        {booking.status === 'confirmed' && (
          <button 
            onClick={onCancel}
            className="w-full flex items-center justify-center space-x-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium py-2 px-4 rounded transition-colors text-sm"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel booking</span>
          </button>
        )}
      </div>

    </div>
  );
}
