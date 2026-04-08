"use client";
// components/layout/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Sun, Moon, Monitor, ChevronDown, User, LogOut, Settings, Trash2, LayoutDashboard, Users, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ProfileModal } from "@/components/reports/ProfileModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/trash", label: "Trash", icon: Trash2 },
];

export function Navbar() {
  const { user, logout, resetApp } = useApp();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/login"); };
  const handleReset = () => {
    resetApp();
    toast.success("Application reset to demo data");
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-blue-700 dark:text-blue-400 tracking-tight leading-none">CareLog</p>
              <p className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase leading-none mt-0.5">Shift Reporting</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Theme */}
          <div className="relative">
            <button onClick={() => { setThemeMenuOpen(o => !o); setUserMenuOpen(false); }}
              className="w-9 h-9 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground transition-all">
              <ThemeIcon className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {themeMenuOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+6px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px] z-50"
                  onMouseLeave={() => setThemeMenuOpen(false)}>
                  {[{ value: "light", label: "Light", Icon: Sun }, { value: "dark", label: "Dark", Icon: Moon }, { value: "system", label: "System", Icon: Monitor }].map(({ value, label, Icon }) => (
                    <button key={value} onClick={() => { setTheme(value); setThemeMenuOpen(false); }}
                      className={cn("w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors text-left",
                        theme === value ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold" : "text-foreground hover:bg-accent")}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button onClick={() => { setUserMenuOpen(o => !o); setThemeMenuOpen(false); }}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-secondary hover:bg-accent border border-border transition-all">
                <Avatar initials={user.avatar} size="sm" />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-[13px] font-semibold text-foreground leading-tight">{user.name.split(" ")[0]}</span>
                  <span className="text-[11px] text-muted-foreground leading-tight">{user.role}</span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+6px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[190px] z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}>
                    <div className="px-3.5 py-2.5 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <MenuBtn icon={<User className="w-3.5 h-3.5" />} onClick={() => { setProfileOpen(true); setUserMenuOpen(false); }}>View Profile</MenuBtn>
                      <MenuBtn icon={<Settings className="w-3.5 h-3.5" />} onClick={() => { setProfileOpen(true); setUserMenuOpen(false); }}>Settings</MenuBtn>
                    </div>
                    <div className="border-t border-border py-1">
                      <MenuBtn icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { setResetOpen(true); setUserMenuOpen(false); }}>Reset Demo Data</MenuBtn>
                      <MenuBtn icon={<LogOut className="w-3.5 h-3.5" />} onClick={handleLogout} danger>Sign Out</MenuBtn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={handleReset}
        title="Reset Application" confirmLabel="Yes, Reset" danger
        description="This will clear all current reports and patient data, and restore the original demo data. This action cannot be undone." />
    </>
  );
}

function MenuBtn({ icon, children, onClick, danger }: { icon: React.ReactNode; children: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left",
      danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30" : "text-foreground hover:bg-accent")}>
      {icon}{children}
    </button>
  );
}
