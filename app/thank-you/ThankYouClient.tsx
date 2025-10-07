"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function ThankYouClient() {
  const params = useSearchParams();
  const router = useRouter();

  const order = params.get("order") || params.get("session_id") || "";
  const email = params.get("email") || "";
  const name = params.get("name") || "";

  const downloadsHref = `/downloads?order=${encodeURIComponent(order)}&email=${encodeURIComponent(
    email
  )}&name=${encodeURIComponent(name)}`;

  useEffect(() => {
    router.prefetch("/downloads");
    const t = setTimeout(() => {
      router.replace(downloadsHref);
    }, 300); // quick handoff
    return () => clearTimeout(t);
  }, [downloadsHref, router]);

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment complete 🎉</h1>
      <p className="text-gray-600 mb-8">
        We’re preparing your downloads… you’ll be redirected automatically.
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
