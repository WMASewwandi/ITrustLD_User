const updates = {
  leftTop: {
    title: "Top Tips to Stay Motivated and Avoid Burnout While Working Remotely",
    meta: "LIFESTYLE • 9 months ago",
    bg: "from-[#16374a] via-[#34586b] to-[#5f8091]"
  },
  leftBottom: {
    title: "Workspace Setup Ideas for Better Productivity",
    meta: "PRODUCTIVITY • 8 months ago",
    bg: "from-[#3b4658] via-[#5f6d84] to-[#8f9cb0]"
  },
  center: {
    title: "Smartphone Hacks Everyone Needs to Know to Extend Battery Life",
    meta: "CULTURAL • 9 months ago",
    bg: "from-[#423d1b] via-[#657638] to-[#8fa84b]"
  },
  rightTop: {
    title: "Global Markets Rebound as Inflation Worries Ease for Investors",
    meta: "TRAVEL • 9 months ago",
    bg: "from-[#4b545f] via-[#6e7d8f] to-[#95a8be]"
  },
  rightBottom: {
    title: "How Time in Nature Boosts Mental Health and Reduces Stress",
    meta: "LIFESTYLE • 9 months ago",
    bg: "from-[#2b303a] via-[#515c6a] to-[#6f7d90]"
  }
};

function ImageTile({ item, className = "", overlay = false, compact = false }) {
  return (
    <article className={`relative overflow-hidden border border-theme-gray-border bg-black ${className}`}>
      <div className={`h-full w-full bg-gradient-to-br ${item.bg}`} />
      {overlay ? (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{item.meta}</p>
          <h3 className={`${compact ? "mt-2 text-2-3lg" : "mt-3 text-4xl"} font-semibold leading-tight`}>{item.title}</h3>
        </div>
      ) : null}
    </article>
  );
}

function TextTile({ item }) {
  return (
    <article className="border border-theme-gray-border bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-theme-gray">{item.meta}</p>
      <h3 className="mt-3 text-3xl font-semibold leading-tight text-theme-blue-dark">{item.title}</h3>
    </article>
  );
}

export default function LatestUpdatesSlider() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-shell">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-theme-gray">Latest News</p>
        <h2 className="mt-3 text-center text-3xl font-semibold text-theme-blue-dark sm:text-4xl">
          Latest <span className="text-theme-green-action">Updates</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-md leading-7 text-theme-gray">
          Stay informed with our latest updates, promotions, and important announcements.
        </p>

        <div className="relative left-1/2 mt-10 grid w-screen -translate-x-1/2 gap-6 px-6 xl:grid-cols-[1.05fr_2fr_1.05fr] xl:px-8">
          <div className="grid gap-6">
            <ImageTile item={updates.leftTop} className="min-h-[200px]" />
            <TextTile item={updates.leftTop} />
            <ImageTile item={updates.leftBottom} className="min-h-[200px]" />
          </div>

          <ImageTile item={updates.center} className="min-h-[640px]" overlay />

          <div className="grid gap-6">
            <ImageTile item={updates.rightTop} className="min-h-[308px]" overlay compact />
            <ImageTile item={updates.rightBottom} className="min-h-[308px]" overlay compact />
          </div>
        </div>
      </div>
    </section>
  );
}
