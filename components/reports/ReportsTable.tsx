"use client";
// components/reports/ReportsTable.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, MoreVertical, ClipboardList, Plus, ArrowUpDown, Users } from "lucide-react";
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
    toast.warning("Report moved to trash", { description: `${report.staffName} · ${report.date}` });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredReports.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-7 h-7" />}
            title={activeReports.length === 0 ? "No reports yet" : "No reports match your filters"}
            description={activeReports.length === 0 ? "Submit your first shift report to get started." : "Try adjusting or clearing your search filters."}
            action={activeReports.length === 0 ? (
              <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setNewOpen(true)}>
                Create first report
              </Button>
            ) : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  {["Staff / Shift", "Department", "Patients", "Conditions", "Date", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                      {h && <span className="flex items-center gap-1">{h}{i > 0 && i < 5 && <ArrowUpDown className="w-2.5 h-2.5 opacity-40" />}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredReports.map((report, idx) => (
                    <TableRow key={report.id} report={report} idx={idx} onView={() => setDetailReport(report)} onTrash={() => handleTrash(report)} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredReports.length}</span> of{" "}
                <span className="font-semibold text-foreground">{activeReports.length}</span> shift reports
              </p>
              <p className="text-xs text-muted-foreground">CareLog · Clinical records are confidential</p>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!detailReport} onClose={() => setDetailReport(null)} title="Shift Report" description="Full shift documentation" wide>
        {detailReport && <ReportDetail report={detailReport} />}
      </Modal>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Shift Report" description="Document patients seen this shift" extraWide>
        <ReportForm onClose={() => setNewOpen(false)} />
      </Modal>
    </>
  );
}

function TableRow({ report, idx, onView, onTrash }: { report: Report; idx: number; onView: () => void; onTrash: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const uniqueConditions = Array.from(new Set(report.patients.map(p => p.conditionAfter)));
  const hasCritical = report.patients.some(p => p.conditionAfter === "Critical");

  return (
    <motion.tr initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04, duration: 0.25 }}
      className={cn("group hover:bg-accent/40 transition-colors cursor-pointer", hasCritical && "bg-red-50/30 dark:bg-red-950/10")}
      onClick={onView}>
      {/* Staff / Shift */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {getInitials(report.staffName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate max-w-[160px]">{report.staffName}</p>
            <p className="text-xs text-muted-foreground">{report.shift} shift</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-muted-foreground whitespace-nowrap">{report.department}</span>
      </td>

      {/* Patients */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{report.patients.length}</span>
          <div className="flex -space-x-1.5 ml-1">
            {report.patients.slice(0, 3).map((p, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-card flex items-center justify-center text-[9px] font-bold text-blue-700 dark:text-blue-300">
                {p.patientName.charAt(0)}
              </div>
            ))}
            {report.patients.length > 3 && (
              <div className="w-5 h-5 rounded-full bg-secondary border border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                +{report.patients.length - 3}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Conditions */}
      <td className="px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {uniqueConditions.slice(0, 2).map(c => <ConditionBadge key={c} condition={c} />)}
          {uniqueConditions.length > 2 && (
            <span className="text-xs text-muted-foreground self-center">+{uniqueConditions.length - 2}</span>
          )}
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5">
        <div>
          <p className="text-sm text-foreground font-medium whitespace-nowrap">{formatDateShort(report.timestamp)}</p>
          <p className="text-xs text-muted-foreground">{new Date(report.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
        <div ref={menuRef} className="relative inline-block">
          <button onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground transition-all opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.12 }}
                className="absolute right-0 top-[calc(100%+4px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[155px] z-20">
                <button onClick={() => { onView(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />View Report
                </button>
                <div className="h-px bg-border mx-2" />
                <button onClick={() => { onTrash(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
                  <Trash2 className="w-3.5 h-3.5" />Move to Trash
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}
