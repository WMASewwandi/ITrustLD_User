import UserAppLayout from "@/components/layouts/user-app-layout";
import UserSessionGuard from "@/components/layouts/user-session-guard";
import TidioChat from "@/components/live-chat/tidio-chat";

export default function DashboardLayout({ children }) {
  return (
    <UserAppLayout>
      <UserSessionGuard>{children}</UserSessionGuard>
      <TidioChat />
    </UserAppLayout>
  );
}
