import Link from "next/link";
import { WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { inputClass } from "@/components/ui/dialog";

export function AuthCard({
  mode,
  action,
  error,
  next,
}: {
  mode: "login" | "signup";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  next?: string;
}) {
  const isLogin = mode === "login";
  const friendlyError = error?.includes("For security purposes")
    ? "Supabase limito los intentos por seguridad. Espera alrededor de 1 minuto antes de volver a intentar."
    : error;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-950 dark:text-zinc-50">
                {isLogin ? "Entrar a Finanzas" : "Crear cuenta"}
              </h1>
              <p className="text-sm text-slate-500">
                {isLogin ? "Accede a tu panel personal." : "Empieza con un usuario seguro."}
              </p>
            </div>
          </div>

          {friendlyError ? (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {friendlyError}
            </div>
          ) : null}

          <form action={action} className="grid gap-4">
            {!isLogin ? (
              <label className="grid gap-2 text-sm font-semibold">
                Nombre completo
                <input className={inputClass} name="fullName" autoComplete="name" required />
              </label>
            ) : null}
            <label className="grid gap-2 text-sm font-semibold">
              Correo
              <input className={inputClass} name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Contrasena
              <input
                className={inputClass}
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
              />
            </label>
            {next ? <input type="hidden" name="next" value={next} /> : null}
            <Button type="submit" className="mt-2 w-full">
              {isLogin ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
            <Link className="font-bold text-emerald-700" href={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Crear una" : "Iniciar sesion"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
