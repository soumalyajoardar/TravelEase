'use client';

import React, { useEffect, useState } from 'react';
import { Bus, Plus, Search, X, Loader2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import {
  getBusServices,
  createBusService,
  updateBusService,
  deleteBusService,
  getOperators,
  getRoutes,
} from '@/services/supabaseAdminService';

const BUS_TYPES = ['Sleeper', 'Semi-Sleeper', 'Seater', 'AC Sleeper'] as const;
const SKELETON_ROWS = 5;

interface FormState {
  name: string;
  bus_number: string;
  operator_id: string;
  route_id: string;
  bus_type: string;
  total_seats: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  bus_number: '',
  operator_id: '',
  route_id: '',
  bus_type: 'Sleeper',
  total_seats: '',
  status: 'active',
};

function TableSkeleton() {
  const cols = ['Service Name', 'Bus No.', 'Operator Name', 'Type', 'Status', 'Actions'];
  return (
    <table className="w-full text-left text-sm whitespace-nowrap">
      <thead className="bg-gray-50 border-b border-border text-secondary">
        <tr>
          {cols.map((col) => (
            <th key={col} className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <tr key={i} className="border-b border-border animate-pulse">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
            <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded-full w-16" /></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-14 ml-auto" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {status ?? 'Unknown'}
    </span>
  );
}

export default function AdminBusServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    try {
      const [busData, opData, routeData] = await Promise.all([
        getBusServices(),
        getOperators(),
        getRoutes(),
      ]);
      setServices(busData);
      setOperators(opData);
      setRoutes(routeData);
    } catch (err) {
      console.error('Failed to load bus services data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  }

  function openEditModal(service: any) {
    setEditingId(service.id);
    setForm({
      name: service.name || '',
      bus_number: service.bus_number || '',
      operator_id: service.operator_id || '',
      route_id: service.route_id || '',
      bus_type: service.bus_type || 'Sleeper',
      total_seats: String(service.total_seats || '40'),
      status: service.status || 'active',
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Service name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        bus_number: form.bus_number.trim(),
        operator_id: form.operator_id || null,
        route_id: form.route_id || null,
        bus_type: form.bus_type,
        total_seats: parseInt(form.total_seats || '40', 10),
        status: form.status,
      };

      if (editingId) {
        await updateBusService(editingId, payload);
      } else {
        await createBusService(payload);
      }

      await loadData();
      closeModal();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save bus service. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete bus service "${name}"?`)) return;
    try {
      await deleteBusService(id);
      await loadData();
    } catch (err: any) {
      alert('Error deleting bus service: ' + (err?.message ?? 'Unknown error'));
    }
  }

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Bus Services</h1>
          <p className="text-secondary mt-1 text-sm">
            Manage bus inventory and vehicle types.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bus Service</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by service name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading || services.length === 0}
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <TableSkeleton />
          ) : services.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState
                icon={Bus}
                title="No bus services added yet."
                description="Create bus services before scheduling them."
                actionLabel="Add Bus Service"
                onAction={openAddModal}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Service Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Bus No.</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Operator Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-secondary text-sm">
                      No results found for &quot;{search}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">{service.name}</td>
                      <td className="px-6 py-4 text-secondary font-mono">{service.bus_number}</td>
                      <td className="px-6 py-4 text-secondary">
                        {operators.find((o) => o.id === service.operator_id)?.name ?? service.operator?.name ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-secondary">{service.bus_type ?? '—'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                        <button
                          onClick={() => openEditModal(service)}
                          className="text-primary hover:text-accent cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-primary">
                {editingId ? 'Edit Bus Service' : 'Add Bus Service'}
              </h2>
              <button onClick={closeModal} className="text-secondary hover:text-primary transition-colors cursor-pointer">
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
                  onChange={handleChange}
                  placeholder="e.g. Volvo AC Sleeper"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Bus Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Bus Number
                </label>
                <input
                  type="text"
                  name="bus_number"
                  value={form.bus_number}
                  onChange={handleChange}
                  placeholder="e.g. DL-01-AB-1234"
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
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  ))}
                </select>
              </div>

              {/* Bus Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Bus Type
                </label>
                <select
                  name="bus_type"
                  value={form.bus_type}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  {BUS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Total Seats
                </label>
                <input
                  type="number"
                  name="total_seats"
                  value={form.total_seats}
                  onChange={handleChange}
                  placeholder="40"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
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
