"use client";
// app/trash/page.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, X, Info, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge, EmptyState, Button } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDateShort, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function TrashPage() {
  const { trashedReports, restoreReport, deleteReport, clearTrash } = useApp();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleRestore = (id: string, name: string) => { restoreReport(id); toast.success("Report restored", { description: name }); };
  const handleDelete = (id: string, staffName: string) => { deleteReport(id); toast.error("Report permanently deleted", { description: staffName }); };

  return (
    <AppShell>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Trash2 className="w-6 h-6 text-muted-foreground" />Trash
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">{trashedReports.length} trashed report{trashedReports.length !== 1 ? "s" : ""}</p>
          </div>
          {trashedReports.length > 0 && (
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => setClearConfirmOpen(true)}>
              Clear All
            </Button>
          )}
        </motion.div>

        {trashedReports.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Reports in trash can be restored or permanently deleted. Trashed reports are excluded from analytics and patient histories.
            </p>
          </motion.div>
        )}

        {trashedReports.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <EmptyState icon={<Trash2 className="w-7 h-7" />} title="Trash is empty"
              description="Reports you move to trash will appear here. They can be restored or permanently deleted." />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {trashedReports.map((report, idx) => (
                <motion.div key={report.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }} transition={{ delay: idx * 0.04 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(report.staffName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{report.staffName}</p>
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{report.shift} shift</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{report.patients.length} patient{report.patients.length !== 1 ? "s" : ""}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{report.department}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{formatDateShort(report.timestamp)}</span>
                    </div>
                    {report.patients.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {Array.from(new Set(report.patients.map(p => p.conditionAfter))).slice(0, 3).map(c => (
                          <ConditionBadge key={c} condition={c} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleRestore(report.id, report.staffName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-950/70 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />Restore
                    </button>
                    <button onClick={() => handleDelete(report.id, report.staffName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors">
                      <X className="w-3.5 h-3.5" />Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmDialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}
        onConfirm={() => { clearTrash(); toast.error("All trashed reports permanently deleted"); }}
        title="Clear All Trash" confirmLabel="Clear All" danger
        description={`This will permanently delete all ${trashedReports.length} trashed report${trashedReports.length !== 1 ? "s" : ""}. This cannot be undone.`} />
    </AppShell>
  );
}
