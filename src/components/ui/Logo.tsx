import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'long' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'long', theme = 'light', className = '' }: LogoProps) {
  const isDark = theme === 'dark';
  
  if (variant === 'icon') {
    return (
      <Link href="/" aria-label="TravelEase Home" className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
        <Image 
          src="/images/brand-logo-icon-v2.jpg" 
          alt="TravelEase Logo Icon" 
          width={42} 
          height={32} 
          className={`object-contain mix-blend-multiply ${isDark ? 'brightness-0 invert mix-blend-screen' : ''}`}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center hover:opacity-90 transition-opacity ${className}`} aria-label="TravelEase Home">
      <Image 
        src="/images/brand-logo-long-v2.jpg" 
        alt="TravelEase Logo" 
        width={180} 
        height={32} 
        className={`object-contain mix-blend-multiply ${isDark ? 'brightness-0 invert mix-blend-screen' : ''}`}
        priority
      />
    </Link>
  );
}
