"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { NivaButton } from "@/design-system/components/NivaButton";
import { NivaCard } from "@/design-system/components/NivaSurface";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Niva route error", error);
  }, [error]);

  return (
    <main className="flex min-h-[55vh] items-center justify-center">
      <NivaCard className="max-w-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)]">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-[family-name:var(--font-manrope)] text-2xl font-semibold text-[var(--niva-color-foreground)]">
          Algo interrumpió esta vista
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">
          Tus datos permanecen seguros. Vuelve a intentarlo para recargar esta sección.
        </p>
        <NivaButton className="mt-6" onClick={reset}>
          Intentar de nuevo
        </NivaButton>
      </NivaCard>
    </main>
  );
}


