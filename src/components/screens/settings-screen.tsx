"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type SettingsScreenProps = {
  userId: string;
  initialName: string;
  email: string;
  initialCurrency: string;
  initialLocale: string;
};

export function SettingsScreen({
  userId,
  initialName,
  email,
  initialCurrency,
  initialLocale,
}: SettingsScreenProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [currency, setCurrency] = useState(initialCurrency);
  const [locale, setLocale] = useState(initialLocale);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const initials = useMemo(() => {
    const source = fullName.trim() || email.split("@")[0] || "N";
    return source
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [email, fullName]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = fullName.trim();

    if (!normalizedName) {
      setSaveError("Escribe tu nombre para continuar.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: normalizedName,
        currency_code: currency,
        locale,
      })
      .eq("id", userId);

    if (error) {
      setSaveError("No pudimos guardar tus preferencias. Inténtalo de nuevo.");
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({ data: { full_name: normalizedName } });
    setFullName(normalizedName);
    setSaveMessage("Tus preferencias quedaron guardadas.");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-[var(--niva-color-accent)]" />
            <CardTitle>Tu perfil</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-inverse-surface)] text-xl font-bold text-[var(--niva-color-inverse-foreground)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-[var(--niva-color-foreground)]">{fullName || "Completa tu nombre"}</p>
              <p className="truncate text-sm text-[var(--niva-color-muted)]">{email}</p>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={saveProfile}>
            <Field label="Nombre completo">
              <input
                className={inputClass}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                maxLength={120}
                required
              />
            </Field>
            <Field label="Correo">
              <input className={inputClass} type="email" value={email} readOnly aria-describedby="email-help" />
            </Field>
            <p id="email-help" className="-mt-2 text-xs text-[var(--niva-color-muted)]">
              Este correo identifica tu acceso y no se cambia desde esta pantalla.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Moneda principal">
                <select className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value)}>
                  <option value="MXN">MXN · Peso mexicano</option>
                  <option value="USD">USD · Dólar estadounidense</option>
                  <option value="EUR">EUR · Euro</option>
                </select>
              </Field>
              <Field label="Idioma y región">
                <select className={inputClass} value={locale} onChange={(event) => setLocale(event.target.value)}>
                  <option value="es-MX">Español · México</option>
                </select>
              </Field>
            </div>

            {saveError ? (
              <div role="alert" className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-danger-surface)] p-3 text-sm font-semibold text-[var(--niva-color-danger)]">
                {saveError}
              </div>
            ) : null}
            {saveMessage ? (
              <div role="status" className="flex items-center gap-2 rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-accent-surface)] p-3 text-sm font-semibold text-[var(--niva-color-accent)]">
                <CheckCircle2 className="h-4 w-4" />
                {saveMessage}
              </div>
            ) : null}

            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid content-start gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[var(--niva-color-accent)]" />
              <CardTitle>Privacidad y seguridad</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <SecurityRow icon={<LockKeyhole className="h-4 w-4" />} title="Datos privados" description="Tus registros están aislados por usuario mediante políticas RLS en Supabase." />
            <SecurityRow icon={<KeyRound className="h-4 w-4" />} title="Acceso personal" description="Niva nunca muestra ni almacena tu contraseña en la interfaz." />
            <form action={signOut}>
              <Button variant="secondary" className="w-full" type="submit">
                Cerrar sesión
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-5 text-sm leading-6 text-[var(--niva-color-muted)]">
          Las invitaciones compartidas permanecerán fuera de la app hasta contar con roles verificables, activación segura y auditoría.
        </div>
      </div>
    </div>
  );
}

function SecurityRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] p-4">
      <span className="mt-0.5 text-[var(--niva-color-accent)]">{icon}</span>
      <div>
        <p className="font-semibold text-[var(--niva-color-foreground)]">{title}</p>
        <p className="mt-1 text-sm leading-5 text-[var(--niva-color-muted)]">{description}</p>
      </div>
    </div>
  );
}
