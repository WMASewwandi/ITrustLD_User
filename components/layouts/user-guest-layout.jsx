import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";

export default function UserGuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <NavigationGuest />
      <main className="pt-16 sm:pt-0">{children}</main>
      <FooterGuest />
    </div>
  );
}
