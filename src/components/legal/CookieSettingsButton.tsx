"use client";

import React from 'react';

export default function CookieSettingsButton() {
  return (
    <button 
      onClick={() => (window as any).openCookiePreferences?.()} 
      className="text-secondary hover:text-primary transition-colors underline-offset-2 hover:underline focus:outline-none"
    >
      Cookie Settings
    </button>
  );
}
