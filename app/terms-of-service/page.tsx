// app/terms-of-service/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service | Digital Products Artisan",
  description:
    "Terms for purchasing digital downloads, PLR/MRR licensing rules, EU right of withdrawal disclosure, VAT, payments, and support.",
  alternates: { canonical: "https://digitalproductsartisan.com/terms-of-service" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | Digital Products Artisan",
    description:
      "Digital downloads, PLR/MRR licensing, EU right of withdrawal, VAT, payments, and support.",
    url: "https://digitalproductsartisan.com/terms-of-service",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Digital Products Artisan",
    description:
      "Digital downloads, PLR/MRR licensing, EU right of withdrawal, VAT, payments, and support.",
  },
};

const LAST_UPDATED = new Date().toISOString().slice(0, 10);

export default function TermsOfServicePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service",
    url: "https://digitalproductsartisan.com/terms-of-service",
    dateModified: LAST_UPDATED,
    mainEntity: {
      "@type": "CreativeWork",
      name: "Terms of Service",
      creator: { "@type": "Organization", name: "Digital Products Artisan" },
      about: [
        "Digital content terms",
        "PLR and MRR licensing",
        "Refunds",
        "EU right of withdrawal",
        "VAT and taxes",
      ],
    },
  };

  return (
    <main className="container mx-auto px-4 py-10 prose prose-neutral dark:prose-invert max-w-3xl">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-1">›</span>
        <span aria-current="page">Terms of Service</span>
      </nav>

      <h1>Terms of Service</h1>
      <p>
        <em>Last updated: {LAST_UPDATED}</em>
      </p>

      {/* In-page Table of Contents */}
      <nav aria-label="Table of contents" className="not-prose mb-6 text-sm">
        <ul className="list-disc pl-6 grid gap-1">
          <li><a href="#about" className="hover:underline">About Our Products</a></li>
          <li><a href="#licensing" className="hover:underline">Licensing &amp; Permitted Use</a></li>
          <li><a href="#delivery" className="hover:underline">Delivery &amp; Access</a></li>
          <li><a href="#refunds" className="hover:underline">Refunds &amp; EU Withdrawal</a></li>
          <li><a href="#payments" className="hover:underline">Payments</a></li>
          <li><a href="#tax" className="hover:underline">Taxes &amp; VAT</a></li>
          <li><a href="#prohibited" className="hover:underline">Prohibited Uses</a></li>
          <li><a href="#ip" className="hover:underline">Intellectual Property</a></li>
          <li><a href="#dmca" className="hover:underline">Copyright Concerns</a></li>
          <li><a href="#liability" className="hover:underline">Warranties &amp; Liability</a></li>
          <li><a href="#law" className="hover:underline">Governing Law</a></li>
          <li><a href="#changes" className="hover:underline">Changes to These Terms</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </nav>

      <h2 id="about">1. About Our Products</h2>
      <p>
        We sell <strong>digital products</strong> delivered electronically (no physical shipping).
        After successful payment, download links are provided on-screen and/or by email.
      </p>

      <h2 id="licensing">2. Licensing &amp; Permitted Use</h2>
      <p>
        Your license depends on the product’s listing and the license file included in the download.
      </p>
      <ul>
        <li>
          <strong>Standard Personal/Business Use:</strong> Use in your own projects or business.
          You may not resell, redistribute, share, or upload the original source files.
        </li>
        <li>
          <strong>PLR (Private Label Rights):</strong> When explicitly included, you may edit,
          rebrand, and sell the product as your own subject to the limits in the included license
          (e.g., allowed formats, attribution, resale platforms). Do not misrepresent third-party
          trademarks/assets as your own.
        </li>
        <li>
          <strong>MRR (Master Resell Rights):</strong> When explicitly included, you may resell the
          product and pass resell rights to your customers if the license permits.
        </li>
      </ul>
      <p>
        If a product does <em>not</em> explicitly include PLR/MRR, it is licensed as Standard
        Personal/Business Use. In case of conflict, the license file in the download governs.
      </p>

      <h2 id="delivery">3. Delivery &amp; Access</h2>
      <ul>
        <li>Files are available immediately after payment.</li>
        <li>
          If a link expires or a file is corrupted,{" "}
          <Link href="/contact" className="underline">contact us</Link> for a fresh link.
        </li>
      </ul>

      <h2 id="refunds">4. Refunds</h2>
      <p>
        Because digital content is irrevocably delivered, <strong>all sales are final</strong> except
        where required by law. We’ll repair/replace defective files reported within 14 days.
      </p>

      <h3 id="eu-withdrawal">4.1 EU Right of Withdrawal (Digital Content)</h3>
      <p>
        EU consumers normally have a 14-day right of withdrawal. For digital content not supplied on
        a tangible medium, this right ends once delivery begins with your <em>express consent</em>
        and acknowledgement that you lose the right of withdrawal. By accessing or downloading the
        files immediately after purchase, you agree to this early delivery and waive the withdrawal
        right for that order.
      </p>

      <h2 id="payments">5. Payments</h2>
      <ul>
        <li>Payments are processed via trusted providers (e.g., Stripe and/or PayPal).</li>
        <li>Your bank/payment provider may apply currency conversion fees.</li>
        <li>Fraud/chargebacks for validly delivered content may result in license revocation.</li>
      </ul>

      <h2 id="tax">6. Taxes &amp; VAT</h2>
      <p>
        Where applicable, VAT/sales tax is calculated at checkout based on your location and
        prevailing regulations (including EU VAT rules). Invoices/receipts reflect any tax collected.
      </p>

      <h2 id="prohibited">7. Prohibited Uses</h2>
      <ul>
        <li>Re-uploading, sharing, or reselling source files unless explicitly granted under PLR/MRR.</li>
        <li>Any unlawful, defamatory, or infringing use.</li>
        <li>Implying endorsement by Digital Products Artisan without written permission.</li>
      </ul>

      <h2 id="ip">8. Intellectual Property</h2>
      <p>
        Unless transferred under a PLR/MRR license, all intellectual property remains with Digital
        Products Artisan or licensors. Third-party trademarks and assets remain the property of their
        respective owners.
      </p>

      <h2 id="dmca">9. Copyright Concerns (DMCA/Notice)</h2>
      <p>
        If you believe content infringes your rights, please provide notice including your contact
        details, identification of the work claimed to be infringed, the location (URL) of the
        material, and a good-faith statement. We will review promptly.
      </p>

      <h2 id="liability">10. Warranties &amp; Liability</h2>
      <p>
        Products are provided “as is” without warranties beyond those required by law. To the maximum
        extent permitted, we are not liable for indirect or consequential damages arising from use of
        our products.
      </p>

      <h2 id="law">11. Governing Law</h2>
      <p>
        These terms are governed by the laws of Germany. If you are an EU consumer, mandatory
        consumer protection rules of your country of residence also apply.
      </p>

      <h2 id="changes">12. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. The “Last updated” date above indicates the
        latest version.
      </p>

      <h2 id="contact">13. Contact</h2>
      <p>
        Need help?{" "}
        <Link href="/contact" className="underline">
          Contact us
        </Link>
        . We aim to respond within 1–2 business days.
      </p>

      <hr />
      <p className="text-sm">
        <strong>Checkout notice:</strong> “By completing this purchase, you request immediate delivery
        of digital content and acknowledge that your 14-day right of withdrawal ends once the download
        or access begins.”
      </p>
    </main>
  );
}
