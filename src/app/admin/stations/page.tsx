"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Search, X } from 'lucide-react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { getStations, createStation } from '@/services/supabaseAdminService';

const INITIAL_FORM = {
  name: '',
  code: '',
  city: '',
  type: 'train',
  status: 'active',
};

export default function AdminStationsPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  async function loadStations() {
    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStations();
  }, []);

  function openModal() {
    setForm(INITIAL_FORM);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm(INITIAL_FORM);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createStation(form);
      await loadStations();
      closeModal();
    } catch (err: any) {
      alert('Error creating station: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Stations</h1>
          <p className="text-secondary mt-1">Manage physical travel locations and stops.</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Station</span>
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by name or code..."
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || stations.length === 0}
            />
          </div>
          <select
            disabled={isLoading || stations.length === 0}
            className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary hidden sm:block cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Content */}
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center px-6 py-4 gap-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-5 bg-gray-200 rounded w-14 ml-auto" />
                </div>
              ))}
            </div>
          ) : stations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState
                icon={MapPin}
                title="No stations have been added yet."
                description="Add physical stations before creating routes."
                actionLabel="Add Station"
                onAction={openModal}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Code</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">City</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station: any) => (
                  <tr key={station.id} className="border-b border-border hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary">{station.name}</td>
                    <td className="px-6 py-4 text-secondary font-mono uppercase">{station.code}</td>
                    <td className="px-6 py-4 text-secondary">{station.city}</td>
                    <td className="px-6 py-4 text-secondary capitalize">{station.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          station.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-gray-100 text-secondary'
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent font-medium cursor-pointer hover:underline text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Station Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">Add Station</h2>
              <button onClick={closeModal} className="text-secondary hover:text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">

              {/* Station Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-primary">Station Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi Railway Station"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Station Code */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-primary">Station Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NDLS"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary font-mono uppercase"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-primary">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-primary">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-secondary border border-border rounded hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Add Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
