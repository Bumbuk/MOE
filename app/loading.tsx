export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="h-8 w-56 animate-pulse rounded-md bg-black/10" />

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-[320px] animate-pulse rounded-2xl bg-black/10 md:h-[360px]" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </div>
    </main>
  );
}
