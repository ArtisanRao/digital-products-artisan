import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export const dynamic = "force-dynamic";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">Finishing up…</h1>
          <p className="text-gray-600 mt-2">Preparing your downloads.</p>
        </main>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
