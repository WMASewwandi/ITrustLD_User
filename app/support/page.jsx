"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UserAppLayout from "@/components/layouts/user-app-layout";
import NavigationGuest from "@/components/partials/navigation-guest";
import FooterGuest from "@/components/partials/footer-guest";
import { getUserSession, hasUserSession } from "@/lib/auth";
import { submitHelpTicket } from "@/lib/help-api";
import { Headphones, Mail, MessageCircle, Phone, X } from "lucide-react";

const faqs = [
  {
    q: "How do I create an iTrustLD account?",
    a: 'Click "Register" in the navigation bar, complete your details, verify your email, and finish account verification with valid identification documents.',
  },
  {
    q: "How do I make a deposit?",
    a: 'Log in and open Top-up. Choose your payment method, enter the amount, include the iTrustLD email in the transaction remark, and upload payment proof.',
  },
  {
    q: "How long does it take to process a withdrawal?",
    a: "Cash-out requests are usually processed within 1–3 business days after approval. You will receive email updates when the status changes.",
  },
  {
    q: "What documents do I need for account verification?",
    a: "Provide a valid government ID and a proof of address dated within the last 3 months. Images must be clear and show all four corners.",
  },
  {
    q: "What payment methods are supported?",
    a: "Bank transfer, Skrill, Neteller, XM Global, Perfect Money, Binance, and supported cryptocurrencies. Available options may vary by region.",
  },
  {
    q: "How does the Loyalty Program work?",
    a: "Earn Trust Points from qualifying activity. Points unlock tier benefits and can be redeemed from the Loyalty section in your dashboard.",
  },
  {
    q: "What should I do if my deposit is rejected?",
    a: "Check the rejection reason in transaction history, correct the payment proof or remark details, and submit a new top-up request. Contact support if you need help.",
  },
  {
    q: "Is my account information secure?",
    a: "Yes. iTrustLD uses encryption and secure authentication. Never share your password and sign out on shared devices.",
  },
  {
    q: "How long does document verification take?",
    a: "Most documents are reviewed within one business day. Rejection reasons appear on the Documents page if a file is declined.",
  },
  {
    q: "Can I reuse saved bank accounts?",
    a: "Yes. Add banks in My Profile and select them during top-up, cash-out, and loyalty redemption.",
  },
  {
    q: "How do Trust Points tiers work?",
    a: "Tiers progress with activity: Normal → Silver → Gold → Diamond → VIP (500k points) → VVIP (1M points). Open Loyalty to view tier benefits.",
  },
];

const contactChannels = [
  {
    id: "ticket",
    label: "24/7 Support",
    detail: "Submit a ticket below",
    href: "#support-form",
    icon: MessageCircle,
  },
  {
    id: "email",
    label: "Email Support",
    detail: "support@itrustld.com",
    href: "mailto:support@itrustld.com",
    icon: Mail,
  },
  {
    id: "phone",
    label: "Call Us",
    detail: "+94 117 751 751",
    href: "tel:+94117751751",
    icon: Phone,
  },
];

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/45";
const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#0B1020]/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-theme-green-action/50";

function SupportContent({ isLoggedIn, guestNav = false }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [modal, setModal] = useState({ open: false, kind: "success", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const session = getUserSession();
    const form = formRef.current;
    if (!form || !session) return;

    const fullName = String(session.name || "").trim();
    const [firstName = "", ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ");

    if (firstName && form.firstName && !form.firstName.value) form.firstName.value = firstName;
    if (lastName && form.lastName && !form.lastName.value) form.lastName.value = lastName;
    if (session.email && form.email && !form.email.value) form.email.value = session.email;
  }, [isLoggedIn]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);

    try {
      const data = await submitHelpTicket({
        first_name: form.firstName.value.trim(),
        last_name: form.lastName.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
      });

      setModal({
        open: true,
        kind: "success",
        message:
          data?.message ||
          "Your support ticket has been submitted successfully. Our team will get back to you soon.",
      });
      form.reset();

      if (isLoggedIn) {
        const session = getUserSession();
        const fullName = String(session?.name || "").trim();
        const [firstName = "", ...rest] = fullName.split(/\s+/);
        const lastName = rest.join(" ");
        if (firstName) form.firstName.value = firstName;
        if (lastName) form.lastName.value = lastName;
        if (session?.email) form.email.value = session.email;
      }
    } catch (err) {
      setModal({
        open: true,
        kind: "error",
        message: err?.message || "Could not submit your support ticket. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onChannelClick = (event, href) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div
        className={`mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 ${
          guestNav ? "pt-24 sm:pt-28" : ""
        }`}
      >
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">Help Center</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Support & Help</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/55 sm:text-base">
            We&apos;re here to help. Reach our team any time — we typically respond in under two hours.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-green-action/15 text-theme-green-action">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{channel.label}</span>
                  <span className="mt-0.5 block text-xs text-white/50">{channel.detail}</span>
                </span>
              </>
            );

            if (channel.href?.startsWith("#")) {
              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  onClick={(event) => onChannelClick(event, channel.href)}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {inner}
                </a>
              );
            }

            return (
              <a
                key={channel.id}
                href={channel.href}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.05]"
              >
                {inner}
              </a>
            );
          })}
        </div>

        <div className="mb-8 rounded-2xl border border-theme-green-action/25 bg-theme-green-action/10 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-green-action/20 text-theme-green-action">
              <Headphones className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isLoggedIn ? "Signed in — faster support" : "Get faster support when signed in"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {isLoggedIn
                  ? "Your account details are prefilled below. Submit a ticket or return to your dashboard for account actions."
                  : "Log in to prefill your details and access member quick links for documents, transactions, and loyalty."}
              </p>
              <Link
                href={isLoggedIn ? "/dashboard" : "/login?redirect=/support"}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-theme-green-action px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {isLoggedIn ? "Go to Dashboard" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-7">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-green-action">FAQ</p>
              <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-white/10">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03] sm:px-6"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isOpen ? "bg-theme-green-action text-white" : "bg-white/10 text-white/70"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm font-semibold sm:text-base ${isOpen ? "text-theme-green-action" : "text-white"}`}>
                          {item.q}
                        </span>
                        {isOpen ? (
                          <span className="mt-2 block text-sm leading-7 text-white/60">{item.a}</span>
                        ) : null}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </article>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {isLoggedIn ? (
              <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-green-action">Member resources</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Quick links</h2>
                <div className="mt-4 grid gap-2">
                  {[
                    { href: "/dashboard/documents", label: "KYC documents" },
                    { href: "/dashboard/transactions", label: "Transaction history" },
                    { href: "/dashboard/loyalty", label: "Trust Points & loyalty" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl border border-white/10 bg-[#0B1020]/40 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-theme-green-action/40 hover:text-theme-green-action"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </aside>
            ) : null}

            <article
              id="support-form"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-green-action">Contact</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Submit a Support Ticket</h2>
                <p className="mt-1 text-sm text-white/50">We&apos;ll follow up by email as soon as possible.</p>
              </div>

              <form ref={formRef} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First Name <span className="text-theme-orange">*</span>
                    </label>
                    <input id="firstName" name="firstName" required className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name <span className="text-theme-orange">*</span>
                    </label>
                    <input id="lastName" name="lastName" required className={fieldClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-theme-orange">*</span>
                  </label>
                  <input id="email" name="email" type="email" required className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject <span className="text-theme-orange">*</span>
                  </label>
                  <input id="subject" name="subject" required className={fieldClass} />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message <span className="text-theme-orange">*</span>
                  </label>
                  <textarea id="message" name="message" rows={5} required className={fieldClass} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-theme-green-action px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </article>
          </div>
        </div>
      </div>

      {modal.open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1020] p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg text-white ${
                    modal.kind === "success" ? "bg-theme-green-action" : "bg-theme-orange"
                  }`}
                >
                  {modal.kind === "success" ? "✓" : "!"}
                </span>
                <div>
                  <p className="text-base font-semibold text-white">
                    {modal.kind === "success" ? "Ticket submitted" : "Could not submit"}
                  </p>
                  <p className="text-xs text-white/45">
                    {modal.kind === "success" ? "We'll be in touch shortly" : "Please try again"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setModal({ open: false, kind: "success", message: "" })}
                className="rounded-lg p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-white/65">{modal.message}</p>
            <button
              type="button"
              onClick={() => setModal({ open: false, kind: "success", message: "" })}
              className="mt-6 w-full rounded-xl bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default function SupportPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsLoggedIn(hasUserSession());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1020] text-sm text-white/50">
        Loading support…
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <UserAppLayout>
        <SupportContent isLoggedIn />
      </UserAppLayout>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B16] text-white">
      <NavigationGuest />
      <main>
        <SupportContent isLoggedIn={false} guestNav />
      </main>
      <FooterGuest />
    </div>
  );
}
