"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, Ticket, CreditCard, Undo2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  AppNotification 
} from '@/services/notificationService';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/notifications');
      return;
    }

    async function load() {
      try {
        const data = await getUserNotifications(user!.id);
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user, authLoading, router]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(user!.id, id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead(user!.id);
      setNotifications(prev => 
        prev.map(n => n.read_at ? n : { ...n, read_at: new Date().toISOString() })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Ticket className="w-5 h-5 text-blue-600" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'refund': return <Undo2 className="w-5 h-5 text-purple-600" />;
      case 'support': return <MessageSquare className="w-5 h-5 text-amber-600" />;
      default: return <Bell className="w-5 h-5 text-secondary" />;
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read_at)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Notifications</h1>
          <p className="text-secondary">Important updates about your bookings and account.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex space-x-1 border border-border rounded-lg bg-white p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                  filter === 'unread' ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'
                }`}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    filter === 'unread' ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-primary hover:underline flex items-center space-x-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex space-x-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">No notifications</h3>
                <p className="text-secondary max-w-sm mb-6">
                  {filter === 'unread' 
                    ? "You're all caught up! There are no unread notifications."
                    : "Important updates about your bookings and account will appear here."}
                </p>
                {filter === 'unread' && (
                  <button 
                    onClick={() => setFilter('all')}
                    className="text-primary font-medium hover:underline text-sm"
                  >
                    View all notifications
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 md:p-6 flex gap-4 transition-colors ${
                      !notif.read_at ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      !notif.read_at ? 'bg-white shadow-sm border border-blue-100' : 'bg-gray-100'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <h3 className={`text-base ${!notif.read_at ? 'font-bold text-primary' : 'font-semibold text-primary'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs text-secondary whitespace-nowrap">
                          {new Date(notif.created_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 ${!notif.read_at ? 'text-gray-800' : 'text-secondary'}`}>
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        {notif.action_url && (
                          <Link 
                            href={notif.action_url}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View details
                          </Link>
                        )}
                        
                        {!notif.read_at && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {!notif.read_at && (
                      <div className="shrink-0 flex items-center h-10">
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" aria-label="Unread"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
