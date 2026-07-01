import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export function createClient() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
