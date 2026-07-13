import UserAuthLayout from "@/components/layouts/user-auth-layout";

export default function AuthLayoutDemoPage() {
  return (
    <UserAuthLayout>
      <div className="rounded-xl border border-theme-gray-border bg-white p-8">
        <h1 className="text-3xl font-semibold text-theme-blue-dark">Auth Layout Demo</h1>
        <p className="mt-3 text-md text-theme-gray">
          Form shell only for Day 1. Login/register fields are intentionally out of scope.
        </p>
      </div>
    </UserAuthLayout>
  );
}
