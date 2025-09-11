"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart, type CartState } from "@/lib/cart-store"

export function SiteHeader() {
  const count = useCart((s: CartState) => s.count())

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* ... your left nav ... */}

        <Link href="/cart" className="relative inline-flex items-center">
          <ShoppingCart className="h-6 w-6" />
          <span
            className={[
              "absolute -right-2 -top-2 min-w-[1.25rem] h-5 px-1",
              "rounded-full bg-blue-600 text-white text-xs font-semibold",
              "flex items-center justify-center",
              count === 0 ? "hidden" : "",
            ].join(" ")}
            aria-label={`${count} items in cart`}
          >
            {count > 99 ? "99+" : count}
          </span>
          <span className="sr-only">Cart</span>
        </Link>
      </div>
    </header>
  )
}
