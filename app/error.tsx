"use client";

export default function Error(props: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <section className="rounded-2xl border border-black/10 bg-white p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2E4C9A]">Ошибка загрузки</h1>
        <p className="mt-3 text-sm text-black/60">{props.error?.message ?? "Попробуйте снова."}</p>
        <button
          type="button"
          onClick={props.reset}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-[#2E4C9A] px-4 text-sm font-medium text-white hover:bg-[#243f84]"
        >
          Повторить
        </button>
      </section>
    </main>
  );
}
