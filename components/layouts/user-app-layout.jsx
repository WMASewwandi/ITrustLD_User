import FooterGuest from "@/components/partials/footer-guest";
import NavigationUser from "@/components/partials/navigation-user";
import PromoTopAlert from "@/components/dashboard/promo-top-alert";

export default function UserAppLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col text-white print:min-h-0 print:bg-white print:text-black">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B1020] bg-cover bg-center bg-no-repeat print:hidden"
        style={{ backgroundImage: "url('/userdash.png')" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[#0B1020]/70 print:hidden"
        aria-hidden
      />
      <div className="print:hidden">
        <PromoTopAlert />
        <NavigationUser />
      </div>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip lg:pl-[60px] print:overflow-visible print:p-0 print:pl-0">
        <main className="relative min-w-0 flex-1 overflow-x-clip max-lg:pb-[calc(72px+env(safe-area-inset-bottom))] print:overflow-visible print:pb-0">
          {children}
        </main>
        <div className="hidden shrink-0 lg:block print:hidden">
          <FooterGuest />
        </div>
      </div>
    </div>
  );
}
