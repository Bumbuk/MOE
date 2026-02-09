export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="h-8 w-52 rounded-xl bg-[#FDE9D4]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-3">
              <div className="aspect-square w-full rounded-xl bg-[#FDE9D4]" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 rounded bg-[#FDE9D4]" />
                <div className="h-4 w-1/2 rounded bg-[#FDE9D4]" />
                <div className="h-9 w-full rounded-xl bg-[#FDE9D4]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
