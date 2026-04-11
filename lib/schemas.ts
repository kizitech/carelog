// lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const shiftLogSchema = z.object({
  residentId: z.string().min(1, "Please select a resident"),
  conditionUpdate: z.string().min(1, "Please describe the resident's condition").max(1000),
  medicationTaken: z.boolean().default(false),
  incidents: z.string().max(1000).default(""),
  tasksForNextShift: z.string().min(1, "Please leave tasks for the next shift").max(1000),
  careProvided: z.string().max(1000).default(""),
  staffName: z.string().min(2, "Staff name is required"),
  shift: z.enum(["Morning", "Afternoon", "Night"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["Care Worker", "Senior Carer", "Team Leader", "Manager", "Night Staff"]),
  wing: z.enum(["Sunrise Wing", "Garden Wing", "Oak Wing", "Maple Wing"]),
});

export type LoginFormValues    = z.infer<typeof loginSchema>;
export type ShiftLogFormValues = z.infer<typeof shiftLogSchema>;
export type ProfileFormValues  = z.infer<typeof profileSchema>;
