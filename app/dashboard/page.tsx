"use client";
// app/dashboard/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ClipboardList, Users, UserCheck, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Button } from "@/components/shared";
import { FilterBar } from "@/components/logs/FilterBar";
import { ShiftLogsTable } from "@/components/logs/ShiftLogsTable";
import { Modal } from "@/components/shared/Modal";
import { ShiftLogForm } from "@/components/logs/ShiftLogForm";
import { getGreeting, todayStr, formatRelative } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, activeLogs, todayLogs, residents, getResidentLogs } = useApp();
  const [newOpen, setNewOpen] = useState(false);
  const router = useRouter();

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const uniqueResidentsToday = new Set(todayLogs.map(l => l.residentId)).size;
  const activeStaff = new Set(todayLogs.map(l => l.staffName)).size;

  // Most recent log per resident for the "needs attention" panel
  const residentsWithLogs = residents
    .map(r => {
      const logs = getResidentLogs(r.id);
      return { resident: r, lastLog: logs[0] ?? null };
    })
    .filter(x => x.lastLog)
    .sort((a, b) => (b.lastLog?.timestamp ?? 0) - (a.lastLog?.timestamp ?? 0))
    .slice(0, 4);

  return (
    <AppShell>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{today} · {user?.shift} shift · {user?.wing}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }}>
            <Button variant="primary" size="lg" icon={<Plus className="w-4 h-4" />} onClick={() => setNewOpen(true)}>
              New Shift Log
            </Button>
          </motion.div>
        </div>

        {/* Stats — simple 3-up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Logs Today" value={todayLogs.length} icon={<ClipboardList className="w-5 h-5" />}
            accent="bg-blue-50 dark:bg-blue-950/50" iconColor="text-blue-600 dark:text-blue-400"
            sub="shift logs created today" delay={0.05} />
          <StatCard label="Residents Logged" value={uniqueResidentsToday} icon={<Users className="w-5 h-5" />}
            accent="bg-green-50 dark:bg-green-950/30" iconColor="text-green-600 dark:text-green-400"
            sub="residents covered today" delay={0.1} />
          <StatCard label="Active Staff" value={activeStaff} icon={<UserCheck className="w-5 h-5" />}
            accent="bg-amber-50 dark:bg-amber-950/30" iconColor="text-amber-600 dark:text-amber-400"
            sub="staff logged today" delay={0.15} />
        </div>

        {/* Recent resident activity — quick handover snapshot */}
        {residentsWithLogs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Recent Resident Activity</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Latest log entry per resident</p>
                </div>
                <Button variant="ghost" size="sm"
                  onClick={() => router.push("/residents")}>
                  All residents <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="divide-y divide-border">
                {residentsWithLogs.map(({ resident, lastLog }) => (
                  <div key={resident.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 cursor-pointer transition-colors"
                    onClick={() => router.push(`/residents/${resident.id}`)}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {resident.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{resident.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">{lastLog?.conditionUpdate}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-muted-foreground">{lastLog ? formatRelative(lastLog.timestamp) : ""}</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{lastLog?.staffName.split(" ")[0]}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters + Table */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">All Shift Logs</h2>
            <span className="text-xs text-muted-foreground">{activeLogs.length} total</span>
          </div>
          <FilterBar />
          <ShiftLogsTable />
        </motion.div>
      </div>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Shift Log" description="Record care and handover notes for a resident">
        <ShiftLogForm onClose={() => setNewOpen(false)} />
      </Modal>
    </AppShell>
  );
}
