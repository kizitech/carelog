"use client";
// components/reports/ReportForm.tsx
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, User, Heart, TrendingUp, Pill, Zap, BookOpen, FileText, Building2, Calendar, Check, ChevronDown, Stethoscope } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { reportSchema, type ReportFormValues } from "@/lib/schemas";
import { FormField, Input, Textarea, Select, Toggle, SectionHeader, Button } from "@/components/shared";
import { ConditionBadge } from "@/components/shared";
import { CONDITIONS, DEPARTMENTS, SHIFTS, todayStr, getShift, cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReportForm({ onClose }: { onClose: () => void }) {
  const { addReport, user, assignedPatients, patients } = useApp();
  const [expandedIdx, setExpandedIdx] = useState<number>(0);

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      department: user?.department || "General Ward",
      shift: getShift(),
      date: todayStr(),
      notes: "",
      patients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "patients" });

  const addPatient = (patientId: string) => {
    if (fields.some(f => f.patientId === patientId)) {
      toast.error("Patient already added to this report");
      return;
    }
    append({ patientId, conditionBefore: "Stable", conditionAfter: "Stable", observations: "", treatment: "", medication: false, medNotes: "", injuries: "", educationGiven: "", notes: "" });
    setExpandedIdx(fields.length);
  };

  const onSubmit = async (data: ReportFormValues) => {
    await new Promise(r => setTimeout(r, 700));
    addReport(data);
    toast.success(`Shift report submitted`, { description: `${data.patients.length} patient${data.patients.length !== 1 ? "s" : ""} documented` });
    onClose();
  };

  // Available patients not yet added
  const usedIds = new Set(fields.map(f => f.patientId));
  const available = (assignedPatients.length > 0 ? assignedPatients : patients).filter(p => !usedIds.has(p.id));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Shift Meta */}
      <div>
        <SectionHeader icon={<Calendar className="w-3.5 h-3.5" />} title="Shift Information" />
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Department" icon={<Building2 className="w-3.5 h-3.5" />} required>
            <Select {...register("department")}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </Select>
          </FormField>
          <FormField label="Shift" icon={<Stethoscope className="w-3.5 h-3.5" />} required>
            <Select {...register("shift")}>
              {SHIFTS.map(s => <option key={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField label="Date" icon={<Calendar className="w-3.5 h-3.5" />} required>
            <Input type="date" {...register("date")} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="General Shift Notes" icon={<FileText className="w-3.5 h-3.5" />}>
            <Textarea {...register("notes")} placeholder="Overall shift summary, handover notes…" className="min-h-[60px]" />
          </FormField>
        </div>
      </div>

      {/* Patient list */}
      <div>
        <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="Patient Reports" />

        {/* Add patient */}
        <div className="flex items-center gap-3 mb-4">
          <Select onChange={e => { if (e.target.value) { addPatient(e.target.value); e.target.value = ""; } }}
            className="flex-1" defaultValue="">
            <option value="" disabled>— Select a patient to add —</option>
            {available.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.department} · {p.ward})</option>
            ))}
          </Select>
          {available.length === 0 && (
            <span className="text-xs text-muted-foreground">All assigned patients added</span>
          )}
        </div>

        {errors.patients && typeof errors.patients === "object" && "message" in errors.patients && (
          <p className="text-red-500 text-xs mb-3">{(errors.patients as { message?: string }).message}</p>
        )}

        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl text-muted-foreground text-sm">
            <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
            Select a patient above to start documenting
          </div>
        )}

        <AnimatePresence>
          {fields.map((field, idx) => {
            const pt = patients.find(p => p.id === field.patientId);
            const isExpanded = expandedIdx === idx;
            const medVal = watch(`patients.${idx}.medication`);
            return (
              <motion.div key={field.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="mb-3 border border-border rounded-xl overflow-hidden">
                {/* Patient header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary/40 cursor-pointer" onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {pt?.name.split(" ").map(w => w[0]).join("").slice(0, 2) || "??"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{pt?.name || field.patientId}</p>
                    <p className="text-xs text-muted-foreground">{pt?.department} · {pt?.ward}</p>
                  </div>
                  <ConditionBadge condition={watch(`patients.${idx}.conditionAfter`) || "Stable"} />
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                  <button type="button" onClick={e => { e.stopPropagation(); remove(idx); if (expandedIdx === idx) setExpandedIdx(-1); }}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="p-4 space-y-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Condition on Arrival" icon={<Heart className="w-3.5 h-3.5" />} required error={errors.patients?.[idx]?.conditionBefore?.message}>
                            <Select {...register(`patients.${idx}.conditionBefore`)}>
                              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                            </Select>
                          </FormField>
                          <FormField label="Condition After Shift" icon={<TrendingUp className="w-3.5 h-3.5" />} required error={errors.patients?.[idx]?.conditionAfter?.message}>
                            <Select {...register(`patients.${idx}.conditionAfter`)}>
                              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                            </Select>
                          </FormField>
                        </div>
                        <FormField label="Observations" icon={<Stethoscope className="w-3.5 h-3.5" />} required error={errors.patients?.[idx]?.observations?.message}>
                          <Textarea {...register(`patients.${idx}.observations`)} placeholder="Clinical observations, vitals, patient status…" className="min-h-[70px]" />
                        </FormField>
                        <FormField label="Treatment Given" icon={<Zap className="w-3.5 h-3.5" />}>
                          <Textarea {...register(`patients.${idx}.treatment`)} placeholder="Procedures, interventions performed…" className="min-h-[60px]" />
                        </FormField>
                        <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3 border border-border">
                          <div className="flex items-center gap-2.5">
                            <Pill className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-semibold">Medication Administered</p>
                              <p className="text-xs text-muted-foreground">Was medication given this shift?</p>
                            </div>
                          </div>
                          <Controller control={control} name={`patients.${idx}.medication`}
                            render={({ field }) => <Toggle checked={field.value} onChange={field.onChange} />} />
                        </div>
                        {medVal && (
                          <FormField label="Medication Notes" icon={<Pill className="w-3.5 h-3.5" />}>
                            <Textarea {...register(`patients.${idx}.medNotes`)} placeholder="Medications, dosages, times…" className="min-h-[60px]" />
                          </FormField>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Injuries / Wounds" icon={<Zap className="w-3.5 h-3.5" />}>
                            <Textarea {...register(`patients.${idx}.injuries`)} placeholder="Any injuries or wound status…" className="min-h-[60px]" />
                          </FormField>
                          <FormField label="Education Given" icon={<BookOpen className="w-3.5 h-3.5" />}>
                            <Textarea {...register(`patients.${idx}.educationGiven`)} placeholder="Patient/family education provided…" className="min-h-[60px]" />
                          </FormField>
                        </div>
                        <FormField label="Additional Notes" icon={<FileText className="w-3.5 h-3.5" />}>
                          <Textarea {...register(`patients.${idx}.notes`)} placeholder="Any extra notes for this patient…" className="min-h-[55px]" />
                        </FormField>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" loading={isSubmitting} className="flex-[2]" icon={<Check className="w-4 h-4" />}>
          {isSubmitting ? "Submitting…" : `Submit Report${fields.length > 0 ? ` (${fields.length} patient${fields.length !== 1 ? "s" : ""})` : ""}`}
        </Button>
      </div>
    </form>
  );
}
