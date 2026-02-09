"use client";

export default function Error(props: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 space-y-4">
          <div className="text-xl font-semibold text-[var(--foreground)]">Что‑то пошло не так</div>
          <div className="text-sm text-[#4B7488]">
            {props.error?.message ?? "Ошибка загрузки"}
          </div>
          <button
            onClick={props.reset}
            className="rounded-xl border border-[#F9B44D] bg-[#FF6634] px-4 py-2 text-sm font-medium text-white hover:bg-[#EC99A6]"
          >
            Повторить
          </button>
        </div>
      </div>
    </main>
  );
}
