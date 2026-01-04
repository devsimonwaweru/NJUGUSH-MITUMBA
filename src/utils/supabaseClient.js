import { createClient } from '@supabase/supabase-js'

// Public Client (For Public Site - Uses Anon Key)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Admin Client (For Admin Dashboard - Bypasses RLS)
export const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY, // USES SERVICE ROLE KEY
  { 
    auth: { persistSession: true },
    db: { schema: 'public' } 
  }
);