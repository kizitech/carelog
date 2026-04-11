"use client";
// components/logs/ShiftLogDetail.tsx
import type { ShiftLog } from "@/types";
import { ConditionBadge } from "@/components/shared";
import { formatTimestamp, getInitials } from "@/lib/utils";
import {
  User, Pill, AlertTriangle, ArrowRight,
  FileText, Calendar, CheckCircle2, XCircle, ClipboardList, Stethoscope,
} from "lucide-react";

export function ShiftLogDetail({ log }: { log: ShiftLog }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm flex-shrink-0">
          {getInitials(log.residentName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-foreground">{log.residentName}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
              {log.shift} Shift
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />{formatTimestamp(log.timestamp)}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Logged by</p>
          <p className="text-sm font-bold text-foreground">{log.staffName}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-border">
        <DetailRow icon={<Stethoscope className="w-3.5 h-3.5" />} label="Condition Update">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{log.conditionUpdate}</p>
        </DetailRow>

        {log.careProvided && (
          <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label="Care Provided">
            <p className="text-sm text-foreground leading-relaxed">{log.careProvided}</p>
          </DetailRow>
        )}

        <DetailRow icon={<Pill className="w-3.5 h-3.5" />} label="Medication">
          <div className="flex items-center gap-2">
            {log.medicationTaken
              ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600 dark:text-green-400">Taken</span></>
              : <><XCircle   className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Not recorded as taken</span></>}
          </div>
        </DetailRow>

        {log.incidents ? (
          <DetailRow icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Incidents">
            <p className="text-sm text-foreground leading-relaxed bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2">
              {log.incidents}
            </p>
          </DetailRow>
        ) : (
          <DetailRow icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Incidents">
            <p className="text-sm text-muted-foreground italic">No incidents reported</p>
          </DetailRow>
        )}

        {/* Tasks — highlighted as most important */}
        <div className="py-3.5">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">
                Tasks for Next Shift
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl px-4 py-3">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                  {log.tasksForNextShift}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-3">
      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}
