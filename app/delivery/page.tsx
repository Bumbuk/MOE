export const runtime = "nodejs";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Доставка</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-2">
            <div className="font-semibold">Сроки</div>
            <div className="text-sm text-neutral-300">Отправка 1–2 рабочих дня.</div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-2">
            <div className="font-semibold">Способы</div>
            <div className="text-sm text-neutral-300">Курьер / ПВЗ / Почта (по региону).</div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-sm text-neutral-300">
          Точную стоимость и сроки по регионам подключим в следующем шаге (после теста).
        </div>
      </div>
    </main>
  );
}
