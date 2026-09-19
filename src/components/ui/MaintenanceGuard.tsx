"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { getPublicSiteSettings } from '@/services/cmsAdminService';
import { Wrench } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const settings = await getPublicSiteSettings();
        if (settings?.maintenance_mode) {
          setIsMaintenance(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    }
    checkMaintenance();
  }, [pathname]); // Recheck on navigation

  // Don't show anything while checking to avoid flash
  if (isChecking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAdminRoute = pathname?.startsWith('/admin');
  const isAdminUser = user?.role === 'admin';

  // If we are in maintenance mode, and the user is not an admin, OR they are an admin but on a customer page, show maintenance.
  // Wait, the prompt says: "Authorized administrators should still be able to access the Admin Panel through a secure bypass"
  // So admins can use the whole site? Or just the Admin panel? Usually just Admin panel is guaranteed, but let's allow them anywhere if they are logged in as admin.
  if (isMaintenance && !isAdminUser) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-8 h-8 text-secondary" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">We're making a few updates.</h3>
            <p className="text-secondary mb-8 leading-relaxed">
              TravelEase is temporarily unavailable while we perform system maintenance. Please check back shortly.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
