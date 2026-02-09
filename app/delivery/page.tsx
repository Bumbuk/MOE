export const runtime = "nodejs";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Доставка</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 space-y-2">
            <div className="font-semibold text-[var(--foreground)]">Сроки</div>
            <div className="text-sm text-[#4B7488]">Отправка 1–2 рабочих дня.</div>
          </div>

          <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 space-y-2">
            <div className="font-semibold text-[var(--foreground)]">Способы</div>
            <div className="text-sm text-[#4B7488]">Курьер / ПВЗ / Почта (по региону).</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 text-sm text-[#4B7488]">
          Точную стоимость и сроки по регионам подключим в следующем шаге (после теста).
        </div>
      </div>
    </main>
  );
}
