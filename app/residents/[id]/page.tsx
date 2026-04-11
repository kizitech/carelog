"use client";
// app/residents/[id]/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Heart, Clock, ClipboardList,
  AlertTriangle, Pill, CheckCircle2, XCircle, ArrowRight,
  Plus, User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge, Button } from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { ShiftLogForm } from "@/components/logs/ShiftLogForm";
import { formatTimestamp, formatRelative, getInitials, cn } from "@/lib/utils";
import type { ShiftLog } from "@/types";

export default function ResidentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { getResident, getResidentLogs } = useApp();
  const router = useRouter();
  const [newLogOpen, setNewLogOpen] = useState(false);

  const resident = getResident(id);
  const logs = getResidentLogs(id);

  if (!resident) {
    return (
      <AppShell>
        <div className="text-center py-24 max-w-sm mx-auto">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/25" />
          <h2 className="text-xl font-bold text-foreground mb-2">Resident not found</h2>
          <p className="text-muted-foreground mb-6 text-sm">This resident record does not exist.</p>
          <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push("/residents")}>
            Back to Residents
          </Button>
        </div>
      </AppShell>
    );
  }

  const admittedDays = Math.floor((Date.now() - new Date(resident.admittedDate).getTime()) / 86_400_000);
  const isAlert = resident.currentCondition === "Unwell" || resident.currentCondition === "Declined";

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back */}
        <motion.button initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/residents")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4" />Back to Residents
        </motion.button>

        {/* Resident card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <div className={cn("bg-card border rounded-2xl shadow-sm overflow-hidden",
            isAlert ? "border-red-200 dark:border-red-800/50" : "border-border")}>
            {/* Colour bar */}
            <div className={cn("h-1.5", isAlert ? "bg-gradient-to-r from-red-400 to-orange-400" : "bg-gradient-to-r from-blue-500 to-indigo-500")} />

            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-lg font-extrabold">
                    {getInitials(resident.name)}
                  </div>
                  {isAlert && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-card animate-pulse" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="text-xl font-extrabold text-foreground tracking-tight">{resident.name}</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        DOB: {new Date(resident.dob).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <ConditionBadge condition={resident.currentCondition} />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <InfoPill icon={<MapPin className="w-3 h-3" />} label={`${resident.room} · ${resident.wing}`} />
                    <InfoPill icon={<User className="w-3 h-3" />} label={`Key worker: ${resident.keyWorker}`} />
                    <InfoPill icon={<Clock className="w-3 h-3" />} label={`${admittedDays} days in care`} />
                  </div>
                </div>
              </div>

              {/* Care notes */}
              {resident.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Care Notes</p>
                  <p className="text-sm text-foreground leading-relaxed">{resident.notes}</p>
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-secondary/30">
              <StripStat label="Shift Logs" value={logs.length} />
              <StripStat label="Days in Care" value={admittedDays} />
              <StripStat label="Last Log" value={logs.length > 0 ? formatRelative(logs[0].timestamp) : "—"} small />
            </div>
          </div>
        </motion.div>

        {/* Timeline header + add button */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Shift History</h2>
              <p className="text-xs text-muted-foreground">{logs.length} log{logs.length !== 1 ? "s" : ""} · most recent first</p>
            </div>
          </div>
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setNewLogOpen(true)}>
            Add Log
          </Button>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
          {logs.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted-foreground/25" />
              <p className="font-bold text-foreground">No logs yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-5">Shift logs for {resident.name} will appear here.</p>
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setNewLogOpen(true)}>
                Add first log
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-5 bottom-5 w-px bg-border" />
              <div className="space-y-4">
                {logs.map((log, i) => (
                  <LogCard key={log.id} log={log} isLatest={i === 0} index={i} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* New log modal — pre-selects this resident */}
      <Modal open={newLogOpen} onClose={() => setNewLogOpen(false)} title="New Shift Log"
        description={`Record care and handover notes for ${resident.name}`}>
        <ShiftLogForm onClose={() => setNewLogOpen(false)} defaultResidentId={id} />
      </Modal>
    </AppShell>
  );
}

// ── Timeline card ─────────────────────────────────────────────────────────────
function LogCard({ log, isLatest, index }: { log: ShiftLog; isLatest: boolean; index: number }) {
  const shiftColor =
    log.shift === "Morning"   ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
    log.shift === "Afternoon" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" :
                                "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400";

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}
      className="relative pl-11">
      {/* Timeline dot */}
      <div className={cn("absolute left-[13px] top-4 w-4 h-4 rounded-full border-2 border-card flex-shrink-0",
        isLatest ? "bg-blue-500 shadow-md shadow-blue-400/40" : "bg-border")}>
        {isLatest && <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25" />}
      </div>

      <div className={cn("bg-card border rounded-2xl overflow-hidden shadow-sm",
        isLatest ? "border-blue-200 dark:border-blue-800/60" : "border-border")}>

        {/* Card header */}
        <div className={cn("flex items-center justify-between gap-2 px-4 py-3 border-b border-border flex-wrap",
          isLatest ? "bg-blue-50/50 dark:bg-blue-950/20" : "bg-secondary/20")}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
              {getInitials(log.staffName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">{log.staffName}</p>
              <p className="text-[10px] text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", shiftColor)}>{log.shift}</span>
            {isLatest && (
              <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Latest
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          {/* Condition */}
          <LogRow label="Condition Update">
            <p className="text-sm text-foreground leading-relaxed">{log.conditionUpdate}</p>
          </LogRow>

          {/* Care provided */}
          {log.careProvided && (
            <LogRow label="Care Provided">
              <p className="text-sm text-foreground leading-relaxed">{log.careProvided}</p>
            </LogRow>
          )}

          {/* Medication */}
          <LogRow label="Medication">
            <div className="flex items-center gap-1.5">
              {log.medicationTaken
                ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs font-semibold text-green-600 dark:text-green-400">Taken</span></>
                : <><XCircle className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Not recorded</span></>}
            </div>
          </LogRow>

          {/* Incidents */}
          {log.incidents && (
            <LogRow label="Incidents">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{log.incidents}</p>
              </div>
            </LogRow>
          )}

          {/* Tasks — highlighted */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Tasks for Next Shift</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl px-3.5 py-2.5">
              <p className="text-sm text-foreground leading-relaxed font-medium">{log.tasksForNextShift}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      {children}
    </div>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-secondary/70 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground font-medium">
      <span className="text-blue-500 flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function StripStat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className={cn("font-extrabold text-foreground", small ? "text-sm" : "text-xl")}>{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}
