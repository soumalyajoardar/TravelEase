"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Calendar, Plus, Search, X, Train, Bus, Clock, IndianRupee } from 'lucide-react';
import {
  getSchedules,
  createSchedule,
  getTrainServices,
  getBusServices,
} from '@/services/supabaseAdminService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '—';
  // timeStr may be "HH:MM:SS" or "HH:MM"
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

function statusBadge(status: string) {
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
// Modal
// ---------------------------------------------------------------------------

interface ModalProps {
  trainServices: any[];
  busServices: any[];
  onClose: () => void;
  onCreated: () => void;
}

function AddScheduleModal({ trainServices, busServices, onClose, onCreated }: ModalProps) {
  const [serviceType, setServiceType] = useState<'train' | 'bus'>('train');
  const [trainServiceId, setTrainServiceId] = useState('');
  const [busServiceId, setBusServiceId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [baseFare, setBaseFare] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const serviceId = serviceType === 'train' ? trainServiceId : busServiceId;
    if (!serviceId) {
      setError(`Please select a ${serviceType} service.`);
      return;
    }
    if (!travelDate || !departureTime || !arrivalTime) {
      setError('Please fill in all date and time fields.');
      return;
    }
    if (!availableSeats || !baseFare) {
      setError('Please enter available seats and base fare.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSchedule({
        service_type: serviceType,
        service_id: serviceId,
        travel_date: travelDate,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        available_seats: parseInt(availableSeats, 10),
        base_fare: parseFloat(baseFare),
        status: 'active',
      });
      onCreated();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputCls =
    'w-full border border-border rounded px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary placeholder-gray-400';
  const labelCls = 'block text-xs font-medium text-secondary mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-primary">Add Schedule</h2>
          </div>
          <button onClick={onClose} className="cursor-pointer text-secondary hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Service Type */}
          <div>
            <p className={labelCls}>Service Type</p>
            <div className="flex space-x-4">
              {(['train', 'bus'] as const).map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="serviceType"
                    value={type}
                    checked={serviceType === type}
                    onChange={() => setServiceType(type)}
                    className="accent-primary cursor-pointer"
                  />
                  <span className="flex items-center space-x-1 text-sm text-primary capitalize">
                    {type === 'train' ? <Train className="w-4 h-4" /> : <Bus className="w-4 h-4" />}
                    <span>{type === 'train' ? 'Train' : 'Bus'}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dynamic service dropdown */}
          {serviceType === 'train' ? (
            <div>
              <label className={labelCls}>Train Service</label>
              <select
                value={trainServiceId}
                onChange={(e) => setTrainServiceId(e.target.value)}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Select a train service</option>
                {trainServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.train_number ? `${s.train_number} — ` : ''}{s.train_name ?? s.name ?? s.id}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className={labelCls}>Bus Service</label>
              <select
                value={busServiceId}
                onChange={(e) => setBusServiceId(e.target.value)}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Select a bus service</option>
                {busServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.bus_number ? `${s.bus_number} — ` : ''}{s.bus_name ?? s.name ?? s.id}
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
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Departure / Arrival */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Departure Time</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Arrival Time</label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Seats / Fare */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Available Seats</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 120"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
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
                  value={baseFare}
                  onChange={(e) => setBaseFare(e.target.value)}
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-secondary border border-border rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer px-5 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [trainServices, setTrainServices] = useState<any[]>([]);
  const [busServices, setBusServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  async function loadAll() {
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

  function handleCreated() {
    setShowModal(false);
    loadAll();
  }

  // Client-side filtering
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

  return (
    <>
      {showModal && (
        <AddScheduleModal
          trainServices={trainServices}
          busServices={busServices}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Schedules</h1>
            <p className="text-secondary mt-1">Manage departure and arrival timetables.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            <input
              type="date"
              disabled={isLoading || schedules.length === 0}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary cursor-pointer hidden md:block disabled:opacity-50"
            />
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

          {/* Content */}
          <div className="overflow-x-auto min-h-[400px] flex flex-col">
            {isLoading ? (
              /* Loading skeleton */
              <div className="flex-1 p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
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
                  description="Add schedules to make services bookable."
                  actionLabel="Add Schedule"
                  onAction={() => setShowModal(true)}
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
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Service</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Departure</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Arrival</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Seats</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Fare</th>
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

                      {/* Service */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
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
                          <Clock className="w-3.5 h-3.5 text-secondary" />
                          <span>{formatTime(schedule.departure_time)}</span>
                        </div>
                      </td>

                      {/* Arrival */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 text-primary">
                          <Clock className="w-3.5 h-3.5 text-secondary" />
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
                          ? `₹${Number(schedule.base_fare).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {statusBadge(schedule.status)}
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
              Showing {filtered.length} of {schedules.length} schedule{schedules.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
