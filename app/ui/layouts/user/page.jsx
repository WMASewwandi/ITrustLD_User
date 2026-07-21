import UserAppLayout from "@/components/layouts/user-app-layout";

export default function UserLayoutDemoPage() {
  return (
    <UserAppLayout>
      <div className="rounded-xl border border-theme-gray-border bg-white p-8">
        <h1 className="text-3xl font-semibold text-theme-blue-dark">User App Layout Demo</h1>
        <p className="mt-3 text-md text-theme-gray">
          Logged-in shell placeholder for Day 2 pages (top-up, cash-out, transactions, profile).
        </p>
      </div>
    </UserAppLayout>
  );
}
