"use client";
// components/reports/ReportsTable.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Trash2,
  MoreVertical,
  ClipboardList,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ConditionBadge, EmptyState, Button } from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { ReportDetail } from "./ReportDetail";
import { ReportForm } from "./ReportForm";
import { formatDateShort, getInitials, cn } from "@/lib/utils";
import type { Report } from "@/types";
import { toast } from "sonner";

export function ReportsTable() {
  const { filteredReports, activeReports, trashReport } = useApp();
  const [detailReport, setDetailReport] = useState<Report | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const handleTrash = (report: Report) => {
    trashReport(report.id);
    toast.warning("Report moved to trash", {
      description: report.patientName,
      action: { label: "Undo", onClick: () => {} },
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredReports.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-7 h-7" />}
            title={
              activeReports.length === 0
                ? "No reports yet"
                : "No reports match your filters"
            }
            description={
              activeReports.length === 0
                ? "Submit your first shift report to get started."
                : "Try adjusting or clearing your search filters."
            }
            action={
              activeReports.length === 0 ? (
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setNewOpen(true)}
                >
                  Create first report
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  {[
                    "Patient",
                    "Condition",
                    "Medication",
                    "Department",
                    "Staff",
                    "Date",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap"
                    >
                      {h && (
                        <span className="flex items-center gap-1">
                          {h}
                          {i < 6 && i > 0 && (
                            <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />
                          )}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredReports.map((report, idx) => (
                    <TableRow
                      key={report.id}
                      report={report}
                      idx={idx}
                      onView={() => setDetailReport(report)}
                      onTrash={() => handleTrash(report)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredReports.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {activeReports.length}
                </span>{" "}
                reports
              </p>
              <p className="text-xs text-muted-foreground">
                CareLog · Clinical records are confidential
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!detailReport}
        onClose={() => setDetailReport(null)}
        title="Report Details"
        description="Full shift report record"
      >
        {detailReport && <ReportDetail report={detailReport} />}
      </Modal>

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
    </>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────
function TableRow({
  report,
  idx,
  onView,
  onTrash,
}: {
  report: Report;
  idx: number;
  onView: () => void;
  onTrash: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.25 }}
      className="group hover:bg-accent/40 transition-colors cursor-pointer"
      onClick={onView}
    >
      {/* Patient */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {getInitials(report.patientName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight truncate max-w-[150px]">
              {report.patientName}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {report.notes?.slice(0, 35) || "—"}
            </p>
          </div>
        </div>
      </td>

      {/* Condition */}
      <td className="px-4 py-3.5">
        <ConditionBadge condition={report.condition} />
      </td>

      {/* Medication */}
      <td className="px-4 py-3.5">
        <span
          className={cn(
            "text-xs font-semibold",
            report.medication
              ? "text-teal-600 dark:text-teal-400"
              : "text-muted-foreground"
          )}
        >
          {report.medication ? "Yes" : "No"}
        </span>
      </td>

      {/* Department */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {report.department}
        </span>
      </td>

      {/* Staff */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
            {getInitials(report.staffName)}
          </div>
          <span className="text-sm text-foreground whitespace-nowrap">
            {report.staffName}
          </span>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5">
        <div>
          <p className="text-sm text-foreground font-medium whitespace-nowrap">
            {formatDateShort(report.timestamp)}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(report.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </td>

      {/* Actions */}
      <td
        className="px-4 py-3.5 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={menuRef} className="relative inline-block">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-[calc(100%+4px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[155px] z-20"
              >
                <button
                  onClick={() => { onView(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left"
                >
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  View Report
                </button>
                <div className="h-px bg-border mx-2" />
                <button
                  onClick={() => { onTrash(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Move to Trash
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}
