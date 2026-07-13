import Link from "next/link";

const socials = [
  { href: "#", label: "Facebook", icon: "/assets/img/icons/facebook.svg" },
  { href: "#", label: "YouTube", icon: "/assets/img/icons/youtube.svg" },
  { href: "#", label: "WhatsApp", icon: "/assets/img/icons/whatsapp.svg" }
];

const linksColA = [
  { href: "/", label: "Home" },
  { href: "/help", label: "Help" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
];

const linksColC = [
  { href: "#", label: "Deposits" },
  { href: "#", label: "Withdrawals" },
  { href: "#", label: "Trust Points" },
  { href: "#", label: "Partners" }
];

const linksColD = [
  { href: "#", label: "Terms of Use" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Cookie Policy" }
];

export default function FooterGuest() {
  return (
    <footer className="bg-theme-blue-darkshade text-white">
      <div className="container-shell py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[2.9fr_0.95fr_0.85fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-11 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-7 text-white/85">
              ITrustLD By GLOBIX (PVT) LTD, a registered company.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Our Terms of Use govern the opening, use, and closure of your iTrustLD Account and related payment services.
              Together with any other referenced terms and conditions, they constitute the agreement between you and iTrustLD.
              Additional terms may apply to specific services, which will be communicated to you when ordering or using these
              services.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/75">
              Depending on your iTrustLD Account type, additional terms may apply. iTrustLD electronic money accounts are not
              considered bank accounts. By accepting these Terms of Use, you acknowledge that Sri Lanka&apos;s Financial Services
              Compensation Scheme does not cover your iTrustLD Account and that, in the unlikely event of insolvency, there is a
              risk of losing electronic funds held in your account.
            </p>
          </div>

          <div>
            <h3 className="text-2-3lg font-semibold uppercase tracking-wide">Links</h3>
            <ul className="mt-4 space-y-2.5">
              {linksColA.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/85 transition hover:text-theme-green-action">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="my-4 border-t border-white/15" />
            <ul className="space-y-2.5">
              {linksColC.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/85 transition hover:text-theme-green-action">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2-3lg font-semibold uppercase tracking-wide">Links</h3>
            <ul className="mt-4 space-y-2.5">
              {linksColD.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/85 transition hover:text-theme-green-action">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-white/85">
            <span className="text-md">Register for free</span>
            <Link
              href="/register"
              className="rounded-full border border-white/50 px-5 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-theme-green-action hover:text-theme-green-action"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-white/15 pt-6">
          <div className="flex items-center justify-center gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 transition hover:border-theme-green-action"
              >
                <img src={social.icon} alt={social.label} className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-theme-blue-dark py-4">
        <p className="container-shell text-center text-sm text-[#CFD3D7]">© 2024 iTrustLD. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
