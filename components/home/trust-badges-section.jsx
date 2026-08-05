import Link from "next/link";

const BADGES = [
  {
    src: "/assets/banner-trust-duns.png",
    alt: "D-U-N-S Registered — Dun & Bradstreet",
  },
  {
    src: "/assets/banner-trust-pilot.png",
    alt: "Review us on Trustpilot",
    href: "https://www.trustpilot.com/review/www.itrustld.com",
  },
  {
    src: "/assets/banner-trust-roc.png",
    alt: "Registrar of Companies for England and Wales",
  },
];

export default function TrustBadgesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
        style={{ backgroundImage: "url('/sec.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/60" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-center gap-x-16 gap-y-10 px-4 sm:gap-x-24 sm:gap-y-12 sm:px-6 lg:px-8">
        {BADGES.map((badge) => {
          const image = (
            <img
              src={badge.src}
              alt={badge.alt}
              className="h-28 w-auto object-contain sm:h-36 md:h-40"
            />
          );

          if (badge.href) {
            return (
              <Link
                key={badge.src}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex transition duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-green-action/50"
                aria-label={badge.alt}
              >
                {image}
              </Link>
            );
          }

          return (
            <div key={badge.src} className="inline-flex">
              {image}
            </div>
          );
        })}
      </div>
    </section>
  );
}
