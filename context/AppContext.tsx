"use client";
// context/AppContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Report } from "@/types";
import { SEED_REPORTS } from "@/lib/seed";
import {
  saveToStorage,
  loadFromStorage,
  getInitials,
  getShift,
  todayStr,
} from "@/lib/utils";
import { v4 as uuid } from "uuid";
import type { ReportFormValues } from "@/lib/schemas";

interface AppContextValue {
  // Auth
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

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

  // Filters
  search: string;
  setSearch: (v: string) => void;
  filterCondition: string;
  setFilterCondition: (v: string) => void;
  filterDepartment: string;
  setFilterDepartment: (v: string) => void;
  filterDate: string;
  setFilterDate: (v: string) => void;
  filteredReports: Report[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = loadFromStorage<User | null>("cl_user", null);
    const savedReports = loadFromStorage<Report[]>("cl_reports", SEED_REPORTS);
    if (savedUser) setUser(savedUser);
    setReports(savedReports);
    setHydrated(true);
  }, []);

  // Persist reports
  useEffect(() => {
    if (hydrated) saveToStorage("cl_reports", reports);
  }, [reports, hydrated]);

  // Persist user
  useEffect(() => {
    if (hydrated) saveToStorage("cl_user", user);
  }, [user, hydrated]);

  const login = useCallback((email: string, name?: string) => {
    const newUser: User = {
      id: uuid(),
      name: name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      email,
      role: "Senior Nurse",
      shift: getShift(),
      avatar: getInitials(name || email),
      department: "General Ward",
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveToStorage("cl_user", null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((u) => {
      if (!u) return u;
      const updated = { ...u, ...data, avatar: getInitials(data.name || u.name) };
      return updated;
    });
  }, []);

  const addReport = useCallback(
    (values: ReportFormValues) => {
      const report: Report = {
        ...values,
        id: uuid(),
        timestamp: Date.now(),
        trashed: false,
        medNotes: values.medNotes || "",
        incidents: values.incidents || "",
        notes: values.notes || "",
      };
      setReports((r) => [report, ...r]);
    },
    []
  );

  const trashReport = useCallback((id: string) => {
    setReports((r) => r.map((rep) => (rep.id === id ? { ...rep, trashed: true } : rep)));
  }, []);

  const restoreReport = useCallback((id: string) => {
    setReports((r) => r.map((rep) => (rep.id === id ? { ...rep, trashed: false } : rep)));
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((r) => r.filter((rep) => rep.id !== id));
  }, []);

  const clearTrash = useCallback(() => {
    setReports((r) => r.filter((rep) => !rep.trashed));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setFilterCondition("");
    setFilterDepartment("");
    setFilterDate("");
  }, []);

  const activeReports = reports.filter((r) => !r.trashed);
  const trashedReports = reports.filter((r) => r.trashed);
  const todayReports = activeReports.filter((r) => r.date === todayStr());

  const filteredReports = activeReports.filter((r) => {
    const q = search.toLowerCase().trim();
    if (
      q &&
      !r.patientName.toLowerCase().includes(q) &&
      !r.staffName.toLowerCase().includes(q) &&
      !r.department.toLowerCase().includes(q)
    )
      return false;
    if (filterCondition && r.condition !== filterCondition) return false;
    if (filterDepartment && r.department !== filterDepartment) return false;
    if (filterDate && r.date !== filterDate) return false;
    return true;
  });

  const hasActiveFilters = !!(search || filterCondition || filterDepartment || filterDate);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        reports,
        activeReports,
        trashedReports,
        todayReports,
        addReport,
        trashReport,
        restoreReport,
        deleteReport,
        clearTrash,
        search,
        setSearch,
        filterCondition,
        setFilterCondition,
        filterDepartment,
        setFilterDepartment,
        filterDate,
        setFilterDate,
        filteredReports,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
