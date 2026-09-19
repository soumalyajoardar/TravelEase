import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchClient from '@/components/search/SearchClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Trains & Buses | TravelEase',
  description: 'Compare trains and buses in one place, see the complete price upfront, and find a trip that works for you.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;

  const origin = resolvedParams.from as string || '';
  const destination = resolvedParams.to as string || '';
  const date = resolvedParams.date as string || '';
  const travellers = resolvedParams.travellers as string || '';
  const type = resolvedParams.type as string || 'all';

  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="text-secondary font-medium">Loading search interface...</div>
          </div>
        }>
          <SearchClient 
            initialOrigin={origin}
            initialDestination={destination}
            initialDate={date}
            initialTravellers={travellers}
            initialType={type}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
