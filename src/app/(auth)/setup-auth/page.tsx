import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NivaBrandLockup } from "@/components/brand/niva-brand";

export default function SetupAuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--niva-color-background)] p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 sm:p-8">
          <NivaBrandLockup className="mb-7" />
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Falta configurar Supabase</h1>
              <p className="text-sm text-[var(--niva-color-muted)]">La app ya está protegida, pero necesita variables de entorno.</p>
            </div>
          </div>
          <div className="rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] p-4 font-mono text-sm text-[var(--niva-color-body)]">
            NEXT_PUBLIC_SUPABASE_URL=<br />
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<br />
            SUPABASE_SERVICE_ROLE_KEY=
          </div>
          <p className="mt-4 text-sm text-[var(--niva-color-muted)]">
            La llave service role solo se usa en servidor para tareas administrativas autorizadas.
            Nunca debe llevar prefijo NEXT_PUBLIC.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
