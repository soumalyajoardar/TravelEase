"use client";

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    function handleOffline() {
      setIsOffline(true);
      setShowBackOnline(false);
    }

    function handleOnline() {
      setIsOffline(false);
      setShowBackOnline(true);
      
      // Hide the "back online" message after 3 seconds
      setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Initial check
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showBackOnline) return null;

  if (isOffline) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 flex items-center justify-center space-x-2 text-sm z-50 relative">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span className="font-medium">You're offline.</span>
        <span className="hidden sm:inline">Some TravelEase features may be unavailable until your connection is restored.</span>
      </div>
    );
  }

  if (showBackOnline) {
    return (
      <div className="bg-green-50 border-b border-green-200 text-green-900 px-4 py-3 flex items-center justify-center space-x-2 text-sm z-50 relative animate-in fade-in slide-in-from-top-2 duration-300">
        <Wifi className="w-4 h-4 shrink-0" />
        <span className="font-medium">You're back online.</span>
      </div>
    );
  }

  return null;
}
