"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { BookOpen, Search, X } from 'lucide-react';
import { getAdminBookings, cancelAdminBooking } from '@/services/supabaseAdminService';

type Booking = {
  id: string;
  travel_date: string;
  total_amount: number;
  status: string;
  user?: {
    full_name: string;
    email: string;
  };
};

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  pending:    'bg-yellow-100 text-yellow-800',
};

function StatusBadge({ status }: { status: string }) {
  const classes = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${classes}`}>
      {status}
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-border animate-pulse">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-3 bg-gray-200 rounded w-24" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadBookings() {
    setIsLoading(true);
    try {
      const data = await getAdminBookings();
      setBookings(data as Booking[]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(booking: Booking) {
    const confirmed = window.confirm(
      `Cancel booking ${booking.id.slice(0, 8).toUpperCase()}? This action cannot be undone.`
    );
    if (!confirmed) return;
    setCancellingId(booking.id);
    try {
      await cancelAdminBooking(booking.id);
      await loadBookings();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  }

  const filtered = bookings.filter((b) => {
    const ref = b.id.slice(0, 8).toUpperCase();
    const name = b.user?.full_name ?? '';
    const email = b.user?.email ?? '';
    const matchesSearch =
      searchQuery === '' ||
      ref.includes(searchQuery.toUpperCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasBookings = bookings.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Bookings</h1>
          <p className="text-secondary mt-1 text-sm">View and manage customer travel bookings.</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ref, name or email..."
              disabled={!hasBookings && !isLoading}
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={!hasBookings && !isLoading}
            className="w-full sm:w-auto border border-border rounded px-3 py-2 text-sm bg-white text-secondary focus:outline-none focus:border-primary cursor-pointer disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Content */}
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Booking Ref</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer Email</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Travel Date</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Amount</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <SkeletonRows />
              </tbody>
            </table>
          ) : bookings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState
                icon={BookOpen}
                title="No bookings yet."
                description="Bookings placed by customers will appear here."
                actionLabel="Refresh"
                onAction={loadBookings}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Booking Ref</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer Email</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Travel Date</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Amount</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-secondary text-sm">
                      No bookings match your search or filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-primary text-xs tracking-widest">
                        {booking.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-primary">
                        {booking.user?.full_name ?? <span className="text-secondary italic">Unknown</span>}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {booking.user?.email ?? <span className="italic">—</span>}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {booking.travel_date
                          ? new Date(booking.travel_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        {booking.total_amount != null
                          ? `₹${Number(booking.total_amount).toLocaleString('en-IN')}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status !== 'cancelled' ? (
                          <button
                            onClick={() => handleCancel(booking)}
                            disabled={cancellingId === booking.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-3.5 h-3.5" />
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        ) : (
                          <span className="text-secondary text-xs italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer row count */}
        {!isLoading && bookings.length > 0 && (
          <div className="px-6 py-3 border-t border-border bg-gray-50 text-xs text-secondary">
            Showing {filtered.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
