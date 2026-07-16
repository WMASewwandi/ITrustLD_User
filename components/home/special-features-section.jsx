const specialFeatures = [
  {
    title: "Local Deposit",
    description:
      "We are pleased to inform our customers that we have added Local (Domestic) Bank Transfer as a new deposit option.",
    icon: "deposit",
    deco: "mesh",
    step: "01",
    color: "#0D9F1B",
    soft: "rgba(13,159,27,0.22)",
    glow: "rgba(13,159,27,0.45)"
  },
  {
    title: "Trust Points",
    description: "Earn Trust points to redeem for cash. Make connections and exchange money to be rewarded.",
    icon: "points",
    deco: "gift",
    step: "02",
    color: "#3B82F6",
    soft: "rgba(59,130,246,0.22)",
    glow: "rgba(59,130,246,0.45)"
  },
  {
    title: "Trust Partner",
    description:
      "Join iTrustLD partner programme. Monetize your traffic and earn trust point commissions when you share iTrustLD.",
    icon: "partner",
    deco: "handshake",
    step: "03",
    color: "#8B5CF6",
    soft: "rgba(139,92,246,0.22)",
    glow: "rgba(139,92,246,0.45)"
  },
  {
    title: "24/7 Chat Support",
    description: "Get 24/7 chat support with our friendly customer service agents at your service.",
    icon: "support",
    deco: "headset",
    step: "04",
    color: "#F59E0B",
    soft: "rgba(245,158,11,0.22)",
    glow: "rgba(245,158,11,0.45)"
  }
];

function FeatureIcon({ type }) {
  const common = "h-7 w-7 shrink-0 text-white";

  if (type === "deposit") {
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

  if (type === "points") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5L14.4 8.4L19.8 9.2L15.9 13L16.8 18.5L12 16L7.2 18.5L8.1 13L4.2 9.2L9.6 8.4L12 3.5Z" />
      </svg>
    );
  }

  if (type === "partner") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="9" r="2.5" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3.5 18C4 15.5 6 14 8 14C10 14 12 15.5 12.5 18" />
        <path d="M11.5 18C12 15.5 14 14 16 14C18 14 20 15.5 20.5 18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 7.5H18.5V14.5H10.5L7 17.5V14.5H5.5V7.5Z" />
      <path d="M9 11H15" />
    </svg>
  );
}

function DecoIcon({ type, color }) {
  const common = "h-16 w-16";

  if (type === "gift") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10H20V20H4V10Z" />
        <path d="M12 10V20" />
        <path d="M4 10H20V13H4V10Z" />
        <path d="M12 4C10.5 4 9.5 5.2 9.5 6.5C9.5 8 10.5 9.5 12 10C13.5 9.5 14.5 8 14.5 6.5C14.5 5.2 13.5 4 12 4Z" />
      </svg>
    );
  }

  if (type === "handshake") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L8 8L12 11L16 8L21 12" />
        <path d="M8 8V16" />
        <path d="M16 8V16" />
        <path d="M10 13L12 15L14 13" />
      </svg>
    );
  }

  if (type === "headset") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12V11C5 7.1 8.1 4 12 4C15.9 4 19 7.1 19 11V12" />
        <path d="M5 12H6.5C7.3 12 8 12.7 8 13.5V16.5C8 17.3 7.3 18 6.5 18H5V12Z" />
        <path d="M19 12H17.5C16.7 12 16 12.7 16 13.5V16.5C16 17.3 16.7 18 17.5 18H19V12Z" />
        <path d="M19 16.5V17.5C19 19.4 17.4 21 15.5 21H13" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 120 80" aria-hidden="true">
      {Array.from({ length: 48 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
        return <circle key={index} cx={10 + col * 14} cy={10 + row * 12} r="2" fill={color} opacity={0.35 - row * 0.04} />;
      })}
    </svg>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="special-glow absolute -left-16 top-8 h-[28rem] w-[28rem] rounded-full bg-theme-green-action/20 blur-[90px]" />
      <div className="special-glow special-glow-delay absolute -right-20 bottom-8 h-[26rem] w-[26rem] rounded-full bg-cyan-400/15 blur-[100px]" />
      <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full border border-theme-green-shaded/20" />
      <div className="absolute left-[10%] top-[22%] h-28 w-28 rounded-full border border-theme-green-shaded/15" />
      <div className="absolute bottom-[12%] right-[10%] h-44 w-44 rounded-full border border-[#3B82F6]/15" />
      <div className="absolute bottom-[16%] right-[12%] h-28 w-28 rounded-full border border-[#3B82F6]/10" />
      <div className="absolute right-[12%] top-[14%] grid grid-cols-6 gap-2 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-theme-blue-dark/40" />
        ))}
      </div>
    </div>
  );
}

function SpecialCard({ feature }) {
  return (
    <article
      className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.35rem] border border-white/5 bg-[#0A1120] p-6 transition duration-300 hover:-translate-y-2"
      style={{
        boxShadow: `0 18px 40px rgba(15,23,42,0.18), 0 0 0 1px ${feature.soft}, 0 20px 40px ${feature.soft}`
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full blur-3xl transition duration-500 group-hover:opacity-100"
        style={{ backgroundColor: feature.soft }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full blur-2xl opacity-70"
        style={{ backgroundColor: feature.soft }}
      />

      <span
        className="absolute right-4 top-4 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-[0.12em]"
        style={{ color: feature.color, backgroundColor: feature.soft }}
      >
        {feature.step}
      </span>

      <div className="relative mt-2 flex h-[84px] w-[84px] items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border opacity-35"
          style={{ borderColor: feature.color, boxShadow: `0 0 18px ${feature.soft}` }}
        />
        <span className="absolute inset-[8px] rounded-full border opacity-55" style={{ borderColor: feature.color }} />
        <span
          className="absolute inset-[16px] rounded-full border opacity-90"
          style={{ borderColor: feature.color, boxShadow: `0 0 16px ${feature.glow}` }}
        />
        <span className="relative">
          <FeatureIcon type={feature.icon} />
        </span>
      </div>

      <h3 className="relative mt-7 text-xl font-semibold text-white">{feature.title}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-7 text-white/65">{feature.description}</p>

      <div className="pointer-events-none absolute bottom-3 right-3 opacity-[0.18]">
        <DecoIcon type={feature.deco} color={feature.color} />
      </div>
    </article>
  );
}

export default function SpecialFeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] py-20 sm:py-24">
      <BackgroundDecor />

      <div className="container-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/30 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action shadow-sm">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5L13.2 8.2L18.8 7L15.3 11.2L20.5 14L14.5 14.3L12 20L9.5 14.3L3.5 14L8.7 11.2L5.2 7L10.8 8.2L12 2.5Z" />
            </svg>
            Why iTrustLD
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-theme-blue-dark sm:text-4xl lg:text-5-6xl">
            What&apos;s <span className="text-theme-green-action">Special</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-md leading-7 text-theme-gray sm:text-md-lg sm:leading-8">
            Built for reliability, rewards, and speed — the platform experience is designed around customer confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {specialFeatures.map((feature) => (
            <SpecialCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
