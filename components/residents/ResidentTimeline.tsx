"use client";
// components/residents/ResidentTimeline.tsx
import { motion } from "framer-motion";
import { Clock, User, ArrowRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { formatTimestamp, getInitials, cn } from "@/lib/utils";
import type { ShiftLog } from "@/types";

export function ResidentTimeline({ logs }: { logs: ShiftLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p className="font-semibold text-sm">No logs yet</p>
        <p className="text-xs mt-1">Shift logs for this resident will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-5 bottom-5 w-px bg-border" />
      <div className="space-y-4">
        {logs.map((log, i) => (
          <TimelineEntry key={log.id} log={log} isLatest={i === 0} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntry({ log, isLatest, index }: { log: ShiftLog; isLatest: boolean; index: number }) {
  const shiftColor =
    log.shift === "Morning"   ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" :
    log.shift === "Afternoon" ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" :
    "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30";

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}
      className="relative pl-10">
      {/* Timeline dot */}
      <div className={cn("absolute left-[13px] top-4 w-3 h-3 rounded-full border-2 border-card",
        isLatest ? "bg-blue-500 ring-2 ring-blue-500/30" : "bg-border")}>
        {isLatest && <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-40" />}
      </div>

      <div className={cn("bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        isLatest ? "border-blue-200 dark:border-blue-800/60" : "border-border")}>

        {/* Entry header */}
        <div className={cn("flex items-center justify-between gap-2 px-4 py-3 border-b border-border",
          isLatest ? "bg-blue-50/50 dark:bg-blue-950/20" : "bg-secondary/20")}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {getInitials(log.staffName)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground">{log.staffName}</p>
              <p className="text-[10px] text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", shiftColor)}>
              {log.shift}
            </span>
            {isLatest && (
              <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Latest
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          {/* Condition update */}
          <LogBlock label="Condition Update">
            <p className="text-sm text-foreground leading-relaxed">{log.conditionUpdate}</p>
          </LogBlock>

          {/* Medication */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Medication:</span>
            {log.medicationTaken
              ? <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400"><CheckCircle2 className="w-3 h-3" />Taken</span>
              : <span className="flex items-center gap-1 text-xs text-muted-foreground"><XCircle className="w-3 h-3" />Not recorded</span>}
          </div>

          {/* Incidents */}
          {log.incidents && (
            <LogBlock label="Incidents">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{log.incidents}</p>
              </div>
            </LogBlock>
          )}

          {/* Tasks — highlighted */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />Tasks for Next Shift
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">{log.tasksForNextShift}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      {children}
    </div>
  );
}
