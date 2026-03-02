"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "../../lib/cart-store";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemsCount = useCartStore((s) => s.items.reduce((acc, item) => acc + item.qty, 0));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 items-center px-4 md:h-20 md:max-w-7xl md:px-6">
        <div className="flex items-center gap-3 md:gap-10">
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2E4C9A] lg:gap-10">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx("hover:opacity-70", isActive(item.href) && "underline underline-offset-8")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" aria-label="На главную" className="absolute left-1/2 -translate-x-1/2">
          <Image src="/images/logo/logo.PNG" alt="MOE" width={160} height={52} className="h-10 w-auto md:h-12" priority />
        </Link>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            href="/cart"
            id="site-cart-button"
            aria-label="Корзина"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2E4C9A]/70 text-[#2E4C9A] hover:bg-black/5 md:h-12 md:w-12"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 7h15l-1.2 12H7.2L6 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M9 7a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {itemsCount > 0 && (
              <span className="absolute -right-1 -top-1 h-[18px] min-w-[18px] rounded-full bg-[#2E4C9A] px-1 text-center text-[11px] leading-[18px] text-white">
                {itemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 right-0 top-16 z-50 border-t border-black/10 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx("block py-2 text-sm font-medium text-[#2E4C9A]", isActive(item.href) && "underline underline-offset-8")}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
