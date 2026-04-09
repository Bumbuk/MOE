import Link from "next/link";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-[linear-gradient(135deg,#efe4d3_0%,#f8f4ec_45%,#d9e7df_100%)] py-20">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-stone-600">MOE Store</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-stone-950 md:text-6xl">
            Одежда для спокойного гардероба с чистыми силуэтами и мягкими фактурами.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Выбирайте вещи на каждый день: продуманные формы, приятные материалы
            и спокойная палитра, которую легко встроить в повседневный образ.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-stone-400 px-6 py-3 text-sm font-medium text-stone-900 transition hover:border-stone-800"
            >
              Узнать о проекте
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-stone-500">В центре внимания</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
            <li>Лаконичные формы и вещи, которые легко сочетать между собой.</li>
            <li>Коллекция для размеренного ритма города и повседневных образов.</li>
            <li>Выбранные модели с понятной посадкой и спокойным характером.</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
