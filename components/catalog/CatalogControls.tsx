"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FiltersResp = {
  categories: string[];
  sizes: string[];
  colors: { slug: string; name: string }[];
  price: { min: number; max: number };
};

export default function CatalogControls() {
  const router = useRouter();
  const sp = useSearchParams();

  const [filters, setFilters] = useState<FiltersResp | null>(null);
  const [open, setOpen] = useState(false);

  const [category, setCategory] = useState(sp.get("category") ?? "");
  const [size, setSize] = useState(sp.get("size") ?? "");
  const [color, setColor] = useState(sp.get("color") ?? "");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") ?? "");

  useEffect(() => {
    fetch("/api/filters")
      .then((r) => r.json())
      .then((d) => setFilters(d))
      .catch(() => setFilters(null));
  }, []);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (category) p.set("category", category);
    if (size) p.set("size", size);
    if (color) p.set("color", color);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    return p;
  }, [q, category, size, color, minPrice, maxPrice]);

  function apply() {
    router.push(`/?${qs.toString()}`);
  }

  function reset() {
    setCategory("");
    setSize("");
    setColor("");
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/");
  }

  return (
    <div className="rounded-2xl border border-[#F9B44D] bg-[var(--background)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="flex-1 min-w-[180px] rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 placeholder-[#AAA19C]"
          placeholder="Поиск..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
        />

        <button
          className="rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-sm text-[#4B7488] hover:bg-[#FDE9D4]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Скрыть фильтры" : "Фильтры"}
        </button>

        <button
          className="rounded-xl border border-[#F9B44D] bg-[#FF6634] px-3 py-2 text-sm text-white hover:bg-[#EC99A6]"
          onClick={apply}
        >
          Применить
        </button>

        <button
          className="rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-sm text-[#4B7488] hover:bg-[#FDE9D4]"
          onClick={reset}
        >
          Сброс
        </button>
      </div>

      <div
        className={
          "grid overflow-hidden transition-all duration-200 ease-out " +
          (open ? "mt-3 max-h-[600px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <div className="text-sm text-[#4B7488]">Категория</div>
            <select
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Все</option>
              {(filters?.categories ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Размер</div>
            <select
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488]"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Все</option>
              {(filters?.sizes ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Цвет</div>
            <select
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488]"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">Все</option>
              {(filters?.colors ?? []).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Цена от (₽)</div>
            <input
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488] placeholder-[#AAA19C]"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </label>

          <label className="block">
            <div className="text-sm text-[#4B7488]">Цена до (₽)</div>
            <input
              className="mt-1 w-full rounded-xl border border-[#F9B44D] bg-[var(--background)] px-3 py-2 text-[#4B7488] placeholder-[#AAA19C]"
              placeholder="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
