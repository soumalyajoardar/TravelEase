"use client";

import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import NotificationDropdown from './notifications/NotificationDropdown';
import Logo from './ui/Logo';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo variant="long" theme="light" />
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/" className={`transition-colors text-sm font-medium ${pathname === '/' ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Search</Link>
          <Link href="/my-trips" className={`transition-colors text-sm font-medium ${pathname?.startsWith('/my-trips') ? 'text-primary' : 'text-secondary hover:text-primary'}`}>My Trips</Link>
          <Link href="/offers" className={`transition-colors text-sm font-medium ${pathname?.startsWith('/offers') ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Offers</Link>
          <Link href="/help" className={`transition-colors text-sm font-medium ${pathname?.startsWith('/help') ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Help</Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-6">
              <NotificationDropdown />
              <span className="text-sm font-medium text-primary">Hi, {user.name}</span>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium text-accent hover:underline">Admin</Link>
              )}
              <button onClick={logout} className="text-sm font-medium text-secondary hover:text-primary flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-primary font-medium text-sm hover:underline px-2 py-2">
                Login
              </Link>
              <Link href="/signup" className="bg-primary text-white px-5 py-2 rounded font-medium text-sm hover:bg-opacity-90 transition-opacity">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Actions & Menu Toggle */}
        <div className="flex lg:hidden items-center space-x-4">
          {user ? (
            <Link href="/my-trips" className="text-primary p-2" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/login" className="text-primary p-2" aria-label="Login">
              <User className="w-5 h-5" />
            </Link>
          )}
          <button 
            className="text-primary p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white py-4 px-4 absolute w-full shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-primary font-semibold">Search Trips</Link>
            <Link href="/my-trips" className="text-secondary hover:text-primary font-medium">My Trips</Link>
            <Link href="/offers" className="text-secondary hover:text-primary font-medium">Offers</Link>
            <Link href="/help" className="text-secondary hover:text-primary font-medium">Help</Link>
            <Link href="/about" className="text-secondary hover:text-primary font-medium">About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
