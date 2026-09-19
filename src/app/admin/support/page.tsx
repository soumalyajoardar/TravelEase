"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { MessageSquare, Search } from 'lucide-react';
import { getAdminSupportTickets, SupportTicket } from '@/services/helpService';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminSupportTickets();
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Support Tickets</h1>
          <p className="text-secondary mt-1">Manage and respond to customer support requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by Ticket Ref or Customer Email..." 
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || tickets.length === 0}
            />
          </div>
          <select disabled={isLoading || tickets.length === 0} className="w-full sm:w-auto border border-border rounded px-3 py-2 text-sm bg-white text-secondary">
            <option>All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Waiting for Customer</option>
            <option>Resolved</option>
          </select>
        </div>
        
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState 
                icon={MessageSquare}
                title="No support requests yet."
                description="When customers contact support, their tickets will appear here."
                actionLabel="Refresh inbox"
                onAction={() => window.location.reload()}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Ticket Ref</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Category</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Booking</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Created</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
