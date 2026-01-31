import Image from "next/image";
import Link from "next/link";
import { formatRub } from "../../lib/shared/constants";
import FitChips from "../ui/FitChips";

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
  const colorItems = (product.colors ?? []).map((c) => ({ key: c, label: c }));
  const sizeItems = (product.sizes ?? []).map((s) => ({ key: s, label: s }));

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-700 hover:bg-neutral-900/80"
    >
      {/* ✅ Превью: больше зона + белый фон + contain без padding (фото не выглядит маленьким) */}
      <div className="relative h-80 w-full bg-white">
        {product.thumb ? (
          <Image
            src={product.thumb.url}
            alt={product.thumb.alt?.trim() || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            // если у тебя домены картинок — уже настроены, иначе next/image будет ругаться
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500 bg-neutral-950">
            Нет фото
          </div>
        )}

        {/* лёгкий низовой градиент как раньше */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-neutral-400">{product.category ?? ""}</div>
            <div className="mt-1 line-clamp-2 text-lg font-semibold leading-snug text-neutral-100">
              {product.title}
            </div>
          </div>

          <div className="shrink-0 text-base font-semibold text-neutral-100">
            {formatRub(product.priceFrom)}
          </div>
        </div>

        {/* ✅ Цвета: фиксируем высоту под 2 строки, чтобы карточки не прыгали */}
        <div className="mt-4 min-h-[56px]">
          {colorItems.length ? (
            <FitChips
              items={colorItems}
              maxLines={2}
              chipClassName="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300"
              moreClassName="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400"
            />
          ) : null}
        </div>

        {/* ✅ Размеры: тоже фиксируем высоту */}
        <div className="mt-3 min-h-[56px]">
          {sizeItems.length ? (
            <FitChips
              items={sizeItems}
              maxLines={2}
              chipClassName="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-300"
              moreClassName="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 text-xs text-neutral-400"
            />
          ) : null}
        </div>
      </div>
    </Link>
  );
}