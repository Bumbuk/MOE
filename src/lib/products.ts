import type { Product, ProductPreview } from "@/types/product";

const products: Product[] = [
  {
    id: "product-bomber",
    slug: "bomber",
    title: "Бомбер Banana Mood",
    description:
      "Лёгкий бомбер с объёмной посадкой и мягкой подкладкой для городского гардероба.",
    shortDescription: "Лёгкий бомбер с акцентным цветом и мягкой фактурой.",
    status: "ACTIVE",
    composition: "65% хлопок, 35% полиэстер",
    certification: "Сертифицировано по стандарту OEKO-TEX",
    popularRank: 1,
    previewRank: 1,
    category: {
      id: "category-outerwear",
      slug: "outerwear",
      name: "Верхняя одежда",
      description: "Базовые и акцентные модели на каждый день.",
    },
    colors: [
      {
        id: "color-banana",
        slug: "banana",
        name: "Banana",
        sortOrder: 1,
        variants: [
          {
            id: "variant-bomber-s",
            size: "S",
            sku: "BOMBER-BANANA-S",
            price: 12990,
            oldPrice: 14990,
            stock: 4,
            status: "ACTIVE",
          },
          {
            id: "variant-bomber-m",
            size: "M",
            sku: "BOMBER-BANANA-M",
            price: 12990,
            oldPrice: 14990,
            stock: 2,
            status: "ACTIVE",
          },
        ],
        images: [
          {
            id: "image-bomber-banana-1",
            path: "/images/products/bomber/banana/1.webp",
            alt: "Бомбер Banana Mood спереди",
            sortOrder: 1,
            isMain: true,
            productColorId: "color-banana",
          },
        ],
      },
    ],
    images: [
      {
        id: "image-bomber-main",
        path: "/images/products/bomber/banana/1.webp",
        alt: "Бомбер Banana Mood",
        sortOrder: 1,
        isMain: true,
      },
    ],
  },
  {
    id: "product-knit-set",
    slug: "knit-set",
    title: "Трикотажный комплект Cloud",
    description:
      "Мягкий комплект из свободного свитшота и прямых брюк для спокойных образов.",
    shortDescription: "Комплект из плотного трикотажа с расслабленной посадкой.",
    status: "ACTIVE",
    composition: "80% хлопок, 20% эластан",
    certification: "Подходит для ежедневной носки",
    popularRank: 2,
    previewRank: 2,
    category: {
      id: "category-sets",
      slug: "sets",
      name: "Комплекты",
      description: "Готовые образы на каждый день.",
    },
    colors: [
      {
        id: "color-oat",
        slug: "oat",
        name: "Oat",
        sortOrder: 1,
        variants: [
          {
            id: "variant-knit-set-s",
            size: "S",
            sku: "KNIT-SET-OAT-S",
            price: 9990,
            stock: 6,
            status: "ACTIVE",
          },
          {
            id: "variant-knit-set-m",
            size: "M",
            sku: "KNIT-SET-OAT-M",
            price: 9990,
            stock: 1,
            status: "ACTIVE",
          },
        ],
        images: [
          {
            id: "image-knit-oat-1",
            path: "/images/products/knit-set/oat/1.webp",
            alt: "Трикотажный комплект Cloud",
            sortOrder: 1,
            isMain: true,
            productColorId: "color-oat",
          },
        ],
      },
    ],
    images: [
      {
        id: "image-knit-main",
        path: "/images/products/knit-set/oat/1.webp",
        alt: "Трикотажный комплект Cloud",
        sortOrder: 1,
        isMain: true,
      },
    ],
  },
  {
    id: "product-shirt",
    slug: "cotton-shirt",
    title: "Рубашка Cotton Form",
    description:
      "Плотная хлопковая рубашка прямого кроя, которая работает как самостоятельный слой и как overshirt.",
    shortDescription: "Прямая хлопковая рубашка для многослойных образов.",
    status: "ACTIVE",
    composition: "100% хлопок",
    certification: "Мягкая ткань с предсказуемой посадкой",
    popularRank: 3,
    previewRank: 3,
    category: {
      id: "category-shirts",
      slug: "shirts",
      name: "Рубашки",
      description: "Базовые вещи с чистым силуэтом.",
    },
    colors: [
      {
        id: "color-milk",
        slug: "milk",
        name: "Milk",
        sortOrder: 1,
        variants: [
          {
            id: "variant-shirt-s",
            size: "S",
            sku: "SHIRT-MILK-S",
            price: 7490,
            stock: 3,
            status: "ACTIVE",
          },
          {
            id: "variant-shirt-m",
            size: "M",
            sku: "SHIRT-MILK-M",
            price: 7490,
            stock: 0,
            status: "OUT_OF_STOCK",
          },
        ],
        images: [
          {
            id: "image-shirt-milk-1",
            path: "/images/products/cotton-shirt/milk/1.webp",
            alt: "Рубашка Cotton Form",
            sortOrder: 1,
            isMain: true,
            productColorId: "color-milk",
          },
        ],
      },
    ],
    images: [
      {
        id: "image-shirt-main",
        path: "/images/products/cotton-shirt/milk/1.webp",
        alt: "Рубашка Cotton Form",
        sortOrder: 1,
        isMain: true,
      },
    ],
  },
];

function toProductPreview(product: Product): ProductPreview {
  const firstVariant = product.colors[0]?.variants[0];
  const mainImage =
    product.images.find((image) => image.isMain)?.path ?? "/images/products/placeholder.webp";

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
    price: firstVariant?.price ?? 0,
    oldPrice: firstVariant?.oldPrice,
    mainImage,
  };
}

export async function getProducts() {
  return products.map(toProductPreview).sort((left, right) => left.previewRank - right.previewRank);
}

export async function getFeaturedProducts() {
  return products
    .map(toProductPreview)
    .sort((left, right) => left.popularRank - right.popularRank)
    .slice(0, 3);
}

export async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}
