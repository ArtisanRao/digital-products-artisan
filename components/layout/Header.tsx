// components/layout/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="w-full bg-white/90 backdrop-blur border-b"
      style={{ position: "sticky", top: 0, zIndex: 100 }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          prefetch={false}
          aria-label="Go to homepage"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Digital Products Artisan"
            width={32}
            height={32}
            className="block h-8 w-8 object-contain"
          />
          <span className="text-base font-semibold">Digital Products Artisan</span>
        </Link>

        {/* Main Nav (clickable-surface prevents overlay blocks) */}
        <nav
          className="hidden md:flex items-center gap-4 clickable-surface"
          style={{ pointerEvents: "auto", isolation: "isolate" }}
          aria-label="Main navigation"
        >
          <Link
            href="/categories"
            prefetch={false}
            className="nav-link pe-auto"
            style={{ pointerEvents: "auto", position: "relative", zIndex: 1000 }}
          >
            Categories
          </Link>

          <Link
            href="/products"
            prefetch={false}
            className="nav-link"
            style={{ pointerEvents: "auto" }}
          >
            Products
          </Link>

          <Link
            href="/about"
            prefetch={false}
            className="nav-link"
            style={{ pointerEvents: "auto" }}
          >
            About
          </Link>

          <Link
            href="/contact"
            prefetch={false}
            className="nav-link"
            style={{ pointerEvents: "auto" }}
          >
            Contact
          </Link>
        </nav>

        {/* Simple mobile links (kept server-safe; no JS menu) */}
        <nav
          className="md:hidden flex items-center gap-3 clickable-surface"
          style={{ pointerEvents: "auto", isolation: "isolate" }}
          aria-label="Mobile navigation"
        >
          <Link
            href="/categories"
            prefetch={false}
            className="mobile-link"
            style={{ pointerEvents: "auto", position: "relative", zIndex: 1000 }}
          >
            Categories
          </Link>
          <Link href="/products" prefetch={false} className="mobile-link">
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}
