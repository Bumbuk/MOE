import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: {
      category: true,
      colors: {
        select: { slug: true, name: true, variants: { select: { size: true, price: true, status: true } } },
      },
    },
  });

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter((x): x is string => !!x))
  ).sort();

  const sizesSet = new Set<string>();
  const colorsMap = new Map<string, string>();
  const prices: number[] = [];

  for (const p of products) {
    for (const c of p.colors) {
      const activeVars = c.variants.filter((v) => v.status === "ACTIVE");
      if (activeVars.length) colorsMap.set(c.slug, c.name);
      for (const v of activeVars) {
        sizesSet.add(v.size);
        prices.push(v.price);
      }
    }
  }

  const sizes = Array.from(sizesSet).sort((a, b) => Number(a) - Number(b));
  const colors = Array.from(colorsMap.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return NextResponse.json({ categories, sizes, colors, minPrice, maxPrice });
}
