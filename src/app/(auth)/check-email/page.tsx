import Link from "next/link";
import { MailCheck } from "lucide-react";
import { resendConfirmation } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NivaBrandLockup } from "@/components/brand/niva-brand";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--niva-color-background)] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center sm:p-8">
          <NivaBrandLockup className="mx-auto mb-7 justify-center" />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-[var(--niva-color-foreground)]">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-[var(--niva-color-muted)]">
            Creamos tu usuario y enviamos un enlace de confirmación a:
          </p>
          <p className="mt-3 rounded-[var(--niva-radius-md)] bg-[var(--niva-color-muted-surface)] px-3 py-2 font-mono text-sm font-semibold text-[var(--niva-color-body)]">
            {email || "tu correo"}
          </p>

          {params.error ? (
            <div className="mt-4 rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-3 text-left text-sm text-[var(--niva-color-foreground)]">
              {params.error.includes("For security purposes")
                ? "Supabase limitó los reenvíos por seguridad. Espera alrededor de 1 minuto antes de intentarlo de nuevo."
                : params.error}
            </div>
          ) : null}

          {params.sent ? (
            <div className="mt-4 rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-accent-surface)] p-3 text-sm text-[var(--niva-color-accent)]">
              Enviamos otro correo de confirmación.
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <form action={resendConfirmation}>
              <input type="hidden" name="email" value={email} />
              <Button className="w-full" type="submit" disabled={!email}>
                Reenviar confirmación
              </Button>
            </form>
            <Link href="/login" className="inline-flex h-10 w-full items-center justify-center rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-5 text-sm font-semibold text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xs)] transition hover:bg-[var(--niva-color-muted-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--niva-color-focus)] focus-visible:ring-offset-2">
              Ya confirmé, ir a iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
