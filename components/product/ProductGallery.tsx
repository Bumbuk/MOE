"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  images?: string[];
  title?: string;
};

export default function ProductGallery({ images, title }: Props) {
  const items = useMemo(() => (images ?? []).filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = items[Math.min(activeIndex, Math.max(items.length - 1, 0))] ?? null;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_96px]">
      <div className="order-1 overflow-hidden rounded-2xl bg-black/5">
        {activeImage ? (
          <div className="relative aspect-[4/3] w-full lg:aspect-square">
            <Image src={activeImage} alt={title ?? "Фото товара"} fill className="object-cover" sizes="100vw" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center text-sm text-black/45 lg:aspect-square">Нет фото</div>
        )}
      </div>

      {items.length > 1 && (
        <div className="order-2 grid grid-cols-5 gap-3 lg:block lg:max-h-[552px] lg:space-y-2 lg:overflow-y-auto">
          {items.map((src, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  "relative overflow-hidden rounded-xl border bg-black/5 lg:block lg:w-[92px] " +
                  (active ? "border-[#2E4C9A]/60" : "border-black/10 hover:border-black/25")
                }
              >
                <div className="relative h-16 w-full lg:h-[84px]">
                  <Image src={src} alt={title ?? "Миниатюра"} fill className="object-cover" sizes="120px" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
