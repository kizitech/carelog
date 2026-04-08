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
  avatar: string;
  department: Department;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  department: Department;
  admittedDate: string;
  currentCondition: Condition;
  assignedTo: string[];
  ward: string;
  notes: string;
}

export interface PatientLog {
  patientId: string;
  patientName: string;
  conditionBefore: Condition;
  conditionAfter: Condition;
  observations: string;
  treatment: string;
  medication: boolean;
  medNotes: string;
  injuries: string;
  educationGiven: string;
  notes: string;
  timestamp: number;
}

export interface Report {
  id: string;
  staffId: string;
  staffName: string;
  department: Department;
  shift: Shift;
  date: string;
  timestamp: number;
  patients: PatientLog[];
  trashed: boolean;
  notes: string;
}

export interface PatientLogFormValues {
  patientId: string;
  conditionBefore: Condition;
  conditionAfter: Condition;
  observations: string;
  treatment: string;
  medication: boolean;
  medNotes: string;
  injuries: string;
  educationGiven: string;
  notes: string;
}

export interface ReportFormValues {
  department: Department;
  shift: Shift;
  date: string;
  notes: string;
  patients: PatientLogFormValues[];
}
