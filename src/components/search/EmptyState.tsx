import React from 'react';
import { SearchX, Compass } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'no-params' | 'no-results';
}

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === 'no-params') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-white border border-border rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-10 h-10 text-primary" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Start your search</h2>
        <p className="text-secondary mb-8 max-w-md">
          Enter your journey details to find available trains and buses. We'll help you compare options easily.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Search trips
        </Link>
      </div>
    );
  }

  // no-results
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-white border border-border rounded-full flex items-center justify-center mb-6 shadow-sm">
        <SearchX className="w-10 h-10 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">No trips available</h2>
      <p className="text-secondary mb-8 max-w-md">
        We couldn't find available options for this search. Try another date or modify your search preferences.
      </p>
      <Link 
        href="/" 
        className="bg-white border border-primary text-primary hover:bg-background font-medium px-8 py-3 rounded transition-colors"
      >
        Modify search
      </Link>
    </div>
  );
}
