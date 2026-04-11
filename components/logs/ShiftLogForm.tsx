"use client";
// components/logs/ShiftLogForm.tsx
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, ClipboardList, Pill, AlertTriangle,
  ArrowRight, FileText, Calendar, Check, Stethoscope,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { shiftLogSchema, type ShiftLogFormValues } from "@/lib/schemas";
import { FormField, Input, Textarea, Select, Toggle, SectionHeader, Button } from "@/components/shared";
import { SHIFTS, todayStr, getShift } from "@/lib/utils";
import { toast } from "sonner";

type ShiftLogFieldName = keyof ShiftLogFormValues;

export function ShiftLogForm({ onClose, defaultResidentId }: { onClose: () => void; defaultResidentId?: string }) {
  const { addLog, user, residents } = useApp();
  
  const [touched, setTouched] = useState<Partial<Record<ShiftLogFieldName, boolean>>>({});

  const {
    register, handleSubmit, control, watch, setValue, trigger, formState: { errors, isSubmitting },
  } = useForm<ShiftLogFormValues>({
    resolver: zodResolver(shiftLogSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      residentId: defaultResidentId || "",
      conditionUpdate: "",
      medicationTaken: false,
      incidents: "",
      tasksForNextShift: "",
      careProvided: "",
      staffName: user?.name || "",
      shift: getShift(),
      date: todayStr(),
    },
  });

  const watchedValues = watch();

  // Force re-validation when specific fields change
  useEffect(() => {
    if (touched.residentId) trigger("residentId");
  }, [watchedValues.residentId, trigger, touched.residentId]);
  
  useEffect(() => {
    if (touched.conditionUpdate) trigger("conditionUpdate");
  }, [watchedValues.conditionUpdate, trigger, touched.conditionUpdate]);
  
  useEffect(() => {
    if (touched.tasksForNextShift) trigger("tasksForNextShift");
  }, [watchedValues.tasksForNextShift, trigger, touched.tasksForNextShift]);

  const onSubmit = async (data: ShiftLogFormValues) => {
    console.log("Submitting data:", data);
    
    // Manual validation before submit
    if (!data.residentId) {
      toast.error("Please select a resident");
      return;
    }
    if (!data.conditionUpdate || data.conditionUpdate.trim() === "") {
      toast.error("Please provide a condition update");
      return;
    }
    if (!data.tasksForNextShift || data.tasksForNextShift.trim() === "") {
      toast.error("Please provide tasks for next shift");
      return;
    }
    
    await new Promise(r => setTimeout(r, 600));
    addLog(data);
    toast.success("Shift log created successfully!", {
      description: `${residents.find(r => r.id === data.residentId)?.name || "Resident"} · ${data.shift} shift`,
    });
    onClose();
  };

  // Handle field blur to mark as touched
  const handleFieldBlur = (fieldName: ShiftLogFieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    trigger(fieldName);
  };

  // Sort residents alphabetically
  const sortedResidents = [...residents].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* ── Resident + Shift Info ── */}
      <div>
        <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="Who is this log for?" />
        <div className="space-y-4">
          <FormField label="Resident" icon={<User className="w-3.5 h-3.5" />} required error={errors.residentId?.message}>
            <select
              {...register("residentId")}
              value={watchedValues.residentId}
              onChange={(e) => {
                setValue("residentId", e.target.value, { shouldValidate: true, shouldDirty: true });
                handleFieldBlur("residentId");
              }}
              onBlur={() => handleFieldBlur("residentId")}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select a resident —</option>
              {sortedResidents.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.room}, {r.wing}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Your Name" icon={<User className="w-3.5 h-3.5" />} required error={errors.staffName?.message}>
              <input
                type="text"
                {...register("staffName")}
                onChange={(e) => {
                  setValue("staffName", e.target.value, { shouldValidate: true });
                }}
                onBlur={() => handleFieldBlur("staffName")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </FormField>
            
            <FormField label="Shift" icon={<Calendar className="w-3.5 h-3.5" />} required error={errors.shift?.message}>
              <select
                {...register("shift")}
                value={watchedValues.shift}
                onChange={(e) => setValue("shift", e.target.value as "Morning" | "Afternoon" | "Night", { shouldValidate: true })}
                onBlur={() => handleFieldBlur("shift")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            
            <FormField label="Date" icon={<Calendar className="w-3.5 h-3.5" />} required error={errors.date?.message}>
              <input
                type="date"
                {...register("date")}
                onChange={(e) => setValue("date", e.target.value, { shouldValidate: true })}
                onBlur={() => handleFieldBlur("date")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* ── Shift Notes ── */}
      <div>
        <SectionHeader icon={<ClipboardList className="w-3.5 h-3.5" />} title="Shift Notes" />
        <div className="space-y-4">

          <FormField
            label="Condition Update" 
            icon={<Stethoscope className="w-3.5 h-3.5" />} 
            required
            error={errors.conditionUpdate?.message}
            hint="How is the resident today? Describe their mood, appetite, and general wellbeing."
          >
            <textarea
              {...register("conditionUpdate")}
              value={watchedValues.conditionUpdate}
              onChange={(e) => {
                setValue("conditionUpdate", e.target.value, { shouldValidate: true, shouldDirty: true });
                handleFieldBlur("conditionUpdate");
              }}
              onBlur={() => handleFieldBlur("conditionUpdate")}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px]"
              placeholder="e.g. Dot had a good morning. Alert and in good spirits. Ate a full breakfast…"
            />
          </FormField>

          <FormField
            label="Care Provided" 
            icon={<FileText className="w-3.5 h-3.5" />}
            hint="What did you do for the resident during this shift?"
          >
            <textarea
              {...register("careProvided")}
              onChange={(e) => setValue("careProvided", e.target.value, { shouldValidate: true })}
              onBlur={() => handleFieldBlur("careProvided")}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
              placeholder="e.g. Assisted with morning wash and dressing. Accompanied to lounge for activities…"
            />
          </FormField>

          {/* Medication toggle */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 border border-border">
            <div className="flex items-center gap-2.5">
              <Pill className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Medication Taken</p>
                <p className="text-xs text-muted-foreground">Did the resident take their medication this shift?</p>
              </div>
            </div>
            <Controller
              control={control}
              name="medicationTaken"
              render={({ field: f }) => (
                <button
                  type="button"
                  onClick={() => {
                    f.onChange(!f.value);
                    trigger("medicationTaken");
                  }}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${f.value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}
                  `}
                >
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${f.value ? "translate-x-6" : "translate-x-1"}
                  `} />
                </button>
              )}
            />
          </div>

          <FormField
            label="Incidents" 
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            hint="Any falls, accidents, or behaviour concerns? Leave blank if none."
          >
            <textarea
              {...register("incidents")}
              onChange={(e) => setValue("incidents", e.target.value, { shouldValidate: true })}
              onBlur={() => handleFieldBlur("incidents")}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
              placeholder="e.g. Resident attempted to leave at 08:15 — calmly redirected. No distress…"
            />
          </FormField>
        </div>
      </div>

      {/* ── Handover ── */}
      <div>
        <SectionHeader icon={<ArrowRight className="w-3.5 h-3.5" />} title="Handover for Next Shift" />
        <FormField
          label="Tasks for Next Shift" 
          icon={<ClipboardList className="w-3.5 h-3.5" />} 
          required
          error={errors.tasksForNextShift?.message}
          hint="What does the next member of staff need to know or do? Be specific."
        >
          <textarea
            {...register("tasksForNextShift")}
            value={watchedValues.tasksForNextShift}
            onChange={(e) => {
              setValue("tasksForNextShift", e.target.value, { shouldValidate: true, shouldDirty: true });
              handleFieldBlur("tasksForNextShift");
            }}
            onBlur={() => handleFieldBlur("tasksForNextShift")}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="e.g. Blood sugar check at 17:00. Daughter calling this afternoon — let resident know. GP visit booked tomorrow 10am…"
          />
        </FormField>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={isSubmitting} 
          icon={<Check className="w-4 h-4" />} 
          className="flex-[2]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Save Shift Log"}
        </Button>
      </div>
    </form>
  );
}