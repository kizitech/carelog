"use client";
// components/logs/ShiftLogsTable.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, MoreVertical, ClipboardList, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ConditionBadge, EmptyState, Button } from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { ShiftLogDetail } from "./ShiftLogDetail";
import { ShiftLogForm } from "./ShiftLogForm";
import { formatDateShort, getInitials, cn } from "@/lib/utils";
import type { ShiftLog } from "@/types";
import { toast } from "sonner";

export function ShiftLogsTable() {
  const { filteredLogs, activeLogs, trashLog } = useApp();
  const [detailLog, setDetailLog] = useState<ShiftLog | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredLogs.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-7 h-7" />}
            title={activeLogs.length === 0 ? "No shift logs yet" : "No logs match your filters"}
            description={activeLogs.length === 0 ? "Start by creating a shift log for a resident." : "Try adjusting or clearing your filters."}
            action={activeLogs.length === 0 ? (
              <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setNewOpen(true)}>
                Create first shift log
              </Button>
            ) : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  {["Resident", "Staff", "Shift", "Condition Update", "Date", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredLogs.map((log, idx) => (
                    <TableRow key={log.id} log={log} idx={idx}
                      onView={() => setDetailLog(log)}
                      onTrash={() => { trashLog(log.id); toast.warning("Log moved to trash", { description: log.residentName }); }}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredLogs.length}</span> of{" "}
                <span className="font-semibold text-foreground">{activeLogs.length}</span> shift logs
              </p>
              <p className="text-xs text-muted-foreground">CareLog · Shift Handover System</p>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!detailLog} onClose={() => setDetailLog(null)} title="Shift Log" description="Full shift record">
        {detailLog && <ShiftLogDetail log={detailLog} />}
      </Modal>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Shift Log" description="Record care and handover notes">
        <ShiftLogForm onClose={() => setNewOpen(false)} />
      </Modal>
    </>
  );
}

function TableRow({ log, idx, onView, onTrash }: { log: ShiftLog; idx: number; onView: () => void; onTrash: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <motion.tr initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
      className="group hover:bg-accent/40 transition-colors cursor-pointer" onClick={onView}>

      {/* Resident */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {getInitials(log.residentName)}
          </div>
          <p className="text-sm font-bold text-foreground truncate max-w-[140px]">{log.residentName}</p>
        </div>
      </td>

      {/* Staff */}
      <td className="px-4 py-3.5">
        <p className="text-sm text-foreground">{log.staffName}</p>
      </td>

      {/* Shift */}
      <td className="px-4 py-3.5">
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full",
          log.shift === "Morning"   ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
          log.shift === "Afternoon" ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" :
          "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
        )}>
          {log.shift}
        </span>
      </td>

      {/* Condition snippet */}
      <td className="px-4 py-3.5 max-w-[220px]">
        <p className="text-sm text-muted-foreground truncate">{log.conditionUpdate}</p>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="text-sm text-foreground font-medium">{formatDateShort(log.timestamp)}</p>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
        <div ref={menuRef} className="relative inline-block">
          <button onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.12 }}
                className="absolute right-0 top-[calc(100%+4px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[150px] z-20">
                <button onClick={() => { onView(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />View Log
                </button>
                <div className="h-px bg-border mx-2" />
                <button onClick={() => { onTrash(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
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
