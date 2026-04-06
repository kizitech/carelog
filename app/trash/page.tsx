"use client";
// app/trash/page.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, X, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { ConditionBadge, EmptyState, Button } from "@/components/shared";
import { formatDateShort, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function TrashPage() {
  const { trashedReports, restoreReport, deleteReport, clearTrash } = useApp();

  const handleRestore = (id: string, name: string) => {
    restoreReport(id);
    toast.success("Report restored", { description: name });
  };

  const handleDelete = (id: string, name: string) => {
    deleteReport(id);
    toast.error("Report permanently deleted", { description: name });
  };

  const handleClearAll = () => {
    clearTrash();
    toast.error("All trashed reports permanently deleted");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Trash2 className="w-6 h-6 text-muted-foreground" />
              Trash
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">
              {trashedReports.length} trashed report
              {trashedReports.length !== 1 ? "s" : ""}
            </p>
          </div>

          {trashedReports.length > 0 && (
            <Button
              variant="danger"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Info banner */}
        {trashedReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4"
          >
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Reports in trash can be restored or permanently deleted by an
              admin. Trashed reports are not included in analytics.
            </p>
          </motion.div>
        )}

        {/* Empty state */}
        {trashedReports.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <EmptyState
              icon={<Trash2 className="w-7 h-7" />}
              title="Trash is empty"
              description="Reports you move to trash will appear here. They can be restored or permanently deleted."
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-3"
          >
            <AnimatePresence>
              {trashedReports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(report.patientName)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">
                        {report.patientName}
                      </p>
                      <ConditionBadge condition={report.condition} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {report.staffName} · {report.department} ·{" "}
                      {formatDateShort(report.timestamp)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRestore(report.id, report.patientName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-950/70 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(report.id, report.patientName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
