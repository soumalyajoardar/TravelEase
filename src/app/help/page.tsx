import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpCenterClient from './HelpCenterClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center | TravelEase',
  description: 'Find answers about bookings, payments, cancellations, refunds and travel.',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<HelpSkeleton />}>
          <HelpCenterClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function HelpSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
        <div className="h-12 bg-gray-200 rounded max-w-lg mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border border-border rounded-lg p-6 h-32 bg-white"></div>
        ))}
      </div>
    </div>
  );
}
