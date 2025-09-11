"use client";

import Link from "next/link";
import CurrencyPicker from "@/components/currency-picker";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold">Digital Products Artisan</Link>

        <nav className="flex items-center gap-4">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
        </nav>

        {/* 👇 Add the picker on the right */}
        <CurrencyPicker className="ml-auto" />
      </div>
    </header>
  );
}
