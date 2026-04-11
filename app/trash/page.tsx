"use client";
// app/trash/page.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, X, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, Button } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDateShort, getInitials, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function TrashPage() {
  const { trashedLogs, restoreLog, deleteLog, clearTrash } = useApp();
  const [clearOpen, setClearOpen] = useState(false);

  const handleRestore = (id: string, name: string) => {
    restoreLog(id);
    toast.success("Log restored", { description: name });
  };

  const handleDelete = (id: string, name: string) => {
    deleteLog(id);
    toast.error("Log permanently deleted", { description: name });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Trash2 className="w-6 h-6 text-muted-foreground" />Trash
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px]">
              {trashedLogs.length} trashed log{trashedLogs.length !== 1 ? "s" : ""}
            </p>
          </div>
          {trashedLogs.length > 0 && (
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => setClearOpen(true)}>
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Info banner */}
        {trashedLogs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Trashed logs are hidden from the dashboard and resident histories. Restore them to make them visible again, or delete them permanently.
            </p>
          </motion.div>
        )}

        {/* Empty state */}
        {trashedLogs.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <EmptyState icon={<Trash2 className="w-7 h-7" />} title="Trash is empty"
              description="Shift logs you move to trash will appear here. You can restore or permanently delete them." />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {trashedLogs.map((log, idx) => (
                <motion.div key={log.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm font-bold flex-shrink-0">
                    {getInitials(log.residentName)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-foreground">{log.residentName}</p>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        log.shift === "Morning"   ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
                        log.shift === "Afternoon" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" :
                                                    "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400")}>
                        {log.shift}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      By {log.staffName} · {formatDateShort(log.timestamp)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5 opacity-70">
                      {log.conditionUpdate}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleRestore(log.id, log.residentName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-950/70 transition-colors">
                      <RotateCcw className="w-3.5 h-3.5" />Restore
                    </button>
                    <button onClick={() => handleDelete(log.id, log.residentName)}
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

      <ConfirmDialog open={clearOpen} onClose={() => setClearOpen(false)}
        onConfirm={() => { clearTrash(); toast.error("All trashed logs permanently deleted"); }}
        title="Clear All Trash" confirmLabel="Clear All" danger
        description={`This will permanently delete all ${trashedLogs.length} trashed log${trashedLogs.length !== 1 ? "s" : ""}. This cannot be undone.`} />
    </AppShell>
  );
}
