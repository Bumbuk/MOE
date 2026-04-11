export type CartProductSnapshot = {
  productId: string;
  productColorId?: string;
  productVariantId?: string;
  slug: string;
  title: string;
  colorName: string;
  size: string;
  sku?: string;
  imagePath: string;
  price: number;
};

export type CartItem = {
  id: string;
  productId: string;
  productColorId?: string;
  variantId: string;
  quantity: number;
  product: CartProductSnapshot;
};
