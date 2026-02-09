import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { ProductsQuerySchema } from "../../../lib/validators";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = ProductsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "INVALID_QUERY" }, { status: 400 });

  const q = parsed.data;

  const page = q.page ?? 1;
  const pageSize = q.pageSize ?? 24;

  const search = q.q;

  const sizesArr = q.sizes;
  const sizeOne = q.size;

  const minPrice = q.minPrice != null ? Number(q.minPrice) : null;
  const maxPrice = q.maxPrice != null ? Number(q.maxPrice) : null;

  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (q.category) where.category = q.category;

  // без mode (совместимо со всеми)
  if (search) {
    where.title = { contains: search };
  }

  const sizeFilter =
    sizesArr && sizesArr.length
      ? { in: sizesArr }
      : sizeOne
        ? { equals: sizeOne }
        : null;

  if (sizeFilter || minPrice != null || maxPrice != null) {
    where.colors = {
      some: {
        variants: {
          some: {
            status: "ACTIVE",
            ...(sizeFilter ? { size: sizeFilter } : {}),
            ...(minPrice != null ? { price: { gte: minPrice } } : {}),
            ...(maxPrice != null ? { price: { lte: maxPrice } } : {}),
          },
        },
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    q.sort === "old" ? { updatedAt: "asc" } : { updatedAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      colors: {
        orderBy: { sortOrder: "asc" },
        select: {
          name: true,
          slug: true,
          images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true, alt: true } },
          variants: { select: { price: true, size: true, status: true, stock: true } },
        },
      },
    },
  });

  const items = products.map((p) => {
    const activeVariants = p.colors.flatMap((c) => c.variants.filter((v) => v.status === "ACTIVE"));
    const prices = activeVariants.map((v) => v.price);
    const priceFrom = prices.length ? Math.min(...prices) : 0;

    const thumb = p.colors.find((c) => c.images.length)?.images[0] ?? null;

    const sizes = Array.from(new Set(activeVariants.map((v) => v.size))).sort((a, b) => Number(a) - Number(b));

    const colors = p.colors
      .filter((c) => c.variants.some((v) => v.status === "ACTIVE"))
      .map((c) => c.name);

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      priceFrom,
      thumb,
      sizes,
      colors,
    };
  });

  return NextResponse.json({ items });
}
