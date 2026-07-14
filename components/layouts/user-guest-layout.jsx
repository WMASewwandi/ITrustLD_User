import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";

export default function UserGuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <NavigationGuest />
      <main>{children}</main>
      <FooterGuest />
    </div>
  );
}
