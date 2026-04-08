"use client";
// components/reports/ReportDetail.tsx
import type { Report, PatientLog } from "@/types";
import { ConditionBadge } from "@/components/shared";
import { formatTimestamp, getInitials } from "@/lib/utils";
import { User, Heart, TrendingUp, Pill, AlertTriangle, BookOpen, FileText, Building2, Calendar, Clock, CheckCircle2, XCircle, Stethoscope } from "lucide-react";

export function ReportDetail({ report }: { report: Report }) {
  return (
    <div className="space-y-5">
      {/* Shift Header */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm">
          {getInitials(report.staffName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-foreground">{report.staffName}</h3>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">{report.shift} Shift</span>
            <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">{report.department}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{formatTimestamp(report.timestamp)}</span>
          </div>
          {report.notes && <p className="text-sm text-muted-foreground mt-2 italic">"{report.notes}"</p>}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-extrabold text-foreground">{report.patients.length}</div>
          <div className="text-xs text-muted-foreground">patient{report.patients.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Per-patient logs */}
      <div className="space-y-4">
        {report.patients.map((log, i) => (
          <PatientLogCard key={i} log={log} index={i} />
        ))}
      </div>
    </div>
  );
}

function PatientLogCard({ log, index }: { log: PatientLog; index: number }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 border-b border-border">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
          {getInitials(log.patientName)}
        </div>
        <div className="flex-1">
          <span className="text-sm font-bold text-foreground">{log.patientName}</span>
          <span className="text-xs text-muted-foreground ml-2">Patient {index + 1}</span>
        </div>
        <ConditionBadge condition={log.conditionAfter} />
      </div>
      <div className="divide-y divide-border">
        <DetailRow icon={<Heart className="w-3.5 h-3.5" />} label="On Arrival"><ConditionBadge condition={log.conditionBefore} /></DetailRow>
        <DetailRow icon={<TrendingUp className="w-3.5 h-3.5" />} label="After Shift"><ConditionBadge condition={log.conditionAfter} /></DetailRow>
        <DetailRow icon={<Stethoscope className="w-3.5 h-3.5" />} label="Observations">
          <p className="text-sm text-foreground">{log.observations || <span className="text-muted-foreground italic">None</span>}</p>
        </DetailRow>
        {log.treatment && (
          <DetailRow icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Treatment">
            <p className="text-sm text-foreground">{log.treatment}</p>
          </DetailRow>
        )}
        <DetailRow icon={<Pill className="w-3.5 h-3.5" />} label="Medication">
          <div>
            <div className="flex items-center gap-1.5">
              {log.medication ? <><CheckCircle2 className="w-4 h-4 text-blue-500" /><span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Administered</span></>
                : <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Not given</span></>}
            </div>
            {log.medication && log.medNotes && <p className="text-xs text-muted-foreground mt-1 bg-secondary/50 rounded-lg p-2">{log.medNotes}</p>}
          </div>
        </DetailRow>
        {log.injuries && <DetailRow icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Injuries/Wounds"><p className="text-sm text-foreground">{log.injuries}</p></DetailRow>}
        {log.educationGiven && <DetailRow icon={<BookOpen className="w-3.5 h-3.5" />} label="Education Given"><p className="text-sm text-foreground">{log.educationGiven}</p></DetailRow>}
        {log.notes && <DetailRow icon={<FileText className="w-3.5 h-3.5" />} label="Notes"><p className="text-sm text-foreground">{log.notes}</p></DetailRow>}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-4 py-2.5">
      <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
}
