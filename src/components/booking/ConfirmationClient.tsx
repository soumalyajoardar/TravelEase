"use client";

import React, { useState, useEffect } from 'react';
import { getBookingById } from '@/services/travelService';
import { BookingRecord, TrainRecord, BusRecord } from '@/types/travel';
import Link from 'next/link';
import { CheckCircle2, Download, Printer, Share2, HelpCircle, FileText, MapPin, Clock, Train, Bus } from 'lucide-react';

export default function ConfirmationClient({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const data = await getBookingById(bookingId);
        if (data) {
          setBooking(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (isLoading) return null;

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-4">Booking not found</h2>
        <p className="text-secondary mb-8 max-w-md">
          We couldn't find this booking. It may have expired or the booking ID is incorrect.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  const isTrain = booking.trip.type === 'train';
  const train = booking.trip as TrainRecord;
  const bus = booking.trip as BusRecord;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
      
      {/* Status Header */}
      <div className="bg-white border border-border rounded-lg shadow-sm p-8 mb-8 text-center print:border-none print:shadow-none print:mb-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Booking confirmed</h1>
        <p className="text-secondary mb-6">Your trip has been successfully booked.</p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
          <div>
            <span className="block text-secondary text-xs uppercase tracking-wider mb-1">Booking ID</span>
            <span className="font-bold text-primary text-lg">{booking.id}</span>
          </div>
          {booking.pnr && (
            <>
              <div className="hidden sm:block w-px h-8 bg-border"></div>
              <div>
                <span className="block text-secondary text-xs uppercase tracking-wider mb-1">PNR</span>
                <span className="font-bold text-primary text-lg">{booking.pnr}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ticket Card */}
      <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden mb-8 print:shadow-none print:border-gray-300">
        
        {/* Ticket Header */}
        <div className="bg-primary text-white p-6 flex justify-between items-center print:bg-gray-100 print:text-black print:border-b">
          <div className="font-bold text-xl tracking-tight">TravelEase</div>
          <div className="text-sm font-medium flex items-center space-x-2">
            {isTrain ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
            <span className="uppercase">{booking.trip.type} Ticket</span>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="p-6 md:p-8 border-b border-border">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-primary">{booking.trip.operator}</span>
            <span className="text-sm text-secondary">
              {isTrain ? `${train.trainNumber} • ${train.classCategory}` : `${bus.busType} • ${bus.acStatus} ${bus.seatType}`}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex-1 text-center md:text-left">
              <div className="text-3xl font-bold text-primary mb-1">{booking.trip.departureTime}</div>
              <div className="font-medium text-primary mb-1">{booking.trip.origin}</div>
              <div className="text-xs text-secondary">{isTrain ? 'Boarding Station' : 'Boarding Point'}</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full md:w-auto">
              <span className="text-sm font-medium text-secondary mb-2">{booking.trip.duration}</span>
              <div className="w-full h-px bg-border relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <div className="text-3xl font-bold text-primary mb-1">{booking.trip.arrivalTime}</div>
              <div className="font-medium text-primary mb-1">{booking.trip.destination}</div>
              <div className="text-xs text-secondary">{isTrain ? 'Arrival Station' : 'Dropping Point'}</div>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="p-6 md:p-8 border-b border-border">
          <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Passenger details</h3>
          <div className="space-y-4">
            {booking.passengers.map((p, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium text-primary">{p.fullName}</span>
                  <span className="text-secondary ml-2">{p.age} yrs • {p.gender}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-secondary">Status</span>
                  <span className="font-medium text-success">Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boarding Info & Payment Summary */}
        <div className="p-6 md:p-8 bg-gray-50 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Boarding information</h3>
            {isTrain ? (
              <p className="text-sm text-secondary leading-relaxed">
                Please report to the departure station at least 30 minutes before {booking.trip.departureTime}. Platform numbers are typically announced 2 hours before departure.
              </p>
            ) : (
              <p className="text-sm text-secondary leading-relaxed">
                {bus.boardingInfo || `Please report to the boarding point at least 15 minutes before ${booking.trip.departureTime}.`}
              </p>
            )}
          </div>
          <div className="flex-1 md:border-l md:border-border md:pl-8">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">Payment summary</h3>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between text-secondary">
                <span>Total amount</span>
                <span>₹{booking.totalPaid}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Payment method</span>
                <span className="uppercase">{booking.paymentMethod}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-bold text-primary">Status</span>
              <span className="font-medium text-success">Paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <button 
          className="flex items-center justify-center space-x-2 bg-primary text-white font-medium py-3 px-4 rounded hover:bg-opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 bg-white border border-border text-primary font-medium py-3 px-4 rounded hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        <button 
          className="flex items-center justify-center space-x-2 bg-white border border-border text-primary font-medium py-3 px-4 rounded hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        <Link 
          href="/"
          className="flex items-center justify-center space-x-2 bg-white border border-border text-primary font-medium py-3 px-4 rounded hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need help?</span>
        </Link>
      </div>

      <div className="mt-8 text-center print:hidden">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          Return to Homepage
        </Link>
      </div>

    </div>
  );
}
