"use client";
// app/patients/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Users, ChevronRight, AlertTriangle, Clock, Building2, Filter, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge, Select } from "@/components/shared";
import { formatRelative, DEPARTMENTS, CONDITIONS, getInitials, cn } from "@/lib/utils";

export default function PatientsPage() {
  const { patients, getPatientReports } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterCond, setFilterCond] = useState("");

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.department.toLowerCase().includes(q) && !p.ward.toLowerCase().includes(q)) return false;
    if (filterDept && p.department !== filterDept) return false;
    if (filterCond && p.currentCondition !== filterCond) return false;
    return true;
  });

  const hasFilters = !!(search || filterDept || filterCond);
  const clearAll = () => { setSearch(""); setFilterDept(""); setFilterCond(""); };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />Patients
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{patients.length} patients in the system</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-3 py-1.5 rounded-full font-semibold text-xs">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              {patients.filter(p => p.currentCondition === "Critical").length} Critical
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 px-3 py-1.5 rounded-full font-semibold text-xs">
              {patients.filter(p => p.currentCondition === "Serious").length} Serious
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients by name, ward…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <Select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="min-w-[155px] flex-shrink-0">
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </Select>
          <Select value={filterCond} onChange={e => setFilterCond(e.target.value)} className="min-w-[140px] flex-shrink-0">
            <option value="">All Conditions</option>
            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
          </Select>
          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-secondary hover:bg-accent border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-all flex-shrink-0">
              <X className="w-3.5 h-3.5" />Clear
            </button>
          )}
        </motion.div>

        {/* Patient Grid */}
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-bold text-foreground">No patients found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((patient, i) => {
              const history = getPatientReports(patient.id);
              const lastEntry = history[0];
              const isCritical = patient.currentCondition === "Critical" || patient.currentCondition === "Serious";
              return (
                <motion.div key={patient.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => router.push(`/patients/${patient.id}`)}
                  className={cn("bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-blue-200 dark:hover:border-blue-800/60 group",
                    isCritical && "border-red-200 dark:border-red-800/60 bg-red-50/20 dark:bg-red-950/10")}>
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(patient.name)}
                      </div>
                      {isCritical && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card animate-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-foreground truncate">{patient.name}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <ConditionBadge condition={patient.currentCondition} />
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{patient.department} · {patient.ward}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      {lastEntry ? <>Last report: {formatRelative(lastEntry.report.timestamp)}</> : "No reports yet"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{history.length}</span> shift report{history.length !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {patient.notes && (
                    <p className="mt-3 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-2.5 py-1.5 line-clamp-2">{patient.notes}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
