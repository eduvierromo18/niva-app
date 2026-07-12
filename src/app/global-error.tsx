"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Niva global error", error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", fontFamily: "system-ui, sans-serif", background: "#FAFBFC", color: "#111827" }}>
          <section style={{ maxWidth: "520px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5B6472" }}>Niva</p>
            <h1 style={{ marginTop: "16px", fontSize: "28px" }}>No pudimos cargar la aplicación</h1>
            <p style={{ marginTop: "12px", lineHeight: 1.6, color: "#5B6472" }}>Tus datos permanecen seguros. Intenta cargar Niva nuevamente.</p>
            <button type="button" onClick={reset} style={{ marginTop: "24px", minHeight: "40px", border: 0, borderRadius: "8px", padding: "0 20px", background: "#1E7A4E", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }}>
              Volver a intentar
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

