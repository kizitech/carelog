"use client";
// app/patients/[id]/page.tsx
import { useRouter } from "next/navigation";
import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User, Building2, Calendar, Clock, FileText, AlertTriangle, Activity } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge, Button } from "@/components/shared";
import { PatientTimeline } from "@/components/patients/PatientTimeline";
import { formatTimestamp, getInitials } from "@/lib/utils";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatient, getPatientReports } = useApp();
  const router = useRouter();

  const patient = getPatient(id);
  const history = getPatientReports(id);

  if (!patient) {
    return (
      <AppShell>
        <div className="text-center py-24">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold text-foreground mb-2">Patient not found</h2>
          <p className="text-muted-foreground mb-6">This patient record does not exist or has been removed.</p>
          <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push("/patients")}>
            Back to Patients
          </Button>
        </div>
      </AppShell>
    );
  }

  const isCritical = patient.currentCondition === "Critical" || patient.currentCondition === "Serious";
  const admittedDays = Math.floor((Date.now() - new Date(patient.admittedDate).getTime()) / 86400000);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
          <button onClick={() => router.push("/patients")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" />Back to Patients
          </button>
        </motion.div>

        {/* Patient Profile Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={`bg-card border rounded-2xl shadow-sm overflow-hidden ${isCritical ? "border-red-200 dark:border-red-800/60" : "border-border"}`}>
            {/* Header strip */}
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-lg font-extrabold">
                    {getInitials(patient.name)}
                  </div>
                  {isCritical && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-card animate-pulse" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="text-xl font-extrabold text-foreground tracking-tight">{patient.name}</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">DOB: {new Date(patient.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <ConditionBadge condition={patient.currentCondition} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <InfoChip icon={<Building2 className="w-3 h-3" />} label={patient.department} />
                    <InfoChip icon={<Activity className="w-3 h-3" />} label={patient.ward} />
                    <InfoChip icon={<Calendar className="w-3 h-3" />} label={`Admitted ${admittedDays}d ago`} />
                  </div>
                </div>
              </div>

              {patient.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Clinical Notes</p>
                  <p className="text-sm text-foreground">{patient.notes}</p>
                </div>
              )}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-secondary/30">
              <StatItem label="Shift Reports" value={history.length} />
              <StatItem label="Days Admitted" value={admittedDays} />
              <StatItem label="Last Updated" value={history.length > 0 ? formatTimestamp(history[0].report.timestamp).split("·")[0].trim() : "—"} small />
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Medical History</h2>
              <p className="text-xs text-muted-foreground">Chronological shift log · {history.length} entr{history.length !== 1 ? "ies" : "y"}</p>
            </div>
          </div>
          <PatientTimeline entries={history} />
        </motion.div>
      </div>
    </AppShell>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-secondary/60 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground font-medium">
      <span className="text-blue-500 flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function StatItem({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className={`font-extrabold text-foreground ${small ? "text-sm" : "text-xl"}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
