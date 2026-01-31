export const runtime = "nodejs";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">О нас</h1>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-neutral-300 space-y-3">
          <p>
            Мы продаём товары из каталога. Отправка — после подтверждения заказа.
          </p>
          <p>
            Если укажешь город/контакты — сюда же добавим “где находимся” и
            “как быстро отвечаем”.
          </p>
        </div>
      </div>
    </main>
  );
}
