import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 space-y-4">
          <div className="text-xl font-semibold text-[var(--foreground)]">Страница не найдена</div>
          <div className="text-sm text-[#4B7488]">
            Такой страницы нет. Перейдите в каталог.
          </div>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-[#F9B44D] bg-[#FF6634] px-4 py-2 text-sm font-medium text-white hover:bg-[#EC99A6]"
          >
            В каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
