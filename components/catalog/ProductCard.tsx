"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatRub } from "../../lib/constants";

type Product = {
  title: string;
  slug: string;
  category: string | null;
  priceFrom: number;
  previewImages: { url: string; alt: string }[];
  colorSwatches: { name: string; hex: string | null }[];
};

type Props = {
  product: Product;
};

function normalizeHex(hex: string | null) {
  if (!hex) return null;
  const v = hex.trim();
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return null;
  return v;
}

export default function ProductCard({ product }: Props) {
  const images = product.previewImages.length
    ? product.previewImages
    : [{ url: "", alt: "Нет фото" }];
  const [active, setActive] = useState(0);

  const visibleSwatches = useMemo(() => product.colorSwatches.slice(0, 6), [product.colorSwatches]);
  const image = images[Math.min(active, images.length - 1)] ?? images[0];

  function prev() {
    setActive((v) => (v === 0 ? images.length - 1 : v - 1));
  }

  function next() {
    setActive((v) => (v === images.length - 1 ? 0 : v + 1));
  }

  return (
    <article className="group">
      <div className="relative h-[520px] w-full overflow-hidden rounded-md bg-[#e8e8e8]">
        {image?.url ? (
          <Link href={`/product/${product.slug}`} className="absolute inset-0">
            <Image
              src={image.url}
              alt={image.alt?.trim() || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-black/45">Нет фото</div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black/70 hover:bg-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Следующее фото"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-black/70 hover:bg-white"
            >
              →
            </button>
            <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
              {images.slice(0, 6).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Фото ${idx + 1}`}
                  onClick={() => setActive(idx)}
                  className={
                    "h-2.5 w-2.5 rounded-full border " +
                    (idx === active ? "border-black/60 bg-black/60" : "border-black/30 bg-white/80")
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-3">
        <div className="text-xs text-black/50">{product.category ?? ""}</div>
        <Link href={`/product/${product.slug}`} className="mt-1 block text-[30px] leading-6 text-black/85 hover:text-black">
          {product.title}
        </Link>
        <div className="mt-2 text-xl font-medium text-black/85">{formatRub(product.priceFrom)}</div>

        {visibleSwatches.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {visibleSwatches.map((swatch) => {
              const hex = normalizeHex(swatch.hex);
              return (
                <span
                  key={`${swatch.name}-${swatch.hex ?? "nohex"}`}
                  title={swatch.name}
                  className="h-4 w-4 rounded-full border border-black/20"
                  style={hex ? { backgroundColor: hex } : { backgroundColor: "#d4d4d4" }}
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
