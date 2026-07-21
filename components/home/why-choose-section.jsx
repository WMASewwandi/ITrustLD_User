const whyChooseItems = [
  {
    title: "Security and Reliability",
    description:
      "With a focus on user protection, iTrustLD employs stringent security measures and technological advancements to set industry standards.",
    icon: "security",
    step: "01",
    color: "#0D9F1B",
    soft: "rgba(13,159,27,0.18)"
  },
  {
    title: "Local Bank Transfer",
    description:
      "iTrustLD offers customers the ability to fill their trading accounts through local banks in their home country, using their local currency.",
    icon: "bank",
    step: "02",
    color: "#22D3EE",
    soft: "rgba(34,211,238,0.18)"
  },
  {
    title: "Fast Transaction Processing",
    description:
      "iTrustLD ensures efficiency in transaction processing. Users can experience rapid fund transfers, enabling them to seize trading opportunities without delay.",
    icon: "transfer",
    step: "03",
    color: "#A855F7",
    soft: "rgba(168,85,247,0.18)"
  },
  {
    title: "Global Coverage",
    description:
      "With transactions supported in over 60 nations, iTrustLD provides extensive coverage, enabling users from various regions to access their services seamlessly.",
    icon: "globe",
    step: "04",
    color: "#F97316",
    soft: "rgba(249,115,22,0.18)"
  }
];

function WhyChooseIcon({ type }) {
  const common = "h-7 w-7 shrink-0";

  if (type === "security") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
        <path d="M9.5 12.1L11.2 13.8L14.8 10.1" />
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
        <path d="M13 3L20 12L13 21" />
        <path d="M4 12H19" />
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

function WhyCard({ item }) {
  return (
    <article
      className="why-cut-card group relative min-h-[210px] overflow-hidden bg-[#0B1220]/55 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-7"
      style={{
        borderColor: item.color,
        boxShadow: `0 0 0 1px ${item.soft}`
      }}
    >
      <span
        className="absolute right-0 top-0 z-20 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#070B16]"
        style={{ backgroundColor: item.color }}
      >
        {item.step}
      </span>

      <span
        className="pointer-events-none absolute bottom-2 right-3 select-none text-7xl font-bold leading-none opacity-[0.08] sm:text-8xl"
        style={{ color: item.color }}
        aria-hidden="true"
      >
        {item.step}
      </span>

      <div className="relative z-10 flex h-full items-center gap-5 sm:gap-6">
        <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center sm:h-[96px] sm:w-[96px]">
          <span
            className="absolute inset-0 rounded-full border opacity-40"
            style={{ borderColor: item.color }}
          />
          <span
            className="absolute inset-[8px] rounded-full border opacity-55"
            style={{ borderColor: item.color }}
          />
          <span
            className="absolute inset-[16px] rounded-full border opacity-80"
            style={{ borderColor: item.color }}
          />
          <span className="relative" style={{ color: item.color }}>
            <WhyChooseIcon type={item.icon} />
          </span>
        </div>

        <div className="min-w-0 flex-1 pr-8">
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{item.title}</h3>
          <div className="mt-3 h-[2px] w-12 rounded-full" style={{ backgroundColor: item.color }} />
          <p className="mt-4 text-sm leading-7 text-white/65 sm:text-md sm:leading-8">{item.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-[#070B16] py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/why.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#070B16]/50" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-theme-green-action/40 bg-theme-green-action/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-green-action">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3.5L19 6.2V11.7C19 16.1 16.1 20 12 21.5C7.9 20 5 16.1 5 11.7V6.2L12 3.5Z" />
              <path d="M9.5 12.1L11.2 13.8L14.8 10.1" />
            </svg>
            Core Strengths
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5-6xl">
            Why Choose <span className="text-theme-green-action">iTrustLD</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-md leading-7 text-white/60 sm:text-md-lg sm:leading-8">
            A secure, high-speed exchange experience designed to keep user trust, operational reliability, and global reach at
            the center.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:gap-6 lg:grid-cols-2">
          {whyChooseItems.map((item) => (
            <WhyCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
