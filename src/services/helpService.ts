import { createAdminClient } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_reference?: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

// In-memory mock arrays, starting empty to satisfy no-fake-data rules.
let mockArticles: HelpArticle[] = [];
let mockTickets: SupportTicket[] = [];

// --- CUSTOMER FACING ---

export async function getPublishedHelpArticles(): Promise<HelpArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockArticles.filter(a => a.status === 'published');
}

export async function searchHelpArticles(query: string): Promise<HelpArticle[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const lowerQuery = query.toLowerCase();
  return mockArticles.filter(a => 
    a.status === 'published' && 
    (a.title.toLowerCase().includes(lowerQuery) || a.content.toLowerCase().includes(lowerQuery))
  );
}

export async function getHelpArticleBySlug(slug: string): Promise<HelpArticle | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockArticles.find(a => a.slug === slug && a.status === 'published') || null;
}

export async function submitSupportTicket(data: Omit<SupportTicket, 'id' | 'reference' | 'status' | 'created_at' | 'updated_at'>): Promise<SupportTicket> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newTicket: SupportTicket = {
    ...data,
    id: 'tkt_' + Math.random().toString(36).substring(2, 9),
    reference: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockTickets.push(newTicket);
  return newTicket;
}

export async function getCustomerTickets(userEmail: string): Promise<SupportTicket[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTickets.filter(t => t.customer_email === userEmail);
}

// --- ADMIN FACING ---

export async function getAdminArticles(): Promise<HelpArticle[]> {
  const supabase = await createAdminClient();
  return [...mockArticles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getAdminSupportTickets(): Promise<SupportTicket[]> {
  const supabase = await createAdminClient();
  return [...mockTickets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
