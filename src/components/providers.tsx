"use client";

import * as React from "react";
import "@/sentry.client.config";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TRPCReactProvider>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster richColors position="top-center" />
            </TooltipProvider>
          </TRPCReactProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
