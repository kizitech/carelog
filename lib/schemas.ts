// lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const patientLogSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  conditionBefore: z.enum(["Stable", "Critical", "Improving", "Serious"]),
  conditionAfter: z.enum(["Stable", "Critical", "Improving", "Serious"]),
  observations: z.string().min(1, "Observations required").max(1000),
  treatment: z.string().max(500).default(""),
  medication: z.boolean().default(false),
  medNotes: z.string().max(500).default(""),
  injuries: z.string().max(500).default(""),
  educationGiven: z.string().max(500).default(""),
  notes: z.string().max(500).default(""),
});

export const reportSchema = z.object({
  department: z.enum(["Emergency", "ICU", "Pediatrics", "Surgery", "General Ward"]),
  shift: z.enum(["Morning", "Afternoon", "Night"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).default(""),
  patients: z.array(patientLogSchema).min(1, "Add at least one patient"),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["Nurse", "Senior Nurse", "Doctor", "Resident", "Intern"]),
  department: z.enum(["Emergency", "ICU", "Pediatrics", "Surgery", "General Ward"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type PatientLogFormValues = z.infer<typeof patientLogSchema>;
export type ReportFormValues = z.infer<typeof reportSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
