import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  title: string;
  slug: string;
  color: string;
  size: string;
  priceRub: number;
  imageUrl?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  lastAddedAt: number;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  setQty: (variantId: string, qty: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      lastAddedAt: 0,
      addItem: (item) =>
        set((state) => {
          const qtyToAdd = Math.max(1, item.qty ?? 1);
          const idx = state.items.findIndex((i) => i.variantId === item.variantId);
          const items = state.items.slice();
          if (idx >= 0) {
            items[idx] = { ...items[idx]!, qty: Math.min(99, items[idx]!.qty + qtyToAdd) };
          } else {
            items.push({ ...item, qty: qtyToAdd });
          }
          return { items, lastAddedAt: Date.now() };
        }),
      setQty: (variantId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, qty: Math.min(99, Math.max(1, qty)) } : i
          ),
        })),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "moe-cart" }
  )
);

export function cartSubtotalRub(items: CartItem[]) {
  return items.reduce((s, it) => s + it.priceRub * it.qty, 0);
}
