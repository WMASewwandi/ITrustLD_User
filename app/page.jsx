import NavigationGuest from "@/components/partials/navigation-guest";
import PrimaryButton from "@/components/ui/primary-button";
import Link from "next/link";
import LatestUpdatesSlider from "@/components/home/latest-updates-slider";
import BuildProfileSection from "@/components/home/build-profile-section";
import VideoTutorialsSection from "@/components/home/video-tutorials-section";
import ReferEarnSection from "@/components/home/refer-earn-section";
import FooterGuest from "@/components/partials/footer-guest";
import CurrencyWatermarks from "@/components/ui/currency-watermarks";

const specialFeatures = [
  {
    title: "Local Deposit",
    description:
      "We are pleased to inform our customers that we have added Local (Domestic) Bank Transfer as a new deposit option.",
    icon: "deposit"
  },
  {
    title: "Trust Points",
    description: "Earn Trust points to redeem for cash. Make connections and exchange money to be rewarded.",
    icon: "points"
  },
  {
    title: "Trust Partner",
    description:
      "Join iTrustLD partner programme. Monetize your traffic and earn trust point commissions when you share iTrustLD.",
    icon: "partner"
  },
  {
    title: "24/7 Chat Support",
    description: "Get 24/7 chat support with our friendly customer service agents at your service.",
    icon: "support"
  }
];

const whyChooseItems = [
  {
    title: "Security and Reliability",
    description:
      "With a focus on user protection, iTrustLD employs stringent security measures and technological advancements to set industry standards.",
    icon: "security"
  },
  {
    title: "Local Bank Transfer",
    description:
      "iTrustLD offers customers the ability to fill their trading accounts through local banks in their home country, using their local currency.",
    icon: "bank"
  },
  {
    title: "Fast Transaction Processing",
    description:
      "iTrustLD ensures efficiency in transaction processing. Users can experience rapid fund transfers, enabling them to seize trading opportunities without delay.",
    icon: "transfer"
  },
  {
    title: "Global Coverage",
    description:
      "With transactions supported in over 50 nations, iTrustLD provides extensive coverage, enabling users from various regions to access their services seamlessly.",
    icon: "globe"
  }
];

function FeatureIcon({ type }) {
  const common = "h-7 w-7 text-white shrink-0";

  if (type === "deposit") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={common}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M3.5 10.5H20.5" />
        <circle cx="8" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (type === "points") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={common}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5L14.4 8.4L19.8 9.2L15.9 13L16.8 18.5L12 16L7.2 18.5L8.1 13L4.2 9.2L9.6 8.4L12 3.5Z" />
      </svg>
    );
  }

  if (type === "partner") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={common}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="9" r="2.5" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3.5 18C4 15.5 6 14 8 14C10 14 12 15.5 12.5 18" />
        <path d="M11.5 18C12 15.5 14 14 16 14C18 14 20 15.5 20.5 18" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={common}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 7.5H18.5V14.5H10.5L7 17.5V14.5H5.5V7.5Z" />
      <path d="M9 11H15" />
    </svg>
  );
}

function WhyChooseIcon({ type, className = "h-11 w-11 text-theme-green-dark" }) {
  const common = className;

  if (type === "security") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
        <rect x="9.3" y="10.8" width="5.4" height="4.5" rx="1" />
        <path d="M10.2 10.8V9.7C10.2 8.7 11 7.9 12 7.9C13 7.9 13.8 8.7 13.8 9.7V10.8" />
      </svg>
    );
  }

  if (type === "bank") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 9L12 4.5L20.5 9" />
        <path d="M5.5 9.5H18.5" />
        <path d="M7 9.5V16.5" />
        <path d="M12 9.5V16.5" />
        <path d="M17 9.5V16.5" />
        <path d="M4.5 19.5H19.5" />
      </svg>
    );
  }

  if (type === "transfer") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 8.5H16.5" />
        <path d="M13.5 5.5L16.5 8.5L13.5 11.5" />
        <path d="M19.5 15.5H7.5" />
        <path d="M10.5 12.5L7.5 15.5L10.5 18.5" />
        <rect x="4.5" y="5" width="15" height="14" rx="2" opacity="0.35" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 12H20.2" />
      <path d="M12 3.5C9.5 5.8 8 8.8 8 12C8 15.2 9.5 18.2 12 20.5" />
      <path d="M12 3.5C14.5 5.8 16 8.8 16 12C16 15.2 14.5 18.2 12 20.5" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-theme-blue-dark via-theme-blue-panel to-theme-green-dark">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-theme-green-action/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-theme-green-shaded/20 blur-3xl" />

      <NavigationGuest />

      <main>
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center pb-12 sm:min-h-[calc(100vh-5rem)] sm:pb-16">
          <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur">
                TRUSTED DIGITAL EXCHANGE PLATFORM
              </p>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4-5xl">
                Exchange Your Digital Currencies
                <span className="block text-theme-green-action">Seamlessly and Securely</span>
              </h1>

              <p className="mt-4 max-w-2xl text-md-lg text-white/80">
                Experience fast transactions, secure account handling, and a clean user journey designed for modern digital
                finance.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryButton>Get Started</PrimaryButton>
                <Link
                  href="/help"
                  className="rounded-[4px] border border-white/30 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xl font-semibold">82K+</p>
                  <p className="text-xs text-white/75">Members</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xl font-semibold">2.4M</p>
                  <p className="text-xs text-white/75">Deposits</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xl font-semibold">2.2M</p>
                  <p className="text-xs text-white/75">Withdrawals</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xl font-semibold">24/7</p>
                  <p className="text-xs text-white/75">Support</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-xl">
                <p className="text-sm text-white/70">Portfolio Overview</p>
                <p className="mt-1 text-2xl font-semibold">$128,940.62</p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl bg-theme-blue-darkshade/80 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">BTC Wallet</span>
                      <span className="text-sm text-theme-green-action">+4.2%</span>
                    </div>
                    <p className="mt-2 text-lg font-medium">1.8475 BTC</p>
                  </div>

                  <div className="rounded-xl bg-theme-blue-darkshade/80 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">USDT Wallet</span>
                      <span className="text-sm text-theme-green-action">+1.8%</span>
                    </div>
                    <p className="mt-2 text-lg font-medium">42,120 USDT</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-theme-green-action/40 bg-theme-green-action/10 p-4">
                  <p className="text-sm text-white/85">Fast payout processing enabled.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#F6F8FC] py-16 sm:py-20">
          <CurrencyWatermarks />
          <div className="pointer-events-none absolute -left-10 top-8 h-56 w-56 rounded-full bg-theme-green-shaded/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-theme-blue-darkshade/10 blur-3xl" />

          <div className="container-shell relative">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-theme-gray">Why iTrustLD</p>
            <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl">
              What&apos;s <span className="text-theme-green-action">Special</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-7 text-theme-gray">
              Built for reliability, rewards, and speed - the platform experience is designed around customer confidence.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {specialFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative flex min-h-[330px] flex-col overflow-hidden border border-theme-gray-border bg-white shadow-[0_14px_34px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-2 hover:border-theme-green-shaded hover:shadow-[0_24px_52px_rgba(15,23,42,0.18)]"
                >
                  <div className="pointer-events-none absolute inset-y-0 -left-24 w-16 rotate-12 bg-white/30 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />
                  <div className="h-20 bg-gradient-to-r from-theme-blue-darkshade via-theme-blue-panel to-theme-green-dark" />

                  <div className="flex flex-1 flex-col px-5 pb-6">
                    <div className="mx-auto -mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-theme-blue-dark text-white shadow-[0_10px_24px_rgba(37,34,62,0.35)] ring-4 ring-white transition duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-theme-blue-darkshade">
                      <FeatureIcon type={feature.icon} />
                    </div>

                    <h3 className="mt-5 text-center text-2-3lg font-semibold text-theme-blue-dark transition-colors duration-300 group-hover:text-theme-green-dark">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-center text-sm leading-7 text-theme-gray transition-colors duration-300 group-hover:text-theme-black">
                      {feature.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#EEF3FA] pt-16 pb-0 sm:pt-20 sm:pb-0">
          <CurrencyWatermarks />
          <div className="pointer-events-none absolute -left-10 top-6 h-56 w-56 rounded-full bg-theme-green-shaded/12 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-theme-blue-darkshade/10 blur-3xl" />

          <div className="container-shell relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-theme-gray">Core Strengths</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl">
                Why Choose <span className="text-theme-green-action">iTrustLD</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-md leading-7 text-theme-gray">
                A secure, high-speed exchange experience designed to keep user trust, operational reliability, and global reach
                at the center.
              </p>
            </div>

            <div className="relative left-1/2 mt-10 grid w-screen -translate-x-1/2 gap-0 sm:grid-cols-2 lg:grid-cols-4">
              {whyChooseItems.map((item, index) => (
                <article
                  key={item.title}
                  className={`group relative flex min-h-[250px] flex-col items-center justify-center border-r border-theme-gray-border px-6 py-10 text-center text-theme-blue-dark transition duration-300 hover:brightness-[1.02] ${
                    index % 4 === 0
                      ? "bg-[#EAF7F9]"
                      : index % 4 === 1
                        ? "bg-[#E4F3F6]"
                        : index % 4 === 2
                          ? "bg-[#DEEFF2]"
                          : "bg-[#D8ECF0]"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center border border-theme-green-dark/25 bg-white/80">
                    <WhyChooseIcon type={item.icon} className="h-6 w-6 text-theme-green-dark" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold uppercase tracking-wide text-theme-blue-dark">{item.title}</h3>
                  <p className="mt-4 max-w-[290px] text-sm leading-7 text-theme-blue-darkshade">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <LatestUpdatesSlider />
        <BuildProfileSection />
        <VideoTutorialsSection />
        <ReferEarnSection />
      </main>
      <FooterGuest />
    </div>
  );
}
