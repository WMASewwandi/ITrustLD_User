"use client";

import { WebsiteLogoProvider } from "@/components/brand-logo";
import { MaintenanceModeProvider } from "@/components/maintenance-mode-provider";

export default function AppProviders({ children }) {
  return (
    <WebsiteLogoProvider>
      <MaintenanceModeProvider>{children}</MaintenanceModeProvider>
    </WebsiteLogoProvider>
  );
}
