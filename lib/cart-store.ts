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
  /**
   * Доступное количество на складе для данного варианта. Если null, то запас не ограничен.
   * Используется для ограничения увеличения количества в корзине.
   */
  stock?: number | null;
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
            const existing = items[idx]!;
            const stock = item.stock ?? existing.stock;
            // Объединяем количества, но не превышаем 99 и доступный запас.
            let newQty = existing.qty + qtyToAdd;
            if (stock != null) {
              newQty = Math.min(newQty, stock);
            }
            newQty = Math.min(99, newQty);
            items[idx] = {
              ...existing,
              qty: newQty,
              stock,
            };
          } else {
            // Если товар новый, ограничиваем количество запасом (если есть).
            const stock = item.stock;
            let initialQty = qtyToAdd;
            if (stock != null) {
              initialQty = Math.min(initialQty, stock);
            }
            items.push({ ...item, qty: initialQty });
          }
          return { items, lastAddedAt: Date.now() };
        }),
      setQty: (variantId, qty) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.variantId !== variantId) return i;
            let clamped = Math.min(99, Math.max(1, qty));
            if (i.stock != null) {
              clamped = Math.min(clamped, i.stock);
            }
            return { ...i, qty: clamped };
          }),
        })),
      removeItem: (variantId) => set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "moe-cart" }
  )
);

export function cartSubtotalRub(items: CartItem[]) {
  return items.reduce((s, it) => s + it.priceRub * it.qty, 0);
}
