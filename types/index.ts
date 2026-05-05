// types/index.ts

export type Condition = "Well" | "Improving" | "Unwell" | "Critical";
export type Shift = "Morning" | "Afternoon" | "Night";
export type Role = "Care Worker" | "Senior Care Worker" | "Team Leader" | "Manager" | "Nurse";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shift: Shift;
  avatar: string; // initials
}

export interface Resident {
  id: string;
  name: string;
  dob: string;             // YYYY-MM-DD
  roomNumber: string;      // e.g. "12A"
  admittedDate: string;    // YYYY-MM-DD
  currentCondition: Condition;
  supportWorker: string;   // staff name
  notes: string;           // general care notes
}

export interface ShiftRecord {
  id: string;
  residentId: string;
  residentName: string;
  staffName: string;
  shift: Shift;
  date: string;            // YYYY-MM-DD
  timestamp: number;
  conditionUpdate: Condition;  // selected condition — updates resident
  observations: string;
  careProvided: string;
  medicationTaken: boolean;
  incidents: string;
  tasksForNextShift: string;
  trashed: boolean;
}

export interface ShiftRecordFormValues {
  residentId: string;
  conditionUpdate: Condition;
  observations: string;
  careProvided: string;
  medicationTaken: boolean;
  incidents: string;
  tasksForNextShift: string;
  staffName: string;
  shift: Shift;
  date: string;
}
