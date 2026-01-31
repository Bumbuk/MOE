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

  // если пользователь меняет URL (назад/вперёд) — синхронизируемся
  useEffect(() => {
    setCategory(sp.get("category") ?? "");
    setSize(sp.get("size") ?? "");
    setColor(sp.get("color") ?? "");
    setQ(sp.get("q") ?? "");
    setMinPrice(sp.get("minPrice") ?? "");
    setMaxPrice(sp.get("maxPrice") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

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
    // при применении фильтров всегда возвращаемся на 1 страницу
    p.set("page", "1");
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

  const inputBase =
    "w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-800";

  const btnBase =
    "rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900";

  return (
    <section className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          className={"flex-1 min-w-[180px] " + inputBase}
          placeholder="Поиск..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? apply() : null)}
        />

        <button className={btnBase} onClick={() => setOpen((v) => !v)}>
          {open ? "Скрыть фильтры" : "Фильтры"}
        </button>

        <button
          className="rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-950 hover:bg-white"
          onClick={apply}
        >
          Применить
        </button>

        <button className={btnBase} onClick={reset}>
          Сброс
        </button>
      </div>

      <div
        className={
          "grid overflow-hidden transition-all duration-200 ease-out " +
          (open ? "mt-4 max-h-[600px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <div className="text-sm text-neutral-500">Категория</div>
            <select className={"mt-1 " + inputBase} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Все</option>
              {(filters?.categories ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-neutral-500">Размер</div>
            <select className={"mt-1 " + inputBase} value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Все</option>
              {(filters?.sizes ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-neutral-500">Цвет</div>
            <select className={"mt-1 " + inputBase} value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Все</option>
              {(filters?.colors ?? []).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-neutral-500">Цена от (₽)</div>
            <input
              className={"mt-1 " + inputBase}
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </label>

          <label className="block">
            <div className="text-sm text-neutral-500">Цена до (₽)</div>
            <input
              className={"mt-1 " + inputBase}
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </label>

          {filters?.price ? (
            <div className="hidden lg:block rounded-xl border border-neutral-900 bg-neutral-950/60 p-3 text-sm text-neutral-400">
              Диапазон в каталоге: <span className="text-neutral-200">{filters.price.min}</span> —{" "}
              <span className="text-neutral-200">{filters.price.max}</span> ₽
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
