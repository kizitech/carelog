"use client";
// components/shared/index.tsx
import { cn, CONDITION_STYLES } from "@/lib/utils";
import type { Condition } from "@/types";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ConditionBadge({ condition }: { condition: Condition }) {
  const c = CONDITION_STYLES[condition];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", c.bg, c.text, c.border)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
      {condition}
    </span>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}
export function Button({ variant = "primary", size = "md", loading = false, icon, iconRight, children, className, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
    secondary: "bg-secondary hover:bg-accent text-secondary-foreground",
    ghost: "bg-transparent hover:bg-accent text-foreground",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border border-border hover:bg-accent text-foreground",
  };
  const sizes = { sm: "px-3 py-1.5 text-[13px]", md: "px-4 py-2.5 text-sm", lg: "px-5 py-3 text-[15px]" };
  return (
    <button disabled={disabled || loading} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon || null}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function StatCard({ label, value, icon, accent, iconColor, sub, delay = 0 }: {
  label: string; value: number | string; icon: ReactNode; accent: string; iconColor: string; sub?: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", accent)}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[26px] font-extrabold text-foreground leading-none tracking-tight">{value}</p>
        <p className="text-[13px] text-muted-foreground mt-1 font-medium">{label}</p>
        {sub && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">{sub}</p>}
      </div>
    </motion.div>
  );
}

export function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">{icon}</div>
      <span className="text-[15px] font-bold text-foreground">{title}</span>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-500 mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        checked ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700")}>
      <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

export function Avatar({ initials, size = "md", className }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizes = { sm: "w-7 h-7 text-[11px]", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" };
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center font-bold text-white flex-shrink-0", sizes[size], className)}>
      {initials}
    </div>
  );
}

export function FormField({ label, icon, required, error, children, hint }: {
  label: string; icon?: ReactNode; required?: boolean; error?: string; children: ReactNode; hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
        {icon && <span className="text-blue-500">{icon}</span>}
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/70">{hint}</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

const inputBase = "w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(inputBase, "min-h-[80px] resize-y", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(inputBase, "cursor-pointer", className)} {...props}>{children}</select>
  )
);
Select.displayName = "Select";