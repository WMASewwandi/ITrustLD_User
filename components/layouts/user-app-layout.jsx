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
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden pb-[calc(72px+env(safe-area-inset-bottom))] lg:pl-[60px] lg:pb-0">
        <main className="relative min-w-0 flex-1 overflow-x-hidden">{children}</main>
        <div className="hidden lg:block">
          <FooterGuest />
        </div>
      </div>
    </div>
  );
}
