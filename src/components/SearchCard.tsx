"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, ArrowDownUp, Sparkles } from 'lucide-react';

export default function SearchCard() {
  const [activeTab, setActiveTab] = useState('compare');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-09-25');
  const [travellers, setTravellers] = useState('1');

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      setDepartureDate(today);
    } catch {
      // keep fallback
    }
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    window.location.href = `/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&date=${encodeURIComponent(departureDate)}&travellers=${encodeURIComponent(travellers)}&type=${activeTab}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-[1200px]">
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab('trains')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors cursor-pointer ${
            activeTab === 'trains' 
              ? 'text-primary border-b-2 border-primary font-bold' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          Trains
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors cursor-pointer ${
            activeTab === 'buses' 
              ? 'text-primary border-b-2 border-primary font-bold' 
              : 'text-secondary hover:text-primary'
          }`}
        >
          Buses
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-6 py-3 font-medium text-sm md:text-base transition-colors cursor-pointer ${
            activeTab === 'compare' 
              ? 'text-accent border-b-2 border-accent font-bold' 
              : 'text-secondary hover:text-accent'
          }`}
        >
          Compare
        </button>
      </div>

      {/* Form Fields */}
      <form className="flex flex-col lg:flex-row lg:items-end gap-4 md:gap-3 w-full" onSubmit={handleSearch}>
        
        {/* Origin / Destination with Swap */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-3 flex-1 relative min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="origin" className="text-sm font-semibold text-primary mb-1.5">From</label>
            <input 
              id="origin"
              type="text" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Haldibari or Siliguri"
              className="border border-border rounded px-3 py-2.5 text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow w-full"
            />
          </div>

          {/* Swap Button */}
          <div className="absolute right-4 top-[50%] -translate-y-[10px] md:translate-y-0 md:static md:flex md:items-end md:justify-center md:pb-1 z-10 shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap origin and destination"
              className="bg-white md:bg-background border border-border text-primary p-2 rounded-full shadow-sm md:shadow-none hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
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
            <label htmlFor="departure" className="text-sm font-semibold text-primary mb-1.5 cursor-pointer">Departure</label>
            <input 
              id="departure"
              type="date" 
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="border border-border rounded px-2 md:px-3 py-2.5 text-sm md:text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white w-full cursor-pointer hover:border-gray-400"
            />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <label htmlFor="return" className="text-sm font-semibold text-primary mb-1.5 whitespace-nowrap cursor-pointer">Return <span className="hidden xl:inline">(Optional)</span></label>
            <input 
              id="return"
              type="date" 
              className="border border-border rounded px-2 md:px-3 py-2.5 text-sm md:text-base text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white w-full cursor-pointer hover:border-gray-400"
            />
          </div>
        </div>

        {/* Travellers & Search Button */}
        <div className="flex flex-row lg:flex-row gap-3 lg:shrink-0">
          <div className="flex flex-col flex-1 sm:w-32 lg:w-32 shrink-0">
            <label htmlFor="travellers" className="text-sm font-semibold text-primary mb-1.5 cursor-pointer">Travellers</label>
            <select 
              id="travellers"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
              className="border border-border rounded px-3 py-2.5 text-base text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-white appearance-none w-full cursor-pointer hover:border-gray-400"
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
              className="bg-gradient-to-r from-accent to-[#e09b00] hover:from-[#e09b00] hover:to-[#cc8a00] text-primary font-bold text-lg px-2 md:px-4 py-2.5 h-[46px] rounded shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

      </form>

      {/* Quick routes recommendation */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs text-secondary">
        <span className="flex items-center gap-1 font-medium text-primary">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Popular routes:
        </span>
        <button
          type="button"
          onClick={() => handleQuickRoute('Haldibari', 'Kolkata')}
          className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-primary transition-colors cursor-pointer"
        >
          Haldibari → Kolkata
        </button>
        <button
          type="button"
          onClick={() => handleQuickRoute('Siliguri', 'Kolkata')}
          className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-primary transition-colors cursor-pointer"
        >
          Siliguri → Kolkata
        </button>
        <button
          type="button"
          onClick={() => handleQuickRoute('Kolkata', 'Haldibari')}
          className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-primary transition-colors cursor-pointer"
        >
          Kolkata → Haldibari
        </button>
      </div>
    </div>
  );
}
