"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Users, Search } from 'lucide-react';
import { getAdminCustomers, CustomerProfile } from '@/services/customerAdminService';
import Link from 'next/link';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminCustomers();
        setCustomers(data);
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
          <h1 className="text-2xl font-bold text-primary">Customers</h1>
          <p className="text-secondary mt-1">Manage customer accounts and operational data.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Phone..." 
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || customers.length === 0}
            />
          </div>
          <select disabled={isLoading || customers.length === 0} className="w-full sm:w-auto border border-border rounded px-3 py-2 text-sm bg-white text-secondary">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Deactivated</option>
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
          ) : customers.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState 
                icon={Users}
                title="No customers yet."
                description="When users sign up for TravelEase, their profiles will appear here."
                actionLabel="Refresh list"
                onAction={() => window.location.reload()}
              />
            </div>
          ) : (
            <div className="w-full">
              {/* Desktop Table */}
              <table className="w-full text-left text-sm whitespace-nowrap hidden md:table">
                <thead className="bg-gray-50 border-b border-border text-secondary">
                  <tr>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Customer</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Email</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Bookings</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Created</th>
                    <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary">{c.first_name} {c.last_name}</td>
                      <td className="px-6 py-4 text-secondary">{c.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary">{c.booking_count}</td>
                      <td className="px-6 py-4 text-secondary">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/customers/${c.id}`} className="text-primary hover:underline font-medium text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100">
                {customers.map(c => (
                  <div key={c.id} className="p-4 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-primary">{c.first_name} {c.last_name}</h3>
                        <p className="text-sm text-secondary truncate">{c.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 ${
                        c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-secondary">
                      <span>{c.booking_count} bookings</span>
                      <span>Joined {new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <Link 
                        href={`/admin/customers/${c.id}`}
                        className="w-full block text-center py-2 border border-border rounded text-primary font-medium text-sm hover:bg-gray-50 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
