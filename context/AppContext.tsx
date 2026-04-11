"use client";
// context/AppContext.tsx
import {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, type ReactNode,
} from "react";
import type { User, Resident, ShiftLog } from "@/types";
import { SEED_RESIDENTS, SEED_LOGS } from "@/lib/seed";
import { saveToStorage, loadFromStorage, getInitials, getShift, todayStr } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import type { ShiftLogFormValues } from "@/lib/schemas";

interface AppContextValue {
  // Auth
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Residents
  residents: Resident[];
  getResident: (id: string) => Resident | undefined;

  // Shift Logs
  logs: ShiftLog[];
  activeLogs: ShiftLog[];
  trashedLogs: ShiftLog[];
  todayLogs: ShiftLog[];
  addLog: (values: ShiftLogFormValues) => void;
  trashLog: (id: string) => void;
  restoreLog: (id: string) => void;
  deleteLog: (id: string) => void;
  clearTrash: () => void;

  // History per resident
  getResidentLogs: (residentId: string) => ShiftLog[];

  // Filters
  search: string; setSearch: (v: string) => void;
  filterStaff: string; setFilterStaff: (v: string) => void;
  filterDate: string; setFilterDate: (v: string) => void;
  filteredLogs: ShiftLog[];
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // All unique staff names (for filter dropdown)
  allStaffNames: string[];

  // Reset
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_USER: User = {
  id: "u1", name: "Ada Obi", email: "ada.obi@carehome.org",
  role: "Senior Carer", shift: "Morning", avatar: "AO", wing: "Sunrise Wing",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [logs, setLogs] = useState<ShiftLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const savedUser      = loadFromStorage<User | null>("cl_user", null);
    const savedLogs      = loadFromStorage<ShiftLog[]>("cl_logs", SEED_LOGS);
    const savedResidents = loadFromStorage<Resident[]>("cl_residents", SEED_RESIDENTS);
    if (savedUser) setUser(savedUser);
    setLogs(savedLogs);
    setResidents(savedResidents);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveToStorage("cl_logs", logs); }, [logs, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("cl_user", user); }, [user, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("cl_residents", residents); }, [residents, hydrated]);

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
    setUser(u => u ? { ...u, ...data, avatar: getInitials(data.name || u.name) } : u);
  }, []);

  const getResident = useCallback((id: string) => residents.find(r => r.id === id), [residents]);

  const addLog = useCallback((values: ShiftLogFormValues) => {
    if (!user) return;
    const resident = residents.find(r => r.id === values.residentId);
    const newLog: ShiftLog = {
      id: uuid(),
      residentId: values.residentId,
      residentName: resident?.name || values.residentId,
      staffId: user.id,
      staffName: values.staffName,
      shift: values.shift,
      date: values.date,
      timestamp: Date.now(),
      conditionUpdate: values.conditionUpdate,
      medicationTaken: values.medicationTaken,
      incidents: values.incidents || "",
      tasksForNextShift: values.tasksForNextShift,
      careProvided: values.careProvided || "",
      trashed: false,
    };
    setLogs(l => [newLog, ...l]);
  }, [user, residents]);

  const trashLog   = useCallback((id: string) => setLogs(l => l.map(log => log.id === id ? { ...log, trashed: true  } : log)), []);
  const restoreLog = useCallback((id: string) => setLogs(l => l.map(log => log.id === id ? { ...log, trashed: false } : log)), []);
  const deleteLog  = useCallback((id: string) => setLogs(l => l.filter(log => log.id !== id)), []);
  const clearTrash = useCallback(() => setLogs(l => l.filter(log => !log.trashed)), []);

  const resetApp = useCallback(() => {
    setLogs(SEED_LOGS);
    setResidents(SEED_RESIDENTS);
    saveToStorage("cl_logs",      SEED_LOGS);
    saveToStorage("cl_residents", SEED_RESIDENTS);
  }, []);

  const getResidentLogs = useCallback((residentId: string) =>
    logs.filter(l => !l.trashed && l.residentId === residentId)
      .sort((a, b) => b.timestamp - a.timestamp),
    [logs]
  );

  const activeLogs  = useMemo(() => logs.filter(l => !l.trashed), [logs]);
  const trashedLogs = useMemo(() => logs.filter(l =>  l.trashed), [logs]);
  const todayLogs   = useMemo(() => activeLogs.filter(l => l.date === todayStr()), [activeLogs]);

  const allStaffNames = useMemo(() =>
    Array.from(new Set(activeLogs.map(l => l.staffName))).sort(),
    [activeLogs]
  );

  const filteredLogs = useMemo(() => {
    return activeLogs.filter(l => {
      const q = search.toLowerCase().trim();
      if (q && !l.residentName.toLowerCase().includes(q) && !l.staffName.toLowerCase().includes(q)) return false;
      if (filterStaff && l.staffName !== filterStaff) return false;
      if (filterDate  && l.date !== filterDate)        return false;
      return true;
    });
  }, [activeLogs, search, filterStaff, filterDate]);

  const clearFilters = useCallback(() => { setSearch(""); setFilterStaff(""); setFilterDate(""); }, []);
  const hasActiveFilters = !!(search || filterStaff || filterDate);

  return (
    <AppContext.Provider value={{
      user, login, logout, updateProfile,
      residents, getResident,
      logs, activeLogs, trashedLogs, todayLogs,
      addLog, trashLog, restoreLog, deleteLog, clearTrash,
      getResidentLogs,
      search, setSearch, filterStaff, setFilterStaff,
      filterDate, setFilterDate,
      filteredLogs, clearFilters, hasActiveFilters,
      allStaffNames,
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
