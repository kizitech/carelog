// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "CareLog — Shift Reporting System",
  description:
    "A modern, professional hospital shift reporting system for clinical staff.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230d9488'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='white'>✚</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AppProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              expand={false}
              duration={3500}
              toastOptions={{
                style: {
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                },
              }}
            />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
