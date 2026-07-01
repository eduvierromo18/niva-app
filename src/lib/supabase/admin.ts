import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";

export function createAdminClient() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin environment variables are not configured.");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

