// app/terms-of-service/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Digital Products Artisan",
  description:
    "Terms of Service for Digital Products Artisan. Please read these terms before purchasing our digital downloads.",
  alternates: { canonical: "/terms-of-service" },
  robots: { index: true, follow: true },
};

export default function TermsOfServicePage() {
  return (
    <main className="container mx-auto px-4 py-10 prose prose-gray max-w-3xl">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">Home</Link> <span>›</span>{" "}
        <span aria-current="page">Terms of Service</span>
      </nav>

      <h1>Terms of Service</h1>
      <p><em>Last updated: {new Date().toISOString().slice(0,10)}</em></p>

      <h2>1. About our products</h2>
      <p>
        We sell digital downloads (no physical shipping). After purchase you’ll
        receive access to your files immediately.
      </p>

      <h2>2. Licensing & permitted use</h2>
      <p>
        Unless stated otherwise, purchases are for personal or business use by a
        single buyer. Resale or redistribution of the original files is not
        permitted.
      </p>

      <h2>3. Refunds</h2>
      <p>
        Due to the nature of digital goods, all sales are final and non-refundable,
        except where required by law. If you have an issue, please{" "}
        <Link href="/contact" className="underline">contact us</Link>.
      </p>

      <h2>4. Support</h2>
      <p>
        If you encounter problems with a file, reach out and we’ll help resolve
        it as quickly as possible.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions? Email us via the form at{" "}
        <Link href="/contact" className="underline">/contact</Link>.
      </p>
    </main>
  );
}
