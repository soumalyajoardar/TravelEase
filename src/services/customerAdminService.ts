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

// In-memory mock array starting strictly empty.
let mockCustomers: CustomerProfile[] = [];

// --- ADMIN FACING ---

export async function getAdminCustomers(): Promise<CustomerProfile[]> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockCustomers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getAdminCustomerById(userId: string): Promise<CustomerDetail | null> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const customer = mockCustomers.find(c => c.id === userId);
  if (!customer) return null;

  return {
    ...customer,
    email_verified: true, // Mocking verified state
    phone_verified: false
  };
}

export async function setCustomerStatus(userId: string, status: 'active' | 'deactivated'): Promise<boolean> {
  const supabase = await createAdminClient();
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = mockCustomers.findIndex(c => c.id === userId);
  if (index === -1) throw new Error("Customer not found");

  mockCustomers[index].status = status;
  return true;
}

// Note: Bookings and Support tickets for a user would typically 
// be fetched via their respective services filtering by userId.
export async function getAdminCustomerBookings(userId: string): Promise<any[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return []; // Strictly empty to adhere to rules
}

export async function getAdminCustomerSupportTickets(userId: string): Promise<any[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return []; // Strictly empty to adhere to rules
}
