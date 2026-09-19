import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TripClient from '@/components/trip/TripClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trip Details | TravelEase',
  description: 'Review your trip details and continue your booking with TravelEase.',
};

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen">
        <Suspense fallback={
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:w-[400px] shrink-0">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        }>
          <TripClient tripId={id} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
