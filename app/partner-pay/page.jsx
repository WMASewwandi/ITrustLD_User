"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogoImage } from "@/components/brand-logo";
import UserAuthLayout from "@/components/layouts/user-auth-layout";
import { hasUserSession } from "@/lib/auth";
import { previewPaymentGateway } from "@/lib/payment-gateway";

export default function PartnerPayEntryPage() {
  return (
    <Suspense
      fallback={
        <UserAuthLayout>
          <div className="flex min-h-dvh items-center justify-center text-white/50">Loading…</div>
        </UserAuthLayout>
      }
    >
      <PartnerPayEntry />
    </Suspense>
  );
}

function PartnerPayEntry() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("gateway") || params.get("token");
    if (!token) {
      setMessage("This payment link is missing. Please restart from the partner platform.");
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const preview = await previewPaymentGateway(token);
        if (cancelled) return;
        if (!preview.has_account) {
          setMessage(preview.message || "No iTrustLD account found for this email.");
          return;
        }
        const next = preview.continue_path || `/dashboard/deposit?gateway=${encodeURIComponent(token)}`;
        if (hasUserSession()) {
          router.replace(next);
          return;
        }
        const login = new URL("/login", window.location.origin);
        login.searchParams.set("redirect", next);
        if (preview.email) login.searchParams.set("email", preview.email);
        router.replace(`${login.pathname}?${login.searchParams.toString()}`);
      } catch (err) {
        if (!cancelled) {
          setMessage(err.message || "This payment link is invalid or expired.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router]);

  if (!message) {
    return (
      <UserAuthLayout>
        <div className="flex min-h-dvh items-center justify-center text-white/50">Opening checkout…</div>
      </UserAuthLayout>
    );
  }

  return (
    <UserAuthLayout>
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
        <Link href="/" className="mb-8 inline-block w-fit">
          <BrandLogoImage alt="iTrustLD" className="h-10 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Cannot continue this payment</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/75">{message}</p>
        <Link
          href="/register"
          className="mt-8 inline-flex w-fit rounded-xl bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white"
        >
          Create an account
        </Link>
      </div>
    </UserAuthLayout>
  );
}
