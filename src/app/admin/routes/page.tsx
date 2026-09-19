"use client";

import React, { useEffect, useState } from 'react';
import { GitBranch, Plus, Search, X } from 'lucide-react';
import { getRoutes, createRoute, updateRoute, deleteRoute, getStations } from '@/services/supabaseAdminService';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

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

interface RouteForm {
  name: string;
  origin_station_id: string;
  destination_station_id: string;
  distance_km: string;
  estimated_duration_minutes: string;
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
  if (!totalMinutes) return '—';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

const EMPTY_FORM: RouteForm = {
  name: '',
  origin_station_id: '',
  destination_station_id: '',
  distance_km: '',
  estimated_duration_minutes: '',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Unified form state
  const [form, setForm] = useState<RouteForm>(EMPTY_FORM);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  async function fetchData() {
    setIsLoading(true);
    const [routesData, stationsData] = await Promise.all([getRoutes(), getStations()]);
    setRoutes(routesData as Route[]);
    setStations(stationsData as Station[]);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------------------------------------------------------------------
  // Form helpers
  // ---------------------------------------------------------------------------

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ---------------------------------------------------------------------------
  // Modal helpers
  // ---------------------------------------------------------------------------

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  }

  function openEditModal(route: Route) {
    setEditingId(route.id);
    setForm({
      name: route.name || '',
      origin_station_id: route.origin_station_id || '',
      destination_station_id: route.destination_station_id || '',
      distance_km: String(route.distance_km || ''),
      estimated_duration_minutes: String(route.estimated_duration_minutes || ''),
    });
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  // ---------------------------------------------------------------------------
  // Save & Delete handlers
  // ---------------------------------------------------------------------------

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.origin_station_id) {
      setFormError('Please select an origin station.');
      return;
    }
    if (!form.destination_station_id) {
      setFormError('Please select a destination station.');
      return;
    }
    if (form.origin_station_id === form.destination_station_id) {
      setFormError('Origin and destination must be different.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        origin_station_id: form.origin_station_id,
        destination_station_id: form.destination_station_id,
        distance_km: form.distance_km ? parseFloat(form.distance_km) : 0,
        estimated_duration_minutes: form.estimated_duration_minutes ? parseInt(form.estimated_duration_minutes) : 0,
      };

      if (editingId) {
        await updateRoute(editingId, payload);
      } else {
        await createRoute(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      await fetchData();
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to save route. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete route "${name}"?`)) return;
    try {
      await deleteRoute(id);
      await fetchData();
    } catch (err: any) {
      alert('Error deleting route: ' + (err?.message ?? 'Unknown error'));
    }
  }

  // ---------------------------------------------------------------------------
  // Filtered routes
  // ---------------------------------------------------------------------------

  const filtered = routes.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.name || '').toLowerCase().includes(q) ||
      (r.origin_station?.name ?? '').toLowerCase().includes(q) ||
      (r.destination_station?.name ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Routes</h1>
          <p className="text-secondary mt-1 text-sm">
            Manage travel routes connecting stations across the network.
          </p>
        </div>
        <button
          onClick={openAddModal}
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
        {isLoading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="p-8 flex items-center justify-center min-h-[400px]">
            <AdminEmptyState
              icon={GitBranch}
              title="No routes have been configured."
              description="Define routes by connecting an origin and destination station."
              actionLabel="Add Route"
              onAction={openAddModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
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
                    <td className="px-6 py-4 text-secondary">
                      {route.origin_station?.name ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {route.destination_station?.name ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {route.distance_km ? `${route.distance_km} km` : '—'}
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {formatDuration(route.estimated_duration_minutes)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                      <button
                        onClick={() => openEditModal(route)}
                        className="text-primary hover:text-accent cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.id, route.name)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">
                {editingId ? 'Edit Route' : 'Add New Route'}
              </h2>
              <button
                onClick={closeModal}
                className="text-secondary hover:text-primary cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">

              {/* Route Name */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Route Name (Optional)
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
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
                  name="origin_station_id"
                  value={form.origin_station_id}
                  onChange={handleFormChange}
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
                  name="destination_station_id"
                  value={form.destination_station_id}
                  onChange={handleFormChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select destination station</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Distance & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    name="distance_km"
                    value={form.distance_km}
                    onChange={handleFormChange}
                    placeholder="e.g. 1450"
                    className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="estimated_duration_minutes"
                    value={form.estimated_duration_minutes}
                    onChange={handleFormChange}
                    placeholder="e.g. 1020"
                    className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-xs">{formError}</p>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-secondary border border-border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-opacity-90 cursor-pointer disabled:opacity-60 transition-opacity"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Route' : 'Add Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
