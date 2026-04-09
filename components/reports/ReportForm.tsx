"use client";
// components/reports/ReportForm.tsx
import { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, User, Heart, TrendingUp, Pill, Zap, BookOpen,
  FileText, Building2, Calendar, Check, ChevronDown, Stethoscope,
  UserPlus, History, ArrowLeft, Clock, ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { reportSchema, type ReportFormValues } from "@/lib/schemas";
import {
  FormField, Input, Textarea, Select, Toggle, SectionHeader, Button,
  ConditionBadge,
} from "@/components/shared";
import { CONDITIONS, DEPARTMENTS, SHIFTS, todayStr, getShift, cn, formatTimestamp, getInitials, CONDITION_COLORS } from "@/lib/utils";
import { toast } from "sonner";
import type { Patient, Report, PatientLog } from "@/types";

export function ReportForm({ onClose }: { onClose: () => void }) {
  const { addReport, user, assignedPatients, patients, getPatientReports } = useApp();
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);
  const [historyPatientId, setHistoryPatientId] = useState<string | null>(null);

  const {
    register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      department: user?.department ?? "General Ward",
      shift: getShift(),
      date: todayStr(),
      notes: "",
      patients: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "patients",
    keyName: "rhfId",
  });

  const [pickerValue, setPickerValue] = useState("");

  const handlePickerChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setPickerValue("");
    if (!patientId) return;
    if (fields.some(f => f.patientId === patientId)) {
      toast.error("Patient already added to this report");
      return;
    }
    append({
      patientId,
      conditionBefore: "Stable",
      conditionAfter: "Stable",
      observations: "",
      treatment: "",
      medication: false,
      medNotes: "",
      injuries: "",
      educationGiven: "",
      notes: "",
    });
    setExpandedIdx(fields.length);
  }, [fields, append]);

  const handleRemove = useCallback((idx: number) => {
    remove(idx);
    setExpandedIdx(prev => {
      if (prev === idx) return -1;
      if (prev > idx) return prev - 1;
      return prev;
    });
  }, [remove]);

  const onSubmit = async (data: ReportFormValues) => {
    console.log("Submitting data:", data);

    if (data.patients.length === 0) {
      toast.error("Please add at least one patient");
      return;
    }

    // Validate each patient has observations
    for (let i = 0; i < data.patients.length; i++) {
      if (!data.patients[i].observations || data.patients[i].observations.trim() === "") {
        toast.error(`Patient ${i + 1}: Observations are required`);
        setExpandedIdx(i);
        return;
      }
    }

    await new Promise(r => setTimeout(r, 700));
    addReport(data);
    toast.success("Shift report submitted");
    onClose();
  };

  const onError = (errors: any) => {
    console.error("Validation errors:", errors);
    toast.error("Please fill in all required fields");

    if (errors.patients) {
      for (let i = 0; i < errors.patients.length; i++) {
        if (errors.patients[i]) {
          setExpandedIdx(i);
          break;
        }
      }
    }
  };

  const usedIds = new Set(fields.map(f => f.patientId));
  const pool = assignedPatients.length > 0 ? assignedPatients : patients;
  const available = pool.filter(p => !usedIds.has(p.id));

  const historyPatient = historyPatientId ? patients.find(p => p.id === historyPatientId) : null;
  const historyEntries = historyPatientId ? getPatientReports(historyPatientId) : [];

  // Watch values for debugging
  const watchDepartment = watch("department");
  const watchShift = watch("shift");
  const watchDate = watch("date");

  console.log("Current values:", { watchDepartment, watchShift, watchDate });

  return (
    <div className="relative">
      {historyPatientId && historyPatient && (
        <div className="absolute inset-0 z-10 bg-card rounded-xl flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
            <button
              type="button"
              onClick={() => setHistoryPatientId(null)}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to form
            </button>
            <span className="text-muted-foreground/40 text-sm">|</span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {getInitials(historyPatient.name)}
              </div>
              <span className="text-sm font-bold text-foreground truncate">{historyPatient.name}</span>
              <ConditionBadge condition={historyPatient.currentCondition} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {historyEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-semibold text-sm">No history yet</p>
              </div>
            ) : (
              historyEntries.map(({ report, log }, i) => (
                <HistoryCard key={`${report.id}-${i}`} report={report} log={log} isLatest={i === 0} />
              ))
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6" noValidate>
        {/* Shift Information */}
        <div>
          <SectionHeader icon={<Calendar className="w-3.5 h-3.5" />} title="Shift Information" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Department" icon={<Building2 className="w-3.5 h-3.5" />} required error={errors.department?.message}>
              <select
                {...register("department")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Shift" icon={<Stethoscope className="w-3.5 h-3.5" />} required error={errors.shift?.message}>
              <select
                {...register("shift")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SHIFTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Date" icon={<Calendar className="w-3.5 h-3.5" />} required error={errors.date?.message}>
              <input
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </div>

          <div className="mt-4">
            <FormField label="General Shift Notes" icon={<FileText className="w-3.5 h-3.5" />}>
              <textarea
                {...register("notes")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                placeholder="Overall shift summary, handover notes…"
              />
            </FormField>
          </div>
        </div>

        {/* Patient Reports */}
        <div>
          <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="Patient Reports" />

          <div className="mb-4">
            <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <UserPlus className="w-3.5 h-3.5 text-blue-500" />
              Add a Patient
            </label>
            <select
              value={pickerValue}
              onChange={handlePickerChange}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">
                {available.length === 0 ? "— All assigned patients have been added —" : "— Select a patient to add —"}
              </option>
              {available.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.department} · {p.ward}
                </option>
              ))}
            </select>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground text-sm">
              <User className="w-8 h-8 mx-auto mb-2 opacity-25" />
              <p className="font-medium">No patients added yet</p>
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <PatientEntry
                key={field.rhfId}
                idx={idx}
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                isExpanded={expandedIdx === idx}
                onToggle={() => setExpandedIdx(prev => prev === idx ? -1 : idx)}
                onRemove={() => handleRemove(idx)}
                patients={patients}
                onViewHistory={() => setHistoryPatientId(field.patientId)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting} className="flex-[2]" icon={<Check className="w-4 h-4" />}>
            {isSubmitting ? "Submitting…" : `Submit Report (${fields.length} patient${fields.length !== 1 ? "s" : ""})`}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PatientEntry({
  idx, control, register, watch, errors,
  isExpanded, onToggle, onRemove, patients, onViewHistory,
}: {
  idx: number; control: any; register: any; watch: any; errors: any;
  isExpanded: boolean; onToggle: () => void; onRemove: () => void;
  patients: Patient[]; onViewHistory: () => void;
}) {
  const patientId = watch(`patients.${idx}.patientId`);
  const pt = patients.find(p => p.id === patientId);
  const initials = pt?.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2) ?? "??";
  const conditionAfter = watch(`patients.${idx}.conditionAfter`) || "Stable";
  const medEnabled = watch(`patients.${idx}.medication`) || false;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 cursor-pointer select-none" onClick={onToggle}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{pt?.name ?? "Unknown"}</p>
          <p className="text-xs text-muted-foreground truncate">{pt?.department} · {pt?.ward}</p>
        </div>
        <ConditionBadge condition={conditionAfter} />
        <button type="button" onClick={e => { e.stopPropagation(); onViewHistory(); }} className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-muted-foreground hover:text-blue-500">
          <History className="w-3.5 h-3.5" />
        </button>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
        <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className={cn("border-t border-border transition-all duration-300", !isExpanded && "hidden")}>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Condition on Arrival"
              required
              error={errors.patients?.[idx]?.conditionBefore?.message}
            >
              <select
                {...register(`patients.${idx}.conditionBefore`)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField
              label="Condition After Shift"
              required
              error={errors.patients?.[idx]?.conditionAfter?.message}
            >
              <select
                {...register(`patients.${idx}.conditionAfter`)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField
            label="Observations"
            required
            error={errors.patients?.[idx]?.observations?.message}
          >
            <textarea
              {...register(`patients.${idx}.observations`)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
              placeholder="Clinical observations, vitals, patient status…"
            />
          </FormField>

          <FormField label="Treatment Given">
            <textarea
              {...register(`patients.${idx}.treatment`)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
              placeholder="Procedures, interventions performed…"
            />
          </FormField>

          <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3 border border-border">
            <div className="flex items-center gap-2.5">
              <Pill className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-semibold">Medication Administered</p>
                <p className="text-xs text-muted-foreground">Was medication given this shift?</p>
              </div>
            </div>
            <Controller
              control={control}
              name={`patients.${idx}.medication`}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    field.value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", field.value ? "translate-x-6" : "translate-x-1")} />
                </button>
              )}
            />
          </div>

          <div className={cn("transition-all duration-200", medEnabled ? "opacity-100" : "hidden")}>
            <FormField label="Medication Notes">
              <textarea
                {...register(`patients.${idx}.medNotes`)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                placeholder="Medications, dosages, times administered…"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Injuries / Wounds">
              <textarea
                {...register(`patients.${idx}.injuries`)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                placeholder="Any injuries or wound status…"
              />
            </FormField>
            <FormField label="Education Given">
              <textarea
                {...register(`patients.${idx}.educationGiven`)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                placeholder="Patient/family education provided…"
              />
            </FormField>
          </div>

          <FormField label="Additional Notes">
            <textarea
              {...register(`patients.${idx}.notes`)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[55px]"
              placeholder="Any extra notes for this patient…"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}

function HistoryCard({ report, log, isLatest }: { report: Report; log: PatientLog; isLatest: boolean }) {
  const improved = log.conditionAfter === "Stable" ||
    (log.conditionBefore === "Critical" && log.conditionAfter === "Serious") ||
    (log.conditionBefore === "Serious" && log.conditionAfter === "Improving");
  const worsened = log.conditionAfter === "Critical" ||
    (log.conditionBefore === "Stable" && log.conditionAfter !== "Stable") ||
    (log.conditionBefore === "Improving" && log.conditionAfter === "Serious");

  return (
    <div className={cn("border rounded-xl overflow-hidden", isLatest ? "border-blue-300 dark:border-blue-700" : "border-border")}>
      <div className={cn("flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border", isLatest ? "bg-blue-50/70 dark:bg-blue-950/30" : "bg-secondary/30")}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {getInitials(report.staffName)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{report.staffName}</p>
            <p className="text-[10px] text-muted-foreground">{report.shift} shift · {formatTimestamp(report.timestamp)}</p>
          </div>
        </div>
        {isLatest && <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">Latest</span>}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/10">
        <ConditionBadge condition={log.conditionBefore} />
        <ArrowRight className={cn("w-3.5 h-3.5", improved ? "text-green-500" : worsened ? "text-red-500" : "text-muted-foreground")} />
        <ConditionBadge condition={log.conditionAfter} />
        {improved && <span className="text-[10px] text-green-600 font-semibold">Improved</span>}
        {worsened && <span className="text-[10px] text-red-600 font-semibold">Deteriorated</span>}
      </div>
      <div className="px-3 py-2.5 space-y-2">
        {log.observations && <HistoryRow label="Observations" value={log.observations} />}
        {log.treatment && <HistoryRow label="Treatment" value={log.treatment} />}
        {log.medication && <HistoryRow label="Medication" value={log.medNotes || "Administered (no notes)"} />}
        {log.injuries && <HistoryRow label="Injuries" value={log.injuries} />}
        {log.educationGiven && <HistoryRow label="Education" value={log.educationGiven} />}
        {log.notes && <HistoryRow label="Notes" value={log.notes} />}
      </div>
    </div>
  );
}

function HistoryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs text-foreground leading-relaxed">{value}</p>
    </div>
  );
}