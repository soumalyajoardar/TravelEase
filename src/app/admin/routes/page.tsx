"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { GitBranch, Plus, Search, X } from 'lucide-react';
import { getRoutes, createRoute, getStations } from '@/services/supabaseAdminService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Station {
  id: string;
  name: string;
}

interface Route {
  id: string;
  name: string;
  origin_station_id: string;
  destination_station_id: string;
  distance_km: number;
  estimated_duration_minutes: number;
  origin_station?: { name: string } | null;
  destination_station?: { name: string } | null;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/5" />
          <div className="h-4 bg-gray-200 rounded w-1/5" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
          <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  async function fetchData() {
    setLoading(true);
    const [routesData, stationsData] = await Promise.all([getRoutes(), getStations()]);
    setRoutes(routesData as Route[]);
    setStations(stationsData as Station[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------------------------------------------------------------------
  // Modal helpers
  // ---------------------------------------------------------------------------

  function openModal() {
    setName('');
    setOriginId('');
    setDestinationId('');
    setDistance('');
    setDuration('');
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) { setFormError('Route name is required.'); return; }
    if (!originId) { setFormError('Please select an origin station.'); return; }
    if (!destinationId) { setFormError('Please select a destination station.'); return; }
    if (originId === destinationId) { setFormError('Origin and destination must be different.'); return; }
    if (!distance || parseFloat(distance) <= 0) { setFormError('Please enter a valid distance.'); return; }
    if (!duration || parseInt(duration) <= 0) { setFormError('Please enter a valid duration.'); return; }

    setSubmitting(true);
    try {
      await createRoute({
        name: name.trim(),
        origin_station_id: originId,
        destination_station_id: destinationId,
        distance_km: parseFloat(distance),
        estimated_duration_minutes: parseInt(duration),
      });
      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to create route. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtered routes
  // ---------------------------------------------------------------------------

  const filtered = routes.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.origin_station?.name ?? '').toLowerCase().includes(q) ||
      (r.destination_station?.name ?? '').toLowerCase().includes(q)
    );
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Routes</h1>
          <p className="text-secondary mt-1 text-sm">Manage travel routes connecting stations across the network.</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Search Bar */}
        <div className="p-4 border-b border-border bg-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <AdminEmptyState
              icon={GitBranch}
              title="No routes have been configured."
              description="Define routes by connecting an origin and destination station."
              actionLabel="Add Route"
              onAction={openModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-left text-secondary">
                  <th className="px-6 py-3 font-medium">Route Name</th>
                  <th className="px-6 py-3 font-medium">Origin</th>
                  <th className="px-6 py-3 font-medium">Destination</th>
                  <th className="px-6 py-3 font-medium">Distance</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{route.name}</td>
                    <td className="px-6 py-4 text-secondary">{route.origin_station?.name ?? '-'}</td>
                    <td className="px-6 py-4 text-secondary">{route.destination_station?.name ?? '-'}</td>
                    <td className="px-6 py-4 text-secondary">{route.distance_km} km</td>
                    <td className="px-6 py-4 text-secondary">{formatDuration(route.estimated_duration_minutes)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary text-sm font-medium hover:underline cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">Add New Route</h2>
              <button onClick={closeModal} className="text-secondary hover:text-primary cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              {/* Route Name */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Route Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kolkata to Delhi Express"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Origin Station */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Origin Station <span className="text-red-500">*</span>
                </label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select origin station</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Destination Station */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Destination Station <span className="text-red-500">*</span>
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select destination station</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Distance & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Distance (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. 1450"
                    className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 1320"
                    className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded border border-border text-secondary hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded bg-primary text-white font-medium hover:bg-opacity-90 cursor-pointer transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Create Route'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
