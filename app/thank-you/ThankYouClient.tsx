"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ThankYouClient() {
  const params = useSearchParams();

  const order = params.get("order") || params.get("session_id") || "";
  const email = params.get("email") || "";
  const name = params.get("name") || "";

  const downloadsHref = `/downloads?order=${encodeURIComponent(order)}&email=${encodeURIComponent(
    email
  )}&name=${encodeURIComponent(name)}`;

  // Secondary safety redirect (if inline script was blocked)
  useEffect(() => {
    // do not wait; hand off immediately
    window.location.replace(downloadsHref);
  }, [downloadsHref]);

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment complete 🎉</h1>
      <p className="text-gray-600 mb-8">
        Redirecting you to your downloads…
      </p>
      <Link
        href={downloadsHref}
        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go to downloads now
      </Link>
      <p className="mt-6 text-sm text-gray-500">
        Order: <span className="font-mono">{order || "—"}</span>
      </p>
    </main>
  );
}
