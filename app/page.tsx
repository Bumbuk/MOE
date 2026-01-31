import ProductGrid from "../components/catalog/ProductGrid";
import CatalogControls from "../components/catalog/CatalogControls";
import { getSiteUrl } from "../lib/server/site-url";

export const dynamic = "force-dynamic";

type ApiResponse = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: Array<{
    id: string;
    title: string;
    slug: string;
    category: string | null;
    priceFrom: number;
    thumb: { url: string; alt: string } | null;
    sizes: string[];
    colors: string[];
  }>;
};

function qs(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.trim()) sp.set(k, v);
  }
  return sp.toString();
}

async function getProducts(search: Record<string, string | undefined>) {
  const query = qs({
    q: search.q,
    category: search.category,
    size: search.size,
    sizes: search.sizes,
    color: search.color,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    sort: search.sort,
    page: search.page ?? "1",
    pageSize: search.pageSize ?? search.limit ?? "24",
  });

  const url = new URL(`/api/products?${query}`, getSiteUrl());
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Не удалось загрузить товары");
  return (await res.json()) as ApiResponse;
}

function buildHref(sp: Record<string, string | undefined>, page: number) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v && v.trim()) next.set(k, v);
  }
  next.set("page", String(page));
  return `/?${next.toString()}`;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const data = await getProducts(sp);

  const prev = data.page > 1 ? data.page - 1 : null;
  const next = data.page < data.totalPages ? data.page + 1 : null;

  // ✅ Пагинация ТОЛЬКО если товаров всего > 20
  const showPager = data.total > 20 && data.totalPages > 1;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Каталог</h1>
        </header>

        <CatalogControls />

        <ProductGrid items={data.items} />

        {showPager ? (
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-neutral-400">
              Страница {data.page} из {data.totalPages}
            </div>

            <div className="flex gap-2">
              <a
                href={prev ? buildHref(sp, prev) : "#"}
                className={
                  "rounded-xl border px-3 py-2 text-sm " +
                  (prev
                    ? "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                    : "border-neutral-900 bg-neutral-950 opacity-40 pointer-events-none")
                }
              >
                Назад
              </a>

              <a
                href={next ? buildHref(sp, next) : "#"}
                className={
                  "rounded-xl border px-3 py-2 text-sm " +
                  (next
                    ? "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                    : "border-neutral-900 bg-neutral-950 opacity-40 pointer-events-none")
                }
              >
                Вперёд
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}