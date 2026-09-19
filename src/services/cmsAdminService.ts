import { createAdminClient } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';

export interface HomepageContent {
  id: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_image_url?: string;
  announcement_active: boolean;
  announcement_text?: string;
  announcement_link?: string;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  support_email?: string;
  support_phone?: string;
  maintenance_mode: boolean;
  currency: string;
  timezone: string;
  updated_at: string;
}

// In-memory mock states starting empty
let mockHomepageContent: HomepageContent | null = null;
let mockSiteSettings: SiteSettings | null = null;

// --- CUSTOMER FACING ---

export async function getPublishedHomepageContent(): Promise<HomepageContent | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (mockHomepageContent?.status === 'published') {
    return mockHomepageContent;
  }
  return null;
}

export async function getPublicSiteSettings(): Promise<SiteSettings | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockSiteSettings;
}

// --- ADMIN FACING ---

export async function getAdminHomepageContent(): Promise<HomepageContent | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockHomepageContent;
}

export async function saveAdminHomepageContent(data: Partial<HomepageContent>, publish: boolean): Promise<HomepageContent> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const updated: HomepageContent = {
    id: mockHomepageContent?.id || 'home_1',
    announcement_active: false,
    ...mockHomepageContent,
    ...data,
    status: publish ? 'published' : 'draft',
    updated_at: new Date().toISOString()
  };
  
  mockHomepageContent = updated;
  return updated;
}

export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockSiteSettings;
}

export async function saveAdminSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const updated: SiteSettings = {
    id: mockSiteSettings?.id || 'settings_1',
    site_name: 'TravelEase',
    maintenance_mode: false,
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    ...mockSiteSettings,
    ...data,
    updated_at: new Date().toISOString()
  };
  
  mockSiteSettings = updated;
  return updated;
}

export interface SystemConfigState {
  payments: 'Configured' | 'Not configured';
  sms: 'Configured' | 'Not configured';
  email: 'Configured' | 'Not configured';
  travel_inventory: 'Configured' | 'Not configured';
}

export async function getSystemConfigState(): Promise<SystemConfigState> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    payments: 'Not configured',
    sms: 'Not configured',
    email: 'Not configured',
    travel_inventory: 'Not configured' // Strictly following rule: don't fake integrations
  };
}
