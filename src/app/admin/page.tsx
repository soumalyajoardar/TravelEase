"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Map, Train, Bus, Calendar, DollarSign, Ticket, 
  MessageSquare, Layout, ShieldCheck, AlertCircle, Plus, 
  Database, Lock, CreditCard, Undo2, Users
} from 'lucide-react';
import { getAdminDashboardMetrics, DashboardMetrics } from '@/services/dashboardAdminService';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>)}
        </div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 text-center py-20">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Unable to load dashboard data.</h2>
        <p className="text-secondary mb-6">Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate items requiring attention
  const attentionItems = [
    ...(metrics.bookings.pendingConfirmation > 0 ? [{ msg: `${metrics.bookings.pendingConfirmation} pending booking confirmations`, link: '/admin/bookings' }] : []),
    ...(metrics.payments.failed > 0 ? [{ msg: `${metrics.payments.failed} failed payments`, link: '/admin/payments' }] : []),
    ...(metrics.payments.refundPending > 0 ? [{ msg: `${metrics.payments.refundPending} pending refunds`, link: '/admin/refunds' }] : []),
    ...(metrics.support.unresolved > 0 ? [{ msg: `${metrics.support.unresolved} unresolved support requests`, link: '/admin/support' }] : []),
    ...(metrics.content.draftHomepage > 0 ? [{ msg: 'Homepage drafts awaiting publication', link: '/admin/homepage' }] : [])
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary mt-1">Overview of TravelEase operations.</p>
      </div>

      {/* Priority / Attention Area */}
      {attentionItems.length > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-800 mb-2">Action Required</h2>
              <ul className="space-y-2">
                {attentionItems.map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.link} className="text-sm text-red-700 hover:underline font-medium">
                      &bull; {item.msg}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm font-medium text-green-800">No action required right now.</p>
        </div>
      )}

      {/* Admin Action Shortcuts */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/routes" className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-border rounded text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" /> <span>Add route</span>
        </Link>
        <Link href="/admin/train-services" className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-border rounded text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" /> <span>Add train service</span>
        </Link>
        <Link href="/admin/bus-services" className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-border rounded text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" /> <span>Add bus service</span>
        </Link>
        <Link href="/admin/schedules" className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-border rounded text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" /> <span>Add schedule</span>
        </Link>
        <Link href="/admin/homepage" className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-border rounded text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
          <Layout className="w-4 h-4" /> <span>Edit homepage</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Operational Overview */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Map className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-primary">Travel Inventory</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Active Routes</p>
                <p className="text-2xl font-bold text-primary">{metrics.inventory.routes}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Train Services</p>
                <p className="text-2xl font-bold text-primary">{metrics.inventory.trainServices}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Bus Services</p>
                <p className="text-2xl font-bold text-primary">{metrics.inventory.busServices}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Upcoming Schedules</p>
                <p className="text-2xl font-bold text-primary">{metrics.inventory.upcomingSchedules}</p>
              </div>
            </div>
          </section>

          {/* Booking Overview */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Ticket className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-primary">Bookings</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Upcoming</p>
                <p className="text-2xl font-bold text-primary">{metrics.bookings.upcoming}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Confirmed</p>
                <p className="text-2xl font-bold text-primary">{metrics.bookings.confirmed}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Pending Confirmation</p>
                <p className="text-2xl font-bold text-primary">{metrics.bookings.pendingConfirmation}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Cancelled</p>
                <p className="text-2xl font-bold text-primary">{metrics.bookings.cancelled}</p>
              </div>
            </div>
          </section>

          {/* Payments & Refunds Overview */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-primary">Payments & Refunds</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Successful Payments</p>
                <p className="text-2xl font-bold text-primary">{metrics.payments.successful}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Pending Payments</p>
                <p className="text-2xl font-bold text-primary">{metrics.payments.pending}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Failed Payments</p>
                <p className="text-2xl font-bold text-primary">{metrics.payments.failed}</p>
              </div>
              <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-secondary mb-1">Refunds Pending</p>
                <p className="text-2xl font-bold text-primary">{metrics.payments.refundPending}</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Support Overview */}
          <section className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-secondary" />
                <h2 className="font-semibold text-primary">Support Requests</h2>
              </div>
              <Link href="/admin/support" className="text-xs font-medium text-primary hover:underline">View</Link>
            </div>
            <div className="p-4 divide-y divide-gray-50">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Open tickets</span>
                <span className="font-medium text-primary">{metrics.support.open}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">In progress</span>
                <span className="font-medium text-primary">{metrics.support.inProgress}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Waiting for customer</span>
                <span className="font-medium text-primary">{metrics.support.waitingForCustomer}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Unresolved</span>
                <span className="font-medium text-primary">{metrics.support.unresolved}</span>
              </div>
            </div>
          </section>

          {/* Content Overview */}
          <section className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
              <Layout className="w-5 h-5 text-secondary" />
              <h2 className="font-semibold text-primary">Content</h2>
            </div>
            <div className="p-4 divide-y divide-gray-50">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Homepage drafts</span>
                <span className="font-medium text-primary">{metrics.content.draftHomepage}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Unpublished offers</span>
                <span className="font-medium text-primary">{metrics.content.unpublishedOffers}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-secondary">Draft legal docs</span>
                <span className="font-medium text-primary">{metrics.content.draftLegalDocs}</span>
              </div>
            </div>
          </section>

          {/* System Status */}
          <section className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
              <Database className="w-5 h-5 text-secondary" />
              <h2 className="font-semibold text-primary">System Status</h2>
            </div>
            <div className="p-4 divide-y divide-gray-50">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary">Database</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${metrics.system.database === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {metrics.system.database}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary">Authentication</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${metrics.system.authentication === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {metrics.system.authentication}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary">Travel Inventory</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${metrics.system.inventory === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {metrics.system.inventory}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-secondary">Payments</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${metrics.system.payments === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {metrics.system.payments}
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
      
      {metrics.inventory.routes === 0 && (
        <div className="mt-8 border-t border-border pt-8 text-center max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-primary mb-2">Your TravelEase workspace is ready.</h2>
          <p className="text-secondary mb-6">Add travel inventory to begin. The dashboard will automatically populate as customers make bookings.</p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/admin/routes" className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-opacity-90">
              Add first route
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
