import Link from "next/link";
import Container from "./Container";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[#F9B44D] bg-[var(--background)]">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-base font-semibold text-[#FF6634]">Магазин</div>
            <div className="text-sm text-[#4B7488]">
              Витрина + заказ. Оплату подключим позже.
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-[#FF6634]">Информация</div>
            <div className="grid gap-2 text-[#4B7488]">
              <Link className="hover:text-[#FF6634]" href="/about">
                О нас
              </Link>
              <Link className="hover:text-[#FF6634]" href="/delivery">
                Доставка
              </Link>
              <Link className="hover:text-[#FF6634]" href="/returns">
                Возврат
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-[#FF6634]">Контакты</div>
            <div className="text-[#4B7488]">Тел: +7 …</div>
            <div className="text-[#4B7488]">Email: …</div>
          </div>
        </div>

        <div className="mt-8 text-xs text-[#4B7488]">
          © {new Date().getFullYear()} Все права защищены
        </div>
      </Container>
    </footer>
  );
}
