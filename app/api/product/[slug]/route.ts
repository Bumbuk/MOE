import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export const runtime = "nodejs";

// Next.js 16 (Turbopack) wraps params in a Promise for async resolution.
// See https://nextjs.org/docs/messages/sync-dynamic-apis
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trimmedSlug = (slug || "").trim();
  if (!trimmedSlug || trimmedSlug.length > 120) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const product = await prisma.product.findUnique({
    where: { slug: trimmedSlug },
    select: {
      title: true,
      slug: true,
      category: true,
      description: true,
      composition: true,
      certification: true,
      status: true,
      colors: {
        orderBy: { sortOrder: "asc" },
        select: {
          name: true,
          slug: true,
          images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
          variants: {
            where: { status: "ACTIVE" },
            orderBy: [{ sizeSort: "asc" }, { size: "asc" }],
            select: { id: true, size: true, sizeSort: true, price: true, stock: true, sku: true, status: true },
          },
        },
      },
    },
  });

  if (!product) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(product);
}
