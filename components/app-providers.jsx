"use client";

import { WebsiteLogoProvider } from "@/components/brand-logo";
import { MaintenanceModeProvider } from "@/components/maintenance-mode-provider";
import { AppDialogProvider } from "@/components/app-dialog";
import TidioChat from "@/components/live-chat/tidio-chat";

export default function AppProviders({ children }) {
  return (
    <WebsiteLogoProvider>
      <MaintenanceModeProvider>
        <AppDialogProvider>
          {children}
          <TidioChat />
        </AppDialogProvider>
      </MaintenanceModeProvider>
    </WebsiteLogoProvider>
  );
}
