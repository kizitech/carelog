"use client";
// components/shared/Modal.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
  extraWide?: boolean;
  description?: string;
}

export function Modal({ open, onClose, title, children, wide = false, extraWide = false, description }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn("relative bg-card border border-border rounded-2xl shadow-2xl w-full overflow-hidden",
              extraWide ? "max-w-[900px]" : wide ? "max-w-[720px]" : "max-w-[540px]")}
            style={{ maxHeight: "92vh" }}>
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <div>
                <h2 className="text-[17px] font-bold text-foreground">{title}</h2>
                {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(92vh - 65px)" }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
