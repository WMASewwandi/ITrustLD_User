import FooterGuest from "@/components/partials/footer-guest";
import NavigationUser from "@/components/partials/navigation-user";

export default function UserAppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B1020] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/userdash.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B1020]/70"
        aria-hidden
      />
      <NavigationUser />
      <main className="relative flex-1">{children}</main>
      <FooterGuest />
    </div>
  );
}
