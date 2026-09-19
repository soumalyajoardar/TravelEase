import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactClient from './ContactClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support | TravelEase',
  description: 'Need help with a booking, payment or another TravelEase service? Contact our support team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-16">
        <ContactClient />
      </main>
      <Footer />
    </div>
  );
}
