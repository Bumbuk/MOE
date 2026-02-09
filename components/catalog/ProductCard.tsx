import Image from "next/image";
import Link from "next/link";
import { formatRub } from "../../lib/constants";
import FitChips from "../ui/FitChips";

// Типы товара для карточки каталога. Здесь мы используем только те поля,
// которые реально отображаются: заголовок, slug для ссылки, категория,
// минимальная цена, превью (thumb) и списки размеров/цветов.
type Product = {
  title: string;
  slug: string;
  category: string | null;
  priceFrom: number;
  thumb: { url: string; alt: string } | null;
  sizes: string[];
  colors: string[];
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  // Преобразуем массивы размеров и цветов в массив объектов для FitChips.
  const colorItems = (product.colors ?? []).map((c) => ({ key: c, label: c }));
  const sizeItems = (product.sizes ?? []).map((s) => ({ key: s, label: s }));

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[#F9B44D] bg-[var(--background)] transition hover:bg-[#FDE9D4] hover:border-[#EC99A6]"
    >
      {/* Изображение товара: используем object-cover, тёплый фон и лёгкий градиент. */}
      <div className="relative h-80 w-full bg-[var(--background)]">
        {product.thumb ? (
          <Image
            src={product.thumb.url}
            alt={product.thumb.alt?.trim() || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#4B7488]">
            Нет фото
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDE9D4] to-transparent" />
      </div>

      {/* Основное содержимое карточки: название, категория, цена, чипы цветов/размеров */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-[#4B7488]">{product.category ?? ""}</div>
            <div className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-[#2D2C2A]">
              {product.title}
            </div>
          </div>
          <div className="shrink-0 text-base font-semibold text-[#FF6634]">
            {formatRub(product.priceFrom)}
          </div>
        </div>

        {/* Цвета. Высота фиксирована, чтобы карточки не "прыгали". */}
        {colorItems.length ? (
          <div className="mt-4 min-h-[44px]">
            <FitChips
              items={colorItems}
              maxLines={2}
              chipClassName="rounded-full border border-[#F9B44D] bg-[var(--background)] px-2 py-1 text-xs text-[#4B7488]"
              moreClassName="rounded-full border border-[#F9B44D] bg-[var(--background)] px-2 py-1 text-xs text-[#EC99A6]"
            />
          </div>
        ) : null}

        {/* Размеры. */}
        {sizeItems.length ? (
          <div className="mt-3 min-h-[44px]">
            <FitChips
              items={sizeItems}
              maxLines={2}
              chipClassName="rounded-full border border-[#F9B44D] bg-[var(--background)] px-2 py-1 text-xs text-[#4B7488]"
              moreClassName="rounded-full border border-[#F9B44D] bg-[var(--background)] px-2 py-1 text-xs text-[#EC99A6]"
            />
          </div>
        ) : null}
      </div>
    </Link>
  );
}