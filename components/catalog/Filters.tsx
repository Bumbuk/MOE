"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  initial: {
    q: string;
    category: string;
    size: string;
    color: string;
    minPrice: string;
    maxPrice: string;
  };
  options: {
    categories: string[];
    sizes: string[];
    colors: { slug: string; name: string }[];
    minPrice: number;
    maxPrice: number;
  };
  sort: "new" | "price_asc" | "price_desc";
};

export default function Filters({ initial, options, sort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(initial.q);
  const [category, setCategory] = useState(initial.category);
  const [size, setSize] = useState(initial.size);
  const [color, setColor] = useState(initial.color);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);

  const query = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");

    if (category) params.set("category", category);
    else params.delete("category");

    if (size) params.set("size", size);
    else params.delete("size");

    if (color) params.set("color", color);
    else params.delete("color");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    return params;
  }, [searchParams, q, category, size, color, minPrice, maxPrice]);

  function applyFilters() {
    router.push(`${pathname}?${query.toString()}`);
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    ["q", "category", "size", "color", "minPrice", "maxPrice"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  function applySort(nextSort: "new" | "price_asc" | "price_desc") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-[30px] leading-none tracking-wide text-black/80 hover:text-black"
        >
          ФИЛЬТР +
        </button>

        <div className="flex items-center gap-2 text-sm text-black/70">
          <span>Сортировать по</span>
          <select
            value={sort}
            onChange={(e) => applySort(e.target.value as "new" | "price_asc" | "price_desc")}
            className="rounded-md border border-black/10 bg-white px-2 py-1 outline-none"
          >
            <option value="new">Новинкам</option>
            <option value="price_asc">Цене (возр.)</option>
            <option value="price_desc">Цене (убыв.)</option>
          </select>
        </div>
      </div>

      <div
        className={
          "grid overflow-hidden transition-all duration-300 ease-out " +
          (open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]">
            <input
              className="h-11 rounded-md border border-black/10 bg-black/[0.02] px-3 text-sm outline-none placeholder:text-black/40 focus:border-black/30"
              placeholder="Поиск"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
            />

            <select
              className="h-11 rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/30"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Категория</option>
              {options.categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="h-11 rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/30"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">Размер</option>
              {options.sizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="h-11 rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/30"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="">Цвет</option>
              {options.colors.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              className="h-11 rounded-md border border-black/10 px-3 text-sm outline-none placeholder:text-black/35 focus:border-black/30"
              placeholder={`от ${options.minPrice}`}
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
            />

            <input
              className="h-11 rounded-md border border-black/10 px-3 text-sm outline-none placeholder:text-black/35 focus:border-black/30"
              placeholder={`до ${options.maxPrice}`}
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="h-10 rounded-md bg-[#2E4C9A] px-4 text-sm font-medium text-white hover:bg-[#243f84]"
            >
              Применить
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="h-10 rounded-md border border-black/10 px-4 text-sm hover:bg-black/5"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
