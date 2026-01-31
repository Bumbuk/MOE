import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
          <div className="text-xl font-semibold">Страница не найдена</div>
          <div className="text-sm text-neutral-400">
            Такой страницы нет. Перейди в каталог.
          </div>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm hover:border-neutral-600"
          >
            В каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
