import CurrencyWatermarks from "@/components/ui/currency-watermarks";

const steps = [
  {
    title: "Create Account",
    description: "Create your iTrustLD account by using your basic details.",
    icon: "account"
  },
  {
    title: "Verify Identity",
    description: "Complete the identity verification process to secure your account and transactions.",
    icon: "verify"
  },
  {
    title: "Choose Deposit Method",
    description: "Select from a wide range of options when depositing money to your iTrustLD account.",
    icon: "deposit"
  },
  {
    title: "Start Exchanging",
    description: "Top up your wallet and begin secure digital exchange with confidence.",
    icon: "exchange"
  }
];

function StepIcon({ type }) {
  const common = "h-6 w-6 text-white";

  if (type === "account") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 18C6.2 15.3 8.8 13.8 12 13.8C15.2 13.8 17.8 15.3 18.5 18" />
      </svg>
    );
  }

  if (type === "verify") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
        <path d="M9 12L11 14L15 10" />
      </svg>
    );
  }

  if (type === "deposit") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path d="M3.5 10.5H20.5" />
        <circle cx="8" cy="14.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 8.5H16.5" />
      <path d="M13.5 5.5L16.5 8.5L13.5 11.5" />
      <path d="M19.5 15.5H7.5" />
      <path d="M10.5 12.5L7.5 15.5L10.5 18.5" />
    </svg>
  );
}

export default function BuildProfileSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/sec.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/45" aria-hidden="true" />
      <CurrencyWatermarks />
      <div className="pointer-events-none absolute -left-16 top-8 h-[26rem] w-[26rem] rounded-full bg-theme-green-action/15 blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#4F7CFF]/12 blur-[110px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/25 bg-[#EAF8EC] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action shadow-sm">
            Simple Onboarding
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl lg:text-5-6xl">
            Build Your Profile With <span className="text-theme-green-action">Ease</span>
          </h2>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-theme-blue-dark shadow-[0_0_14px_rgba(37,34,62,0.45)]" />
          <p className="mx-auto mt-5 max-w-2xl text-md leading-7 text-theme-gray sm:text-md-lg sm:leading-8">
            A step-by-step onboarding flow built for speed, security, and a frictionless first-time experience.
          </p>
        </div>

        <div className="relative mt-14 sm:mt-16">
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-[34px] hidden h-[3px] rounded-full bg-theme-blue-dark lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-[34px] hidden h-[3px] rounded-full bg-theme-blue-dark/35 blur-[6px] lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <article key={step.title} className="group relative flex flex-col items-center text-center">
                {index < steps.length - 1 ? (
                  <div
                    className="pointer-events-none absolute left-[calc(50%+2rem)] top-[34px] hidden h-[3px] w-[calc(100%-4rem)] bg-theme-blue-dark sm:block lg:hidden"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-theme-red-action shadow-[0_0_18px_rgba(255,0,0,0.35),0_12px_28px_rgba(255,0,0,0.22)] ring-[6px] ring-white transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_24px_rgba(255,0,0,0.45),0_16px_34px_rgba(255,0,0,0.28)] group-hover:ring-theme-red-action/15">
                  <StepIcon type={step.icon} />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-theme-blue-dark sm:text-xl">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-[260px] text-sm leading-7 text-theme-gray">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
