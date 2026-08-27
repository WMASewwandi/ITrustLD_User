import Link from "next/link";
import { Facebook, Send, Youtube } from "lucide-react";

export default function FooterUser() {
  return (
    <footer className="border-t border-white/8 bg-[#080C18]">
      <div className="mx-auto max-w-[1100px] px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-white/80">
          iTrustLD By GLOBIX (PVT) LTD, a registered company.
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-xs leading-relaxed text-white/45">
          The Terms of Use govern the account. These accounts are not bank accounts.
          iTrustLD is not covered by Sri Lanka&apos;s Financial Services Compensation Scheme.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
          <Link
            href="/terms-and-conditions"
            className="text-theme-green-action underline-offset-4 hover:underline"
          >
            Terms and Conditions
          </Link>
          <span className="text-white/25">|</span>
          <Link
            href="/privacy-policy"
            className="text-theme-green-action underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <span className="text-white/25">|</span>
          <Link
            href="/cookie-policy"
            className="text-theme-green-action underline-offset-4 hover:underline"
          >
            Cookie Policy
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {[
            { Icon: Facebook, href: "https://facebook.com/SNXcompany", label: "Facebook" },
            { Icon: Send, href: "https://whatsapp.com/channel/0029Va4BZjl47Xe8lo429m2K", label: "WhatsApp" },
            {
              Icon: Youtube,
              href: "https://youtube.com/@itrustld_official?si=35nXu8mTQM__7ZF",
              label: "YouTube",
            },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:border-white/25 hover:text-white"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="text-xs text-white/35">
            Copyright © {new Date().getFullYear()} iTrustLD. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
