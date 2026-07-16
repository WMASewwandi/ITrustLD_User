import Link from "next/link";

const NEWS = [
  {
    id: 1,
    author: "iTrustLD",
    initial: "i",
    date: "2025-06-12",
    title: "New deposit methods now available",
    excerpt: "We've expanded payment options so you can fund your account faster and more securely.",
    image: "/sec.png",
  },
  {
    id: 2,
    author: "Support",
    initial: "S",
    date: "2025-06-08",
    title: "Loyalty tiers update",
    excerpt: "Earn more Trust Points on every eligible transaction. Check your current tier in Loyalty.",
    image: "/why.png",
  },
  {
    id: 3,
    author: "Team",
    initial: "T",
    date: "2025-06-01",
    title: "Security tips for crypto transfers",
    excerpt: "Always verify wallet addresses and enable two-factor authentication on your profile.",
    image: "/video.png",
  },
];

export default function LatestNews() {
  return (
    <section className="border-t border-white/6 bg-[#0E1424]/70">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Latest <span className="text-theme-green-action">News</span>
          </h2>
          <p className="mt-2 text-sm text-white/50">Stay informed with our latest news updates</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {NEWS.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden bg-[#1a2238] bg-cover bg-center transition duration-500 group-hover:scale-[1.02]"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1424]/80 to-transparent" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25223E] text-xs font-bold text-white">
                      {item.initial}
                    </span>
                    <span className="text-sm font-medium text-white">{item.author}</span>
                  </div>
                  <time className="text-xs text-white/40">{item.date}</time>
                </div>
                <h3 className="text-base font-semibold text-white transition group-hover:text-theme-green-action">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="inline-flex text-sm font-medium text-theme-green-action transition hover:underline"
          >
            View all news
          </Link>
          <span className="text-white/20">·</span>
          <Link
            href="/dashboard/partner-pay?amount=150&currency=USD&partnerUserId=PARTNER-88421"
            className="inline-flex text-sm font-medium text-white/55 transition hover:text-theme-green-action"
          >
            Demo partner payment →
          </Link>
        </div>
      </div>
    </section>
  );
}
