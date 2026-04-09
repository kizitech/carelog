"use client";
// app/login/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace("/dashboard"); }, [user, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "ada.obi@hospital.org", password: "password" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    login(data.email);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-card">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full max-w-[420px] relative">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-300 tracking-tight">CareLog</h1>
          <p className="text-muted-foreground mt-1.5 text-[15px]">Hospital Shift Reporting System</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-black/30 p-8">
          <h2 className="text-[20px] font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to access your shift dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />Staff Email / ID<span className="text-red-500">*</span>
              </label>
              <input {...register("email")} type="email" placeholder="you@hospital.org"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-500" />Password<span className="text-red-500">*</span>
              </label>
              <input {...register("password")} type="password" placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl py-3 text-[15px] transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[.98]">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : <>Sign in<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 justify-center">
              <Shield className="w-3.5 h-3.5" />
              Demo: any valid email + any password
            </div>
          </div>
        </motion.div>
        <p className="text-center text-xs text-muted-foreground/40 mt-6">CareLog v2.0 · Secure Clinical Reporting</p>
      </motion.div>
    </div>
  );
}
