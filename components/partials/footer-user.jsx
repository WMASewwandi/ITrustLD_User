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
        <Link
          href="/terms"
          className="mt-4 inline-block text-sm text-theme-green-action underline-offset-4 hover:underline"
        >
          Terms and Conditions
        </Link>

        <div className="mt-6 flex items-center justify-center gap-4">
          {[Facebook, Send, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition hover:border-white/25 hover:text-white"
              aria-label="Social link"
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
