import Link from "next/link";
import { Container } from "@/components/ui/container";

const navigation = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О нас" },
  { href: "/cart", label: "Корзина" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-[#f7f1e8]/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-[0.2em] text-stone-900">
          MOE
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-stone-700">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
