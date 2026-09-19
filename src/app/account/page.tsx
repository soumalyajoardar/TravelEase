import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountClient from '@/components/account/AccountClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings | TravelEase',
  description: 'Manage your TravelEase account and preferences.',
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background min-h-screen pb-12">
        <Suspense fallback={
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg shrink-0"></div>
              <div className="flex-1 h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        }>
          <AccountClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
