import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PolicyViewer from '@/components/legal/PolicyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TravelEase',
  description: 'Terms and conditions for using the TravelEase platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        <PolicyViewer slug="terms" defaultTitle="Terms & Conditions" />
      </main>
      <Footer />
    </div>
  );
}
