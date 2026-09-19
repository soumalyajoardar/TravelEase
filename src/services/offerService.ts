import { createAdminClient } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  coupon_code?: string;
  start_at: string;
  end_at: string;
  active: boolean;
  min_booking_amount?: number;
  max_discount?: number;
  travel_type?: 'all' | 'train' | 'bus';
}

// Simulated in-memory array since DB is not connected yet.
// Keeping it strictly empty to satisfy the "no fake data" rule.
let mockOffers: Offer[] = [];

// --- CUSTOMER FACING ---
export async function getActiveOffers(): Promise<Offer[]> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const now = new Date().toISOString();
  
  // Filter active and currently valid offers
  return mockOffers.filter(offer => 
    offer.active &&
    offer.start_at <= now &&
    offer.end_at >= now
  );
}

// --- ADMIN FACING ---
export async function getAdminOffers(): Promise<Offer[]> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockOffers].sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime());
}

export async function createOffer(offerData: Omit<Offer, 'id'>): Promise<Offer> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newOffer: Offer = {
    ...offerData,
    id: 'off_' + Math.random().toString(36).substring(2, 9)
  };
  
  mockOffers.push(newOffer);
  return newOffer;
}

export async function deactivateOffer(id: string): Promise<void> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const idx = mockOffers.findIndex(o => o.id === id);
  if (idx !== -1) {
    mockOffers[idx].active = false;
  }
}
