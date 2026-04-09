export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductVariantStatus = "ACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";

export type ProductImage = {
  id: string;
  path: string;
  alt: string;
  sortOrder: number;
  isMain: boolean;
  productColorId?: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  sku: string;
  price: number;
  oldPrice?: number;
  stock: number;
  status: ProductVariantStatus;
};

export type ProductColor = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  variants: ProductVariant[];
  images: ProductImage[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  status: ProductStatus;
  composition: string;
  certification: string;
  popularRank: number;
  previewRank: number;
  category: Category;
  colors: ProductColor[];
  images: ProductImage[];
};

export type ProductPreview = Pick<
  Product,
  "id" | "slug" | "title" | "shortDescription" | "popularRank" | "previewRank"
> & {
  category: Pick<Category, "slug" | "name">;
  price: number;
  oldPrice?: number;
  mainImage: string;
};
