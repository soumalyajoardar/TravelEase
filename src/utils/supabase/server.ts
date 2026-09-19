/**
 * This is the architectural foundation for the Server-Side Supabase client.
 * In a real deployment, this file uses @supabase/ssr inside Server Components,
 * Server Actions, and Route Handlers to securely read/write auth cookies.
 * 
 * Example real implementation:
 * 
 * import { createServerClient } from '@supabase/ssr'
 * import { cookies } from 'next/headers'
 * 
 * export async function createClient() {
 *   const cookieStore = await cookies()
 *   return createServerClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *     {
 *       cookies: {
 *         getAll() { return cookieStore.getAll() },
 *         setAll(cookiesToSet) { ... }
 *       }
 *     }
 *   )
 * }
 */

export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null })
        })
      })
    })
  };
}

/**
 * Creates an admin client using the Service Role Key.
 * Bypasses RLS. STRICTLY FOR SERVER-SIDE ADMIN USAGE ONLY.
 * NEVER EXPOSE TO BROWSER.
 */
export async function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Mock admin mode active.');
  }
  
  return {
    // Mock admin client structure
    from: (table: string) => ({
      select: () => ({ data: [], error: null })
    })
  };
}
