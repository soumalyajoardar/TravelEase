"use client";

import React, { useState, useEffect } from 'react';
import SearchSummary from './SearchSummary';
import FilterSidebar from './FilterSidebar';
import { TrainResultCard, BusResultCard } from './ResultCards';
import EmptyState from './EmptyState';
import ComparisonView from './ComparisonView';
import { searchTravelRecords } from '@/services/travelService';
import { TravelRecord, TrainRecord, BusRecord } from '@/types/travel';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface SearchClientProps {
  initialOrigin: string;
  initialDestination: string;
  initialDate: string;
  initialTravellers: string;
  initialType: string;
}

export default function SearchClient({
  initialOrigin,
  initialDestination,
  initialDate,
  initialTravellers,
  initialType,
}: SearchClientProps) {
  const [activeTab, setActiveTab] = useState(initialType || 'all');
  const [records, setRecords] = useState<TravelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');

  const hasParams = initialOrigin || initialDestination;

  useEffect(() => {
    if (!hasParams) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const data = await searchTravelRecords(initialOrigin, initialDestination, activeTab);
        setRecords(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialOrigin, initialDestination, activeTab, hasParams]);

  const handleCompareToggle = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getFilteredAndSortedRecords = () => {
    let sorted = [...records];
    
    // Sort logic
    if (sortOption === 'price') {
      sorted.sort((a, b) => (a.fare?.total || 0) - (b.fare?.total || 0));
    } else if (sortOption === 'duration') {
      // Simplistic duration sort, assuming HHh MMm format roughly alphabetically sorting correctly for similar lengths or parsing it
      // For now simple sort
      sorted.sort((a, b) => a.duration.localeCompare(b.duration));
    }
    
    if (activeTab === 'compare') {
      return sorted.filter(r => compareIds.includes(r.id));
    }
    
    return sorted;
  };

  const displayedRecords = getFilteredAndSortedRecords();
  const comparingRecords = records.filter(r => compareIds.includes(r.id));

  // Determine what content to show based on state
  let content;

  if (!hasParams) {
    content = <EmptyState type="no-params" />;
  } else if (isLoading) {
    content = (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-border rounded-lg p-5 flex flex-col md:flex-row gap-6 animate-pulse">
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="flex justify-between">
                <div className="h-10 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mt-3"></div>
                <div className="h-10 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="md:w-64 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-primary mb-3">Unable to load travel options</h2>
        <p className="text-secondary mb-8">Please try again.</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-white font-medium px-8 py-3 rounded">
          Retry
        </button>
      </div>
    );
  } else if (records.length === 0) {
    content = <EmptyState type="no-results" />;
  } else if (activeTab === 'compare') {
    content = <ComparisonView records={comparingRecords} onRemove={handleCompareToggle} />;
  } else {
    content = (
      <div className="space-y-4">
        {displayedRecords.map(record => {
          if (record.type === 'train') {
            return (
              <TrainResultCard 
                key={record.id} 
                record={record as TrainRecord} 
                isComparing={compareIds.includes(record.id)}
                onCompareToggle={handleCompareToggle}
              />
            );
          } else {
            return (
              <BusResultCard 
                key={record.id} 
                record={record as BusRecord} 
                isComparing={compareIds.includes(record.id)}
                onCompareToggle={handleCompareToggle}
              />
            );
          }
        })}
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-12">
      <SearchSummary 
        origin={initialOrigin} 
        destination={initialDestination} 
        date={initialDate} 
        travellers={initialTravellers} 
      />

      {hasParams && (
        <div className="bg-white border-b border-border shadow-sm sticky top-[104px] md:top-[120px] z-30">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex overflow-x-auto hide-scrollbar">
            {['all', 'trains', 'buses', 'compare'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'compare' && compareIds.length > 0 && (
                  <span className="ml-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                    {compareIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex gap-8">
        
        {/* Desktop Filters */}
        {hasParams && activeTab !== 'compare' && (
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          
          {hasParams && !isLoading && !error && records.length > 0 && activeTab !== 'compare' && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-primary text-lg">
                {displayedRecords.length} option{displayedRecords.length !== 1 ? 's' : ''} found
              </h2>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary hidden md:inline">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-border rounded px-3 py-2 text-sm text-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  aria-label="Sort by"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price">Lowest price</option>
                  <option value="duration">Shortest duration</option>
                </select>
              </div>
            </div>
          )}

          {content}
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      {hasParams && activeTab !== 'compare' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 bg-white border border-border text-primary font-medium py-3 rounded flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="flex-1 bg-white border border-border text-primary font-medium py-3 rounded flex items-center justify-center space-x-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
      )}

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-end lg:hidden">
          <div className="bg-white w-full h-[85vh] rounded-t-xl overflow-y-auto">
            <FilterSidebar onClose={() => setShowMobileFilters(false)} className="border-0 rounded-none shadow-none" />
            <div className="sticky bottom-0 p-4 bg-white border-t border-border">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary text-white font-medium py-3 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
