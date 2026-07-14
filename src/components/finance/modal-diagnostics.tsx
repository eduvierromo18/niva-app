"use client";

// TEMP on-screen diagnostic for the mobile modal scroll bug. Measures the
// NivaModal panel it lives inside and prints the numbers so they can be read /
// photographed from the phone (no dev tools needed). Remove after diagnosis.
import { useEffect, useRef, useState } from "react";

export function ModalDiagnostics({ label }: { label: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [lines, setLines] = useState<string[]>(["midiendo…"]);

  useEffect(() => {
    function measure() {
      const panel = ref.current?.closest('[role="dialog"]') as HTMLElement | null;
      if (!panel) return;
      const cs = getComputedStyle(panel);
      const r = panel.getBoundingClientRect();
      setLines([
        `overflows: ${panel.scrollHeight > panel.clientHeight + 1}`,
        `scrollH/clientH: ${panel.scrollHeight}/${panel.clientHeight}`,
        `maxHeight: ${cs.maxHeight}`,
        `overflowY: ${cs.overflowY}`,
        `panelBottom/winH: ${Math.round(r.bottom)}/${window.innerHeight}`,
        `bottomCutOff: ${r.bottom > window.innerHeight + 1}`,
      ]);
    }
    const raf = requestAnimationFrame(measure);
    const timer = setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <pre ref={ref} className="whitespace-pre-wrap rounded-md border-2 border-red-500 bg-yellow-100 p-2 font-mono text-[11px] leading-snug text-black">
      {`DIAG · ${label}\n` + lines.join("\n")}
    </pre>
  );
}
