// app/downloads/page.tsx
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DownloadsPage() {
  const { userId } = auth();
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="mb-4">Please log in to view your downloads.</p>
        <Link className="text-blue-600 underline" href="/login">Log in</Link>
      </div>
    );
  }

  // TODO: List the user’s entitlements (query Stripe or your DB)
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Your Downloads</h1>
      {/* render secure download links here */}
    </div>
  );
}
