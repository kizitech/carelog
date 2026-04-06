"use client";
// components/reports/ReportForm.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  TrendingUp,
  Pill,
  ClipboardList,
  Zap,
  FileText,
  Building2,
  Calendar,
  Loader2,
  Check,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { reportSchema, type ReportFormValues } from "@/lib/schemas";
import {
  FormField,
  Input,
  Textarea,
  Select,
  Toggle,
  SectionHeader,
  Button,
} from "@/components/shared";
import { CONDITIONS, DEPARTMENTS, todayStr } from "@/lib/utils";
import { toast } from "sonner";

interface ReportFormProps {
  onClose: () => void;
}

export function ReportForm({ onClose }: ReportFormProps) {
  const { addReport, user } = useApp();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      patientName: "",
      conditionOnArrival: "Stable",
      condition: "Stable",
      medication: false,
      medNotes: "",
      incidents: "",
      tasksNext: "",
      notes: "",
      staffName: user?.name || "",
      department: user?.department || "General Ward",
      date: todayStr(),
    },
  });

  const medicationValue = watch("medication");

  const onSubmit = async (data: ReportFormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    addReport(data);
    toast.success("Report submitted successfully!", {
      description: `Patient: ${data.patientName}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* ── Patient Information ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <SectionHeader
          icon={<User className="w-3.5 h-3.5" />}
          title="Patient Information"
        />
        <div className="space-y-4">
          <FormField
            label="Patient Name"
            icon={<User className="w-3.5 h-3.5" />}
            required
            error={errors.patientName?.message}
          >
            <Input
              {...register("patientName")}
              placeholder="Full name of patient"
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Condition on Arrival"
              icon={<Heart className="w-3.5 h-3.5" />}
              required
              error={errors.conditionOnArrival?.message}
            >
              <Select {...register("conditionOnArrival")}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Condition After Shift"
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              required
              error={errors.condition?.message}
            >
              <Select {...register("condition")}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormField>
          </div>
        </div>
      </motion.div>

      {/* ── Treatment Details ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SectionHeader
          icon={<Pill className="w-3.5 h-3.5" />}
          title="Treatment Details"
        />
        <div className="space-y-4">
          {/* Medication Toggle */}
          <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-4 py-3 border border-border">
            <div className="flex items-center gap-2.5">
              <Pill className="w-4 h-4 text-teal-500" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Medication Administered
                </p>
                <p className="text-xs text-muted-foreground">
                  Was medication given during this shift?
                </p>
              </div>
            </div>
            <Controller
              control={control}
              name="medication"
              render={({ field }) => (
                <Toggle
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {medicationValue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
                label="Medication Notes"
                icon={<ClipboardList className="w-3.5 h-3.5" />}
                error={errors.medNotes?.message}
              >
                <Textarea
                  {...register("medNotes")}
                  placeholder="List medications, dosages, times administered…"
                  className="min-h-[70px]"
                />
              </FormField>
            </motion.div>
          )}

          <FormField
            label="Incidents During Shift"
            icon={<Zap className="w-3.5 h-3.5" />}
            error={errors.incidents?.message}
          >
            <Textarea
              {...register("incidents")}
              placeholder="Any incidents, adverse events, or notable observations… (optional)"
              className="min-h-[70px]"
            />
          </FormField>
        </div>
      </motion.div>

      {/* ── Handover & Admin ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <SectionHeader
          icon={<ClipboardList className="w-3.5 h-3.5" />}
          title="Handover & Admin"
        />
        <div className="space-y-4">
          <FormField
            label="Tasks for Next Shift"
            icon={<ClipboardList className="w-3.5 h-3.5" />}
            required
            error={errors.tasksNext?.message}
          >
            <Textarea
              {...register("tasksNext")}
              placeholder="Outstanding tasks, priorities, follow-ups for the incoming shift…"
            />
          </FormField>

          <FormField
            label="Additional Notes"
            icon={<FileText className="w-3.5 h-3.5" />}
            error={errors.notes?.message}
          >
            <Textarea
              {...register("notes")}
              placeholder="Any extra notes for the record… (optional)"
              className="min-h-[60px]"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Staff Name"
              icon={<User className="w-3.5 h-3.5" />}
              required
              error={errors.staffName?.message}
            >
              <Input {...register("staffName")} placeholder="Your full name" />
            </FormField>

            <FormField
              label="Department"
              icon={<Building2 className="w-3.5 h-3.5" />}
              required
              error={errors.department?.message}
            >
              <Select {...register("department")}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Date"
              icon={<Calendar className="w-3.5 h-3.5" />}
              required
              error={errors.date?.message}
            >
              <Input type="date" {...register("date")} />
            </FormField>
          </div>
        </div>
      </motion.div>

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-[2]"
          icon={<Check className="w-4 h-4" />}
        >
          {isSubmitting ? "Submitting…" : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}
