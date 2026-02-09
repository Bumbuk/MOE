import Link from "next/link";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db"; 

// Форматирование цены в рублях
function formatRub(v: number) {
  return `₽ ${v.toLocaleString("ru-RU")}`;
}
/**
 * Тип продукта именно в том виде,
 * в котором мы его вытаскиваем из Prisma
 */
type ProductForHome = Prisma.ProductGetPayload<{
  include: {
    colors: {
      include: {
        images: true;
        variants: true;
      };
    };
  };
}>;

/**
 * Упрощённая модель товара для главной страницы
 * (ровно то, что нужно для карточки)
 */
type HomeItem = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  thumb: { url: string; alt: string } | null;
  priceFrom: number | null;
};

/**
 * Преобразует продукт из Prisma
 * → в объект для отображения на главной
 *
 * Логика:
 * 1. Берём первый цвет (sortOrder = 0)
 * 2. Берём первую картинку этого цвета
 * 3. Берём самую дешёвую цену среди активных вариантов
 */
function mapToHomeItem(p: ProductForHome): HomeItem {
  const color = p.colors[0] ?? null;
  const img = color?.images[0] ?? null;
  const cheapest = color?.variants[0] ?? null;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    thumb: img ? { url: img.url, alt: img.alt } : null,
    priceFrom: cheapest?.price ?? null,
  };
}

/**
 * Универсальная карточка товара для главной
 * tall = true → большая карточка (блок "Каталог")
 * tall = false → обычная карточка (блок "Популярные")
 */
function HomeCard({
  item,
  tall,
}: {
  item: HomeItem;
  tall?: boolean;
}) {
  const href = `/product/${item.slug}`;

  // Высота карточки зависит от типа блока
  const heightClass = tall
    ? "h-[320px] md:h-[360px]"
    : "h-[260px]";

  return (
    <Link
      href={href}
      className={tall ? "group overflow-hidden rounded-2xl bg-black/5" : "group"}
    >
      {/* Блок картинки */}
      <div className={`relative w-full ${heightClass} ${tall ? "" : "rounded-2xl"} bg-black/5 overflow-hidden`}>
        {item.thumb ? (
          <Image
            src={item.thumb.url}                 // путь из БД
            alt={item.thumb.alt || item.title}  // alt из БД
            fill
            sizes={tall
              ? "(max-width: 768px) 100vw, 33vw"
              : "(max-width: 768px) 100vw, 25vw"
            }
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          // Если вдруг нет картинки
          <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
            Нет фото
          </div>
        )}
      </div>

      {/* Текстовая часть карточки */}
      <div className={tall ? "px-4 py-4" : "mt-3"}>
        <div className="text-xs text-black/40">
          {item.category ?? ""}
        </div>

        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-black/70">
            {item.title}
          </span>

          <span className="text-black/60">
            {item.priceFrom === null ? "—" : formatRub(item.priceFrom)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Главная страница (Server Component)
 * Загружает данные напрямую из БД
 */
export default async function HomePage() {

  // Параллельно грузим:
  // - популярные товары (4 шт)
  // - preview товары (3 шт)
  const [popularRaw, previewRaw] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", popular: { not: null } },
      orderBy: { popular: "asc" },
      take: 4,
      include: {
        colors: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            variants: {
              where: { status: "ACTIVE" },
              orderBy: { price: "asc" },
              take: 1,
            },
          },
        },
      },
    }),

    prisma.product.findMany({
      where: { status: "ACTIVE", preview: { not: null } },
      orderBy: { preview: "asc" },
      take: 3,
      include: {
        colors: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            variants: {
              where: { status: "ACTIVE" },
              orderBy: { price: "asc" },
              take: 1,
            },
          },
        },
      },
    }),
  ]);

  // Приводим данные к формату для UI
  const popular = popularRaw.map(mapToHomeItem);
  const preview = previewRaw.map(mapToHomeItem);

  return (
    <>
      {/* HERO – БОЛЬШАЯ КАРТИНКА НА ГЛАВНОЙ */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-4 overflow-hidden rounded-2xl bg-black/5">
          <Image
            src="/images/logo/preview2.jpg"   // ← Путь к картинке для главной страницы
            alt="Hero"
            width={2400}
            height={1400}
            className="h-[280x] w-full object-cover [object-position:50%_20%] sm:h-[360px] md:h-[520px]"
            priority
          />
        </div>
      </section>

      {/* ПОПУЛЯРНЫЕ */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Популярные товары</h2>
            <Link href="/catalog" className="text-sm text-black/40 hover:text-black/70">
              Посмотреть всё
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((it) => (
              <HomeCard key={it.id} item={it} />
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW КАТАЛОГА */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">Каталог</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {preview.map((it) => (
              <HomeCard key={it.id} item={it} tall />
            ))}
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}
