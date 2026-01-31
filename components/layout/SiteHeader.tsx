import Link from "next/link";
import Container from "./Container";
import CartLink from "./CartLink";
import HeaderSearch from "./HeaderSearch";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <Container className="py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Магазин
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-300">
            <Link className="hover:text-white" href="/about">О нас</Link>
            <Link className="hover:text-white" href="/delivery">Доставка</Link>
            <Link className="hover:text-white" href="/contacts">Контакты</Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <HeaderSearch />
            {/* вместо обычной ссылки */}
            <CartLink />
          </div>
        </div>
      </Container>
    </header>
  );
}
