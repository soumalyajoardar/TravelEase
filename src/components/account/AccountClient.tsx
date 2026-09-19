"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Users, Bell, Shield, LogOut } from 'lucide-react';
import ProfileSection from './ProfileSection';
import PassengersSection from './PassengersSection';
import NotificationsSection from './NotificationsSection';
import SecuritySection from './SecuritySection';
import Link from 'next/link';

type Tab = 'profile' | 'passengers' | 'notifications' | 'security';

export default function AccountClient() {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-[1024px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">Sign in to view your account</h1>
        <p className="text-secondary mb-8 max-w-md">
          Please sign in to manage your profile and settings.
        </p>
        <Link 
          href="/login?redirect=/account"
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const navItems = [
    { id: 'profile', label: 'Personal information', icon: <User className="w-5 h-5 mr-3" /> },
    { id: 'passengers', label: 'Saved passengers', icon: <Users className="w-5 h-5 mr-3" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5 mr-3" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Account</h1>
        <p className="text-secondary text-lg">Manage your TravelEase account and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-border rounded-lg shadow-sm md:sticky md:top-24">
          <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`flex items-center shrink-0 w-auto md:w-full px-5 py-4 text-left transition-colors font-medium md:border-l-4 border-b-4 md:border-b-0 ${
                  activeTab === item.id 
                    ? 'border-primary md:bg-primary/5 text-primary' 
                    : 'border-transparent text-secondary hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            ))}
            
            <div className="hidden md:block border-t border-border mt-2 pt-2">
              <button
                onClick={logout}
                className="flex items-center w-full px-5 py-4 text-left transition-colors font-medium border-l-4 border-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'profile' && <ProfileSection user={user} />}
          {activeTab === 'passengers' && <PassengersSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'security' && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}
