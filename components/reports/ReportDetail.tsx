"use client";
// components/reports/ReportDetail.tsx
import type { Report } from "@/types";
import { ConditionBadge } from "@/components/shared";
import { formatTimestamp, getInitials } from "@/lib/utils";
import {
  User,
  Heart,
  TrendingUp,
  Pill,
  AlertTriangle,
  ClipboardList,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ReportDetailProps {
  report: Report;
}

export function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div>
      {/* Patient header */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/20 rounded-xl border border-teal-100 dark:border-teal-900/50">
        <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-base flex-shrink-0">
          {getInitials(report.patientName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {report.patientName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <ConditionBadge condition={report.condition} />
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">
              {report.department}
            </span>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      <div className="divide-y divide-border">
        <DetailRow
          icon={<Heart className="w-3.5 h-3.5" />}
          label="Condition on Arrival"
        >
          <ConditionBadge condition={report.conditionOnArrival} />
        </DetailRow>

        <DetailRow
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Condition After Shift"
        >
          <ConditionBadge condition={report.condition} />
        </DetailRow>

        <DetailRow
          icon={<Pill className="w-3.5 h-3.5" />}
          label="Medication Administered"
        >
          <div>
            <div className="flex items-center gap-1.5">
              {report.medication ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                    Yes — medication was given
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    No medication administered
                  </span>
                </>
              )}
            </div>
            {report.medication && report.medNotes && (
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed bg-secondary/50 rounded-lg p-2.5">
                {report.medNotes}
              </p>
            )}
          </div>
        </DetailRow>

        <DetailRow
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          label="Incidents During Shift"
        >
          <p className="text-sm text-foreground leading-relaxed">
            {report.incidents || (
              <span className="text-muted-foreground italic">
                No incidents reported
              </span>
            )}
          </p>
        </DetailRow>

        <DetailRow
          icon={<ClipboardList className="w-3.5 h-3.5" />}
          label="Tasks for Next Shift"
        >
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {report.tasksNext}
          </p>
        </DetailRow>

        {report.notes && (
          <DetailRow
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Additional Notes"
          >
            <p className="text-sm text-foreground leading-relaxed">
              {report.notes}
            </p>
          </DetailRow>
        )}

        <DetailRow
          icon={<User className="w-3.5 h-3.5" />}
          label="Reported By"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-[10px] font-bold">
              {getInitials(report.staffName)}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {report.staffName}
            </span>
            <span className="text-xs text-muted-foreground">
              · {report.department}
            </span>
          </div>
        </DetailRow>

        <DetailRow
          icon={<Building2 className="w-3.5 h-3.5" />}
          label="Department"
        >
          <span className="text-sm text-foreground">{report.department}</span>
        </DetailRow>

        <DetailRow
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Submitted At"
        >
          <span className="text-sm text-foreground font-medium">
            {formatTimestamp(report.timestamp)}
          </span>
        </DetailRow>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3.5">
      <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}
