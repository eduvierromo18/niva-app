import Link from "next/link";
import { NivaBrandLockup } from "@/components/brand/niva-brand";
import { NivaButton } from "@/design-system";
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
    ? "Supabase limitó los intentos por seguridad. Espera alrededor de un minuto antes de volver a intentar."
    : error;

  return (
    <div className="grid min-h-screen bg-[var(--niva-color-background)] lg:grid-cols-[minmax(22rem,0.85fr)_minmax(30rem,1.15fr)]">
      <section className="hidden bg-[var(--niva-color-inverse-surface)] px-10 py-12 text-[var(--niva-color-inverse-foreground)] lg:flex lg:flex-col lg:justify-between">
        <NivaBrandLockup ground="dark" />
        <div className="max-w-md">
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-inverse-muted)]">
            Tu espacio financiero
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-[var(--niva-color-inverse-foreground)]">
            Tu dinero, con calma.
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--niva-color-inverse-muted)]">
            Una lectura clara de lo disponible, lo reservado y lo que viene después.
          </p>
        </div>
        <p className="text-xs text-[var(--niva-color-inverse-muted)]">Privado por diseño · Controlado por ti</p>
      </section>

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <NivaBrandLockup className="lg:hidden" />
          <p className="mt-10 font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-accent)]">
            {isLogin ? "Acceso personal" : "Nuevo espacio"}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[var(--niva-color-foreground)]">
            {isLogin ? "Entrar a Niva" : "Crear tu cuenta"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--niva-color-muted)]">
            {isLogin ? "Continúa con tu centro de control financiero." : "Empieza con un espacio financiero personal y seguro."}
          </p>

          {friendlyError ? (
            <div className="mt-6 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-4 text-sm leading-6 text-[var(--niva-color-foreground)]">
              {friendlyError}
            </div>
          ) : null}

          <form action={action} className="mt-8 grid gap-5">
            {!isLogin ? (
              <label className="grid gap-2 text-sm font-semibold text-[var(--niva-color-foreground)]">
                Nombre completo
                <input className={inputClass} name="fullName" autoComplete="name" required />
              </label>
            ) : null}
            <label className="grid gap-2 text-sm font-semibold text-[var(--niva-color-foreground)]">
              Correo
              <input className={inputClass} name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--niva-color-foreground)]">
              Contraseña
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
            <NivaButton type="submit" size="lg" className="mt-1 w-full">
              {isLogin ? "Entrar" : "Crear cuenta"}
            </NivaButton>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--niva-color-muted)]">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <Link className="font-semibold text-[var(--niva-color-accent)] hover:text-[var(--niva-color-accent-hover)]" href={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Crear una" : "Iniciar sesión"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
