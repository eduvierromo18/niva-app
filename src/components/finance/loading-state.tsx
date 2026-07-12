export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)]" />
      ))}
    </div>
  );
}
