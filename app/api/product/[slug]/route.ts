import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/server/db";
import { SlugSchema } from "../../../../lib/server/validators";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const parsed = SlugSchema.safeParse((params.slug ?? "").trim());
  if (!parsed.success) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const slug = parsed.data;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      title: true,
      slug: true,
      category: true,
      description: true,
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

  if (!product || product.status !== "ACTIVE") {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(product);
}
