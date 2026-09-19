import React, { useState, useEffect } from 'react';
import { NotificationSettings, getNotificationSettings, updateNotificationSettings } from '@/services/accountService';
import { CheckCircle2 } from 'lucide-react';

export default function NotificationsSection() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (err) {
      // Handle silently for mock
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings); // Optimistic update
    
    setIsSaving(true);
    try {
      await updateNotificationSettings(newSettings);
      setSuccess('Notification preferences updated.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Revert on failure
      setSettings(settings);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded-lg w-full"></div>;
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-6 md:p-8">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-primary">Notifications</h2>
        <p className="text-secondary text-sm mt-1">Manage how we communicate with you.</p>
      </div>

      <div className="h-6 mb-2">
        {success && (
          <div className="flex items-center text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            {success}
          </div>
        )}
      </div>

      <div className="space-y-6">
        
        {/* Toggle 1 */}
        <div className="flex items-start justify-between py-2">
          <div className="pr-4">
            <h3 className="font-bold text-primary mb-1">Booking updates</h3>
            <p className="text-sm text-secondary">Important updates about your bookings, payments, and cancellations.</p>
          </div>
          <button 
            onClick={() => handleToggle('bookingUpdates')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.bookingUpdates ? 'bg-primary' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={settings.bookingUpdates}
            aria-label="Toggle booking updates"
          >
            <span 
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.bookingUpdates ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        <div className="border-t border-border"></div>

        {/* Toggle 2 */}
        <div className="flex items-start justify-between py-2">
          <div className="pr-4">
            <h3 className="font-bold text-primary mb-1">Travel reminders</h3>
            <p className="text-sm text-secondary">Reminders about upcoming journeys, departure times, and boarding info.</p>
          </div>
          <button 
            onClick={() => handleToggle('travelReminders')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.travelReminders ? 'bg-primary' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={settings.travelReminders}
            aria-label="Toggle travel reminders"
          >
            <span 
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.travelReminders ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        <div className="border-t border-border"></div>

        {/* Toggle 3 */}
        <div className="flex items-start justify-between py-2">
          <div className="pr-4">
            <h3 className="font-bold text-primary mb-1">Promotional offers</h3>
            <p className="text-sm text-secondary">Travel offers, discounts, and promotional messages from TravelEase.</p>
          </div>
          <button 
            onClick={() => handleToggle('promotions')}
            disabled={isSaving}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.promotions ? 'bg-primary' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={settings.promotions}
            aria-label="Toggle promotional offers"
          >
            <span 
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.promotions ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

      </div>
    </div>
  );
}
