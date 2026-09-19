"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, User, ShieldAlert, Ticket, MessageSquare, 
  CheckCircle2, XCircle, AlertTriangle 
} from 'lucide-react';
import { 
  getAdminCustomerById, 
  getAdminCustomerBookings, 
  getAdminCustomerSupportTickets, 
  setCustomerStatus,
  CustomerDetail 
} from '@/services/customerAdminService';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [custData, bookingsData, ticketsData] = await Promise.all([
          getAdminCustomerById(userId),
          getAdminCustomerBookings(userId),
          getAdminCustomerSupportTickets(userId)
        ]);

        if (!custData) {
          setError('Customer not found.');
        } else {
          setCustomer(custData);
          setBookings(bookingsData);
          setTickets(ticketsData);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load customer information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [userId]);

  const handleStatusChange = async (newStatus: 'active' | 'deactivated') => {
    setIsUpdating(true);
    try {
      await setCustomerStatus(userId, newStatus);
      setCustomer(prev => prev ? { ...prev, status: newStatus } : null);
      setShowDeactivateModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update account status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white border border-border rounded-lg p-6 h-48"></div>
        <div className="bg-white border border-border rounded-lg p-6 h-64"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white border border-border rounded-lg p-8 text-center">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-primary mb-2">Error</h2>
          <p className="text-secondary mb-6">{error}</p>
          <button 
            onClick={() => router.push('/admin/customers')}
            className="text-primary hover:underline font-medium"
          >
            &larr; Back to customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      
      <div className="flex items-center space-x-2 text-sm text-secondary mb-4">
        <Link href="/admin/customers" className="hover:text-primary transition-colors flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Customers
        </Link>
        <span>/</span>
        <span className="text-primary font-medium truncate">{customer.id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0">
            {customer.first_name[0]}{customer.last_name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{customer.first_name} {customer.last_name}</h1>
            <p className="text-secondary">{customer.email}</p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {customer.status === 'active' ? 'Active Account' : 'Deactivated Account'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Info & Actions */}
        <div className="space-y-6 md:col-span-1">
          
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
              <User className="w-4 h-4 text-secondary" />
              <h2 className="font-semibold text-primary">Customer Profile</h2>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div>
                <span className="block text-secondary text-xs mb-1">Customer ID</span>
                <span className="font-mono text-primary break-all">{customer.id}</span>
              </div>
              <div>
                <span className="block text-secondary text-xs mb-1">Phone Number</span>
                <span className="text-primary">{customer.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="block text-secondary text-xs mb-1">Email Verification</span>
                <span className="flex items-center space-x-1">
                  {customer.email_verified ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-600" /> <span className="text-green-700">Verified</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-red-500" /> <span className="text-red-600">Unverified</span></>
                  )}
                </span>
              </div>
              <div>
                <span className="block text-secondary text-xs mb-1">Account Created</span>
                <span className="text-primary">{new Date(customer.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-secondary" />
              <h2 className="font-semibold text-primary">Administrative Actions</h2>
            </div>
            <div className="p-4 space-y-4">
              {customer.status === 'active' ? (
                <button 
                  onClick={() => setShowDeactivateModal(true)}
                  className="w-full text-left px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition-colors focus:outline-none"
                >
                  Deactivate Account
                </button>
              ) : (
                <button 
                  onClick={() => handleStatusChange('active')}
                  disabled={isUpdating}
                  className="w-full text-left px-4 py-2 border border-green-200 bg-green-50 text-green-700 rounded text-sm font-medium hover:bg-green-100 transition-colors focus:outline-none disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Reactivate Account'}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Relations */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-secondary" />
                <h2 className="font-semibold text-primary">Bookings ({bookings.length})</h2>
              </div>
            </div>
            <div className="p-6 text-center text-secondary text-sm">
              {bookings.length === 0 ? (
                <p>No bookings found for this customer.</p>
              ) : (
                <p>Booking list would render here.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-secondary" />
                <h2 className="font-semibold text-primary">Support Requests ({tickets.length})</h2>
              </div>
            </div>
            <div className="p-6 text-center text-secondary text-sm">
              {tickets.length === 0 ? (
                <p>No support requests for this customer.</p>
              ) : (
                <p>Support ticket list would render here.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-bold text-primary">Deactivate Account?</h2>
              </div>
              <p className="text-secondary mb-2">
                Are you sure you want to deactivate <strong>{customer.email}</strong>?
              </p>
              <ul className="list-disc pl-5 text-sm text-secondary space-y-1 mb-6">
                <li>The customer will no longer be able to log in.</li>
                <li>Existing bookings and operational records will remain intact for compliance.</li>
                <li>You can reactivate this account later.</li>
              </ul>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => setShowDeactivateModal(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium border border-border text-primary rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep account
                </button>
                <button 
                  onClick={() => handleStatusChange('deactivated')}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center"
                >
                  {isUpdating ? 'Deactivating...' : 'Deactivate account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
