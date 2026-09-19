"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { MapPin, Plus, Search } from 'lucide-react';
import { getStations } from '@/services/supabaseAdminService';

export default function AdminStationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Stations</h1>
          <p className="text-secondary mt-1">Manage physical travel locations and stops.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span>Add Station</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || stations.length === 0}
            />
          </div>
          <select disabled={isLoading || stations.length === 0} className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary hidden sm:block">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          ) : stations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState 
                icon={MapPin}
                title="No stations have been added yet."
                description="Add physical stations before creating routes."
                actionLabel="Add station"
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Code</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">City</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
