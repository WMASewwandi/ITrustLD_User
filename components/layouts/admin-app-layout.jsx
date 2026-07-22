import NavigationAdmin from "@/components/partials/navigation-admin";

export default function AdminAppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0B1020] text-white">
      <NavigationAdmin />
      <div className="relative pb-20 lg:pl-[220px] lg:pb-0">
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
