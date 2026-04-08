// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Condition, Department, Shift, Role } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CONDITIONS: Condition[] = ["Stable", "Critical", "Improving", "Serious"];
export const DEPARTMENTS: Department[] = ["Emergency", "ICU", "Pediatrics", "Surgery", "General Ward"];
export const ROLES: Role[] = ["Nurse", "Senior Nurse", "Doctor", "Resident", "Intern"];
export const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night"];

export type ConditionColors = { bg: string; text: string; border: string; dot: string };

export const CONDITION_COLORS: Record<Condition, ConditionColors> = {
  Stable:   { bg: "bg-green-50 dark:bg-green-950/30",  text: "text-green-700 dark:text-green-400",  border: "border-green-200 dark:border-green-800",  dot: "bg-green-500" },
  Critical: { bg: "bg-red-50 dark:bg-red-950/30",      text: "text-red-700 dark:text-red-400",      border: "border-red-200 dark:border-red-800",      dot: "bg-red-500" },
  Improving:{ bg: "bg-blue-50 dark:bg-blue-950/30",    text: "text-blue-700 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-800",    dot: "bg-blue-500" },
  Serious:  { bg: "bg-amber-50 dark:bg-amber-950/30",  text: "text-amber-700 dark:text-amber-400",  border: "border-amber-200 dark:border-amber-800",  dot: "bg-amber-500" },
};

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatDateShort(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now); yesterday.setDate(now.getDate()-1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  return `${day}d ago`;
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getShift(): Shift {
  const h = new Date().getHours();
  if (h >= 8 && h < 16) return "Morning";
  if (h >= 16) return "Afternoon";
  return "Night";
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}
