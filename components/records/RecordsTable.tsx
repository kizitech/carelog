"use client";
// components/records/RecordsTable.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, MoreVertical, ClipboardList, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ConditionBadge, EmptyState, Button } from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { RecordDetail } from "./RecordDetail";
import { ShiftRecordForm } from "./ShiftRecordForm";
import { formatDateShort, getInitials, cn } from "@/lib/utils";
import type { ShiftRecord } from "@/types";
import { toast } from "sonner";

export function RecordsTable() {
  const { filteredRecords, activeRecords, trashRecord } = useApp();
  const [detailRecord, setDetailRecord] = useState<ShiftRecord | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {filteredRecords.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="w-7 h-7" />}
            title={activeRecords.length === 0 ? "No records yet" : "No records match your filters"}
            description={activeRecords.length === 0
              ? "Create your first shift record to get started."
              : "Try adjusting or clearing your filters."}
            action={activeRecords.length === 0
              ? <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setNewOpen(true)}>Create first record</Button>
              : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  {["Resident", "Room", "Condition", "Medication", "Staff", "Date", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {filteredRecords.map((record, idx) => (
                    <TableRow key={record.id} record={record} idx={idx}
                      onView={() => setDetailRecord(record)}
                      onTrash={() => { trashRecord(record.id); toast.warning("Record moved to trash", { description: record.residentName }); }} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredRecords.length}</span> of{" "}
                <span className="font-semibold text-foreground">{activeRecords.length}</span> records
              </p>
              <p className="text-xs text-muted-foreground">Carekel · Records are confidential</p>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!detailRecord} onClose={() => setDetailRecord(null)} title="Shift Record" description="Full shift record details">
        {detailRecord && <RecordDetail record={detailRecord} />}
      </Modal>
      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New Shift Record" description="Record care and handover notes for a resident">
        <ShiftRecordForm onClose={() => setNewOpen(false)} />
      </Modal>
    </>
  );
}

function TableRow({ record, idx, onView, onTrash }: {
  record: ShiftRecord; idx: number; onView: () => void; onTrash: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { residents } = useApp();
  const resident = residents.find(r => r.id === record.residentId);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const shiftColor =
    record.shift === "Morning"   ? "text-amber-600 dark:text-amber-400" :
    record.shift === "Afternoon" ? "text-blue-600 dark:text-blue-400"   :
                                   "text-indigo-600 dark:text-indigo-400";

  return (
    <motion.tr initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
      className="group hover:bg-accent/40 transition-colors cursor-pointer" onClick={onView}>
      {/* Resident */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {getInitials(record.residentName)}
          </div>
          <span className="text-sm font-bold text-foreground truncate max-w-[130px]">{record.residentName}</span>
        </div>
      </td>
      {/* Room */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-muted-foreground">{resident ? `Room ${resident.roomNumber}` : "—"}</span>
      </td>
      {/* Condition */}
      <td className="px-4 py-3.5"><ConditionBadge condition={record.conditionUpdate} /></td>
      {/* Medication */}
      <td className="px-4 py-3.5">
        <span className={cn("text-xs font-semibold", record.medicationTaken ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
          {record.medicationTaken ? "Yes" : "No"}
        </span>
      </td>
      {/* Staff */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground flex-shrink-0">
            {getInitials(record.staffName)}
          </div>
          <span className="text-sm text-foreground whitespace-nowrap truncate max-w-[120px]">{record.staffName}</span>
        </div>
      </td>
      {/* Date */}
      <td className="px-4 py-3.5">
        <div>
          <p className="text-sm font-medium text-foreground whitespace-nowrap">{formatDateShort(record.timestamp)}</p>
          <p className={cn("text-xs font-semibold mt-0.5", shiftColor)}>{record.shift}</p>
        </div>
      </td>
      {/* Actions */}
      <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
        <div ref={ref} className="relative inline-block">
          <button onClick={() => setMenu(o => !o)}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground transition-all opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.12 }}
                className="absolute right-0 top-[calc(100%+4px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[155px] z-20">
                <button onClick={() => { onView(); setMenu(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />View Record
                </button>
                <div className="h-px bg-border mx-2" />
                <button onClick={() => { onTrash(); setMenu(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
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
