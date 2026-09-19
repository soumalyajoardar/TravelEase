'use server';
import { createAdminClient } from '@/utils/supabase/server';

export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'deactivated';
  created_at: string;
  last_login?: string;
  booking_count: number;
}

export interface CustomerDetail extends CustomerProfile {
  email_verified: boolean;
  phone_verified: boolean;
}

// --- ADMIN FACING ---

export async function getAdminCustomers(): Promise<CustomerProfile[]> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return []; }

  return (data || []).map(p => ({
    id: p.id,
    first_name: p.full_name?.split(' ')[0] || '',
    last_name: p.full_name?.split(' ').slice(1).join(' ') || '',
    email: p.email,
    status: 'active' as const,
    booking_count: 0,
    created_at: p.created_at,
  }));
}

export async function getAdminCustomerById(userId: string): Promise<CustomerDetail | null> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    first_name: data.full_name?.split(' ')[0] || '',
    last_name: data.full_name?.split(' ').slice(1).join(' ') || '',
    email: data.email,
    status: 'active' as const,
    booking_count: 0,
    created_at: data.created_at,
    email_verified: true,
    phone_verified: false,
  };
}

export async function setCustomerStatus(userId: string, status: 'active' | 'deactivated'): Promise<boolean> {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId);

  if (error) { console.error(error); throw new Error('Failed to update customer status'); }
  return true;
}

// Note: Bookings and Support tickets for a user would typically
// be fetched via their respective services filtering by userId.
export async function getAdminCustomerBookings(userId: string): Promise<any[]> {
  return []; // Strictly empty to adhere to rules
}

export async function getAdminCustomerSupportTickets(userId: string): Promise<any[]> {
  return []; // Strictly empty to adhere to rules
}
