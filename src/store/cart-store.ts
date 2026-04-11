"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartProductSnapshot } from "@/types/cart";

type AddCartItemPayload = {
  productId: string;
  productColorId?: string;
  variantId: string;
  quantity?: number;
  product: CartProductSnapshot;
};

type CartState = {
  items: CartItem[];
  addItem: (payload: AddCartItemPayload) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  decreaseItem: (id: string) => void;
};

function buildCartItemId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: ({ product, productId, productColorId, quantity = 1, variantId }) =>
        set((state) => {
          const itemId = buildCartItemId(productId, variantId);
          const existingItem = state.items.find((item) => item.id === itemId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: itemId,
                productId,
                variantId,
                quantity,
                product,
                productColorId,
              },
            ],
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      decreaseItem: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0),
        })),
    }),
    {
      name: "moe-cart-store",
    },
  ),
);
