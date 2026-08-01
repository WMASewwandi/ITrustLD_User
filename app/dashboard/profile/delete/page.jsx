"use client";

import Link from "next/link";

export default function ProfileDeletePage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/50">
        <Link href="/dashboard/profile" className="hover:text-white">
          My Profile
        </Link>
        <span>/</span>
        <span className="text-white/80">Delete Account</span>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
        <h1 className="text-2xl font-semibold text-white">Delete Account</h1>
        <p className="mt-6 text-sm leading-7 text-white/70">
          If you wish to delete your account and all associated data, please email us at{" "}
          <a href="mailto:support@itrustld.com" className="font-semibold text-theme-green-action hover:underline">
            support@itrustld.com
          </a>{" "}
          using your registered email address. Your request will be processed within 7 business days.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard/profile"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Back to profile
          </Link>
        </div>
      </section>
    </div>
  );
}
