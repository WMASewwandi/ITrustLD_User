"use client";

import Link from "next/link";
import { useState } from "react";
import UserGuestLayout from "@/components/layouts/user-guest-layout";
import PrimaryButton from "@/components/ui/primary-button";
import TextInput from "@/components/ui/text-input";
import InputLabel from "@/components/ui/input-label";

const faqs = [
  {
    q: "How do I create an iTrustLD account?",
    a: "To create an iTrustLD account, click on the \"Register\" button in the navigation bar. Fill in your personal information, verify your email address, and complete the account verification process. You'll need to provide valid identification documents as part of the verification process."
  },
  {
    q: "How do I make a deposit?",
    a: "To make a deposit, log in to your account and navigate to the \"Deposit\" section. Select your preferred payment method (bank transfer, Skrill, Neteller, XM, Perfect Money, or cryptocurrency), enter the deposit amount, and follow the instructions. Make sure to include the iTrustLD email in the transaction description/remark field and upload the payment proof."
  },
  {
    q: "How long does it take to process a withdrawal?",
    a: "Withdrawal processing times vary depending on the payment method. Typically, withdrawals are processed within 1-3 business days after approval. You'll receive email notifications at each stage of the withdrawal process (pending, approved, or rejected)."
  },
  {
    q: "What documents do I need for account verification?",
    a: "For account verification, you'll need to provide a valid government-issued ID (passport, national ID, or driver's license) and a proof of address document (utility bill, bank statement, or official document dated within the last 3 months). All documents must be clear, readable, and show all four corners."
  },
  {
    q: "What payment methods are supported?",
    a: "iTrustLD supports multiple payment methods including bank transfers, Skrill, Neteller, XM Global, Perfect Money, Binance, and various cryptocurrencies. Available payment methods may vary by region. Check your account dashboard for the complete list of available options in your area."
  },
  {
    q: "How does the Loyalty Program work?",
    a: "The iTrustLD Loyalty Program rewards you with points for your transactions. You can earn points on deposits and other activities. Accumulated points can be redeemed for bonuses or withdrawn. Partners can also earn additional benefits by referring clients. Check your loyalty dashboard for your current points balance and available rewards."
  },
  {
    q: "What should I do if my deposit is rejected?",
    a: "If your deposit is rejected, check the rejection reason in your transaction history. Common reasons include missing transaction details, incorrect payment proof, or incomplete information. Make sure to include the iTrustLD email in the transaction description, upload a clear payment proof showing date, time, description, and account number, then submit a new deposit request. If issues persist, contact our support team."
  },
  {
    q: "Is my account information secure?",
    a: "Yes, iTrustLD takes security seriously. We use industry-standard encryption and security measures to protect your personal and financial information. Your account is protected with secure authentication, and we comply with data protection regulations. Never share your login credentials with anyone, and always log out from shared devices."
  }
];

const contactChannels = [
  {
    id: "ticket",
    label: "24/7 Support",
    detail: "Submit a ticket anytime",
    href: "#support-form",
    tone: "bg-theme-green-action hover:brightness-110"
  },
  {
    id: "email",
    label: "Email Support",
    detail: "support@itrustld.com",
    href: "mailto:support@itrustld.com",
    tone: "bg-theme-orange hover:brightness-110"
  },
  {
    id: "phone",
    label: "Call Us",
    detail: "+94 117 751 751",
    href: "tel:+94117751751",
    tone: "bg-theme-green-dark hover:brightness-110"
  },
  {
    id: "response",
    label: "Response Time",
    detail: "Less than 2 hours",
    href: null,
    tone: "bg-theme-blue-darkshade"
  }
];

function ChannelIcon({ id }) {
  const common = "h-5 w-5";
  if (id === "email") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M4 7.5L12 13L20 7.5" />
      </svg>
    );
  }
  if (id === "phone") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 4.5H6.8C5.8 4.5 5 5.3 5 6.3C5 14 10 19 17.7 19C18.7 19 19.5 18.2 19.5 17.2V15.5L16.8 14.8L15.3 16.3C13 15.2 10.8 13 9.7 10.7L11.2 9.2L10.5 6.5L8.5 4.5Z" />
      </svg>
    );
  }
  if (id === "response") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8V12L14.5 14.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 7.5H18.5V14.5H10.5L7 17.5V14.5H5.5V7.5Z" />
      <path d="M9 10.5H15" />
      <path d="M9 12.8H13" />
    </svg>
  );
}

const fieldClass =
  "rounded-lg border border-[#CDD5E0] bg-[#F7F9FC] px-3 py-2.5 text-sm transition focus:border-theme-blue-dark focus:bg-white focus:ring-0";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [modal, setModal] = useState({ open: false, kind: "success", message: "" });

  const onSubmit = (event) => {
    event.preventDefault();
    setModal({
      open: true,
      kind: "success",
      message: "Your support ticket has been submitted successfully. Our team will get back to you soon."
    });
    event.currentTarget.reset();
  };

  const onChannelClick = (event, href) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <UserGuestLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-theme-blue-dark via-theme-blue-panel to-theme-green-dark">
        <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-theme-green-action/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-theme-green-shaded/20 blur-3xl" />

        <div className="container-shell relative py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-green-action">Help Center</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4-5xl">
            Support that stays with you
          </h1>
          <p className="mt-3 max-w-2xl text-md-lg text-white/75">
            Reach our team anytime. We typically respond in under two hours and are available around the clock.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {contactChannels.map((channel) => {
              const content = (
                <>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 transition group-hover:bg-white/25">
                    <ChannelIcon id={channel.id} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{channel.label}</span>
                    <span className="mt-0.5 block text-xs text-white/80">{channel.detail}</span>
                  </span>
                </>
              );

              if (!channel.href) {
                return (
                  <div
                    key={channel.id}
                    className={`${channel.tone} flex items-center gap-3 rounded-xl px-4 py-4 text-white`}
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={channel.id}
                  href={channel.href}
                  onClick={(event) => onChannelClick(event, channel.href)}
                  className={`${channel.tone} group flex items-center gap-3 rounded-xl px-4 py-4 text-white transition`}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#F3F6FB] via-white to-[#F7F9FC] py-12 sm:py-16">
        <div className="container-shell grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <article className="overflow-hidden rounded-2xl border border-theme-gray-border bg-white shadow-[0_18px_50px_rgba(37,34,62,0.08)]">
              <div className="border-b border-theme-gray-border bg-gradient-to-r from-theme-blue-dark to-theme-blue-panel px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-green-action">FAQ</p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Frequently Asked Questions</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  Quick answers to the questions we hear most often from iTrustLD members.
                </p>
              </div>

              <div className="divide-y divide-theme-gray-border p-2 sm:p-3">
                {faqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={item.q}
                      className={`rounded-xl transition ${isOpen ? "bg-[#F7F9FC]" : "hover:bg-[#F7F9FC]/60"}`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                      >
                        <span
                          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isOpen ? "bg-theme-green-action text-white" : "bg-theme-blue-dark/10 text-theme-blue-dark"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-semibold sm:text-base ${
                              isOpen ? "text-theme-green-action" : "text-theme-blue-dark"
                            }`}
                          >
                            {item.q}
                          </span>
                          <span
                            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                              isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                          >
                            <span className="overflow-hidden">
                              <span className="mt-2 block text-sm leading-7 text-theme-blue-darkshade">{item.a}</span>
                            </span>
                          </span>
                        </span>
                        <span
                          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                            isOpen
                              ? "border-theme-green-action bg-theme-green-action text-white"
                              : "border-theme-gray-border text-theme-blue-dark"
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M6 9L12 15L18 9" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <aside className="relative overflow-hidden rounded-2xl bg-theme-green-dark p-6 text-white shadow-[0_18px_50px_rgba(20,83,91,0.22)] sm:p-7">
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/15">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5.5 7.5H18.5V14.5H10.5L7 17.5V14.5H5.5V7.5Z" />
                    <path d="M9 10.5H15" />
                    <path d="M9 12.8H13" />
                  </svg>
                </span>
                <p className="mt-4 text-xl font-semibold">Faster with live chat</p>
                <p className="mt-2 text-sm text-white/80">Log in to chat with an agent for quicker help.</p>
                <Link
                  href="/login"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-[4px] bg-white px-5 py-2.5 text-sm font-semibold text-theme-green-dark transition hover:bg-theme-gray-white sm:w-auto"
                >
                  Go to Login
                </Link>
              </div>
            </aside>

            <article
              id="support-form"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-theme-gray-border bg-white shadow-[0_18px_50px_rgba(37,34,62,0.08)]"
            >
              <div className="border-b border-theme-gray-border px-6 py-5 sm:px-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-green-action">Contact</p>
                <h2 className="mt-1 text-xl font-semibold text-theme-blue-dark sm:text-2xl">Submit a Support Ticket</h2>
                <p className="mt-1 text-sm text-theme-gray">
                  Share a few details and we&apos;ll follow up by email as soon as possible.
                </p>
              </div>

              <form className="space-y-4 px-6 py-6 sm:px-7 sm:py-7" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <InputLabel htmlFor="firstName">
                      First Name <span className="text-theme-red-action">*</span>
                    </InputLabel>
                    <TextInput id="firstName" name="firstName" required className={fieldClass} />
                  </div>
                  <div>
                    <InputLabel htmlFor="lastName">
                      Last Name <span className="text-theme-red-action">*</span>
                    </InputLabel>
                    <TextInput id="lastName" name="lastName" required className={fieldClass} />
                  </div>
                </div>

                <div>
                  <InputLabel htmlFor="email">
                    Email <span className="text-theme-red-action">*</span>
                  </InputLabel>
                  <TextInput id="email" name="email" type="email" required className={fieldClass} />
                </div>

                <div>
                  <InputLabel htmlFor="subject">
                    Subject <span className="text-theme-red-action">*</span>
                  </InputLabel>
                  <TextInput id="subject" name="subject" required className={fieldClass} />
                </div>

                <div>
                  <InputLabel htmlFor="message">
                    Message <span className="text-theme-red-action">*</span>
                  </InputLabel>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className={`w-full text-theme-black outline-none ${fieldClass}`}
                  />
                </div>

                <PrimaryButton type="submit" className="w-full px-6 sm:w-auto sm:px-10">
                  Send Message
                </PrimaryButton>
              </form>
            </article>
          </div>
        </div>
      </section>

      {modal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-blue-dark/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-[0_24px_70px_rgba(8,12,30,0.35)] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-theme-green-action text-lg text-white">
                  ✓
                </span>
                <div>
                  <p className="text-base font-semibold text-theme-blue-dark">
                    {modal.kind === "success" ? "Ticket submitted" : "Warning"}
                  </p>
                  <p className="text-xs text-theme-gray">We&apos;ll be in touch shortly</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setModal({ open: false, kind: "success", message: "" })}
                className="rounded-full px-2 text-xl leading-none text-theme-gray transition hover:bg-theme-gray-white hover:text-theme-blue-dark"
              >
                ×
              </button>
            </div>
            <p className="mt-5 text-sm leading-7 text-theme-blue-darkshade">{modal.message}</p>
            <button
              type="button"
              onClick={() => setModal({ open: false, kind: "success", message: "" })}
              className="mt-6 w-full rounded-[4px] bg-theme-green-action px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </UserGuestLayout>
  );
}
