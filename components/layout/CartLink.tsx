"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../lib/client/cart-store";

export default function CartLink() {
  const items = useCartStore((s) => s.items);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);

  const qty = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2">
      <ShoppingCart className="h-5 w-5" />
      {qty > 0 && (
        <span
          // key заставит элемент пересоздаться -> CSS animation сработает заново
          key={lastAddedAt ?? "init"}
          className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full
                 bg-white text-black text-[11px] font-semibold
                 flex items-center justify-center
                 border border-neutral-700"
        >
          {qty}
        </span>
      )}
    </Link>
  );
}
