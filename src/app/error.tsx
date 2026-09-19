"use client";

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorState from '@/components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, log to an error reporting service here securely
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <ErrorState 
          title="Something went wrong"
          description="TravelEase couldn't complete this request right now. We've noted the issue and are looking into it."
          onRetry={reset}
          primaryAction={{
            label: 'Go to TravelEase',
            href: '/'
          }}
          referenceId={error.digest || 'ERR-SYS'}
        />
      </main>
      <Footer />
    </div>
  );
}
