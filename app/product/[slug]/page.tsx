import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import ProductClient from "../../../components/product/ProductClient";

export const runtime = "nodejs";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // The `params` argument is a Promise in Next.js 15 SSR; unwrap it before using.
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      category: true,
      description: true,
      composition: true,
      certification: true,
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
