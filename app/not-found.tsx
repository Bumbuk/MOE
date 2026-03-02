import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <section className="rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2E4C9A]">Страница не найдена</h1>
        <p className="mt-3 text-sm text-black/60">Похоже, такой страницы нет. Вернитесь в каталог.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-[#2E4C9A] px-4 text-sm font-medium text-white hover:bg-[#243f84]"
        >
          Перейти в каталог
        </Link>
      </section>
    </main>
  );
}
