import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%";
  return Array.from({ length: 14 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function slugName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const fullName = String(payload?.fullName ?? "").trim();
  const role = String(payload?.role ?? "Invitado");

  if (!fullName) {
    return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 400 });
  }

  if (!hasSupabaseAdminConfig()) {
    return NextResponse.json(
      { error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const password = randomPassword();
  const email = `${slugName(fullName)}.${Math.floor(1000 + Math.random() * 9000)}@usuarios.local`;
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      created_by: user.id,
      role,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await admin.from("user_invitations").insert({
    owner_id: user.id,
    invited_user_id: data.user?.id,
    invited_email: email,
    invited_name: fullName,
    role,
    status: "created",
  });

  return NextResponse.json({
    name: fullName,
    username: email,
    password,
    role,
  });
}

