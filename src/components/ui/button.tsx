import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
        className,
      )}
      {...props}
    />
  );
}

