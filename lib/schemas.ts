// lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const shiftRecordSchema = z.object({
  residentId: z.string().min(1, "Please select a resident"),
  conditionUpdate: z.enum(["Well", "Improving", "Unwell", "Critical"]),
  observations: z.string().min(1, "Please add an observation").max(1000),
  careProvided: z.string().max(500).default(""),
  medicationTaken: z.boolean().default(false),
  incidents: z.string().max(1000).default(""),
  tasksForNextShift: z.string().min(5, "Please add at least one task for the next shift").max(1000),
  staffName: z.string().optional().default(""),
  shift: z.enum(["Morning", "Afternoon", "Night"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["Care Worker", "Senior Care Worker", "Team Leader", "Manager", "Nurse"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ShiftRecordFormValues = z.infer<typeof shiftRecordSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
