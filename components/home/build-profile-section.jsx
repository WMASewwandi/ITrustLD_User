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
  const common = "h-5 w-5 text-white";

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
        <path d="M12 13V16.5" />
        <path d="M10.3 15H13.7" />
      </svg>
    );
  }

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

export default function BuildProfileSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F9FC] to-white py-16 sm:py-20">
      <CurrencyWatermarks />
      <div className="pointer-events-none absolute -left-8 top-10 h-56 w-56 rounded-full bg-theme-green-shaded/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-8 h-64 w-64 rounded-full bg-theme-blue-darkshade/10 blur-3xl" />

      <div className="container-shell relative">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-theme-gray">Simple Onboarding</p>
        <h2 className="text-center text-3xl font-semibold text-theme-blue-dark sm:text-4xl">
          Build Your Profile With <span className="text-theme-green-action">Ease</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-7 text-theme-gray">
          A step-by-step onboarding flow built for speed, security, and a frictionless first-time experience.
        </p>

        <div className="mt-12 bg-transparent p-2 sm:p-4">
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 hidden h-[2px] bg-gradient-to-r from-theme-green-action via-theme-blue-darkshade to-theme-green-action lg:block" />
            <div className="grid gap-6 lg:grid-cols-4">
              {steps.map((step, idx) => (
                <article key={step.title} className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-blue-dark">
                    <StepIcon type={step.icon} />
                  </div>
                  <h3 className="mt-4 text-md-lg font-semibold text-theme-blue-dark">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-[250px] text-sm leading-7 text-theme-blue-darkshade">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
