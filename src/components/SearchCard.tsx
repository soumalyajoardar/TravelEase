"use client";

import React, { useState } from 'react';
import { ArrowLeftRight, ArrowDownUp } from 'lucide-react';

export default function SearchCard() {
  const [activeTab, setActiveTab] = useState('compare');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-[1200px]">
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab('trains')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'trains' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          Trains
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'buses' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          Buses
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors ${
            activeTab === 'compare' 
              ? 'text-accent border-b-2 border-accent' 
              : 'text-secondary hover:text-accent'
          }`}
        >
          Compare
        </button>
      </div>

      {/* Form Fields */}
      <form className="flex flex-col lg:flex-row lg:items-end gap-4 md:gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
        
        {/* Origin / Destination with Swap */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-3 flex-1 relative min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="origin" className="text-sm font-semibold text-primary mb-1.5">From</label>
            <input 
              id="origin"
              type="text" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Siliguri"
              className="border border-border rounded px-3 py-2.5 text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow w-full"
            />
          </div>

          {/* Swap Button */}
          <div className="absolute right-4 top-[50%] -translate-y-[10px] md:translate-y-0 md:static md:flex md:items-end md:justify-center md:pb-1 z-10 shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination"
              className="bg-white md:bg-background border border-border text-primary p-2 rounded-full shadow-sm md:shadow-none hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ArrowLeftRight className="hidden md:block w-4 h-4" aria-hidden="true" />
              <ArrowDownUp className="block md:hidden w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="destination" className="text-sm font-semibold text-primary mb-1.5">To</label>
            <input 
              id="destination"
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kolkata"
              className="border border-border rounded px-3 py-2.5 text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow w-full"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-row gap-3 flex-1 min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="departure" className="text-sm font-semibold text-primary mb-1.5">Departure</label>
            <input 
              id="departure"
              type="date" 
              defaultValue="2026-09-20"
              className="border border-border rounded px-2 md:px-3 py-2.5 text-sm md:text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white w-full"
            />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="return" className="text-sm font-semibold text-primary mb-1.5 whitespace-nowrap">Return <span className="hidden xl:inline">(Optional)</span></label>
            <input 
              id="return"
              type="date"
              className="border border-border rounded px-2 md:px-3 py-2.5 text-sm md:text-base text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white w-full"
            />
          </div>
        </div>

        {/* Travellers & Search Button */}
        <div className="flex flex-row lg:flex-row gap-3 lg:shrink-0">
          <div className="flex flex-col flex-1 sm:w-32 lg:w-32 shrink-0">
            <label htmlFor="travellers" className="text-sm font-semibold text-primary mb-1.5">Travellers</label>
            <select 
              id="travellers"
              className="border border-border rounded px-3 py-2.5 text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white appearance-none w-full"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
            </select>
          </div>
          
          <div className="flex flex-col justify-end flex-1 sm:w-32 lg:w-36 shrink-0">
            <button 
              type="submit"
              onClick={() => {
                const date = (document.getElementById('departure') as HTMLInputElement)?.value || '';
                const travellers = (document.getElementById('travellers') as HTMLSelectElement)?.value || '1';
                window.location.href = `/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}&travellers=${encodeURIComponent(travellers)}&type=${activeTab}`;
              }}
              className="bg-accent hover:bg-[#e09b00] text-primary font-bold text-lg px-2 md:px-4 py-2.5 h-[46px] rounded transition-colors w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Search
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
