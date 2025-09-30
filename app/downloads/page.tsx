// app/downloads/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function readParam(sp: SearchParams | undefined, key: string) {
  const v = sp?.[key];
  return Array.isArray(v) ? v[0] : v || "";
}

/**
 * Optional query params you can pass from Stripe Success URL:
 *   ?order=pi_123&email=user@example.com&name=Moda
 * You can add more (e.g., product IDs) as needed.
 */
export default function DownloadsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const order = readParam(searchParams, "order");
  const email = readParam(searchParams, "email");
  const name = readParam(searchParams, "name");

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Your downloads</h1>

      <p className="mt-2 text-gray-700">
        {name ? <>Hi <b>{name}</b> — </> : null}
        {order ? (
          <>Order <b>{order}</b> is confirmed.</>
        ) : (
          <>Thanks for your purchase!</>
        )}
        {email ? <> We’ve also sent a receipt to <b>{email}</b>.</> : null}
      </p>

      {/* TODO: Replace this static block with real entitlements pulled from your DB
          (e.g., via supabase/prisma) keyed by order or session id.
          If you issue signed URLs, generate them server-side in an /api route. */}
      <div className="mt-8 space-y-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Your product files</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            {/* Examples — point these to real file URLs or an authenticated /api/download proxy */}
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
