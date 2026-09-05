"use client";

import { usePathname } from "next/navigation";
import UserAppLayout from "@/components/layouts/user-app-layout";
import UserSessionGuard from "@/components/layouts/user-session-guard";

export default function DashboardFrame({ children }) {
  const pathname = usePathname();
  // Print preview is the same receipt page; skip dashboard chrome/session so it opens faster.
  if (pathname.includes("/print")) {
    return children;
  }

  return (
    <UserSessionGuard>
      <UserAppLayout>{children}</UserAppLayout>
    </UserSessionGuard>
  );
}
