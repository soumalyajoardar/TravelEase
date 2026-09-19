'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Search, X, Train, Bus, Clock, IndianRupee } from 'lucide-react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, getTrainServices, getBusServices } from '@/services/supabaseAdminService';
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
    scheduled: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    delayed: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-600',
  };
  const cls = map[status?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status ?? 'scheduled'}
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
  status: 'scheduled',
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
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  function openAddModal() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setFormError('');
    setIsModalOpen(true);
  }

  function openEditModal(schedule: any) {
    setEditingId(schedule.id);
    setForm({
      service_type: schedule.service_type || 'train',
      service_id: schedule.service_id || '',
      travel_date: schedule.travel_date || '',
      departure_time: schedule.departure_time || '',
      arrival_time: schedule.arrival_time || '',
      available_seats: String(schedule.available_seats || ''),
      base_fare: String(schedule.base_fare || ''),
      status: schedule.status || 'scheduled',
    });
    setFormError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
    setFormError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!form.service_id && !editingId) {
      setFormError('Please select a service.');
      return;
    }
    if (!form.travel_date) {
      setFormError('Please enter a travel date.');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        service_type: form.service_type,
        service_id: form.service_id,
        travel_date: form.travel_date,
        departure_time: form.departure_time,
        arrival_time: form.arrival_time,
        available_seats: form.available_seats ? parseInt(form.available_seats, 10) : 50,
        base_fare: form.base_fare ? parseFloat(form.base_fare) : 450,
        status: form.status || 'scheduled',
      };

      if (editingId) {
        await updateSchedule(editingId, payload);
      } else {
        await createSchedule(payload);
      }

      await loadAll();
      closeModal();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save schedule. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, date: string) {
    if (!confirm(`Are you sure you want to delete the schedule for ${date}?`)) return;
    try {
      await deleteSchedule(id);
      await loadAll();
    } catch (err: any) {
      alert('Error deleting schedule: ' + (err?.message ?? 'Unknown error'));
    }
  }

  const filtered = schedules.filter((s) => {
    const matchesSearch =
      (s.service_type || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.travel_date || '').includes(search) ||
      (s.status || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const serviceOptions = form.service_type === 'train' ? trainServices : busServices;

  const inputCls =
    'w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-secondary mb-1';

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">
                {editingId ? 'Edit Schedule' : 'Add New Schedule'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-secondary hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Service Type */}
              <div>
                <label className={labelCls}>Service Type</label>
                <select
                  value={form.service_type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      service_type: e.target.value as 'train' | 'bus',
                      service_id: '',
                    }))
                  }
                  className={inputCls}
                >
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              {/* Service selection */}
              {!editingId && (
                <div>
                  <label className={labelCls}>
                    {form.service_type === 'train' ? 'Train Service' : 'Bus Service'}
                  </label>
                  <select
                    value={form.service_id}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, service_id: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name || svc.train_name || svc.service_name} {svc.train_number ? `(${svc.train_number})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Travel Date */}
              <div>
                <label className={labelCls}>Travel Date</label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, travel_date: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>

              {/* Departure & Arrival Time */}
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

              {/* Seats & Base Fare */}
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
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 499.00"
                    value={form.base_fare}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, base_fare: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className={inputCls}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {formError && (
                <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
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
                  {isSaving ? 'Saving...' : editingId ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Body */}
      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Schedules</h1>
            <p className="text-secondary mt-1">Manage departure and arrival timetables.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="cursor-pointer flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule</span>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex flex-col gap-3 p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-28" />
                    <div className="h-4 bg-gray-200 rounded w-28" />
                    <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
                  </div>
                ))}
              </div>
            ) : schedules.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <AdminEmptyState
                  icon={Calendar}
                  title="No schedules have been created."
                  description="Add schedules to make services bookable."
                  actionLabel="Add Schedule"
                  onAction={openAddModal}
                />
              </div>
            ) : (
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
                      <td className="px-6 py-4 text-primary font-medium">
                        {formatDate(schedule.travel_date)}
                      </td>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{formatTime(schedule.departure_time)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span>{formatTime(schedule.arrival_time)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-primary">
                        {schedule.available_seats ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-primary">
                        {schedule.base_fare != null
                          ? `₹${Number(schedule.base_fare).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={schedule.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                        <button
                          onClick={() => openEditModal(schedule)}
                          className="text-primary hover:text-accent cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id, schedule.travel_date)}
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
