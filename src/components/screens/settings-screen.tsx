"use client";

import { FormEvent, useMemo, useState } from "react";
import { Copy, KeyRound, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";
import { signOut } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Credential = {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
};

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%";
  return Array.from({ length: 12 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function slugName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.|\.$)/g, "");
}

export function SettingsScreen() {
  const [fullName, setFullName] = useState("Luis Eduvier Romo");
  const [email, setEmail] = useState("luis@example.com");
  const [currency, setCurrency] = useState("MXN");
  const [inviteName, setInviteName] = useState("");
  const [role, setRole] = useState("Invitado");
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const initials = useMemo(() => fullName.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(), [fullName]);

  async function generateCredential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviteName.trim()) return;

    setIsCreating(true);
    setCreateError("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: inviteName.trim(), role }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo crear el usuario real.");
      }

      const data = await response.json();
      setCredentials((current) => [{ id: crypto.randomUUID(), ...data }, ...current]);
      setInviteName("");
    } catch (error) {
      const username = `${slugName(inviteName)}.${Math.floor(100 + Math.random() * 900)}`;
      setCredentials((current) => [
        {
          id: crypto.randomUUID(),
          name: inviteName.trim(),
          username,
          password: randomPassword(),
          role,
        },
        ...current,
      ]);
      setCreateError(error instanceof Error ? `${error.message} Se genero una credencial local temporal.` : "Se genero una credencial local temporal.");
      setInviteName("");
    } finally {
      setIsCreating(false);
    }
  }

  async function copyCredential(credential: Credential) {
    await navigator.clipboard?.writeText(`Usuario: ${credential.username}\nContrasena: ${credential.password}`);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Configuracion de usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-inverse-surface)] text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold">{fullName}</p>
              <p className="text-sm text-[var(--niva-color-muted)]">{email}</p>
            </div>
          </div>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaveMessage("Preferencias guardadas en esta sesion.");
            }}
          >
            <Field label="Nombre completo">
              <input className={inputClass} value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </Field>
            <Field label="Correo">
              <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            <Field label="Moneda principal">
              <select className={inputClass} value={currency} onChange={(event) => setCurrency(event.target.value)}>
                <option>MXN</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </Field>
            <div className="rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-accent-surface)] p-4 text-sm text-[var(--niva-color-foreground)]">
              <div className="mb-1 flex items-center gap-2 font-bold">
                <ShieldCheck className="h-4 w-4" />
                Preparado para Supabase Auth
              </div>
              Por ahora esto guarda la experiencia en pantalla. El siguiente paso es conectar estos datos con `profiles` y Auth.
            </div>
            {saveMessage ? (
              <div className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-accent-surface)] p-3 text-sm font-semibold text-[var(--niva-color-accent)]">
                {saveMessage}
              </div>
            ) : null}
            <Button type="submit">Guardar cambios</Button>
          </form>
          <form action={signOut} className="mt-3">
            <Button variant="secondary" className="w-full" type="submit">
              Cerrar sesion
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios para compartir</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={generateCredential}>
            <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
              <Field label="Nombre del amigo">
                <input className={inputClass} value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="Ej. Ana Martinez" />
              </Field>
              <Field label="Rol">
                <select className={inputClass} value={role} onChange={(event) => setRole(event.target.value)}>
                  <option>Invitado</option>
                  <option>Editor</option>
                  <option>Solo lectura</option>
                </select>
              </Field>
            </div>
            {createError ? (
              <div className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-3 text-sm text-[var(--niva-color-foreground)]">
                {createError}
              </div>
            ) : null}
            <Button type="submit" disabled>
              <UserPlus className="h-4 w-4" />
              Invitaciones disponibles proximamente
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            {credentials.length === 0 ? (
              <div className="rounded-[var(--niva-radius-lg)] border border-dashed border-[var(--niva-color-border)] p-6 text-center text-sm text-[var(--niva-color-muted)]">
                Aun no has generado credenciales.
              </div>
            ) : (
              credentials.map((credential) => (
                <div key={credential.id} className="rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{credential.name}</p>
                        <Badge>{credential.role}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-[var(--niva-color-muted)]">Usuario</p>
                      <p className="font-mono text-sm font-bold">{credential.username}</p>
                      <p className="mt-2 text-sm text-[var(--niva-color-muted)]">Contrasena temporal</p>
                      <p className="font-mono text-sm font-bold">{credential.password}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" className="h-9 w-9 px-0" onClick={() => copyCredential(credential)} aria-label="Copiar credenciales">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 w-9 px-0"
                        onClick={() => setCredentials((current) => current.map((item) => item.id === credential.id ? { ...item, password: randomPassword() } : item))}
                        aria-label="Regenerar contrasena"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] p-4 text-sm text-[var(--niva-color-muted)]">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
            Las invitaciones permanecen deshabilitadas hasta implementar roles verificables, enlaces de activacion y auditoria.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
