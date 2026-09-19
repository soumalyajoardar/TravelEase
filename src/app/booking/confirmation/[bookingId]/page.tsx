import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConfirmationClient from '@/components/booking/ConfirmationClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmation | TravelEase',
  description: 'Your booking confirmation and digital ticket.',
};

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const resolvedParams = await params;
  const { bookingId } = resolvedParams;

  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen pb-12">
        <Suspense fallback={
          <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        }>
          <ConfirmationClient bookingId={bookingId} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
