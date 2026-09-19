import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PolicyViewer from '@/components/legal/PolicyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement | TravelEase',
  description: 'Our commitment to an accessible booking experience.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        <PolicyViewer slug="accessibility" defaultTitle="Accessibility Statement" />
      </main>
      <Footer />
    </div>
  );
}
