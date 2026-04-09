import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { DatabaseErrorState } from "@/components/ui/database-error-state";
import { ProductDetails } from "@/components/product/product-details";
import { getProductBySlug } from "@/lib/products";
import { DatabaseConnectionError } from "@/types/common";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = null;
  let hasDatabaseError = false;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    if (error instanceof DatabaseConnectionError) {
      hasDatabaseError = true;
    } else {
      throw error;
    }
  }

  if (hasDatabaseError) {
    return (
      <DatabaseErrorState
        title="Карточка товара недоступна"
        description="Страница товара уже работает от Prisma. Сейчас подключение к PostgreSQL недоступно, поэтому данные не удалось загрузить."
      />
    );
  }

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
