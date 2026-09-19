"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Search, X } from 'lucide-react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { getStations, createStation, updateStation, deleteStation } from '@/services/supabaseAdminService';

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  function openAddModal() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(st: any) {
    setEditingId(st.id);
    setForm({
      name: st.name || '',
      code: st.code || '',
      city: st.city || '',
      type: st.type || 'train',
      status: st.status || 'active',
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateStation(editingId, form);
      } else {
        await createStation(form);
      }
      await loadStations();
      closeModal();
    } catch (err: any) {
      alert('Error saving station: ' + (err?.message ?? 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteStation(id);
      await loadStations();
    } catch (err: any) {
      alert('Error deleting station: ' + (err?.message ?? 'Unknown error'));
    }
  }

  const filteredStations = stations.filter((st) => {
    const matchesSearch =
      st.name?.toLowerCase().includes(search.toLowerCase()) ||
      st.code?.toLowerCase().includes(search.toLowerCase()) ||
      st.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Stations</h1>
          <p className="text-secondary mt-1">Manage physical travel locations and stops.</p>
        </div>
        <button
          onClick={openAddModal}
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
              placeholder="Search by name, code, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || stations.length === 0}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading || stations.length === 0}
            className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary hidden sm:block cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col gap-3 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-12 ml-auto" />
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
                onAction={openAddModal}
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
                {filteredStations.map((station: any) => (
                  <tr key={station.id} className="border-b border-border hover:bg-gray-50">
                    <td className="px-6 py-4 text-primary font-medium">{station.name}</td>
                    <td className="px-6 py-4 text-secondary font-mono">{station.code}</td>
                    <td className="px-6 py-4 text-secondary">{station.city}</td>
                    <td className="px-6 py-4 text-secondary capitalize">{station.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                          station.status === 'active'
                            ? 'bg-success/10 text-success'
                            : 'bg-gray-100 text-secondary'
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                      <button
                        onClick={() => openEditModal(station)}
                        className="text-primary hover:text-accent cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(station.id, station.name)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Station Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">
                {editingId ? 'Edit Station' : 'Add Station'}
              </h2>
              <button onClick={closeModal} className="text-secondary hover:text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">

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

              {/* Status */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-primary">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  {isSaving ? 'Saving...' : editingId ? 'Update Station' : 'Add Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
