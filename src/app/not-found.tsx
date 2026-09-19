import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | TravelEase',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-secondary" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">Page not found</h1>
          <p className="text-secondary mb-8">
            We couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
            >
              Go to TravelEase
            </Link>
            <Link 
              href="/"
              className="w-full sm:w-auto border border-border text-primary px-6 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Search trips
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
