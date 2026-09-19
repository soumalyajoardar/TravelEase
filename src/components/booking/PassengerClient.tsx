"use client";

import React, { useState, useEffect } from 'react';
import { getRecordById } from '@/services/travelService';
import { TravelRecord } from '@/types/travel';
import CheckoutProgress from './CheckoutProgress';
import TripSummary from './TripSummary';
import PassengerForm, { Passenger } from './PassengerForm';
import FareSummary from './FareSummary';
import Link from 'next/link';

export default function PassengerClient({ tripId, classId }: { tripId: string, classId: string }) {
  const [record, setRecord] = useState<TravelRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: '1', fullName: '', age: '', gender: '' }
  ]);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setIsLoading(true);
        const data = await getRecordById(tripId);
        if (data) {
          setRecord(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchRecord();
    } else {
      setIsLoading(false);
      setError(true);
    }
  }, [tripId]);

  if (isLoading) {
    return null; // The suspense boundary handles the main skeleton
  }

  if (error || !record) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1440px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Your selected trip is unavailable.</h2>
        <p className="text-secondary mb-8 max-w-md">
          Please return to search and choose another available option.
        </p>
        <Link 
          href="/search" 
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Back to search
        </Link>
      </div>
    );
  }

  // Trigger form submission from mobile sticky button
  const handleMobileSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="pb-32 lg:pb-12">
      <CheckoutProgress currentStep={2} />
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link href={`/trip/${record.id}`} className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary mb-6 transition-colors">
          &larr; Back to trip details
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Form Area */}
          <div className="flex-1 w-full min-w-0">
            <TripSummary record={record} classId={classId} />
            <PassengerForm 
              record={record} 
              passengers={passengers} 
              setPassengers={setPassengers} 
            />
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-[350px] shrink-0">
            <FareSummary record={record} passengerCount={passengers.length} />
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 lg:hidden flex flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-secondary mb-0.5">Total payable</div>
          <div className="text-xl font-bold text-primary">₹{record.fare.total * passengers.length}</div>
        </div>
        <button 
          onClick={handleMobileSubmit}
          className="bg-primary hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded transition-opacity flex-1 max-w-[200px] text-center"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
