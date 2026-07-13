export default function UserAuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-theme-blue-darkshade p-3 sm:p-4">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-theme-green-action/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-theme-green-shaded/25 blur-3xl" />
      <section className="flex w-full items-center justify-center">
        <div className="w-full max-w-[1120px]">{children}</div>
      </section>
    </div>
  );
}
