import { Container } from "@/components/ui/container";

export function AboutContent() {
  return (
    <section className="py-16">
      <Container className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">О нас</p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-950">Про стартовую версию проекта</h1>
        <div className="mt-8 space-y-5 text-base leading-8 text-stone-700">
          <p>
            Этот магазин собирается как чистый учебно-практический проект без лишней сложности,
            но с нормальной архитектурой и понятной структурой файлов.
          </p>
          <p>
            На старте мы ограничиваемся только обязательными сущностями каталога, локальным хранением
            изображений и клиентской корзиной без таблицы `CartItem` в базе.
          </p>
          <p>
            Такой подход позволяет быстро получить рабочий фундамент и потом наращивать проект без
            хаотичных переделок.
          </p>
        </div>
      </Container>
    </section>
  );
}
