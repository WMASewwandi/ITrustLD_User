import NavigationGuest from "@/components/partials/navigation-guest";
import PrimaryButton from "@/components/ui/primary-button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-theme-blue-dark via-theme-blue-panel to-theme-green-dark">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-theme-green-action/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-theme-green-shaded/20 blur-3xl" />

      <NavigationGuest />

      <main className="pt-16 sm:pt-0">
        <section className="flex min-h-[calc(100vh-4rem)] items-center sm:min-h-[calc(100vh-5rem)]">
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
      </main>
    </div>
  );
}
