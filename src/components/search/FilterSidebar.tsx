import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  onClose?: () => void;
  className?: string;
}

export default function FilterSidebar({ onClose, className = '' }: FilterSidebarProps) {
  return (
    <div className={`bg-white rounded-lg border border-border p-5 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-primary flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </h3>
        {onClose && (
          <button onClick={onClose} className="text-secondary hover:text-primary md:hidden" aria-label="Close filters">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Since we have no data, we only show logical filter placeholders that make sense for travel */}
      
      <div className="mb-6">
        <h4 className="font-semibold text-sm text-primary mb-3">Departure Time</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Morning (06:00 - 12:00)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Afternoon (12:00 - 18:00)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Evening (18:00 - 00:00)</span>
          </label>
        </div>
      </div>

      <div className="mb-6 border-t border-border pt-6">
        <h4 className="font-semibold text-sm text-primary mb-3">Vehicle Type</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">AC</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Non-AC</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Sleeper</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4" />
            <span className="text-sm text-secondary">Seater</span>
          </label>
        </div>
      </div>

      <button className="w-full text-secondary hover:text-primary font-medium text-sm py-2 underline underline-offset-2">
        Reset filters
      </button>

    </div>
  );
}
