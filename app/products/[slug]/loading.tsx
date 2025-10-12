export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid gap-6 md:grid-cols-[120px_1fr_360px]">
        <div className="hidden md:block">
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="h-72 w-full bg-gray-200 rounded animate-pulse" />
        </div>
        <aside className="rounded-xl border p-4">
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
        </aside>
      </div>
    </main>
  );
}
