import { createAdminClient } from '@/utils/supabase/server';
import { createClient } from '@/utils/supabase/client';

export interface LegalDocument {
  id: string;
  type: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// In-memory mock array, starting empty to satisfy no-fake-data rules.
let mockLegalDocs: LegalDocument[] = [];

// --- CUSTOMER FACING ---

export async function getPublishedPolicy(slug: string): Promise<LegalDocument | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockLegalDocs.find(doc => doc.slug === slug && doc.status === 'published') || null;
}

// --- ADMIN FACING ---

export async function getAdminLegalDocs(): Promise<LegalDocument[]> {
  const supabase = await createAdminClient();
  return [...mockLegalDocs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
