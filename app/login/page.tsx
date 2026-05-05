"use client";
// app/login/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, ArrowRight, Loader2, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace("/dashboard"); }, [user, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "evelyn.rose@carekel.org", password: "password" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login(data.email);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-background to-sky-50 dark:from-slate-900 dark:via-background dark:to-blue-950/20">
      <div className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.12) 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-[400px] relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/25 mb-4">
            <Heart className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">Carekel</h1>
          <p className="text-muted-foreground mt-1 text-sm">Shift Handover App</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-black/25 p-8">
          <h2 className="text-[18px] font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to start or hand over your shift</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />Staff Email<span className="text-red-400">*</span>
              </label>
              <input {...register("email")} type="email" placeholder="you@carekel.org"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-500" />Password<span className="text-red-400">*</span>
              </label>
              <input {...register("password")} type="password" placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[.98] mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : <>Sign in<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground/60 mt-5 pt-5 border-t border-border flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3" />Demo: use the pre-filled details above
          </p>
        </div>
      </motion.div>
    </div>
  );
}
