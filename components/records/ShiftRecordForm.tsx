"use client";
// components/records/ShiftRecordForm.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, Activity, Pill, AlertTriangle, ClipboardList,
  Heart, Clock, Check,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { shiftRecordSchema, type ShiftRecordFormValues } from "@/lib/schemas";
import {
  FormField, Input, Textarea, Toggle,
  SectionHeader, Button, ConditionBadge,
} from "@/components/shared";
import { CONDITIONS, SHIFTS, todayStr, getShift, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export function ShiftRecordForm({
  onClose,
  defaultResidentId,
}: {
  onClose: () => void;
  defaultResidentId?: string;
}) {
  const { addRecord, user, residents } = useApp();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShiftRecordFormValues>({
    resolver: zodResolver(shiftRecordSchema),
    shouldUnregister: false,
    defaultValues: {
      residentId: defaultResidentId ?? "",
      conditionUpdate: "Well",
      observations: "",
      careProvided: "",
      medicationTaken: false,
      incidents: "",
      tasksForNextShift: "",
      // staffName is intentionally omitted here — injected at submit time
      shift: getShift(),
      date: todayStr(),
    },
  });

  const selectedId = watch("residentId");
  const condValue = watch("conditionUpdate");
  const selectedRes = residents.find(r => r.id === selectedId);

  const onSubmit = async (data: ShiftRecordFormValues) => {
    await new Promise(r => setTimeout(r, 600));
    // Inject staffName from context at submit time rather than relying on
    // a hidden form field, which would fail validation if user loads late.
    addRecord({ ...data, staffName: user?.name ?? "Unknown" });
    toast.success("Record saved successfully", {
      description: `${selectedRes?.name ?? "Resident"} · ${data.shift} shift`,
    });
    onClose();
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

      {/* ── Resident & Shift ── */}
      <div>
        <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="Who is this record for?" />

        <div className="mb-4">
          <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            Resident<span className="text-red-400 ml-0.5">*</span>
          </label>

          <Controller
            control={control}
            name="residentId"
            render={({ field }) => (
              <select
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                className={inputCls}
              >
                <option value="">— Select a resident —</option>
                {residents.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} · Room {r.roomNumber}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.residentId && (
            <p className="text-red-500 text-xs mt-1">{errors.residentId.message}</p>
          )}

          {selectedRes && (
            <div className="mt-2 flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {getInitials(selectedRes.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">{selectedRes.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Room {selectedRes.roomNumber} · Support Worker: {selectedRes.supportWorker}
                </p>
              </div>
              <ConditionBadge condition={selectedRes.currentCondition} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Shift" icon={<Clock className="w-3.5 h-3.5" />} required error={errors.shift?.message}>
            <Controller
              control={control}
              name="shift"
              render={({ field }) => (
                <select value={field.value} onChange={e => field.onChange(e.target.value)} className={inputCls}>
                  {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            />
          </FormField>
          <FormField label="Date" icon={<Clock className="w-3.5 h-3.5" />} required error={errors.date?.message}>
            <Input type="date" {...register("date")} />
          </FormField>
        </div>
      </div>

      {/* ── Condition Update ── */}
      <div>
        <SectionHeader icon={<Activity className="w-3.5 h-3.5" />} title="Condition Update" />
        <div className="space-y-4">
          <FormField
            label="Current Condition"
            icon={<Activity className="w-3.5 h-3.5" />}
            required
            error={errors.conditionUpdate?.message}
            hint="This will update the resident's condition across the app when the record is saved."
          >
            <div className="flex items-center gap-3">
              <Controller
                control={control}
                name="conditionUpdate"
                render={({ field }) => (
                  <select value={field.value} onChange={e => field.onChange(e.target.value)} className={`${inputCls} flex-1`}>
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              />
              {condValue && <ConditionBadge condition={condValue} />}
            </div>
          </FormField>

          <FormField
            label="Observations"
            icon={<Activity className="w-3.5 h-3.5" />}
            required
            error={errors.observations?.message}
          >
            <Textarea
              {...register("observations")}
              placeholder="Describe how the resident is today — mood, appetite, physical state, any changes…"
              className="min-h-[90px]"
            />
          </FormField>

          <FormField label="Care Provided" icon={<Heart className="w-3.5 h-3.5" />} error={errors.careProvided?.message}>
            <Textarea
              {...register("careProvided")}
              placeholder="What care was provided this shift? Washing, meals, activities, personal care…"
              className="min-h-[70px]"
            />
          </FormField>
        </div>
      </div>

      {/* ── Medication ── */}
      <div>
        <SectionHeader icon={<Pill className="w-3.5 h-3.5" />} title="Medication" />
        <div className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 border border-border">
          <div className="flex items-center gap-2.5">
            <Pill className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Medication Taken?</p>
              <p className="text-xs text-muted-foreground">Did the resident take their medication this shift?</p>
            </div>
          </div>
          <Controller
            control={control}
            name="medicationTaken"
            render={({ field: f }) => <Toggle checked={!!f.value} onChange={f.onChange} />}
          />
        </div>
      </div>

      {/* ── Incidents ── */}
      <div>
        <SectionHeader icon={<AlertTriangle className="w-3.5 h-3.5" />} title="Incidents" />
        <FormField label="Incidents During Shift" error={errors.incidents?.message}>
          <Textarea
            {...register("incidents")}
            placeholder="Any falls, accidents, behavioural changes, or concerns? Leave blank if none."
            className="min-h-[70px]"
          />
        </FormField>
      </div>

      {/* ── Tasks for Next Shift ── */}
      <div>
        <SectionHeader icon={<ClipboardList className="w-3.5 h-3.5" />} title="Tasks for Next Shift" />
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 mb-3">
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
            This is the most important section. Make sure the next team knows exactly what needs doing.
          </p>
        </div>
        <FormField
          label="What should the next shift know or do?"
          icon={<ClipboardList className="w-3.5 h-3.5" />}
          required
          error={errors.tasksForNextShift?.message}
        >
          <Textarea
            {...register("tasksForNextShift")}
            placeholder="e.g. Check blood pressure at 6pm. GP visiting tomorrow. Daughter called — needs a call back…"
            className="min-h-[100px]"
          />
        </FormField>
      </div>

      {/* ── Staff (display only — value injected at submit) ── */}
      <div className="bg-secondary/40 border border-border rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {user ? getInitials(user.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">Recorded by</p>
          <p className="text-sm font-bold text-foreground">{user?.name ?? "Unknown"}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        {/* No hidden input needed — staffName is injected in onSubmit */}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} className="flex-[2]" icon={<Check className="w-4 h-4" />}>
          {isSubmitting ? "Saving…" : "Save Record"}
        </Button>
      </div>
    </form>
  );
}