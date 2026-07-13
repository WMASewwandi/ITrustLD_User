import Link from "next/link";

const socials = [
  { href: "#", label: "Facebook", icon: "/assets/img/icons/facebook.svg" },
  { href: "#", label: "WhatsApp", icon: "/assets/img/icons/whatsapp.svg" },
  { href: "#", label: "YouTube", icon: "/assets/img/icons/youtube.svg" }
];

export default function FooterGuest() {
  return (
    <footer className="bg-theme-blue-dark text-white">
      <div className="container-shell py-10">
        <p className="text-sm leading-6 text-white/85">
          iTrustLD By GLOBIX (PVT) LTD. Terms govern the opening, use, and closure of your account and related services.
        </p>
        <Link href="#" className="mt-4 inline-block text-sm text-theme-green-action">
          Terms and Conditions
        </Link>

        <div className="mt-6 flex items-center gap-3">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-theme-blue-darkshade"
            >
              <img src={social.icon} alt={social.label} className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-shell py-4 text-xs text-[#CFD3D7]">Copyright © 2024 ITrustLD. All Right Reserved</p>
      </div>
    </footer>
  );
}
