"use client";
// app/dashboard/page.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  Calendar,
  AlertTriangle,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard, Button } from "@/components/shared";
import { FilterBar } from "@/components/reports/FilterBar";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { AnalyticsCharts } from "@/components/charts/AnalyticsCharts";
import { Modal } from "@/components/shared/Modal";
import { ReportForm } from "@/components/reports/ReportForm";
import { getGreeting, todayStr } from "@/lib/utils";

export default function DashboardPage() {
  const { user, activeReports, todayReports } = useApp();
  const [newOpen, setNewOpen] = useState(false);

  const criticalCount = activeReports.filter(
    (r) => r.condition === "Critical"
  ).length;
  const staffCount = new Set(activeReports.map((r) => r.staffName)).size;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, {user?.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{today}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setNewOpen(true)}
              className="animate-pulse-glow"
            >
              New Report
            </Button>
          </motion.div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Reports"
            value={activeReports.length}
            icon={<FileText className="w-5 h-5" />}
            accent="bg-teal-50 dark:bg-teal-950/50"
            iconColor="text-teal-600 dark:text-teal-400"
            sub="All time"
            delay={0.05}
          />
          <StatCard
            label="Reports Today"
            value={todayReports.length}
            icon={<Calendar className="w-5 h-5" />}
            accent="bg-blue-50 dark:bg-blue-950/30"
            iconColor="text-blue-600 dark:text-blue-400"
            sub={todayStr()}
            delay={0.1}
          />
          <StatCard
            label="Critical Patients"
            value={criticalCount}
            icon={<AlertTriangle className="w-5 h-5" />}
            accent="bg-red-50 dark:bg-red-950/30"
            iconColor="text-red-600 dark:text-red-400"
            sub={criticalCount > 0 ? "Needs attention" : "All clear"}
            delay={0.15}
          />
          <StatCard
            label="Active Staff"
            value={staffCount}
            icon={<Users className="w-5 h-5" />}
            accent="bg-amber-50 dark:bg-amber-950/30"
            iconColor="text-amber-600 dark:text-amber-400"
            sub="Reporting staff"
            delay={0.2}
          />
        </div>

        {/* ── Analytics Charts ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <AnalyticsCharts />
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FilterBar />
        </motion.div>

        {/* ── Reports Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <ReportsTable />
        </motion.div>
      </div>

      {/* New Report Modal */}
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New Shift Report"
        description="Submit a new patient shift report"
        wide
      >
        <ReportForm onClose={() => setNewOpen(false)} />
      </Modal>
    </AppShell>
  );
}
