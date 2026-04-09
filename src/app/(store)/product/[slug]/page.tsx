import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductDetails } from "@/components/product/product-details";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="py-16">
      <Container>
        <ProductDetails product={product} />
      </Container>
    </main>
  );
}
