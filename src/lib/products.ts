import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type {
  Product,
  ProductColor,
  ProductImage,
  ProductPreview,
  ProductVariant,
} from "@/types/product";

const productSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  shortDescription: true,
  status: true,
  composition: true,
  certification: true,
  popularRank: true,
  previewRank: true,
  category: {
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
    },
  },
  images: {
    select: {
      id: true,
      path: true,
      alt: true,
      sortOrder: true,
      isMain: true,
      productColorId: true,
    },
    orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
  },
  colors: {
    select: {
      id: true,
      slug: true,
      name: true,
      sortOrder: true,
      images: {
        select: {
          id: true,
          path: true,
          alt: true,
          sortOrder: true,
          isMain: true,
          productColorId: true,
        },
        orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
      },
      variants: {
        select: {
          id: true,
          size: true,
          sku: true,
          price: true,
          oldPrice: true,
          stock: true,
          status: true,
        },
        orderBy: [{ status: "asc" }, { size: "asc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }],
  },
} satisfies Prisma.ProductSelect;

type DbProduct = Prisma.ProductGetPayload<{
  select: typeof productSelect;
}>;
type DecimalLike = { toString(): string };

function decimalToNumber(value: DecimalLike | null | undefined) {
  return value ? Number(value) : undefined;
}

function mapProductImage(image: {
  id: string;
  path: string;
  alt: string;
  sortOrder: number;
  isMain: boolean;
  productColorId: string | null;
}): ProductImage {
  return {
    id: image.id,
    path: image.path,
    alt: image.alt,
    sortOrder: image.sortOrder,
    isMain: image.isMain,
    productColorId: image.productColorId ?? undefined,
  };
}

function mapProductVariant(variant: {
  id: string;
  size: string;
  sku: string;
  price: DecimalLike;
  oldPrice: DecimalLike | null;
  stock: number;
  status: ProductVariant["status"];
}): ProductVariant {
  return {
    id: variant.id,
    size: variant.size,
    sku: variant.sku,
    price: Number(variant.price),
    oldPrice: decimalToNumber(variant.oldPrice),
    stock: variant.stock,
    status: variant.status,
  };
}

function mapProductColor(color: {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  images: Array<{
    id: string;
    path: string;
    alt: string;
    sortOrder: number;
    isMain: boolean;
    productColorId: string | null;
  }>;
  variants: Array<{
    id: string;
    size: string;
    sku: string;
    price: DecimalLike;
    oldPrice: DecimalLike | null;
    stock: number;
    status: ProductVariant["status"];
  }>;
}): ProductColor {
  return {
    id: color.id,
    slug: color.slug,
    name: color.name,
    sortOrder: color.sortOrder,
    images: color.images.map(mapProductImage),
    variants: color.variants.map(mapProductVariant),
  };
}

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    shortDescription: product.shortDescription,
    status: product.status,
    composition: product.composition,
    certification: product.certification,
    popularRank: product.popularRank,
    previewRank: product.previewRank,
    category: {
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
      description: product.category.description ?? undefined,
    },
    images: product.images.map(mapProductImage),
    colors: product.colors.map(mapProductColor),
  };
}

function mapProductPreview(product: Product): ProductPreview {
  const mainVariant = product.colors.flatMap((color) => color.variants)[0];
  const mainImage =
    product.images.find((image) => image.isMain)?.path ??
    product.colors.flatMap((color) => color.images).find((image) => image.isMain)?.path ??
    "/images/products/placeholder.webp";

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription,
    popularRank: product.popularRank,
    previewRank: product.previewRank,
    category: {
      slug: product.category.slug,
      name: product.category.name,
    },
    price: mainVariant?.price ?? 0,
    oldPrice: mainVariant?.oldPrice,
    mainImage,
  };
}

async function getProductRecord(slug?: string) {
  return db.product.findFirst({
    where: {
      ...(slug ? { slug } : {}),
      status: "ACTIVE",
    },
    select: productSelect,
  });
}

export async function getProducts() {
  const records = await db.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ previewRank: "asc" }, { createdAt: "desc" }],
    select: productSelect,
  });

  return records.map((record) => mapProductPreview(mapProduct(record)));
}

export async function getFeaturedProducts() {
  const records = await db.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ popularRank: "asc" }, { previewRank: "asc" }],
    take: 3,
    select: productSelect,
  });

  return records.map((record) => mapProductPreview(mapProduct(record)));
}

export async function getProductBySlug(slug: string) {
  const record = await getProductRecord(slug);

  if (!record) {
    return null;
  }

  return mapProduct(record);
}
