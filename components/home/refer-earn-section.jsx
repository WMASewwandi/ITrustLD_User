import Link from "next/link";

function RedCurrencyWatermarks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="wm-float-a absolute left-[7%] top-[12%] text-6xl font-semibold text-theme-red-action/15">$</span>
      <span className="wm-float-b absolute right-[8%] top-[14%] text-7xl font-semibold text-theme-red-action/15">₿</span>
      <span className="wm-float-c absolute left-[16%] bottom-[16%] text-6xl font-semibold text-theme-red-action/15">€</span>
      <span className="wm-float-a absolute right-[22%] bottom-[12%] text-6xl font-semibold text-theme-red-action/15">¥</span>
      <span className="wm-float-b absolute left-[46%] top-[40%] text-5xl font-semibold text-theme-red-action/12">₹</span>
      <span className="wm-float-c absolute right-[40%] top-[18%] text-4xl font-semibold text-theme-red-action/15">£</span>
    </div>
  );
}

const benefits = [
  {
    step: "01",
    title: "Invite Friends",
    text: "Share your unique referral link",
    icon: "invite"
  },
  {
    step: "02",
    title: "Earn Points",
    text: "Get rewarded for every signup",
    icon: "points"
  },
  {
    step: "03",
    title: "Redeem Rewards",
    text: "Convert points into benefits",
    icon: "reward"
  }
];

function FlowIcon({ type }) {
  const common = "h-5 w-5";

  if (type === "invite") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 18C4.2 15.5 6.4 14 9 14C11.6 14 13.8 15.5 14.5 18" />
        <path d="M17 8H21" />
        <path d="M19 6V10" />
      </svg>
    );
  }

  if (type === "points") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5L14.4 8.4L19.8 9.2L15.9 13L16.8 18.5L12 16L7.2 18.5L8.1 13L4.2 9.2L9.6 8.4L12 3.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M8 7V5.8C8 4.8 8.8 4 9.8 4H14.2C15.2 4 16 4.8 16 5.8V7" />
      <path d="M12 11.5V14.5" />
    </svg>
  );
}

export default function ReferEarnSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: "url('/sec.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/50" aria-hidden="true" />
      <RedCurrencyWatermarks />
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#E6EBF2] bg-white/80 px-6 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-theme-blue-dark via-theme-red-action to-theme-green-action" />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/25 bg-[#EAF8EC] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action shadow-sm">
              Referral Program
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl lg:text-5-6xl">
              Refer and <span className="text-theme-green-action">Earn</span>
            </h2>
            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-theme-blue-dark" />

            <p className="mx-auto mt-5 max-w-2xl text-md leading-7 text-theme-gray sm:text-md-lg sm:leading-8">
              Join our referral program and start earning points by inviting friends to join our platform. Each referral brings
              you closer to exciting rewards. Spread the word and reap the benefits of our Refer &amp; Earn program today.
            </p>

            <div className="relative mx-auto mt-10 max-w-4xl">
              <div
                className="pointer-events-none absolute left-[16%] right-[16%] top-[34px] hidden h-[3px] rounded-full bg-theme-blue-dark sm:block"
                aria-hidden="true"
              />
              <div className="grid gap-6 sm:grid-cols-3 sm:gap-4">
                {benefits.map((item, index) => (
                  <div key={item.title} className="group relative flex flex-col items-center text-center">
                    {index < benefits.length - 1 ? (
                      <span
                        className="pointer-events-none absolute right-[-10%] top-[30px] z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-theme-blue-dark/20 bg-white text-theme-blue-dark sm:inline-flex"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12H19" />
                          <path d="M13 6L19 12L13 18" />
                        </svg>
                      </span>
                    ) : null}

                    <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-theme-red-action text-white ring-[6px] ring-white transition duration-300 group-hover:-translate-y-1">
                      <FlowIcon type={item.icon} />
                    </div>

                    <span className="mt-3 text-[11px] font-semibold tracking-[0.16em] text-theme-blue-dark/45">{item.step}</span>
                    <p className="mt-2 text-base font-semibold text-theme-blue-dark">{item.title}</p>
                    <p className="mt-1 max-w-[180px] text-xs leading-5 text-theme-gray">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[4px] bg-theme-green-action px-12 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Start Now
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12H19" />
                  <path d="M13 6L19 12L13 18" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
