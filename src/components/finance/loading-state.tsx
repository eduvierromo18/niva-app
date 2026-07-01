export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900" />
      ))}
    </div>
  );
}
