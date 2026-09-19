import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PassengerClient from '@/components/booking/PassengerClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Passenger Details | TravelEase',
  description: 'Enter your passenger details to continue booking your journey on TravelEase.',
};

export default async function PassengerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const tripId = resolvedParams.tripId as string || '';
  const classId = resolvedParams.classId as string || '';

  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen">
        <Suspense fallback={
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-full max-w-2xl mb-8 mx-auto"></div>
            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
              <div className="flex-1 space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:w-[350px] shrink-0">
                <div className="h-80 bg-gray-200 rounded-lg sticky top-8"></div>
              </div>
            </div>
          </div>
        }>
          <PassengerClient tripId={tripId} classId={classId} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
