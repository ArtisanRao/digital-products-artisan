import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen(false); // Auto collapse after click
  };

  return (
    <header className="border-b border-gray-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-new.png"
            alt="Digital Products Artisan"
            width={180}
            height={50}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-[38px]">
          <Link href="/products">Products</Link>
          <Link href="/bundles">Bundles</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-2 py-1"
          />
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
          <Link href="/cart">Cart</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col items-start px-4 py-2 space-y-2">
          <Link href="/products" onClick={handleMenuClick}>Products</Link>
          <Link href="/categories" onClick={handleMenuClick}>Categories</Link>
          <Link href="/about" onClick={handleMenuClick}>About</Link>
          <Link href="/support" onClick={handleMenuClick}>Support</Link>
        </nav>
      )}

      {/* Spacing between header and hero */}
      <div className="mt-[38px]"></div>
    </header>
  );
}
