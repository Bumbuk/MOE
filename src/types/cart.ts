export type CartProductSnapshot = {
  productId: string;
  slug: string;
  title: string;
  colorName: string;
  size: string;
  imagePath: string;
  price: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: CartProductSnapshot;
};
