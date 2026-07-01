import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SetupAuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Falta configurar Supabase</h1>
              <p className="text-sm text-slate-500">La app ya esta protegida, pero necesita variables de entorno.</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 font-mono text-sm text-slate-700">
            NEXT_PUBLIC_SUPABASE_URL=<br />
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<br />
            SUPABASE_SERVICE_ROLE_KEY=
          </div>
          <p className="mt-4 text-sm text-slate-500">
            La llave service role solo se usa en servidor para crear usuarios desde el panel de configuracion.
            Nunca debe llevar prefijo NEXT_PUBLIC.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

