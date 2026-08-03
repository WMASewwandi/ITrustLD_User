import UserAppLayout from "@/components/layouts/user-app-layout";
import UserSessionGuard from "@/components/layouts/user-session-guard";

export default function DashboardLayout({ children }) {
  return (
    <UserAppLayout>
      <UserSessionGuard>{children}</UserSessionGuard>
    </UserAppLayout>
  );
}
