"use client";

import { WebsiteLogoProvider } from "@/components/brand-logo";
import { MaintenanceModeProvider } from "@/components/maintenance-mode-provider";
import { AppDialogProvider } from "@/components/app-dialog";

export default function AppProviders({ children }) {
  return (
    <WebsiteLogoProvider>
      <MaintenanceModeProvider>
        <AppDialogProvider>{children}</AppDialogProvider>
      </MaintenanceModeProvider>
    </WebsiteLogoProvider>
  );
}
