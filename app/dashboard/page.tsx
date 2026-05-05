"use client";
// app/dashboard/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ClipboardList, Users, UserCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Button } from "@/components/shared";
import { FilterBar } from "@/components/records/FilterBar";
import { RecordsTable } from "@/components/records/RecordsTable";
import { Modal } from "@/components/shared/Modal";
import { ShiftRecordForm } from "@/components/records/ShiftRecordForm";
import { getGreeting, todayStr } from "@/lib/utils";

export default function DashboardPage() {
  const { user, todayRecords, activeRecords, residents } = useApp();
  const [newOpen, setNewOpen] = useState(false);

  const uniqueResidentsToday = new Set(todayRecords.map(r => r.residentId)).size;
  const activeStaff          = new Set(todayRecords.map(r => r.staffName)).size;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <AppShell>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, {user?.name} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">
              {today} · {user?.shift} shift
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12 }}>
            <Button variant="primary" size="lg" icon={<Plus className="w-4 h-4" />} onClick={() => setNewOpen(true)}>
              New Shift Record
            </Button>
          </motion.div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Records Today"
            value={todayRecords.length}
            icon={<ClipboardList className="w-5 h-5" />}
            accent="bg-blue-50 dark:bg-blue-950/50"
            iconColor="text-blue-600 dark:text-blue-400"
            sub="records created today"
            delay={0.05}
          />
          <StatCard
            label="Residents Covered"
            value={uniqueResidentsToday}
            icon={<Users className="w-5 h-5" />}
            accent="bg-green-50 dark:bg-green-950/30"
            iconColor="text-green-600 dark:text-green-400"
            sub="residents documented today"
            delay={0.1}
          />
          <StatCard
            label="Active Staff"
            value={activeStaff}
            icon={<UserCheck className="w-5 h-5" />}
            accent="bg-amber-50 dark:bg-amber-950/30"
            iconColor="text-amber-600 dark:text-amber-400"
            sub="staff logged today"
            delay={0.15}
          />
        </div>

        {/* ── Records section ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">All Shift Records</h2>
            <span className="text-xs text-muted-foreground">{activeRecords.length} total</span>
          </div>
          <FilterBar />
          <RecordsTable />
        </motion.div>
      </div>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Shift Record" description="Record care and handover notes for a resident">
        <ShiftRecordForm onClose={() => setNewOpen(false)} />
      </Modal>
    </AppShell>
  );
}
