import Link from "next/link";
import Container from "./Container";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-black/10 bg-white">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-base font-semibold text-[#2E4C9A]">MOE</div>
            <div className="text-sm text-black/60">Интернет-магазин одежды с доставкой по России.</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-[#2E4C9A]">Навигация</div>
            <div className="grid gap-2 text-black/60">
              <Link href="/" className="hover:text-black/85">
                Главная
              </Link>
              <Link href="/catalog" className="hover:text-black/85">
                Каталог
              </Link>
              <Link href="/about" className="hover:text-black/85">
                О нас
              </Link>
              <Link href="/cart" className="hover:text-black/85">
                Корзина
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-[#2E4C9A]">Поддержка</div>
            <div className="text-black/60">Телефон: +7 ...</div>
            <div className="text-black/60">Email: ...</div>
          </div>
        </div>

        <div className="mt-8 text-xs text-black/50">© {new Date().getFullYear()} MOE. Все права защищены.</div>
      </Container>
    </footer>
  );
}
