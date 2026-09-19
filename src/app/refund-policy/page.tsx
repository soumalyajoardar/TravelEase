import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PolicyViewer from '@/components/legal/PolicyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | TravelEase',
  description: 'Learn about TravelEase cancellation procedures and refund processing.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        <PolicyViewer slug="refund-policy" defaultTitle="Refund & Cancellation Policy" />
      </main>
      <Footer />
    </div>
  );
}
