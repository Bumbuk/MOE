"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../lib/cart-store";

export default function CartLink() {
  const items = useCartStore((s) => s.items);
  const lastAddedAt = useCartStore((s) => s.lastAddedAt);

  const qty = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2">
      {/* Use foreground colour for the cart icon so it’s visible on the light background. */}
      <ShoppingCart className="h-5 w-5 text-[var(--foreground)]" />
      {qty > 0 && (
        <span
          // key заставит элемент пересоздаться -> CSS animation сработает заново
          key={lastAddedAt ?? "init"}
          className="absolute -right-2 -top-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white text-black text-[11px] font-semibold border border-[#F9B44D] animate-cart-bump"
        >
          {qty}
        </span>
      )}
    </Link>
  );
}
