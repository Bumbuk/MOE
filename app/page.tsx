import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/catalog/ProductCard";
import { prisma } from "../lib/db";

export const runtime = "nodejs";

type HomeItem = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  priceFrom: number;
  previewImages: { url: string; alt: string }[];
  colorSwatches: { name: string; hex: string | null }[];
};

function mapProduct(product: {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  colors: Array<{
    name: string;
    hex: string | null;
    images: Array<{ url: string; alt: string }>;
    variants: Array<{ price: number }>;
  }>;
}): HomeItem {
  const previewColor = product.colors.find((c) => c.images.length > 0) ?? product.colors[0];
  const previewImages = (previewColor?.images ?? []).map((img) => ({ url: img.url, alt: img.alt }));
  const prices = product.colors.flatMap((c) => c.variants.map((v) => v.price));
  const colorSwatches = product.colors
    .filter((c) => c.variants.length > 0)
    .map((c) => ({ name: c.name, hex: c.hex ?? null }));

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    priceFrom: prices.length ? Math.min(...prices) : 0,
    previewImages,
    colorSwatches,
  };
}

async function getHomeProducts(args: {
  where: Record<string, unknown>;
  orderBy: { popular: "asc" } | { preview: "asc" };
  take: number;
}) {
  try {
    return await prisma.product.findMany({
      where: args.where,
      orderBy: args.orderBy,
      take: args.take,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        colors: {
          orderBy: { sortOrder: "asc" },
          select: {
            name: true,
            hex: true,
            images: { orderBy: { sortOrder: "asc" }, take: 8, select: { url: true, alt: true } },
            variants: { where: { status: "ACTIVE" }, select: { price: true } },
          },
        },
      },
    });
  } catch {
    const fallback = await prisma.product.findMany({
      where: args.where,
      orderBy: args.orderBy,
      take: args.take,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        colors: {
          orderBy: { sortOrder: "asc" },
          select: {
            name: true,
            images: { orderBy: { sortOrder: "asc" }, take: 8, select: { url: true, alt: true } },
            variants: { where: { status: "ACTIVE" }, select: { price: true } },
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

export default async function HomePage() {
  const [popularRaw, previewRaw] = await Promise.all([
    getHomeProducts({
      where: { status: "ACTIVE", popular: { not: null } },
      orderBy: { popular: "asc" },
      take: 4,
    }),
    getHomeProducts({
      where: { status: "ACTIVE", preview: { not: null } },
      orderBy: { preview: "asc" },
      take: 3,
    }),
  ]);

  const popular = popularRaw.map(mapProduct);
  const preview = previewRaw.map(mapProduct);

  return (
    <>
      <section className="mx-auto max-w-[1880px] px-4 md:px-6">
        <div className="mt-4 overflow-hidden rounded-md bg-black/5">
          <Image
            src="/images/logo/preview2.JPG"
            alt="MOE"
            width={2400}
            height={1400}
            className="h-[280px] w-full object-cover [object-position:50%_20%] sm:h-[360px] md:h-[520px]"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1880px] px-4 md:px-6">
        <div className="mt-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Популярные товары</h2>
            <Link href="/catalog" className="text-sm text-black/40 hover:text-black/70">
              Посмотреть всё
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {popular.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1880px] px-4 md:px-6">
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">Каталог</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {preview.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center rounded-md bg-[#2E4C9A] px-5 text-sm font-medium text-white hover:bg-[#243f84]"
            >
              Перейти в каталог
            </Link>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}
