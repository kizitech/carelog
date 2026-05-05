"use client";
// components/records/RecordDetail.tsx
import type { ShiftRecord } from "@/types";
import { ConditionBadge } from "@/components/shared";
import { formatTimestamp, getInitials } from "@/lib/utils";
import {
  Activity, Pill, AlertTriangle, ClipboardList, Heart,
  Clock, CheckCircle2, XCircle, User, ArrowRight,
} from "lucide-react";

export function RecordDetail({ record }: { record: ShiftRecord }) {
  const shiftColor =
    record.shift === "Morning"   ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
    record.shift === "Afternoon" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" :
                                   "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4 p-4 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {getInitials(record.residentName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-foreground text-lg">{record.residentName}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <ConditionBadge condition={record.conditionUpdate} />
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${shiftColor}`}>{record.shift} Shift</span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-border">
        <Row icon={<Activity className="w-3.5 h-3.5" />} label="Condition Update">
          <ConditionBadge condition={record.conditionUpdate} />
        </Row>
        <Row icon={<Activity className="w-3.5 h-3.5" />} label="Observations">
          <p className="text-sm text-foreground leading-relaxed">{record.observations}</p>
        </Row>
        {record.careProvided && (
          <Row icon={<Heart className="w-3.5 h-3.5" />} label="Care Provided">
            <p className="text-sm text-foreground leading-relaxed">{record.careProvided}</p>
          </Row>
        )}
        <Row icon={<Pill className="w-3.5 h-3.5" />} label="Medication">
          <div className="flex items-center gap-1.5">
            {record.medicationTaken
              ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-sm font-semibold text-green-600 dark:text-green-400">Taken</span></>
              : <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Not recorded</span></>}
          </div>
        </Row>
        {record.incidents && (
          <Row icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Incidents">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{record.incidents}</p>
            </div>
          </Row>
        )}
        {/* Tasks — highlighted */}
        <Row icon={<ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />} label="Tasks for Next Shift" accent>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl px-3.5 py-2.5">
            <p className="text-sm text-foreground leading-relaxed font-medium">{record.tasksForNextShift}</p>
          </div>
        </Row>
        <Row icon={<User className="w-3.5 h-3.5" />} label="Recorded By">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[9px] font-bold">
              {getInitials(record.staffName)}
            </div>
            <span className="text-sm font-semibold text-foreground">{record.staffName}</span>
          </div>
        </Row>
        <Row icon={<Clock className="w-3.5 h-3.5" />} label="Date &amp; Time">
          <span className="text-sm font-medium text-foreground">{formatTimestamp(record.timestamp)}</span>
        </Row>
      </div>
    </div>
  );
}

function Row({ icon, label, children, accent }: {
  icon: React.ReactNode; label: string; children: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className="flex gap-3 py-3.5">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${accent ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}
