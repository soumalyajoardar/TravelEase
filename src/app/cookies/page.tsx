import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PolicyViewer from '@/components/legal/PolicyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | TravelEase',
  description: 'How TravelEase uses cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        <PolicyViewer slug="cookies" defaultTitle="Cookie Policy" />
      </main>
      <Footer />
    </div>
  );
}
