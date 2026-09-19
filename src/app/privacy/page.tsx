import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PolicyViewer from '@/components/legal/PolicyViewer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TravelEase',
  description: 'Understand how TravelEase collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-white">
        <PolicyViewer slug="privacy" defaultTitle="Privacy Policy" />
      </main>
      <Footer />
    </div>
  );
}
