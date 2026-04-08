"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function RootPage() {
  const { user } = useApp();
  const router = useRouter();
  useEffect(() => {
    router.replace(user ? "/dashboard" : "/login");
  }, [user, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    </div>
  );
}
