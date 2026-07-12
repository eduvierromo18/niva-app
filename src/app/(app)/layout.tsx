import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, currency_code, locale")
    .eq("id", user.id)
    .maybeSingle();

  const fallbackName =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email?.split("@")[0] ?? "Usuario";

  return (
    <AppShell
      user={{
        id: user.id,
        name: profile?.full_name?.trim() || fallbackName,
        email: user.email ?? "",
        currencyCode: profile?.currency_code ?? "MXN",
        locale: profile?.locale ?? "es-MX",
      }}
    >
      {children}
    </AppShell>
  );
}
