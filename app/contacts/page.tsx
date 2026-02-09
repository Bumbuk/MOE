export const runtime = "nodejs";

export default function ContactsPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Контакты</h1>

        <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-6 space-y-2 text-[#4B7488]">
          <div>Телефон: +7 …</div>
          <div>Email: …</div>
          <div>Telegram: …</div>
          <div className="pt-2 text-sm text-[#4B7488]">
            Время ответа: обычно в течение дня.
          </div>
        </div>
      </div>
    </main>
  );
}
