import React from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface SearchSummaryProps {
  origin: string;
  destination: string;
  date: string;
  travellers: string;
}

export default function SearchSummary({ origin, destination, date, travellers }: SearchSummaryProps) {
  return (
    <div className="bg-primary text-white py-4 shadow-md sticky top-16 z-40">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
          <div className="flex flex-col">
            <span className="text-white/60 text-xs tracking-wider mb-1">FROM</span>
            <span>{origin || 'Not selected'}</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-white/60 text-xs tracking-wider mb-1">TO</span>
            <span>{destination || 'Not selected'}</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-white/60 text-xs tracking-wider mb-1">DATE</span>
            <span>{date || 'Not selected'}</span>
          </div>
          <div className="w-px h-8 bg-white/20 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-white/60 text-xs tracking-wider mb-1">TRAVELLERS</span>
            <span>{travellers || 'Not selected'}</span>
          </div>
        </div>
        
        <Link 
          href="/" 
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Modify Search</span>
        </Link>
        
      </div>
    </div>
  );
}
