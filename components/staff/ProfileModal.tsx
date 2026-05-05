"use client";
// components/staff/ProfileModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Check, Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas";
import { FormField, Input, Select, Button, Avatar } from "@/components/shared";
import { Modal } from "@/components/shared/Modal";
import { ROLES } from "@/lib/utils";
import { toast } from "sonner";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateProfile } = useApp();

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name:  user?.name  || "",
      email: user?.email || "",
      role:  user?.role  || "Care Worker",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise(r => setTimeout(r, 500));
    updateProfile(data);
    toast.success("Profile updated");
    onClose();
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title="My Profile" description="Update your details">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
          <Avatar initials={user.avatar} size="xl" />
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{user.name}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{user.role}</p>
            <span className="inline-block mt-1 text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">
              {user.shift} Shift
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" icon={<User className="w-3.5 h-3.5" />} required error={errors.name?.message}>
            <Input {...register("name")} />
          </FormField>
          <FormField label="Email" icon={<Mail className="w-3.5 h-3.5" />} required error={errors.email?.message}>
            <Input {...register("email")} type="email" />
          </FormField>
          <FormField label="Role" icon={<Shield className="w-3.5 h-3.5" />} required error={errors.role?.message}>
            <Select {...register("role")}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </Select>
          </FormField>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => toast.info("Update request sent to manager")} className="flex-1">
              Notify Manager
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}
              icon={<Check className="w-4 h-4" />} className="flex-[2]">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
