// app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "ada.obi@hospital.org", password: "password" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    login(data.email);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 via-background to-blue-50 dark:from-teal-950/20 dark:via-background dark:to-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,184,166,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(20,184,166,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 shadow-lg shadow-teal-500/30 mb-4">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-teal-800 dark:text-teal-300 tracking-tight">
            CareLog
          </h1>
          <p className="text-muted-foreground mt-1.5 text-[15px]">
            Shift Reporting System
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-black/30 p-8"
        >
          <h2 className="text-[20px] font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to your staff account to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-500" />
                Staff Email / ID
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@hospital.org"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-500" />
                Password
                <span className="text-red-500">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-xl py-3 text-[15px] transition-all shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/30 active:scale-[.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-center text-[13px] text-muted-foreground/70">
              Demo: any valid email + any password
            </p>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          CareLog v1.0 · Secure Clinical Reporting
        </p>
      </motion.div>
    </div>
  );
}
