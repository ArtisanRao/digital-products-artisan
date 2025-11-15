import Link from "next/link";

export const runtime = "nodejs";

export const metadata = {
  title: "Download Instructions | Digital Products Artisan",
  description:
    "Help page for accessing and downloading your digital products from Digital Products Artisan.",
};

export default function DownloadsHelpPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">How to Access Your Downloads</h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Here&apos;s how to access and safely store your
        digital products from <strong>Digital Products Artisan</strong>.
      </p>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">1. After Checkout</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            After a successful payment, you&apos;re redirected to a confirmation or
            download page.
          </li>
          <li>
            You&apos;ll also receive an email with your order details and access link (check
            your spam folder if you don&apos;t see it).
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">2. Downloading Your Files</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Click the download button or link for your product toolkit.</li>
          <li>
            Most products are delivered as <strong>.zip</strong> files containing PDFs,
            templates, worksheets and other resources.
          </li>
          <li>
            Save the file to a safe folder on your device (for example:
            <code className="px-1">Documents/DigitalProductsArtisan</code>).
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">3. Opening ZIP Files</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            On Windows and macOS you can usually open <strong>.zip</strong> files by
            double-clicking them.
          </li>
          <li>Extract the contents into a folder before opening the PDFs or documents.</li>
          <li>
            If your phone or tablet doesn&apos;t open ZIP files, try downloading on a laptop
            or use a free unzip app.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">4. Backups & Lifetime Access</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            We recommend creating a backup on cloud storage (e.g. Google Drive, Dropbox) so
            you never lose your files.
          </li>
          <li>
            Your license is for personal / business use according to the license included
            in each product folder.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold">5. Need Help?</h2>
        <p className="text-gray-700">
          If you have any problems accessing or opening your files, just reply to your
          order email or contact support with your order details. I&apos;m happy to help.
        </p>
      </section>

      <div className="border-t pt-6 flex flex-wrap gap-4 text-sm text-gray-600">
        <Link href="/products" className="underline underline-offset-4">
          ← Back to all products
        </Link>
      </div>
    </main>
  );
}
