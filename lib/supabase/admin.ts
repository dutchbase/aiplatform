import { createClient } from '@supabase/supabase-js'

// NEVER import this in client components or pages rendered on the browser.
// Only use in Server Actions and server-only functions.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
