export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-white/10" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-white/5" />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div
            key={key}
            className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]"
          />
        ))}
      </div>
      <div className="mt-4 h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
    </div>
  );
}
