import UserGuestLayout from "@/components/layouts/user-guest-layout";

export default function HelpPage() {
  return (
    <UserGuestLayout>
      <section className="container-shell py-16">
        <div className="rounded-xl border border-theme-gray-border bg-white p-8">
          <h1 className="text-3xl font-semibold text-theme-blue-dark">Help</h1>
          <p className="mt-3 text-md text-theme-gray">Placeholder help page for guest navigation.</p>
        </div>
      </section>
    </UserGuestLayout>
  );
}
