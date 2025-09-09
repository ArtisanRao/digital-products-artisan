// app/order-confirmation/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

type SearchParams = { session_id?: string };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session_id } = await searchParams;
  const hasSession = Boolean(session_id);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto text-center">
        {hasSession ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
            <p className="mt-2 text-gray-600">
              Thanks for your purchase! Your order is confirmed.
              <br />
              (Session ID: <span className="font-mono">{session_id}</span>)
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-600" />
            <h1 className="mt-4 text-2xl font-bold">We couldn’t verify your session</h1>
            <p className="mt-2 text-gray-600">
              No <code>session_id</code> was found in the URL. If you completed payment, your receipt
              should arrive via email shortly.
            </p>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
