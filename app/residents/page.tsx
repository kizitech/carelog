"use client";
// app/residents/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Search, ChevronRight, Clock, X, DoorOpen } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge } from "@/components/shared";
import { formatRelative, getInitials, CONDITIONS } from "@/lib/utils";
import type { Condition } from "@/types";

export default function ResidentsPage() {
  const { residents, getResidentRecords } = useApp();
  const router = useRouter();
  const [search, setSearch]         = useState("");
  const [filterCond, setFilterCond] = useState<Condition | "">("");

  const filtered = residents.filter(r => {
    const q = search.toLowerCase();
    if (q && !r.name.toLowerCase().includes(q) && !r.roomNumber.includes(q)) return false;
    if (filterCond && r.currentCondition !== filterCond) return false;
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Users className="w-6 h-6 text-blue-500" />Residents
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{residents.length} residents · click to view their history</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[180px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or room number…"
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <select value={filterCond} onChange={e => setFilterCond(e.target.value as Condition | "")}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all cursor-pointer min-w-[145px]">
            <option value="">All Conditions</option>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(search || filterCond) && (
            <button onClick={() => { setSearch(""); setFilterCond(""); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1.5">
              <X className="w-3 h-3" />Clear
            </button>
          )}
        </motion.div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/25" />
            <p className="font-bold text-foreground">No residents found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((resident, i) => {
              const records  = getResidentRecords(resident.id);
              const lastRec  = records[0];
              const isCritical = resident.currentCondition === "Critical";
              const isUnwell   = resident.currentCondition === "Unwell";

              return (
                <motion.div key={resident.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => router.push(`/residents/${resident.id}`)}
                  className={`bg-card border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md cursor-pointer transition-all group ${isCritical ? "border-red-200 dark:border-red-800/60" : isUnwell ? "border-amber-200 dark:border-amber-800/60" : "border-border hover:border-blue-200 dark:hover:border-blue-800/60"}`}>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(resident.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <p className="text-sm font-bold text-foreground">{resident.name}</p>
                      <ConditionBadge condition={resident.currentCondition} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DoorOpen className="w-3 h-3" />Room {resident.roomNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">Support: {resident.supportWorker}</span>
                      {lastRec && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />Last record: {formatRelative(lastRec.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center flex-shrink-0 hidden sm:block">
                    <p className="text-lg font-extrabold text-foreground">{records.length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">record{records.length !== 1 ? "s" : ""}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
