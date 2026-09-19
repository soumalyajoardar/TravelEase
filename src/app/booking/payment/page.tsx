import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentClient from '@/components/booking/PaymentClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment | TravelEase',
  description: 'Securely complete your travel booking payment.',
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const tripId = resolvedParams.tripId as string || '';
  const classId = resolvedParams.classId as string || '';
  const passengers = parseInt(resolvedParams.passengers as string || '1', 10);

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
              </div>
              <div className="lg:w-[400px] shrink-0">
                <div className="h-80 bg-gray-200 rounded-lg sticky top-8"></div>
              </div>
            </div>
          </div>
        }>
          <PaymentClient tripId={tripId} classId={classId} passengerCount={passengers} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
