// types/index.ts

export type ConditionStatus =
  | "Well"
  | "Unwell"
  | "Needs Monitoring"
  | "Improved"
  | "Declined";

export type Shift = "Morning" | "Afternoon" | "Night";
export type Role = "Care Worker" | "Senior Carer" | "Team Leader" | "Manager" | "Night Staff";
export type Wing = "Sunrise Wing" | "Garden Wing" | "Oak Wing" | "Maple Wing";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shift: Shift;
  avatar: string;
  wing: Wing;
}

// A resident in the care home (replaces Patient)
export interface Resident {
  id: string;
  name: string;
  dob: string;          // YYYY-MM-DD
  room: string;
  wing: Wing;
  admittedDate: string; // YYYY-MM-DD
  currentCondition: ConditionStatus;
  keyWorker: string;    // staff name
  notes: string;        // general care notes
}

// One shift log entry for one resident (replaces Report)
export interface ShiftLog {
  id: string;
  residentId: string;
  residentName: string;
  staffId: string;
  staffName: string;
  shift: Shift;
  date: string;         // YYYY-MM-DD
  timestamp: number;
  conditionUpdate: string;       // free-text condition narrative
  medicationTaken: boolean;
  incidents: string;             // optional
  tasksForNextShift: string;     // MOST IMPORTANT field
  careProvided: string;          // what was done this shift
  trashed: boolean;
}

// Form shape
export interface ShiftLogFormValues {
  residentId: string;
  conditionUpdate: string;
  medicationTaken: boolean;
  incidents: string;
  tasksForNextShift: string;
  careProvided: string;
  staffName: string;
  shift: Shift;
  date: string;
}
