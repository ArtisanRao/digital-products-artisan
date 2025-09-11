// components/site-header.tsx
import Link from "next/link";
import CurrencyPicker from "@/components/currency-picker";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="font-semibold">Digital Products Artisan</Link>

        <nav className="flex items-center gap-6">
          <Link href="/products">Products</Link>
          <Link href="/bundles">Bundles</Link>
          <Link href="/cart">Cart</Link>
        </nav>

        {/* 👇 This makes the currency sticky across pages via localStorage */}
        <CurrencyPicker />
      </div>
    </header>
  );
}
