import NavigationUser from "@/components/partials/navigation-user";

export default function UserAppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F9] font-poppins">
      <NavigationUser />
      <main className="container-shell py-8">{children}</main>
    </div>
  );
}
