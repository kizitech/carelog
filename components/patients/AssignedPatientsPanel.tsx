"use client";
// components/patients/AssignedPatientsPanel.tsx
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Clock, AlertTriangle, ChevronRight, UserCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ConditionBadge } from "@/components/shared";
import { formatRelative, cn } from "@/lib/utils";

export function AssignedPatientsPanel() {
  const { assignedPatients, getPatientReports } = useApp();
  const router = useRouter();

  if (assignedPatients.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Assigned to You This Shift</h2>
            <p className="text-xs text-muted-foreground">{assignedPatients.length} patient{assignedPatients.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-full font-semibold">
          {assignedPatients.length} Active
        </span>
      </div>

      <div className="divide-y divide-border">
        {assignedPatients.map((patient, i) => {
          const history = getPatientReports(patient.id);
          const lastEntry = history[0];
          const isCritical = patient.currentCondition === "Critical" || patient.currentCondition === "Serious";

          return (
            <motion.div key={patient.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className={cn("flex items-center gap-3 px-5 py-3.5 hover:bg-accent/40 cursor-pointer transition-colors group", isCritical && "bg-red-50/40 dark:bg-red-950/10")}
              onClick={() => router.push(`/patients/${patient.id}`)}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                  {patient.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                {isCritical && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-card animate-pulse" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-foreground">{patient.name}</p>
                  {isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">{patient.department}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">{patient.ward}</span>
                  {lastEntry && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatRelative(lastEntry.report.timestamp)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <ConditionBadge condition={patient.currentCondition} />
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
