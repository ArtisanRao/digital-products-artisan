// app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Digital Products Artisan",
  description: "Read our Privacy Policy to learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12 prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: November 2025</p>

      <p>
        At <strong>Digital Products Artisan</strong>, we respect your privacy. This Privacy Policy
        explains how we collect, use, and protect your information when you use our website and
        digital products.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect information such as your name, email address, and payment details when you
        make a purchase or contact us.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        Your information is used to process orders, improve our services, and communicate updates or
        offers.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:contact@digitalproductsartisan.com">contact@digitalproductsartisan.com</a>.
      </p>
    </main>
  );
}
