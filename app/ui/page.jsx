import Link from "next/link";

const routes = [
  { href: "/", label: "Home Placeholder" },
  { href: "/ui/styleguide", label: "Styleguide" },
  { href: "/ui/layouts/guest", label: "Guest Layout Demo" },
  { href: "/ui/layouts/auth", label: "Auth Layout Demo" },
  { href: "/ui/layouts/user", label: "User Layout Demo" }
];

export default function UiIndexPage() {
  return (
    <main className="min-h-screen bg-theme-gray-white py-16">
      <section className="container-shell rounded-xl border border-theme-gray-border bg-white p-8">
        <h1 className="text-3xl font-semibold text-theme-blue-dark">Day 1 Preview Routes</h1>
        <ul className="mt-6 space-y-3">
          {routes.map((route) => (
            <li key={route.href}>
              <Link href={route.href} className="text-theme-green-action underline underline-offset-4">
                {route.label} ({route.href})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
