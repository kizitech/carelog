// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Condition, Shift, Role } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Constants ─────────────────────────────────────────────────────────────────
export const CONDITIONS: Condition[] = ["Well", "Improving", "Unwell", "Critical"];
export const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night"];
export const ROLES: Role[] = ["Care Worker", "Senior Care Worker", "Team Leader", "Manager", "Nurse"];

// ── Condition colours ─────────────────────────────────────────────────────────
export type ConditionStyle = { bg: string; text: string; border: string; dot: string };

export const CONDITION_STYLES: Record<Condition, ConditionStyle> = {
  Well:      { bg: "bg-green-50  dark:bg-green-950/30",  text: "text-green-700  dark:text-green-400",  border: "border-green-200  dark:border-green-800",  dot: "bg-green-500"  },
  Improving: { bg: "bg-blue-50   dark:bg-blue-950/30",   text: "text-blue-700   dark:text-blue-400",   border: "border-blue-200   dark:border-blue-800",   dot: "bg-blue-500"   },
  Unwell:    { bg: "bg-amber-50  dark:bg-amber-950/30",  text: "text-amber-700  dark:text-amber-400",  border: "border-amber-200  dark:border-amber-800",  dot: "bg-amber-500"  },
  Critical:  { bg: "bg-red-50    dark:bg-red-950/30",    text: "text-red-700    dark:text-red-400",    border: "border-red-200    dark:border-red-800",    dot: "bg-red-500"    },
};

// ── Date helpers ──────────────────────────────────────────────────────────────
export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function formatDateShort(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday     = d.toDateString() === now.toDateString();
  const yest        = new Date(now); yest.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yest.toDateString();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (isToday)     return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getShift(): Shift {
  const h = new Date().getHours();
  if (h >= 8 && h < 16) return "Morning";
  if (h >= 16)          return "Afternoon";
  return "Night";
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Storage helpers ───────────────────────────────────────────────────────────
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
