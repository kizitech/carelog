// lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const reportSchema = z.object({
  patientName: z
    .string()
    .min(2, "Patient name must be at least 2 characters")
    .max(100),
  conditionOnArrival: z.enum(["Stable", "Critical", "Improving", "Serious"]),
  condition: z.enum(["Stable", "Critical", "Improving", "Serious"]),
  medication: z.boolean(),
  medNotes: z.string().max(500).optional().default(""),
  incidents: z.string().max(1000).optional().default(""),
  tasksNext: z.string().min(5, "Please describe tasks for the next shift").max(1000),
  notes: z.string().max(500).optional().default(""),
  staffName: z
    .string()
    .min(2, "Staff name must be at least 2 characters")
    .max(100),
  department: z.enum([
    "Emergency",
    "ICU",
    "Pediatrics",
    "Surgery",
    "General Ward",
  ]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Nurse", "Senior Nurse", "Doctor", "Resident", "Intern"]),
  department: z.enum([
    "Emergency",
    "ICU",
    "Pediatrics",
    "Surgery",
    "General Ward",
  ]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ReportFormValues = z.infer<typeof reportSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
