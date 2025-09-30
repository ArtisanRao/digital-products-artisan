// app/downloads/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

// Accept any to avoid PageProps constraint differences across Next versions.
export default async function DownloadsPage(props: any) {
  // In Next 15, `searchParams` may be an object or a Promise.
  const raw = props?.searchParams;
  const searchParams: Record<string, string | string[] | undefined> =
    typeof raw?.then === "function" ? await raw : raw ?? {};

  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v || "";
  };

  const order = get("order");
  const email = get("email");
  const name = get("name");

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Your downloads</h1>

      <p className="mt-2 text-gray-700">
        {name ? <>Hi <b>{name}</b> — </> : null}
        {order ? <>Order <b>{order}</b> is confirmed.</> : <>Thanks for your purchase!</>}
        {email ? <> We’ve also sent a receipt to <b>{email}</b>.</> : null}
      </p>

      <div className="mt-8 space-y-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Your product files</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {/* Replace with your real files or a signed /api/download route */}
            <li>
              <Link className="underline" href="/files/sample-product.zip">
                Download: sample-product.zip
              </Link>
            </li>
            <li>
              <Link className="underline" href="/files/bonus-checklist.pdf">
                Bonus: checklist.pdf
              </Link>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-600">
          Trouble downloading? Contact{" "}
          <Link className="underline" href="/support">
            support
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
