"use client";

import React from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Map, Plus } from 'lucide-react';

export default function AdminRoutesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Routes</h1>
          <p className="text-secondary mt-1">Manage travel routes and stations.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90">
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {/* Mock Search/Filter Bar */}
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search routes..." 
            className="flex-1 max-w-sm border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            disabled
          />
          <select disabled className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        
        {/* Data Table / Empty State */}
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <AdminEmptyState 
            icon={Map}
            title="No routes have been added yet."
            description="Create your first route to start establishing the travel network."
            actionLabel="Add route"
          />
        </div>
      </div>

    </div>
  );
}
