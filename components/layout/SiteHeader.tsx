"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
// Если есть твой zustand:
// import { useCartStore } from "@/lib/cart-store";

function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Пример: подключишь свой store
  // const itemsCount = useCartStore((s) => s.items.reduce((acc, it) => acc + it.qty, 0));
  const itemsCount = 0;

  // Закрытие по Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 items-center px-4 md:h-20 md:max-w-7xl md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-10">
          {/* Mobile burger */}
          <button
            type="button"
            aria-label="Открыть меню"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#2E4C9A]">
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-[#2E4C9A]">
            {NAV.slice(0, 3).map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className={cx(
                  "hover:opacity-70 transition-opacity",
                  isActive(x.href) && "opacity-100 underline underline-offset-8"
                )}
              >
                {x.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CENTER logo */}
        <Link
          href="/"
          aria-label="На главную"
          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          {/* ЗАМЕНИ на свой logo.svg */}
          <Image
            src="/images/logo/logo.png"
            alt="MOE"
            width={160}
            height={52}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* cart */}
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2E4C9A]/70 text-[#2E4C9A] hover:bg-black/5 md:h-12 md:w-12"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h15l-1.2 12H7.2L6 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {itemsCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E06A4A] text-white text-[11px] leading-[18px] text-center">
                {itemsCount}
              </span>
            )}
          </Link>          
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <>
          {/* overlay */}
          <button
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          {/* panel */}
          <div className="fixed left-0 right-0 top-16 z-50 border-t border-black/10 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4">
              {NAV.map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  onClick={() => setMobileOpen(false)}
                  className={cx(
                    "block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70",
                    isActive(x.href) && "opacity-100 underline underline-offset-8"
                  )}
                >
                  {x.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
