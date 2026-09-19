'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Search, X, Train, Bus, Clock, IndianRupee } from 'lucide-react';
import { getSchedules, createSchedule, getTrainServices, getBusServices } from '@/services/supabaseAdminService';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const minute = m ?? '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${minute} ${ampm}`;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    delayed: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-600',
  };
  const cls = map[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status ?? 'unknown'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Initial form state
// ---------------------------------------------------------------------------

const INITIAL_FORM = {
  service_type: 'train' as 'train' | 'bus',
  service_id: '',
  travel_date: '',
  departure_time: '',
  arrival_time: '',
  available_seats: '',
  base_fare: '',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSchedulesPage() {
  // Data state
  const [schedules, setSchedules] = useState<any[]>([]);
  const [trainServices, setTrainServices] = useState<any[]>([]);
  const [busServices, setBusServices] = useState<any[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  async function loadAll() {
    setIsLoading(true);
    try {
      const [sched, trains, buses] = await Promise.all([
        getSchedules(),
        getTrainServices(),
        getBusServices(),
      ]);
      setSchedules(sched);
      setTrainServices(trains);
      setBusServices(buses);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // -------------------------------------------------------------------------
  // Create handler
  // -------------------------------------------------------------------------

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.service_id) {
      setFormError(`Please select a ${form.service_type} service.`);
      return;
    }
    if (!form.travel_date || !form.departure_time || !form.arrival_time) {
      setFormError('Please fill in all date and time fields.');
      return;
    }
    if (!form.available_seats || !form.base_fare) {
      setFormError('Please enter available seats and base fare.');
      return;
    }

    setIsSaving(true);
    try {
      await createSchedule({
        service_type: form.service_type,
        service_id: form.service_id,
        travel_date: form.travel_date,
        departure_time: form.departure_time,
        arrival_time: form.arrival_time,
        available_seats: parseInt(form.available_seats, 10),
        base_fare: parseFloat(form.base_fare),
        status: 'active',
      });
      setIsModalOpen(false);
      setForm(INITIAL_FORM);
      await loadAll();
    } catch (err: any) {
      setFormError(err?.message ?? 'Failed to create schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function openModal() {
    setForm(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormError('');
  }

  // -------------------------------------------------------------------------
  // Client-side filtering
  // -------------------------------------------------------------------------

  const filtered = schedules.filter((s) => {
    const matchStatus = statusFilter === 'all' || s.status?.toLowerCase() === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.service_type?.toLowerCase().includes(q) ||
      s.service_id?.toLowerCase().includes(q) ||
      s.travel_date?.includes(q) ||
      s.status?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // -------------------------------------------------------------------------
  // Shared input / label styles
  // -------------------------------------------------------------------------

  const inputCls =
    'w-full border border-border rounded px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary placeholder-gray-400';
  const labelCls = 'block text-xs font-medium text-secondary mb-1';

  // Dynamic service list based on selected type
  const serviceOptions = form.service_type === 'train' ? trainServices : busServices;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Modal                                                                */}
      {/* ------------------------------------------------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-primary">Add Schedule</h2>
              </div>
              <button
                onClick={closeModal}
                className="cursor-pointer text-secondary hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {/* Service Type */}
              <div>
                <p className={labelCls}>Service Type</p>
                <div className="flex space-x-6">
                  {(['train', 'bus'] as const).map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value={type}
                        checked={form.service_type === type}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, service_type: type, service_id: '' }))
                        }
                        className="accent-primary cursor-pointer"
                      />
                      <span className="flex items-center space-x-1.5 text-sm text-primary">
                        {type === 'train' ? (
                          <Train className="w-4 h-4" />
                        ) : (
                          <Bus className="w-4 h-4" />
                        )}
                        <span className="capitalize">{type}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Service dropdown */}
              <div>
                <label className={labelCls}>
                  {form.service_type === 'train' ? 'Train Service' : 'Bus Service'}
                </label>
                <select
                  value={form.service_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, service_id: e.target.value }))}
                  className={`${inputCls} cursor-pointer`}
                >
                  <option value="">
                    Select a {form.service_type} service
                  </option>
                  {serviceOptions.map((s: any) => {
                    const label =
                      form.service_type === 'train'
                        ? `${s.train_number ? s.train_number + ' — ' : ''}${s.train_name ?? s.name ?? s.id}`
                        : `${s.bus_number ? s.bus_number + ' — ' : ''}${s.bus_name ?? s.name ?? s.id}`;
                    return (
                      <option key={s.id} value={s.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Travel Date */}
              <div>
                <label className={labelCls}>Travel Date</label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, travel_date: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Departure / Arrival Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Departure Time</label>
                  <input
                    type="time"
                    value={form.departure_time}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, departure_time: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Arrival Time</label>
                  <input
                    type="time"
                    value={form.arrival_time}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, arrival_time: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Available Seats / Base Fare */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Available Seats</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 120"
                    value={form.available_seats}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, available_seats: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Base Fare (INR)</label>
                  <div className="relative">
                    <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 499.00"
                      value={form.base_fare}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, base_fare: e.target.value }))
                      }
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {formError && (
                <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-secondary border border-border rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Page body                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Schedules</h1>
            <p className="text-secondary mt-1">Manage departure and arrival timetables.</p>
          </div>
          <button
            onClick={openModal}
            className="cursor-pointer flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-gray-50 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading || schedules.length === 0}
                className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading || schedules.length === 0}
              className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary cursor-pointer hidden sm:block disabled:opacity-50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Content area */}
          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {isLoading ? (
              /* Loading skeleton */
              <div className="flex-1 p-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-5 bg-gray-200 rounded-full w-14" />
                    <div className="h-4 bg-gray-200 rounded w-12 ml-auto" />
                  </div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex items-center justify-center p-8">
                <AdminEmptyState
                  icon={Calendar}
                  title="No schedules have been created."
                  description="Add schedules to make services bookable by passengers."
                  actionLabel="Add Schedule"
                  onAction={openModal}
                />
              </div>
            ) : filtered.length === 0 ? (
              /* No filter results */
              <div className="flex-1 flex items-center justify-center p-8 text-secondary text-sm">
                No schedules match your search criteria.
              </div>
            ) : (
              /* Table */
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-border text-secondary">
                  <tr>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Date</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Type</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Departure</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Arrival</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Seats</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Fare (INR)</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <td className="px-6 py-4 text-primary font-medium">
                        {formatDate(schedule.travel_date)}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          {schedule.service_type === 'train' ? (
                            <Train className="w-4 h-4 text-secondary flex-shrink-0" />
                          ) : (
                            <Bus className="w-4 h-4 text-secondary flex-shrink-0" />
                          )}
                          <span className="capitalize text-primary">
                            {schedule.service_type ?? '—'}
                          </span>
                        </div>
                      </td>

                      {/* Departure */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{formatTime(schedule.departure_time)}</span>
                        </div>
                      </td>

                      {/* Arrival */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{formatTime(schedule.arrival_time)}</span>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="px-6 py-4 text-primary">
                        {schedule.available_seats ?? '—'}
                      </td>

                      {/* Fare */}
                      <td className="px-6 py-4 text-primary">
                        {schedule.base_fare != null
                          ? `₹${Number(schedule.base_fare).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={schedule.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="cursor-pointer text-xs text-secondary hover:text-primary transition-colors font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer count */}
          {!isLoading && schedules.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-gray-50 text-xs text-secondary">
              Showing {filtered.length} of {schedules.length} schedule
              {schedules.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
