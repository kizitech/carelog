// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Carekel — Digital Care Home App",
  description: "Simple, clear digital care home records for care home staff.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AppProvider>
            {children}
            <Toaster position="bottom-right" richColors expand={false} duration={4000}
              toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500 } }} />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
