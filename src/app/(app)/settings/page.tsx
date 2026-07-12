import { redirect } from "next/navigation";
import { SettingsScreen } from "@/components/screens/settings-screen";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, currency_code, locale")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <SettingsScreen
      userId={user.id}
      initialName={profile?.full_name ?? ""}
      email={user.email ?? ""}
      initialCurrency={profile?.currency_code ?? "MXN"}
      initialLocale={profile?.locale ?? "es-MX"}
    />
  );
}
