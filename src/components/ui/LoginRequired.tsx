"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LoginRequired() {
  const pathname = usePathname();
  const loginUrl = `/login?redirect=${encodeURIComponent(pathname || '/')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-secondary" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">Sign in to continue</h3>
          <p className="text-secondary mb-8 leading-relaxed">
            Please sign in to access this part of TravelEase.
          </p>
          <Link 
            href={loginUrl}
            className="w-full sm:w-auto bg-primary text-white px-8 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
          >
            Sign in
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
