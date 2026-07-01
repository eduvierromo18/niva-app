import Link from "next/link";
import { MailCheck } from "lucide-react";
import { resendConfirmation } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center sm:p-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <MailCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-zinc-50">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-slate-500">
            Creamos tu usuario y enviamos un enlace de confirmacion a:
          </p>
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm font-semibold text-slate-800">
            {email || "tu correo"}
          </p>

          {params.error ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800">
              {params.error.includes("For security purposes")
                ? "Supabase limito los reenvios por seguridad. Espera alrededor de 1 minuto antes de intentarlo de nuevo."
                : params.error}
            </div>
          ) : null}

          {params.sent ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Enviamos otro correo de confirmacion.
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <form action={resendConfirmation}>
              <input type="hidden" name="email" value={email} />
              <Button className="w-full" type="submit" disabled={!email}>
                Reenviar confirmacion
              </Button>
            </form>
            <Button variant="secondary" className="w-full" type="button">
              <Link href="/login">Ya confirme, ir a login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

