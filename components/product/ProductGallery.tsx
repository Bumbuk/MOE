"use client";

import { useMemo, useState } from "react";

type Props = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: Props) {
  const clean = useMemo(() => {
    return (images ?? []).filter((u) => typeof u === "string" && u.length > 0);
  }, [images]);

  const [idx, setIdx] = useState(0);
  const active = clean[idx] ?? clean[0] ?? "";

  return (
    <div className="space-y-3">
      <div className="aspect-square w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={active}
            alt={title}
            className="h-full w-full object-contain bg-white"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
            Нет фото
          </div>
        )}
      </div>

      {clean.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {clean.map((u, i) => {
            const selected = i === idx;
            return (
              <button
                key={u + i}
                type="button"
                onClick={() => setIdx(i)}
                className={
                  "h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-neutral-950 " +
                  (selected ? "border-neutral-200" : "border-neutral-800 hover:border-neutral-700")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt={title} className="h-full w-full object-cover bg-white" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}