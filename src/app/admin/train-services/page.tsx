'use client';

import React, { useEffect, useState } from 'react';
import { TramFront, Plus, Search, X, Loader2 } from 'lucide-react';
import { getTrainServices, createTrainService, updateTrainService, deleteTrainService, getOperators, getRoutes } from '@/services/supabaseAdminService';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

const INITIAL_FORM = {
  name: '',
  train_number: '',
  operator_id: '',
  route_id: '',
  total_seats: '',
  status: 'active',
};

export default function AdminTrainServicesPage() {
  const [services, setServices]   = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [routes, setRoutes]       = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  async function load() {
    try {
      const [svcData, opData, rtData] = await Promise.all([
        getTrainServices(),
        getOperators(),
        getRoutes(),
      ]);
      setServices(svcData ?? []);
      setOperators(opData ?? []);
      setRoutes(rtData ?? []);
    } catch (err) {
      console.error('Failed to load train service data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.train_number?.toLowerCase().includes(q)
    );
  });

  function openAddModal() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  }

  function openEditModal(s: any) {
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      train_number: s.train_number || '',
      operator_id: s.operator_id || '',
      route_id: s.route_id || '',
      total_seats: String(s.total_seats || '100'),
      status: s.status || 'active',
    });
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim())         { setFormError('Service name is required.');      return; }
    if (!form.train_number.trim()) { setFormError('Train number is required.');      return; }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        train_number: form.train_number.trim(),
        operator_id: form.operator_id || null,
        route_id: form.route_id || null,
        total_seats: parseInt(form.total_seats || '100', 10),
        status: form.status,
      };

      if (editingId) {
        await updateTrainService(editingId, payload);
      } else {
        await createTrainService(payload);
      }

      await load();
      closeModal();
    } catch (err: any) {
      setFormError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete train service "${name}"?`)) return;
    try {
      await deleteTrainService(id);
      await load();
    } catch (err: any) {
      alert('Error deleting train service: ' + (err?.message ?? 'Unknown error'));
    }
  }

  function routeLabel(rt: any) {
    const origin = rt.origin_station?.name ?? rt.origin_station_id ?? '?';
    const dest   = rt.destination_station?.name ?? rt.destination_station_id ?? '?';
    return `${origin} → ${dest}`;
  }

  function SkeletonRows() {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="animate-pulse border-b border-border">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16" /></td>
            <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-12 ml-auto" /></td>
          </tr>
        ))}
      </>
    );
  }

  function StatusBadge({ status }: { status: string }) {
    const isActive = status === 'active';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Train Services</h1>
          <p className="text-secondary mt-1">Manage scheduled train routes and operational status.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Train Service</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Table / states */}
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  {['Service Name', 'Train No.', 'Operator Name', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <SkeletonRows />
              </tbody>
            </table>
          ) : services.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState
                icon={TramFront}
                title="No train services added yet."
                description="Create train services before scheduling them."
                actionLabel="Add Train Service"
                onAction={openAddModal}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Service Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Train No.</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Operator Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary text-sm">
                      No services match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">{s.name}</td>
                      <td className="px-6 py-4 text-secondary font-mono">{s.train_number}</td>
                      <td className="px-6 py-4 text-secondary">
                        {operators.find((o) => o.id === s.operator_id)?.name ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                        <button
                          onClick={() => openEditModal(s)}
                          className="text-primary hover:text-accent cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        {!isLoading && services.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-gray-50 text-xs text-secondary">
            Showing {filtered.length} of {services.length} service{services.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">
                {editingId ? 'Edit Train Service' : 'Add Train Service'}
              </h2>
              <button
                onClick={closeModal}
                className="text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  {formError}
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleField}
                  placeholder="e.g. Rajdhani Express"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Train Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Train Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="train_number"
                  value={form.train_number}
                  onChange={handleField}
                  placeholder="e.g. 12301"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Operator */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Operator
                </label>
                <select
                  name="operator_id"
                  value={form.operator_id}
                  onChange={handleField}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select an operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Route */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Route
                </label>
                <select
                  name="route_id"
                  value={form.route_id}
                  onChange={handleField}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select a route</option>
                  {routes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {routeLabel(rt)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleField}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm border border-border rounded text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSaving ? 'Saving...' : editingId ? 'Update Service' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
