"use client";
// components/layout/Navbar.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Sun, Moon, Monitor, ChevronDown, User, LogOut, Settings, Trash2, LayoutDashboard, Users, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/shared";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ProfileModal } from "@/components/staff/ProfileModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/residents", label: "Residents",  icon: Users },
  { href: "/trash",     label: "Trash",      icon: Trash2 },
];

export function Navbar() {
  const { user, logout, resetApp } = useApp();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router   = useRouter();
  const [userMenu,    setUserMenu]    = useState(false);
  const [themeMenu,   setThemeMenu]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resetOpen,   setResetOpen]   = useState(false);

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[58px] flex items-center gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-blue-700 dark:text-blue-400 tracking-tight leading-none">Carekel</p>
              <p className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase leading-none mt-0.5">Shift Handover</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1 ml-3">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
                <Icon className="w-3.5 h-3.5" />{label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Theme */}
          <div className="relative">
            <button onClick={() => { setThemeMenu(o => !o); setUserMenu(false); }}
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border flex items-center justify-center text-muted-foreground transition-all">
              <ThemeIcon className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {themeMenu && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.13 }}
                  className="absolute right-0 top-[calc(100%+6px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[135px] z-50"
                  onMouseLeave={() => setThemeMenu(false)}>
                  {([["light","Light",Sun],["dark","Dark",Moon],["system","System",Monitor]] as const).map(([v,l,I]) => (
                    <button key={v} onClick={() => { setTheme(v); setThemeMenu(false); }}
                      className={cn("w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors text-left",
                        theme === v ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold" : "text-foreground hover:bg-accent")}>
                      <I className="w-3.5 h-3.5" />{l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          {user && (
            <div className="relative">
              <button onClick={() => { setUserMenu(o => !o); setThemeMenu(false); }}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-secondary hover:bg-accent border border-border transition-all">
                <Avatar initials={user.avatar} size="sm" />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-[12px] font-semibold text-foreground leading-tight">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight">{user.role}</span>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform ml-1", userMenu && "rotate-180")} />
              </button>
              <AnimatePresence>
                {userMenu && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.13 }}
                    className="absolute right-0 top-[calc(100%+6px)] bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[185px] z-50"
                    onMouseLeave={() => setUserMenu(false)}>
                    <div className="px-3.5 py-2.5 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="py-1">
                      <NavBtn icon={<User className="w-3.5 h-3.5" />} onClick={() => { setProfileOpen(true); setUserMenu(false); }}>My Profile</NavBtn>
                      <NavBtn icon={<Settings className="w-3.5 h-3.5" />} onClick={() => { setProfileOpen(true); setUserMenu(false); }}>Settings</NavBtn>
                    </div>
                    <div className="border-t border-border py-1">
                      <NavBtn icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={() => { setResetOpen(true); setUserMenu(false); }}>Reset Demo Data</NavBtn>
                      <NavBtn icon={<LogOut className="w-3.5 h-3.5" />} onClick={() => { logout(); router.push("/login"); }} danger>Sign Out</NavBtn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)}
        onConfirm={() => { resetApp(); toast.success("Demo data restored"); }}
        title="Reset Demo Data" confirmLabel="Yes, Reset" danger
        description="This will clear all current records and restore the original demo data. This cannot be undone." />
    </>
  );
}

function NavBtn({ icon, children, onClick, danger }: { icon: React.ReactNode; children: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left",
      danger ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30" : "text-foreground hover:bg-accent")}>
      {icon}{children}
    </button>
  );
}
