"use client";
// components/reports/ProfileModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Building2, Send, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas";
import {
  FormField,
  Input,
  Select,
  Button,
  Avatar,
} from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { ROLES, DEPARTMENTS } from "@/lib/utils";
import { toast } from "sonner";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user, updateProfile } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Nurse",
      department: user?.department || "General Ward",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    updateProfile(data);
    toast.success("Profile updated successfully!");
    onClose();
  };

  const handleSendUpdate = () => {
    toast.info("Update request sent to admin", {
      description: "An admin will review your profile changes.",
    });
  };

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Staff Profile"
      description="View and edit your profile information"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/20 rounded-xl border border-teal-100 dark:border-teal-900/50">
          <Avatar initials={user.avatar} size="xl" />
          <div>
            <h3 className="text-xl font-extrabold text-foreground">
              {user.name}
            </h3>
            <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm mt-0.5">
              {user.role}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">
                {user.shift} Shift
              </span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">
                {user.department}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Full Name"
            icon={<User className="w-3.5 h-3.5" />}
            required
            error={errors.name?.message}
          >
            <Input {...register("name")} placeholder="Your full name" />
          </FormField>

          <FormField
            label="Email Address"
            icon={<Mail className="w-3.5 h-3.5" />}
            required
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="you@hospital.org"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Role"
              icon={<Shield className="w-3.5 h-3.5" />}
              required
              error={errors.role?.message}
            >
              <Select {...register("role")}>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={handleSendUpdate}
              className="flex-1"
            >
              Notify Admin
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!isDirty}
              icon={<Check className="w-4 h-4" />}
              className="flex-[2]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
