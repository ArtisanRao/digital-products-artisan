import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

// Allow static generation for speed (no `dynamic = "force-dynamic"`)

export default function ThankYouPage() {
  // Inline script performs a zero-delay redirect BEFORE hydration
  const inline = `
    (function(){
      try {
        var p=new URLSearchParams(location.search);
        var order=p.get("order")||p.get("session_id")||"";
        var email=p.get("email")||"";
        var name=p.get("name")||"";
        var u="/downloads?order="+encodeURIComponent(order)+"&email="+encodeURIComponent(email)+"&name="+encodeURIComponent(name);
        location.replace(u);
      } catch(e) {}
    })();
  `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: inline }} />
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
    </>
  );
}
