"use client";

import React, { useState, useEffect } from 'react';
import { getRecordById } from '@/services/travelService';
import { TravelRecord } from '@/types/travel';
import TripHeader from './TripHeader';
import OperatorInfo from './OperatorInfo';
import JourneyTimeline from './JourneyTimeline';
import Amenities from './Amenities';
import CancellationPolicy, { ImportantInformation } from './Policies';
import FareOptions from './FareOptions';
import BookingSummary from './BookingSummary';
import Link from 'next/link';

export default function TripClient({ tripId }: { tripId: string }) {
  const [record, setRecord] = useState<TravelRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedClass, setSelectedClass] = useState('opt_1');

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

    fetchRecord();
  }, [tripId]);

  if (isLoading) {
    // Skeleton handled by suspense fallback in page.tsx technically, 
    // but we can also return null or an internal skeleton if mounted client-side
    return null;
  }

  if (error || !record) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1440px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Trip details unavailable</h2>
        <p className="text-secondary mb-8 max-w-md">
          This travel option could not be loaded. It may have been removed or is no longer available. Please return to search and select another option.
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative pb-32 lg:pb-8">
      <TripHeader record={record} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details */}
        <div className="flex-1 min-w-0">
          <OperatorInfo record={record} />
          <JourneyTimeline record={record} />
          <FareOptions record={record} selectedClass={selectedClass} onSelectClass={setSelectedClass} />
          
          <div className="bg-white border border-border rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-4">Seat Selection</h2>
            <p className="text-secondary text-sm">Seat selection will be available later.</p>
          </div>

          <Amenities record={record} />
          <CancellationPolicy />
          <ImportantInformation />
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:w-[400px] shrink-0">
          <BookingSummary record={record} selectedClass={selectedClass} />
        </div>

      </div>

      {/* Mobile Sticky CTA */}
      <BookingSummary record={record} selectedClass={selectedClass} isMobileSticky={true} />
    </div>
  );
}
