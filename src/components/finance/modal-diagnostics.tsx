"use client";

// TEMP on-screen diagnostic for the Budgets modal scroll regression. Measures
// the NivaModal panel it lives inside and prints the numbers so they can be
// read/photographed from the phone (no dev tools needed). Remove after diagnosis.
import { useEffect, useRef, useState } from "react";

export function ModalDiagnostics({ label }: { label: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [lines, setLines] = useState<string[]>(["midiendo…"]);
  const touchCounts = useRef({ start: 0, move: 0, end: 0 });
  const scrollCount = useRef(0);
  const lastScrollTop = useRef<number | null>(null);

  useEffect(() => {
    function measure() {
      const panel = ref.current?.closest('[role="dialog"]') as HTMLElement | null;
      if (!panel) return;
      const cs = getComputedStyle(panel);
      const r = panel.getBoundingClientRect();
      const vv = window.visualViewport;
      setLines([
        `overflows: ${panel.scrollHeight > panel.clientHeight + 1}`,
        `scrollH/clientH: ${panel.scrollHeight}/${panel.clientHeight}`,
        `scrollTop: ${panel.scrollTop}`,
        `maxHeight: ${cs.maxHeight}`,
        `overflowY: ${cs.overflowY}`,
        `overscrollBehaviorY: ${cs.overscrollBehaviorY ?? "n/a"}`,
        `webkitOverflowScrolling: ${(cs as unknown as Record<string, string>).webkitOverflowScrolling ?? "n/a"}`,
        `panelBottom/winH: ${Math.round(r.bottom)}/${window.innerHeight}`,
        `bottomCutOff: ${r.bottom > window.innerHeight + 1}`,
        `innerH/docClientH: ${window.innerHeight}/${document.documentElement.clientHeight}`,
        `visualViewport h/offsetTop: ${vv ? Math.round(vv.height) : "n/a"}/${vv ? Math.round(vv.offsetTop) : "n/a"}`,
        `touch start/move/end: ${touchCounts.current.start}/${touchCounts.current.move}/${touchCounts.current.end}`,
        `scroll events: ${scrollCount.current}`,
      ]);
    }

    const panel = ref.current?.closest('[role="dialog"]') as HTMLElement | null;

    function onTouchStart() {
      touchCounts.current.start += 1;
      measure();
    }
    function onTouchMove() {
      touchCounts.current.move += 1;
      measure();
    }
    function onTouchEnd() {
      touchCounts.current.end += 1;
      measure();
    }
    function onScroll() {
      scrollCount.current += 1;
      lastScrollTop.current = panel?.scrollTop ?? null;
      measure();
    }

    panel?.addEventListener("touchstart", onTouchStart, { passive: true });
    panel?.addEventListener("touchmove", onTouchMove, { passive: true });
    panel?.addEventListener("touchend", onTouchEnd, { passive: true });
    panel?.addEventListener("scroll", onScroll, { passive: true });

    const raf = requestAnimationFrame(measure);
    const timer = setTimeout(measure, 400);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
      panel?.removeEventListener("touchstart", onTouchStart);
      panel?.removeEventListener("touchmove", onTouchMove);
      panel?.removeEventListener("touchend", onTouchEnd);
      panel?.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <pre ref={ref} className="whitespace-pre-wrap rounded-md border-2 border-red-500 bg-yellow-100 p-2 font-mono text-[11px] leading-snug text-black">
      {`DIAG · ${label}\n` + lines.join("\n")}
    </pre>
  );
}
