"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { RotateCcw, Search } from 'lucide-react';
import { getAdminRefunds } from '@/services/supabaseAdminService';

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminRefunds();
        setRefunds(data);
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
          <h1 className="text-2xl font-bold text-primary">Refunds</h1>
          <p className="text-secondary mt-1">Manage requested and completed booking refunds.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by Refund ID or Booking Ref..." 
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || refunds.length === 0}
            />
          </div>
          <select disabled={isLoading || refunds.length === 0} className="w-full sm:w-auto border border-border rounded px-3 py-2 text-sm bg-white text-secondary">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Succeeded</option>
            <option>Failed</option>
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
          ) : refunds.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState 
                icon={RotateCcw}
                title="No refund records found."
                description="When bookings are cancelled, their refund statuses will appear here."
                actionLabel="Refresh list"
                onAction={() => window.location.reload()}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Refund ID</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Booking Ref</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Payment Ref</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Amount</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Date</th>
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
