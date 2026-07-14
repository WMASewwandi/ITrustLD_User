import Link from "next/link";

const userLinks = ["Home", "Deposit", "Withdrawal", "Transactions", "Loyalty", "Help", "Profile"];

export default function NavigationUser() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-theme-blue-dark/95 backdrop-blur">
      <div className="container-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
        <Link href="/" className="inline-flex items-center text-white">
          <img src="/assets/img/logos/logo-itrustld-wide.png" alt="iTrustLD" className="h-10 w-auto" />
        </Link>

        <nav className="flex flex-wrap items-center gap-5">
          {userLinks.map((link) => (
            <Link
              key={link}
              href="/ui/layouts/user"
              className="rounded-full px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/10 hover:text-theme-green-action"
            >
              {link}
            </Link>
          ))}
        </nav>

        <div className="rounded-md border border-white/25 px-3 py-2 text-sm text-white">John Doe | Logout</div>
      </div>
    </header>
  );
}
