"use client";

import React, { useEffect, useState } from 'react';
import { 
  Settings, Save, AlertTriangle, Globe, Palette, 
  Phone, CreditCard, Bell, Map, ShieldCheck, Mail, Lock
} from 'lucide-react';
import { 
  getAdminSiteSettings, 
  saveAdminSiteSettings, 
  SiteSettings,
  getSystemConfigState,
  SystemConfigState
} from '@/services/cmsAdminService';
import Link from 'next/link';

type TabId = 'general' | 'branding' | 'contact' | 'booking' | 'payments' | 'notifications' | 'travel' | 'maintenance' | 'security';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    site_name: 'TravelEase',
    support_email: '',
    support_phone: '',
    maintenance_mode: false,
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });
  const [systemState, setSystemState] = useState<SystemConfigState | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [data, sysData] = await Promise.all([
          getAdminSiteSettings(),
          getSystemConfigState()
        ]);
        if (data) setSettings(data);
        setSystemState(sysData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
    setSaveSuccess(false);
    setSaveError(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(false);
    try {
      const updated = await saveAdminSiteSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 animate-pulse flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-96 bg-gray-200 rounded-lg shrink-0"></div>
        <div className="flex-1 space-y-6">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'booking', label: 'Booking', icon: Settings },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'travel', label: 'Travel Inventory', icon: Map },
    { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Configuration</h1>
          <p className="text-secondary mt-1">Manage global TravelEase settings.</p>
        </div>
        <div className="flex items-center space-x-4">
          {saveSuccess && <span className="text-sm font-medium text-green-600">Settings saved.</span>}
          {saveError && <span className="text-sm font-medium text-red-600">Unable to save settings.</span>}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 bg-primary text-white px-6 py-2 rounded font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'text-secondary hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-secondary'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50">
                  <h2 className="font-semibold text-primary">General Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">Site Name</label>
                    <input 
                      type="text" 
                      name="site_name"
                      value={settings.site_name || ''}
                      readOnly
                      title="Site name is restricted to maintain brand integrity."
                      className="w-full max-w-md border border-border rounded-md px-3 py-2 text-sm bg-gray-50 text-secondary cursor-not-allowed focus:outline-none" 
                    />
                    <p className="text-xs text-secondary mt-1">Contact engineering to change the core brand name.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Default Currency</label>
                      <select 
                        name="currency"
                        value={settings.currency || 'INR'}
                        onChange={handleChange}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="INR">INR (₹)</option>
                      </select>
                      <p className="text-xs text-secondary mt-1">Currency is locked to INR for the Indian market.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">System Timezone</label>
                      <select 
                        name="timezone"
                        value={settings.timezone || 'Asia/Kolkata'}
                        onChange={handleChange}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      </select>
                      <p className="text-xs text-secondary mt-1">Display timezone. Database operates in UTC.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50">
                  <h2 className="font-semibold text-primary">Branding</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-border border-dashed">
                        <span className="text-xs text-secondary">No logo</span>
                      </div>
                      <button className="text-sm font-medium text-primary border border-border px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                        Upload Logo
                      </button>
                    </div>
                    <p className="text-xs text-secondary mt-2">Recommended: SVG or high-resolution PNG (max 2MB).</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50">
                  <h2 className="font-semibold text-primary">Public Support Contact</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Support Email</label>
                      <input 
                        type="email" 
                        name="support_email"
                        value={settings.support_email || ''}
                        onChange={handleChange}
                        placeholder="Not set"
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">Support Phone</label>
                      <input 
                        type="tel" 
                        name="support_phone"
                        value={settings.support_phone || ''}
                        onChange={handleChange}
                        placeholder="Not set"
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
                      />
                    </div>
                  </div>
                  <p className="text-xs text-secondary">These details are published on the Help Center and public pages.</p>
                </div>
              </div>
            </div>
          )}

          {/* BOOKING */}
          {activeTab === 'booking' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50">
                  <h2 className="font-semibold text-primary">Booking Configuration</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-primary">Require Customer Account</h3>
                      <p className="text-xs text-secondary mt-1">Customers must be signed in to complete a booking.</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">Enforced by system</div>
                  </div>
                  <div className="flex justify-between items-start pt-4 border-t border-border">
                    <div>
                      <h3 className="text-sm font-medium text-primary">Guest Booking</h3>
                      <p className="text-xs text-secondary mt-1">Allow unauthenticated users to book.</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs font-medium text-gray-700">Not supported</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold text-primary">Payment Infrastructure</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between border border-border rounded-lg p-4 bg-gray-50">
                    <div>
                      <h3 className="font-medium text-primary">Provider Status</h3>
                      <p className="text-sm text-secondary mt-1">Payment gateway integration state.</p>
                    </div>
                    <div>
                      {systemState?.payments === 'Configured' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Configured</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">Not configured</span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-secondary mt-4">
                    Payment credentials and webhook secrets must be managed securely via server-side environment variables. They cannot be exposed or modified through this interface.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold text-primary">Notification Providers</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <div>
                        <h3 className="font-medium text-primary">Email Service</h3>
                      </div>
                    </div>
                    <div>
                      {systemState?.email === 'Configured' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Configured</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">Not configured</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <div>
                        <h3 className="font-medium text-primary">SMS Service</h3>
                      </div>
                    </div>
                    <div>
                      {systemState?.sms === 'Configured' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Configured</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">Not configured</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-secondary mt-4">
                    Provider API keys must be managed via backend secrets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TRAVEL INVENTORY */}
          {activeTab === 'travel' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
                  <Map className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold text-primary">Inventory Sources</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between border border-border rounded-lg p-4 bg-gray-50 mb-4">
                    <div>
                      <h3 className="font-medium text-primary">External Travel Provider API</h3>
                      <p className="text-sm text-secondary mt-1">Integration with external railway or bus aggregators.</p>
                    </div>
                    <div>
                      {systemState?.travel_inventory === 'Configured' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Configured</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">Not configured</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium text-primary">Manual Inventory</h3>
                      <p className="text-sm text-secondary mt-1">Manage routes and schedules directly via the Admin Panel.</p>
                    </div>
                    <div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 overflow-hidden">
                <div className="p-4 border-b border-red-200 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h2 className="font-semibold text-red-800">System Maintenance</h2>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-medium text-primary">Maintenance Mode</h3>
                      <p className="text-sm text-secondary mt-1 max-w-lg">
                        Enable this to temporarily disable the customer-facing website during critical updates. Customers will see a maintenance screen. Authorized administrators can still access the platform.
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center ml-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            name="maintenance_mode"
                            checked={settings.maintenance_mode}
                            onChange={handleChange}
                            className="sr-only" 
                          />
                          <div className={`block w-12 h-7 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${settings.maintenance_mode ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  {settings.maintenance_mode && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded">
                      <strong>Warning:</strong> Customers are currently locked out of TravelEase. Ensure you test your changes before disabling this mode.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <h2 className="font-semibold text-primary">Security & Permissions</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-primary">Admin Session Policy</h3>
                      <p className="text-sm text-secondary mt-1">Managed by Supabase Auth configuration.</p>
                    </div>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">View policies</Link>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="flex items-start space-x-3">
                      <Lock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-primary">Role Management</h3>
                        <p className="text-sm text-secondary mt-1 max-w-lg">
                          Role escalation is strictly prohibited through the frontend. Administrators must be assigned securely via the database.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
