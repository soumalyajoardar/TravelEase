'use client';

import React, { useEffect, useState } from 'react';
import { Bus, Plus, Search, X, Loader2 } from 'lucide-react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import {
  getBusServices,
  createBusService,
  getOperators,
  getRoutes,
} from '@/services/supabaseAdminService';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUS_TYPES = ['Sleeper', 'Semi-Sleeper', 'Seater', 'AC Sleeper'] as const;

const SKELETON_ROWS = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// TableSkeleton
// ---------------------------------------------------------------------------

function TableSkeleton() {
  const cols = ['Service Name', 'Bus No.', 'Operator Name', 'Type', 'Status', 'Actions'];
  return (
    <table className="w-full text-left text-sm whitespace-nowrap">
      <thead className="bg-gray-50 border-b border-border text-secondary">
        <tr>
          {cols.map((col) => (
            <th
              key={col}
              className="px-6 py-3 font-medium uppercase tracking-wider text-xs"
            >
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

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminBusServicesPage() {
  // Data
  const [services, setServices] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');

  // Form
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        const [svcData, opData, rtData] = await Promise.all([
          getBusServices(),
          getOperators(),
          getRoutes(),
        ]);
        setServices(svcData);
        setOperators(opData);
        setRoutes(rtData);
      } catch (err) {
        console.error('Failed to load bus services data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // -------------------------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------------------------

  function openModal() {
    setForm(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // -------------------------------------------------------------------------
  // Create
  // -------------------------------------------------------------------------

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Service name is required.');
      return;
    }
    if (!form.bus_number.trim()) {
      setFormError('Bus number is required.');
      return;
    }
    if (!form.operator_id) {
      setFormError('Please select an operator.');
      return;
    }
    if (!form.route_id) {
      setFormError('Please select a route.');
      return;
    }
    if (!form.bus_type) {
      setFormError('Please select a bus type.');
      return;
    }
    if (!form.total_seats || parseInt(form.total_seats) <= 0) {
      setFormError('Total seats must be a positive number.');
      return;
    }

    setIsSaving(true);
    try {
      await createBusService({
        name: form.name.trim(),
        bus_number: form.bus_number.trim(),
        operator_id: form.operator_id,
        route_id: form.route_id,
        bus_type: form.bus_type,
        total_seats: parseInt(form.total_seats),
        status: form.status,
      });
      const updated = await getBusServices();
      setServices(updated);
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(
        err?.message || 'Failed to create bus service. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

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
          onClick={openModal}
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
                onAction={openModal}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                    Service Name
                  </th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                    Bus No.
                  </th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                    Operator Name
                  </th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                    Type
                  </th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-secondary text-sm"
                    >
                      No results found for &quot;{search}&quot;.
                    </td>
                  </tr>
                ) : (
                  filtered.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-primary">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-secondary font-mono">
                        {service.bus_number}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {service.operator?.name ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {service.bus_type ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm text-primary font-medium hover:underline cursor-pointer">
                          View
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Bus className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-primary">Add Bus Service</h2>
              </div>
              <button
                onClick={closeModal}
                disabled={isSaving}
                className="text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
                  {formError}
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Volvo AC Sleeper Express"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Bus Number */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Bus Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bus_number"
                  value={form.bus_number}
                  onChange={handleChange}
                  placeholder="e.g. WB-12-AB-3456"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Operator */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Operator <span className="text-red-500">*</span>
                </label>
                <select
                  name="operator_id"
                  value={form.operator_id}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Select operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Route */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Route <span className="text-red-500">*</span>
                </label>
                <select
                  name="route_id"
                  value={form.route_id}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Select route</option>
                  {routes.map((rt) => (
                    <option key={rt.id} value={rt.id}>
                      {rt.origin_station?.name ?? rt.origin_station_id}
                      {' \u2192 '}
                      {rt.destination_station?.name ?? rt.destination_station_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bus Type */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Bus Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="bus_type"
                  value={form.bus_type}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white cursor-pointer"
                >
                  <option value="">Select bus type</option>
                  {BUS_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Total Seats <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="total_seats"
                  value={form.total_seats}
                  onChange={handleChange}
                  min={1}
                  placeholder="e.g. 40"
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-secondary border border-border rounded hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Service</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
