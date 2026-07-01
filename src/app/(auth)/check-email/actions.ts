"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    redirect(`/check-email?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}&sent=1`);
}

