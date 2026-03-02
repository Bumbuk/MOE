import { Prisma } from "@prisma/client";
import Link from "next/link";
import Filters from "../../components/catalog/Filters";
import ProductGrid from "../../components/catalog/ProductGrid";
import { prisma } from "../../lib/db";

type CatalogSearchParams = {
  q?: string;
  category?: string;
  size?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "new" | "price_asc" | "price_desc";
};

function asText(value: string | undefined, max: number) {
  if (!value) return "";
  return value.trim().slice(0, max);
}

function asPrice(value: string | undefined) {
  if (!value) return null;
  if (!/^\d{1,10}$/.test(value.trim())) return null;
  return Number(value);
}

export const runtime = "nodejs";

async function getCatalogProducts(where: Prisma.ProductWhereInput) {
  try {
    return await prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        colors: {
          orderBy: { sortOrder: "asc" },
          select: {
            name: true,
            hex: true,
            images: { orderBy: { sortOrder: "asc" }, take: 8, select: { url: true, alt: true } },
            variants: { where: { status: "ACTIVE" }, select: { size: true, price: true } },
          },
        },
      },
    });
  } catch {
    const fallback = await prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        colors: {
          orderBy: { sortOrder: "asc" },
          select: {
            name: true,
            images: { orderBy: { sortOrder: "asc" }, take: 8, select: { url: true, alt: true } },
            variants: { where: { status: "ACTIVE" }, select: { size: true, price: true } },
          },
        },
      },
    });

    return fallback.map((product) => ({
      ...product,
      colors: product.colors.map((c) => ({ ...c, hex: null })),
    }));
  }
}

export default async function CatalogPage(props: { searchParams: Promise<CatalogSearchParams> }) {
  const searchParams = await props.searchParams;

  const q = asText(searchParams.q, 80);
  const category = asText(searchParams.category, 60);
  const size = asText(searchParams.size, 20);
  const color = asText(searchParams.color, 60);
  const minPrice = asPrice(searchParams.minPrice);
  const maxPrice = asPrice(searchParams.maxPrice);
  const sort = searchParams.sort ?? "new";

  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };
  if (q) where.title = { contains: q };
  if (category) where.category = category;

  if (size || color || minPrice != null || maxPrice != null) {
    where.colors = {
      some: {
        ...(color ? { slug: color } : {}),
        variants: {
          some: {
            status: "ACTIVE",
            ...(size ? { size } : {}),
            ...(minPrice != null ? { price: { gte: minPrice } } : {}),
            ...(maxPrice != null ? { price: { lte: maxPrice } } : {}),
          },
        },
      },
    };
  }

  const [products, filtersSource] = await Promise.all([
    getCatalogProducts(where),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        category: true,
        colors: {
          select: {
            slug: true,
            name: true,
            variants: { where: { status: "ACTIVE" }, select: { size: true, price: true } },
          },
        },
      },
    }),
  ]);

  const items = products.map((product) => {
    const previewColor = product.colors.find((c) => c.images.length > 0) ?? product.colors[0];
    const previewImages = (previewColor?.images ?? []).map((img) => ({ url: img.url, alt: img.alt }));
    const activeVariants = product.colors.flatMap((c) => c.variants);
    const prices = activeVariants.map((v) => v.price);
    const sizes = Array.from(new Set(activeVariants.map((v) => v.size))).sort((a, b) => Number(a) - Number(b));
    const colorSwatches = product.colors
      .filter((c) => c.variants.length > 0)
      .map((c) => ({ name: c.name, hex: c.hex ?? null }));

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      category: product.category,
      priceFrom: prices.length ? Math.min(...prices) : 0,
      previewImages,
      colorSwatches,
      sizes,
    };
  });

  if (sort === "price_asc") {
    items.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (sort === "price_desc") {
    items.sort((a, b) => b.priceFrom - a.priceFrom);
  }

  const categorySet = new Set<string>();
  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string>();
  const priceList: number[] = [];

  for (const product of filtersSource) {
    if (product.category) categorySet.add(product.category);
    for (const c of product.colors) {
      if (c.variants.length) colorMap.set(c.slug, c.name);
      for (const v of c.variants) {
        sizeSet.add(v.size);
        priceList.push(v.price);
      }
    }
  }

  const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b, "ru"));
  const sizes = Array.from(sizeSet).sort((a, b) => Number(a) - Number(b));
  const colors = Array.from(colorMap.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const minDbPrice = priceList.length ? Math.min(...priceList) : 0;
  const maxDbPrice = priceList.length ? Math.max(...priceList) : 0;

  return (
    <main className="mx-auto max-w-[1880px] px-4 py-8 md:px-6">
      <div className="text-xs text-black/45">
        <Link className="hover:text-black/70" href="/">
          Главная
        </Link>
        <span className="px-2">/</span>
        <span className="text-black/70">Каталог</span>
      </div>

      <div className="mt-5">
        <Filters
          initial={{
            q,
            category,
            size,
            color,
            minPrice: minPrice != null ? String(minPrice) : "",
            maxPrice: maxPrice != null ? String(maxPrice) : "",
          }}
          options={{
            categories,
            sizes,
            colors,
            minPrice: minDbPrice,
            maxPrice: maxDbPrice,
          }}
          sort={sort}
        />
      </div>

      <section className="mt-6">
        {items.length ? (
          <ProductGrid
            items={items.map((item) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              category: item.category,
              priceFrom: item.priceFrom,
              previewImages: item.previewImages,
              colorSwatches: item.colorSwatches,
            }))}
          />
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-10 text-sm text-black/60">
            Ничего не найдено. Попробуйте изменить фильтры.
          </div>
        )}
      </section>
    </main>
  );
}
