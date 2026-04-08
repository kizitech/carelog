"use client";
// context/AppContext.tsx
import {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, type ReactNode,
} from "react";
import type { User, Patient, Report } from "@/types";
import { SEED_PATIENTS, SEED_REPORTS } from "@/lib/seed";
import { saveToStorage, loadFromStorage, getInitials, getShift, todayStr } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import type { ReportFormValues } from "@/lib/schemas";

interface AppContextValue {
  // Auth
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Patients
  patients: Patient[];
  assignedPatients: Patient[];
  getPatient: (id: string) => Patient | undefined;
  addPatient: (p: Omit<Patient, "id">) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;

  // Reports
  reports: Report[];
  activeReports: Report[];
  trashedReports: Report[];
  todayReports: Report[];
  addReport: (values: ReportFormValues) => void;
  trashReport: (id: string) => void;
  restoreReport: (id: string) => void;
  deleteReport: (id: string) => void;
  clearTrash: () => void;

  // Patient history helpers
  getPatientReports: (patientId: string) => { report: Report; log: import("@/types").PatientLog }[];

  // Filters
  search: string; setSearch: (v: string) => void;
  filterCondition: string; setFilterCondition: (v: string) => void;
  filterDepartment: string; setFilterDepartment: (v: string) => void;
  filterDate: string; setFilterDate: (v: string) => void;
  filterShift: string; setFilterShift: (v: string) => void;
  filteredReports: Report[];
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Reset
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_USER: User = {
  id: "u1", name: "Ada Obi", email: "ada.obi@hospital.org",
  role: "Senior Nurse", shift: "Morning", avatar: "AO", department: "General Ward",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("");

  useEffect(() => {
    const savedUser = loadFromStorage<User | null>("cl_user", null);
    const savedReports = loadFromStorage<Report[]>("cl_reports", SEED_REPORTS);
    const savedPatients = loadFromStorage<Patient[]>("cl_patients", SEED_PATIENTS);
    if (savedUser) setUser(savedUser);
    setReports(savedReports);
    setPatients(savedPatients);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveToStorage("cl_reports", reports); }, [reports, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("cl_user", user); }, [user, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("cl_patients", patients); }, [patients, hydrated]);

  const login = useCallback((email: string) => {
    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const newUser: User = {
      ...DEFAULT_USER, id: uuid(), name, email,
      avatar: getInitials(name), shift: getShift(),
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => { setUser(null); saveToStorage("cl_user", null); }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(u => {
      if (!u) return u;
      const updated = { ...u, ...data, avatar: getInitials(data.name || u.name) };
      return updated;
    });
  }, []);

  const getPatient = useCallback((id: string) => patients.find(p => p.id === id), [patients]);

  const addPatient = useCallback((p: Omit<Patient, "id">) => {
    setPatients(ps => [{ ...p, id: uuid() }, ...ps]);
  }, []);

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients(ps => ps.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const assignedPatients = useMemo(() =>
    patients.filter(p => user && p.assignedTo.includes(user.id)),
    [patients, user]
  );

  const addReport = useCallback((values: ReportFormValues) => {
    if (!user) return;
    const newReport: Report = {
      id: uuid(),
      staffId: user.id,
      staffName: user.name,
      department: values.department,
      shift: values.shift,
      date: values.date,
      timestamp: Date.now(),
      trashed: false,
      notes: values.notes || "",
      patients: values.patients.map(pl => {
        const pt = patients.find(p => p.id === pl.patientId);
        return {
          ...pl,
          patientName: pt?.name || pl.patientId,
          timestamp: Date.now(),
          medNotes: pl.medNotes || "",
          injuries: pl.injuries || "",
          educationGiven: pl.educationGiven || "",
          notes: pl.notes || "",
          treatment: pl.treatment || "",
        };
      }),
    };
    // Update each patient's currentCondition to conditionAfter
    values.patients.forEach(pl => {
      setPatients(ps => ps.map(p =>
        p.id === pl.patientId ? { ...p, currentCondition: pl.conditionAfter } : p
      ));
    });
    setReports(r => [newReport, ...r]);
  }, [user, patients]);

  const trashReport = useCallback((id: string) => {
    setReports(r => r.map(rep => rep.id === id ? { ...rep, trashed: true } : rep));
  }, []);

  const restoreReport = useCallback((id: string) => {
    setReports(r => r.map(rep => rep.id === id ? { ...rep, trashed: false } : rep));
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports(r => r.filter(rep => rep.id !== id));
  }, []);

  const clearTrash = useCallback(() => {
    setReports(r => r.filter(rep => !rep.trashed));
  }, []);

  const resetApp = useCallback(() => {
    setReports(SEED_REPORTS);
    setPatients(SEED_PATIENTS);
    saveToStorage("cl_reports", SEED_REPORTS);
    saveToStorage("cl_patients", SEED_PATIENTS);
  }, []);

  const getPatientReports = useCallback((patientId: string) => {
    const result: { report: Report; log: import("@/types").PatientLog }[] = [];
    reports.filter(r => !r.trashed).forEach(report => {
      const log = report.patients.find(pl => pl.patientId === patientId);
      if (log) result.push({ report, log });
    });
    return result.sort((a, b) => b.report.timestamp - a.report.timestamp);
  }, [reports]);

  const activeReports = useMemo(() => reports.filter(r => !r.trashed), [reports]);
  const trashedReports = useMemo(() => reports.filter(r => r.trashed), [reports]);
  const todayReports = useMemo(() => activeReports.filter(r => r.date === todayStr()), [activeReports]);

  const filteredReports = useMemo(() => {
    return activeReports.filter(r => {
      const q = search.toLowerCase().trim();
      if (q) {
        const matchesStaff = r.staffName.toLowerCase().includes(q);
        const matchesPatient = r.patients.some(p => p.patientName.toLowerCase().includes(q));
        const matchesDept = r.department.toLowerCase().includes(q);
        if (!matchesStaff && !matchesPatient && !matchesDept) return false;
      }
      if (filterCondition && !r.patients.some(p => p.conditionAfter === filterCondition)) return false;
      if (filterDepartment && r.department !== filterDepartment) return false;
      if (filterDate && r.date !== filterDate) return false;
      if (filterShift && r.shift !== filterShift) return false;
      return true;
    });
  }, [activeReports, search, filterCondition, filterDepartment, filterDate, filterShift]);

  const clearFilters = useCallback(() => {
    setSearch(""); setFilterCondition(""); setFilterDepartment(""); setFilterDate(""); setFilterShift("");
  }, []);

  const hasActiveFilters = !!(search || filterCondition || filterDepartment || filterDate || filterShift);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateProfile,
      patients, assignedPatients, getPatient, addPatient, updatePatient,
      reports, activeReports, trashedReports, todayReports,
      addReport, trashReport, restoreReport, deleteReport, clearTrash,
      getPatientReports,
      search, setSearch, filterCondition, setFilterCondition,
      filterDepartment, setFilterDepartment, filterDate, setFilterDate,
      filterShift, setFilterShift,
      filteredReports, clearFilters, hasActiveFilters,
      resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
