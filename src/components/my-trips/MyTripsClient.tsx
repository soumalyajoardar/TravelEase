"use client";

import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '@/services/travelService';
import { BookingRecord } from '@/types/travel';
import TripCard from './TripCard';
import { Calendar, Search } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function MyTripsClient() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isAuthLoading) {
      fetchBookings();
    } else if (!isAuthLoading && !user) {
      // The Protected Route effect in AuthContext handles redirecting,
      // but we can fast-fail the loading state here.
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      setCancellingId(id);
      const updatedBooking = await cancelBooking(id);
      if (updatedBooking) {
        setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
        setShowCancelDialog(null);
      }
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (isAuthLoading) return null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1024px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">Sign in to view your trips</h1>
        <p className="text-secondary mb-8 max-w-md">
          Your bookings and tickets will appear here after you sign in.
        </p>
        <Link 
          href="/login?redirect=/my-trips"
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) return null; // Handled by suspense skeleton

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1024px] mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Unable to load your trips</h2>
        <p className="text-secondary mb-8">Please try again.</p>
        <button 
          onClick={fetchBookings}
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter logic based on tabs and search
  const filteredBookings = bookings.filter(b => {
    // Note: For a real app, "upcoming" vs "completed" would compare travel date against current date.
    // For this mock, we just filter by status since we don't manipulate real dates robustly in the mock.
    
    // Status filter
    if (activeTab === 'upcoming' && (b.status === 'cancelled' || b.status === 'payment_failed')) return false;
    if (activeTab === 'completed' && b.status !== 'confirmed') return false; // Mocking that 'completed' implies confirmed past date
    if (activeTab === 'cancelled' && b.status !== 'cancelled') return false;
    
    // Text search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !b.trip.destination.toLowerCase().includes(q) &&
        !b.id.toLowerCase().includes(q) &&
        !b.trip.operator.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-[1024px] mx-auto px-4 md:px-8 py-8 md:py-12">
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">My Trips</h1>
        <p className="text-secondary text-lg">View your upcoming journeys and previous bookings.</p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex space-x-1 border-b border-border w-full md:w-auto">
          {(['upcoming', 'completed', 'cancelled'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search your trips..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          />
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <TripCard 
              key={booking.id} 
              booking={booking} 
              onCancel={() => setShowCancelDialog(booking.id)}
            />
          ))
        ) : (
          <div className="bg-white border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              {activeTab === 'upcoming' ? 'No upcoming trips' : `No ${activeTab} trips`}
            </h3>
            <p className="text-secondary mb-6">
              {activeTab === 'upcoming' 
                ? 'Your upcoming bookings will appear here.' 
                : `You don't have any ${activeTab} trips matching this criteria.`}
            </p>
            {activeTab === 'upcoming' && !searchQuery && (
              <Link 
                href="/search" 
                className="bg-primary text-white font-medium px-6 py-2 rounded hover:bg-opacity-90 transition-opacity"
              >
                Search trips
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Dialog Overlay */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-primary mb-2">Cancel this booking?</h3>
            <p className="text-secondary text-sm mb-6 pb-4 border-b border-border">
              This action may not be reversible. Your ticket will be cancelled immediately.
            </p>
            
            {/* Mocked refund logic */}
            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between text-secondary">
                <span>Original amount</span>
                <span className="font-medium text-primary">₹{bookings.find(b => b.id === showCancelDialog)?.totalPaid}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Cancellation fee</span>
                <span className="font-medium text-primary">₹100</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-bold text-primary">Estimated refund</span>
                <span className="font-bold text-success text-lg">
                  ₹{(bookings.find(b => b.id === showCancelDialog)?.totalPaid || 100) - 100}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowCancelDialog(null)}
                className="px-4 py-2 border border-border text-primary font-medium rounded hover:bg-gray-50 transition-colors"
                disabled={cancellingId !== null}
              >
                Keep booking
              </button>
              <button 
                onClick={() => handleCancelBooking(showCancelDialog)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                disabled={cancellingId !== null}
              >
                {cancellingId === showCancelDialog ? 'Cancelling...' : 'Cancel booking'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
