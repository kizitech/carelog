// types/index.ts

export type Condition = "Stable" | "Critical" | "Improving" | "Serious";
export type Department =
  | "Emergency"
  | "ICU"
  | "Pediatrics"
  | "Surgery"
  | "General Ward";
export type Shift = "Morning" | "Afternoon" | "Night";
export type Role = "Nurse" | "Doctor" | "Senior Nurse" | "Resident" | "Intern";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shift: Shift;
  avatar: string; // initials
  department: Department;
}

export interface Report {
  id: string;
  // Patient
  patientName: string;
  conditionOnArrival: Condition;
  condition: Condition; // condition after shift
  // Treatment
  medication: boolean;
  medNotes: string;
  incidents: string;
  // Handover
  tasksNext: string;
  notes: string;
  // Meta
  staffName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  timestamp: number;
  trashed: boolean;
}

export interface ReportFormValues {
  patientName: string;
  conditionOnArrival: Condition;
  condition: Condition;
  medication: boolean;
  medNotes: string;
  incidents: string;
  tasksNext: string;
  notes: string;
  staffName: string;
  department: Department;
  date: string;
}

export type ConditionColors = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export interface FilterState {
  search: string;
  condition: string;
  department: string;
  date: string;
}
