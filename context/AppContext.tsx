"use client";
// context/AppContext.tsx
import {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, type ReactNode,
} from "react";
import type { User, Resident, ShiftRecord } from "@/types";
import { SEED_RESIDENTS, SEED_RECORDS } from "@/lib/seed";
import {
  saveToStorage, loadFromStorage, getInitials, getShift, todayStr,
} from "@/lib/utils";
import { v4 as uuid } from "uuid";
import type { ShiftRecordFormValues } from "@/lib/schemas";

interface AppContextValue {
  // Auth
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Residents
  residents: Resident[];
  getResident: (id: string) => Resident | undefined;

  // Records (formerly logs)
  records: ShiftRecord[];
  activeRecords: ShiftRecord[];
  trashedRecords: ShiftRecord[];
  todayRecords: ShiftRecord[];
  filteredRecords: ShiftRecord[];
  addRecord: (values: ShiftRecordFormValues) => void;
  trashRecord: (id: string) => void;
  restoreRecord: (id: string) => void;
  deleteRecord: (id: string) => void;
  clearTrash: () => void;
  getResidentRecords: (residentId: string) => ShiftRecord[];

  // Filters
  search: string; setSearch: (v: string) => void;
  filterDate: string; setFilterDate: (v: string) => void;
  filterStaff: string; setFilterStaff: (v: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;

  // Reset
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Default logged-in user — Evelyn Rose
const DEFAULT_USER: User = {
  id: "u1",
  name: "Evelyn Rose",
  email: "evelyn.rose@carekel.org",
  role: "Senior Care Worker",
  shift: "Morning",
  avatar: "ER",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [records, setRecords]     = useState<ShiftRecord[]>([]);
  const [hydrated, setHydrated]   = useState(false);

  // Filters
  const [search,      setSearch]      = useState("");
  const [filterDate,  setFilterDate]  = useState("");
  const [filterStaff, setFilterStaff] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser      = loadFromStorage<User | null>("ck_user", null);
    const savedRecords   = loadFromStorage<ShiftRecord[]>("ck_records", SEED_RECORDS);
    const savedResidents = loadFromStorage<Resident[]>("ck_residents", SEED_RESIDENTS);
    if (savedUser) setUser(savedUser);
    setRecords(savedRecords);
    setResidents(savedResidents);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveToStorage("ck_records",   records);   }, [records, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("ck_user",      user);      }, [user, hydrated]);
  useEffect(() => { if (hydrated) saveToStorage("ck_residents", residents); }, [residents, hydrated]);

  const login = useCallback((email: string) => {
    // Reuse Evelyn Rose for the demo; name derived from email if different
    const name = email === DEFAULT_USER.email
      ? DEFAULT_USER.name
      : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const newUser: User = {
      ...DEFAULT_USER,
      id: uuid(),
      name,
      email,
      avatar: getInitials(name),
      shift: getShift(),
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveToStorage("ck_user", null);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(u => {
      if (!u) return u;
      return { ...u, ...data, avatar: getInitials(data.name ?? u.name) };
    });
  }, []);

  const getResident = useCallback(
    (id: string) => residents.find(r => r.id === id),
    [residents]
  );

  const getResidentRecords = useCallback(
    (residentId: string) =>
      records
        .filter(r => !r.trashed && r.residentId === residentId)
        .sort((a, b) => b.timestamp - a.timestamp),
    [records]
  );

  const addRecord = useCallback((values: ShiftRecordFormValues) => {
    if (!user) return;
    const resident = residents.find(r => r.id === values.residentId);
    const newRecord: ShiftRecord = {
      id: uuid(),
      residentId:        values.residentId,
      residentName:      resident?.name ?? values.residentId,
      staffName:         values.staffName,
      shift:             values.shift,
      date:              values.date,
      timestamp:         Date.now(),
      conditionUpdate:   values.conditionUpdate,
      observations:      values.observations,
      careProvided:      values.careProvided || "",
      medicationTaken:   values.medicationTaken,
      incidents:         values.incidents || "",
      tasksForNextShift: values.tasksForNextShift,
      trashed: false,
    };
    // Update the resident's currentCondition in-place
    setResidents(rs =>
      rs.map(r => r.id === values.residentId
        ? { ...r, currentCondition: values.conditionUpdate }
        : r
      )
    );
    setRecords(prev => [newRecord, ...prev]);
  }, [user, residents]);

  const trashRecord   = useCallback((id: string) => setRecords(r => r.map(x => x.id === id ? { ...x, trashed: true  } : x)), []);
  const restoreRecord = useCallback((id: string) => setRecords(r => r.map(x => x.id === id ? { ...x, trashed: false } : x)), []);
  const deleteRecord  = useCallback((id: string) => setRecords(r => r.filter(x => x.id !== id)), []);
  const clearTrash    = useCallback(() => setRecords(r => r.filter(x => !x.trashed)), []);

  const resetApp = useCallback(() => {
    setRecords(SEED_RECORDS);
    setResidents(SEED_RESIDENTS);
    saveToStorage("ck_records", SEED_RECORDS);
    saveToStorage("ck_residents", SEED_RESIDENTS);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch(""); setFilterDate(""); setFilterStaff("");
  }, []);

  // Derived collections
  const activeRecords  = useMemo(() => records.filter(r => !r.trashed), [records]);
  const trashedRecords = useMemo(() => records.filter(r => r.trashed),  [records]);
  const todayRecords   = useMemo(() => activeRecords.filter(r => r.date === todayStr()), [activeRecords]);

  const filteredRecords = useMemo(() => {
    const q = search.toLowerCase().trim();
    // Normalize a value to YYYY-MM-DD so browser locale differences don't break the comparison
    const normDate = (v: string) => v ? v.slice(0, 10) : "";
    return activeRecords.filter(r => {
      if (q && !r.residentName.toLowerCase().includes(q) && !r.staffName.toLowerCase().includes(q)) return false;
      if (filterDate  && normDate(r.date) !== normDate(filterDate)) return false;
      if (filterStaff && r.staffName !== filterStaff) return false;
      return true;
    });
  }, [activeRecords, search, filterDate, filterStaff]);

  const hasActiveFilters = !!(search || filterDate || filterStaff);

  const allStaffNames = useMemo(
    () => Array.from(new Set(activeRecords.map(r => r.staffName))).sort(),
    [activeRecords]
  );

  return (
    <AppContext.Provider value={{
      user, login, logout, updateProfile,
      residents, getResident,
      records, activeRecords, trashedRecords, todayRecords, filteredRecords,
      addRecord, trashRecord, restoreRecord, deleteRecord, clearTrash,
      getResidentRecords,
      search, setSearch,
      filterDate, setFilterDate,
      filterStaff, setFilterStaff,
      clearFilters, hasActiveFilters,
      resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
