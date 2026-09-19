import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AccessRestricted() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Access restricted</h3>
          <p className="text-secondary mb-8 leading-relaxed">
            You don't have permission to access this page.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
            >
              Go back
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto border border-border text-primary px-6 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Go to TravelEase
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
