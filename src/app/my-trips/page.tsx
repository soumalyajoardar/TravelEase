import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyTripsClient from '@/components/my-trips/MyTripsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Trips | TravelEase',
  description: 'View and manage your travel bookings with TravelEase.',
};

export default function MyTripsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen pb-12">
        <Suspense fallback={
          <div className="max-w-[1024px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-8"></div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        }>
          <MyTripsClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
