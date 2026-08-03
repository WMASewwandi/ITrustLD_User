"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserAppLayout from "@/components/layouts/user-app-layout";
import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";
import { hasUserSession } from "@/lib/auth";

function LegalSection({ section }) {
  return (
    <section className="scroll-mt-28">
      <h2 className="text-lg font-semibold text-white sm:text-xl">{section.heading}</h2>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-sm leading-7 text-white/70 sm:text-base">
          {paragraph}
        </p>
      ))}

      {section.list?.length ? (
        <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-7 text-white/70 sm:text-base">
          {section.list.map((item) => (
            <li key={`${item.label}-${item.text}`}>
              <span className="font-semibold text-white/85">{item.label}</span> {item.text}
            </li>
          ))}
        </ul>
      ) : null}

      {section.bullets?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-white/70 sm:text-base">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function LegalDocumentContent({ document, guestNav = false }) {
  return (
    <div
      className={`mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 ${
        guestNav ? "pt-24 sm:pt-28" : ""
      }`}
    >
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">Legal</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{document.title}</h1>
        {document.description ? (
          <p className="mt-3 max-w-3xl text-sm text-white/55 sm:text-base">{document.description}</p>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#12172A]/85 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="space-y-8">
          {document.sections.map((section) => (
            <LegalSection key={section.heading} section={section} />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/terms-and-conditions"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Terms and Conditions
        </Link>
        <Link
          href="/privacy-policy"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Privacy Policy
        </Link>
        <Link
          href="/cookie-policy"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Cookie Policy
        </Link>
      </div>
    </div>
  );
}

export default function LegalDocumentPage({ document }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasUserSession());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1020] text-sm text-white/50">
        Loading…
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <UserAppLayout>
        <LegalDocumentContent document={document} />
      </UserAppLayout>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B16] text-white">
      <NavigationGuest />
      <main>
        <LegalDocumentContent document={document} guestNav />
      </main>
      <FooterGuest />
    </div>
  );
}
