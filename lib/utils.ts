// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import type {
  Condition,
  ConditionColors,
  Department,
  Shift,
  Role,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const CONDITIONS: Condition[] = [
  "Stable",
  "Critical",
  "Improving",
  "Serious",
];

export const DEPARTMENTS: Department[] = [
  "Emergency",
  "ICU",
  "Pediatrics",
  "Surgery",
  "General Ward",
];

export const ROLES: Role[] = [
  "Nurse",
  "Senior Nurse",
  "Doctor",
  "Resident",
  "Intern",
];

export const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night"];

// ─── Condition Colors ─────────────────────────────────────────────────────────
export const CONDITION_COLORS: Record<Condition, ConditionColors> = {
  Stable: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    dot: "bg-green-500",
  },
  Critical: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
  Improving: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  Serious: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
  },
};

// ─── Date Helpers ─────────────────────────────────────────────────────────────
export function formatTimestamp(ts: number): string {
  return format(new Date(ts), "MMM d, yyyy · h:mm a");
}

export function formatDateShort(ts: number): string {
  const d = new Date(ts);
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday, ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy");
}

export function formatRelative(ts: number): string {
  return formatDistanceToNow(new Date(ts), { addSuffix: true });
}

export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getShift(): Shift {
  const h = new Date().getHours();
  if (h >= 8 && h < 16) return "Morning";
  if (h >= 16 && h < 24) return "Afternoon";
  return "Night";
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Initials Helper ──────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
