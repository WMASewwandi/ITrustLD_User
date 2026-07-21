export default function UserAuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B1020] text-white">
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-theme-green-action/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-theme-green-shaded/20 blur-3xl" />
      <div className="relative min-h-screen w-full">{children}</div>
    </div>
  );
}
