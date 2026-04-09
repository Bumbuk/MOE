import Link from "next/link";
import { Container } from "@/components/ui/container";

export function CartEmptyState() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Корзина</p>
          <h1 className="mt-4 text-4xl font-semibold text-stone-950">Пока пусто</h1>
          <p className="mt-4 text-base leading-7 text-stone-700">
            Zustand store будет подключён следующим этапом. Пока страница готова как отдельный
            маршрут и UI-блок.
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Вернуться в каталог
          </Link>
        </div>
      </Container>
    </section>
  );
}
