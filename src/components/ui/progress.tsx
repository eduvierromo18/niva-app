import { NivaProgress } from "@/design-system";

export function Progress({ value, className, label = "Progreso" }: { value: number; className?: string; label?: string }) {
  return <NivaProgress value={value} className={className} label={label} />;
}
