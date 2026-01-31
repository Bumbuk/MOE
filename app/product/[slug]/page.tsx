import { notFound } from "next/navigation";
import { prisma } from "../../../lib/server/db";
import { SlugSchema } from "../../../lib/server/validators";
import ProductClient from "../../../components/product/ProductClient";

export const runtime = "nodejs";

export default async function ProductPage({
  params,
}: {
  // Next 15: params приходит как Promise
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const parsed = SlugSchema.safeParse(rawSlug);
  if (!parsed.success) return notFound();

  const slug = parsed.data;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      category: true,
      description: true,
      status: true,
      colors: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          images: { orderBy: { sortOrder: "asc" }, select: { url: true, alt: true } },
          variants: {
            orderBy: { sizeSort: "asc" },
            select: { id: true, size: true, price: true, stock: true, status: true },
          },
        },
      },
    },
  });

  if (!product || product.status !== "ACTIVE") return notFound();

  return <ProductClient product={product} />;
}
