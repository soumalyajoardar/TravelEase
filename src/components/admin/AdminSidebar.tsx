"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, Map, Train, Bus, Calendar, DollarSign, 
  Ticket, CreditCard, Undo2, Tag, Layout, Users, Settings, 
  ShieldAlert, LogOut, MessageSquare, HelpCircle, FileText, Bell
} from 'lucide-react';
import Logo from '../ui/Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const categories = [
    {
      title: null,
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Travel',
      items: [
        { name: 'Operators', href: '/admin/operators', icon: Users },
        { name: 'Stations', href: '/admin/stations', icon: Map },
        { name: 'Routes', href: '/admin/routes', icon: Map },
        { name: 'Train services', href: '/admin/train-services', icon: Train },
        { name: 'Bus services', href: '/admin/bus-services', icon: Bus },
        { name: 'Schedules', href: '/admin/schedules', icon: Calendar },
        { name: 'Fares', href: '/admin/fares', icon: DollarSign },
        { name: 'Availability', href: '/admin/availability', icon: Ticket },
      ]
    },
    {
      title: 'Bookings',
      items: [
        { name: 'Bookings', href: '/admin/bookings', icon: Ticket },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
        { name: 'Refunds', href: '/admin/refunds', icon: Undo2 },
      ]
    },
    {
      title: 'Content',
      items: [
        { name: 'Offers', href: '/admin/offers', icon: Tag },
        { name: 'Homepage', href: '/admin/homepage', icon: Layout },
        { name: 'Legal Policies', href: '/admin/legal', icon: FileText },
      ]
    },
    {
      title: 'Users',
      items: [
        { name: 'Customers', href: '/admin/customers', icon: Users },
      ]
    },
    {
      title: 'Support & Help',
      items: [
        { name: 'Support tickets', href: '/admin/support', icon: MessageSquare },
        { name: 'Help center', href: '/admin/help', icon: HelpCircle },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Audit logs', href: '/admin/audit-logs', icon: ShieldAlert },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#111827] text-white flex flex-col h-full shadow-xl z-20 shrink-0 hidden md:flex overflow-y-auto no-scrollbar">
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="mb-4">
          <Logo variant="long" theme="dark" />
        </div>
        <Link href="/" className="text-xs text-white/50 hover:text-white transition-colors">
          &larr; Back to website
        </Link>
      </div>
      
      <div className="flex-1 py-4">
        {categories.map((category, idx) => (
          <div key={idx} className="mb-6 px-4">
            {category.title && (
              <h3 className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                {category.title}
              </h3>
            )}
            <nav className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      isActive 
                        ? 'bg-primary text-white font-medium shadow-sm' 
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4 text-white/50" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
