import Link from "next/link";

const socials = [
  { href: "#", label: "Facebook", icon: "/assets/img/icons/facebook.svg" },
  { href: "#", label: "YouTube", icon: "/assets/img/icons/youtube.svg" },
  { href: "#", label: "WhatsApp", icon: "/assets/img/icons/whatsapp.svg" }
];

const quickLinksTop = [
  { href: "/", label: "Home" },
  { href: "/help", label: "Help" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" }
];

const quickLinksBottom = [
  { href: "#", label: "Deposits" },
  { href: "#", label: "Withdrawals" },
  { href: "#", label: "Trust Points" },
  { href: "#", label: "Partners" }
];

const legalLinks = [
  { href: "#", label: "Terms of Use" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Cookie Policy" }
];

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6L15 12L9 18" />
    </svg>
  );
}

function FooterLink({ href, label }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
      <Chevron />
      <span className="transition group-hover:translate-x-0.5">{label}</span>
    </Link>
  );
}

export default function FooterGuest() {
  return (
    <footer className="relative overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#070B16]/70" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-white/10 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-theme-green-action/10 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1.65fr] lg:items-start lg:gap-8">
          <div>
            <Link href="/" className="inline-flex items-center">
              <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto sm:h-11" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/70">
              ITrustLD By GLOBIX (PVT) LTD, a registered company.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/55">
              Our Terms of Use govern the opening, use, and closure of your iTrustLD Account and related payment services.
              Together with any other referenced terms and conditions, they constitute the agreement between you and iTrustLD.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/55">
              iTrustLD electronic money accounts are not considered bank accounts. By accepting these Terms of Use, you
              acknowledge that Sri Lanka&apos;s Financial Services Compensation Scheme does not cover your iTrustLD Account.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_0.75fr_1.25fr] lg:items-start lg:gap-6">
            <div>
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 5" />
                    <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19" />
                  </svg>
                </span>
                Quick Links
              </h3>
              <ul className="mt-5 space-y-3">
                {quickLinksTop.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
              <div className="my-4 h-px bg-white/10" />
              <ul className="space-y-3">
                {quickLinksBottom.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/15 text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
                  </svg>
                </span>
                Legal
              </h3>
              <ul className="mt-5 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="group relative overflow-hidden rounded-[1.35rem] border border-white/20 bg-[#12172A]/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:ml-auto lg:max-w-[300px]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl transition duration-500 group-hover:bg-white/15" />
              <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.12)] ring-1 ring-white/25">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 4.5V7" />
                      <path d="M8 8.5H16L17.5 12.5H6.5L8 8.5Z" />
                      <path d="M7 12.5H17V18.5C17 19.3 16.3 20 15.5 20H8.5C7.7 20 7 19.3 7 18.5V12.5Z" />
                      <path d="M10 15.5H14" />
                    </svg>
                  </span>
                  <p className="text-lg font-semibold leading-tight text-white">Register for free</p>
                </div>

                <p className="relative mt-3 text-sm leading-6 text-white/55">
                  Join iTrustLD today and experience secure, fast, and reliable transactions.
                </p>

                <Link
                  href="/register"
                  className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0B1020] shadow-[0_10px_30px_rgba(255,255,255,0.18)] transition duration-300 hover:bg-white/90 hover:shadow-[0_14px_36px_rgba(255,255,255,0.25)]"
                >
                  Sign Up Now
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12H19" />
                    <path d="M13 6L19 12L13 18" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="inline-flex items-center gap-2 text-sm text-white/60">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-theme-green-action" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
            </svg>
            © 2024 iTrustLD. All Rights Reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition hover:border-theme-green-action/50 hover:bg-theme-green-action/10"
              >
                <img src={social.icon} alt={social.label} className="h-4 w-4" />
              </Link>
            ))}
          </div>

          <p className="inline-flex items-center gap-2 text-sm text-white/55 lg:max-w-sm lg:text-right">
            Licensed and Regulated By the Financial Intelligence Unit of Sri Lanka
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-theme-green-action" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="6" y="10.5" width="12" height="9" rx="2" />
              <path d="M9 10.5V8.5C9 6.8 10.3 5.5 12 5.5C13.7 5.5 15 6.8 15 8.5V10.5" />
            </svg>
          </p>
        </div>
      </div>
    </footer>
  );
}
