"use client";

import { useMemo, useState } from "react";

/*
 * Галерея изображений для карточки товара. Отображает основное фото
 * (сохраняя его пропорции через object-contain), а также список миниатюр
 * для выбора. Мы специально не обрезаем изображения, чтобы покупатель
 * видел товар полностью. Миниатюры показываются только когда есть
 * несколько фото.
 */

type Props = {
  images?: string[];
  title?: string;
};

export default function ProductGallery({ images, title }: Props) {
  const imgs = useMemo(() => (images ?? []).filter(Boolean), [images]);
  const [active, setActive] = useState(0);

  const hasImages = imgs.length > 0;
  const activeSrc = hasImages ? imgs[Math.min(active, imgs.length - 1)] : null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#F9B44D] bg-[var(--background)]">
        {activeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeSrc}
            alt={title ?? "Фото товара"}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#4B7488]">
            Нет фото
          </div>
        )}
      </div>

      {imgs.length > 1 && (
        // На мобиле миниатюры идут в строку (горизонтальный скролл).
        // На lg+ — колонка с ограничением по высоте: видим ~6 штук, остальные прокручиваются.
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[520px]">
          {imgs.map((src, i) => {
            const selected = i === active;
            return (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                className={
                  "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border " +
                  (selected
                    ? "border-[#F9B44D] bg-[#F9B44D]/20"
                    : "border-[#F9B44D] bg-[var(--background)] hover:border-[#EC99A6]")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={title ?? ""} className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
