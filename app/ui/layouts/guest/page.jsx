import UserGuestLayout from "@/components/layouts/user-guest-layout";

export default function GuestLayoutDemoPage() {
  return (
    <UserGuestLayout>
      <section className="container-shell py-16">
        <div className="rounded-xl border border-theme-gray-border bg-white p-8">
          <h1 className="text-3xl font-semibold text-theme-blue-dark">Guest Layout Demo</h1>
          <p className="mt-3 text-md text-theme-gray">
            This page demonstrates `user-guest` layout with desktop and mobile navigation plus footer.
          </p>
        </div>
      </section>
    </UserGuestLayout>
  );
}
