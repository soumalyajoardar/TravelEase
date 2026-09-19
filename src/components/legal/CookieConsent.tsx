"use client";

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check local storage to see if consent was already given
    const consent = localStorage.getItem('travelease_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        setPreferences(JSON.parse(consent));
      } catch (e) {
        // Fallback if parsing fails
      }
    }

    // Expose a global method to reopen the preferences modal from the footer
    (window as any).openCookiePreferences = () => {
      setShowPreferences(true);
    };
  }, []);

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem('travelease_cookie_consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transform transition-transform">
          <div className="flex-1">
            <h3 className="font-bold text-primary mb-1">Your privacy choices</h3>
            <p className="text-sm text-secondary">
              We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
            <button 
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 text-sm font-medium border border-border text-primary rounded hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Manage preferences
            </button>
            <button 
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium border border-border text-primary rounded hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Reject non-essential
            </button>
            <button 
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-opacity-90 transition-opacity w-full sm:w-auto"
            >
              Accept all
            </button>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
          >
            <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
              <h2 id="cookie-modal-title" className="text-xl font-bold text-primary">Cookie Preferences</h2>
              <button 
                onClick={() => setShowPreferences(false)}
                className="text-secondary hover:text-primary transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Essential */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-primary mb-1">Essential Cookies</h3>
                  <p className="text-sm text-secondary">Required for core functionality such as security, authentication, and network management. These cannot be disabled.</p>
                </div>
                <div className="shrink-0 flex items-center space-x-2 text-primary font-medium text-sm bg-gray-100 px-3 py-1 rounded">
                  <Check className="w-4 h-4" />
                  <span>Always active</span>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-primary mb-1">Analytics Cookies</h3>
                  <p className="text-sm text-secondary">Help us understand how visitors interact with our website, discover errors, and provide a better overall experience.</p>
                </div>
                <div className="shrink-0 pt-1">
                  <button 
                    role="switch"
                    aria-checked={preferences.analytics}
                    onClick={() => togglePreference('analytics')}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${preferences.analytics ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${preferences.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-medium text-primary mb-1">Marketing Cookies</h3>
                  <p className="text-sm text-secondary">Used to track visitors across websites to display relevant advertisements.</p>
                </div>
                <div className="shrink-0 pt-1">
                  <button 
                    role="switch"
                    aria-checked={preferences.marketing}
                    onClick={() => togglePreference('marketing')}
                    className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${preferences.marketing ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-gray-50 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <button 
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium border border-border text-primary rounded hover:bg-white transition-colors"
              >
                Reject non-essential
              </button>
              <button 
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-opacity-90 transition-opacity"
              >
                Save my preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
