"use client";
// components/patients/PatientTimeline.tsx
import { motion } from "framer-motion";
import { Clock, User, TrendingUp, Heart, Pill, Zap, BookOpen, FileText, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { ConditionBadge } from "@/components/shared";
import { formatTimestamp, getInitials, CONDITION_COLORS, cn } from "@/lib/utils";
import type { Report, PatientLog } from "@/types";

interface TimelineEntry {
  report: Report;
  log: PatientLog;
}

export function PatientTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No history yet</p>
        <p className="text-sm mt-1">Shift reports for this patient will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />

      <div className="space-y-4">
        {entries.map(({ report, log }, i) => (
          <TimelineCard key={`${report.id}-${i}`} report={report} log={log} index={i} isLatest={i === 0} />
        ))}
      </div>
    </div>
  );
}

function TimelineCard({ report, log, index, isLatest }: { report: Report; log: PatientLog; index: number; isLatest: boolean }) {
  const condBefore = CONDITION_COLORS[log.conditionBefore];
  const condAfter = CONDITION_COLORS[log.conditionAfter];
  const improved = log.conditionAfter === "Stable" || (log.conditionBefore === "Critical" && log.conditionAfter === "Serious") || (log.conditionBefore === "Serious" && log.conditionAfter === "Improving");
  const worsened = log.conditionAfter === "Critical" || (log.conditionBefore === "Stable" && log.conditionAfter !== "Stable");

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07, duration: 0.35 }}
      className="relative pl-12">
      {/* Timeline dot */}
      <div className={cn("absolute left-[15px] top-4 w-3 h-3 rounded-full border-2 border-card shadow-sm",
        isLatest ? "bg-blue-500 ring-2 ring-blue-500/30" : "bg-border")}>
        {isLatest && <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />}
      </div>

      <div className={cn("bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        isLatest && "border-blue-200 dark:border-blue-800/60")}>
        {/* Entry Header */}
        <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2",
          isLatest ? "bg-blue-50/60 dark:bg-blue-950/20" : "bg-secondary/30")}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold">
              {getInitials(report.staffName)}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{report.staffName}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                {formatTimestamp(report.timestamp)}
                <span className="text-muted-foreground/40">·</span>
                <span className={cn("font-semibold", isLatest ? "text-blue-600 dark:text-blue-400" : "")}>{report.shift} shift</span>
              </div>
            </div>
          </div>
          {isLatest && (
            <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Latest</span>
          )}
        </div>

        {/* Condition change */}
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border bg-secondary/10">
          <ConditionBadge condition={log.conditionBefore} />
          <ArrowRight className={cn("w-4 h-4 flex-shrink-0", improved ? "text-green-500" : worsened ? "text-red-500" : "text-muted-foreground")} />
          <ConditionBadge condition={log.conditionAfter} />
          {improved && <span className="text-xs text-green-600 dark:text-green-400 font-semibold ml-1">Improved</span>}
          {worsened && <span className="text-xs text-red-600 dark:text-red-400 font-semibold ml-1">Deteriorated</span>}
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3">
          <LogItem icon={<Zap className="w-3 h-3" />} label="Observations" value={log.observations} />
          {log.treatment && <LogItem icon={<Heart className="w-3 h-3" />} label="Treatment" value={log.treatment} />}

          {/* Medication */}
          <div className="flex gap-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">
              <Pill className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Medication</p>
              <div className="flex items-center gap-1.5">
                {log.medication
                  ? <><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Administered</span></>
                  : <><XCircle className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Not given</span></>}
              </div>
              {log.medication && log.medNotes && (
                <p className="text-xs text-muted-foreground mt-1 bg-secondary/50 rounded-lg px-2 py-1.5">{log.medNotes}</p>
              )}
            </div>
          </div>

          {log.injuries && <LogItem icon={<Zap className="w-3 h-3" />} label="Injuries / Wounds" value={log.injuries} />}
          {log.educationGiven && <LogItem icon={<BookOpen className="w-3 h-3" />} label="Education Given" value={log.educationGiven} />}
          {log.notes && <LogItem icon={<FileText className="w-3 h-3" />} label="Notes" value={log.notes} />}
        </div>
      </div>
    </motion.div>
  );
}

function LogItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2.5">
      <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-foreground leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
