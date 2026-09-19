"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, User } from 'lucide-react';
import Link from 'next/link';
import { getUserNotifications, getUnreadNotificationCount, AppNotification } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    async function loadData() {
      try {
        const [count, notifs] = await Promise.all([
          getUnreadNotificationCount(user!.id),
          getUserNotifications(user!.id)
        ]);
        setUnreadCount(count);
        setNotifications(notifs.slice(0, 5)); // Show max 5 in dropdown
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
    
    // In a real implementation, you would set up Supabase realtime subscription here
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary hover:text-primary transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50">
          <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-secondary text-sm">
                No notifications right now.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 ${!notif.read_at ? 'bg-blue-50/50' : ''} hover:bg-gray-50 transition-colors`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notif.read_at ? 'font-semibold text-primary' : 'font-medium text-primary'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read_at && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 ml-2 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mb-2 line-clamp-2">{notif.message}</p>
                    <div className="text-[10px] text-gray-400">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-border bg-gray-50 text-center">
            <Link 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
