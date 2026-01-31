import Link from "next/link";
import Container from "./Container";

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-neutral-800 bg-neutral-950">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-base font-semibold">Магазин</div>
            <div className="text-sm text-neutral-400">
              Витрина + заказ. Оплату подключим позже.
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold">Информация</div>
            <div className="grid gap-2 text-neutral-300">
              <Link className="hover:text-white" href="/about">О нас</Link>
              <Link className="hover:text-white" href="/delivery">Доставка</Link>
              <Link className="hover:text-white" href="/returns">Возврат</Link>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold">Контакты</div>
            <div className="text-neutral-300">Тел: +7 …</div>
            <div className="text-neutral-300">Email: …</div>
          </div>
        </div>

        <div className="mt-8 text-xs text-neutral-500">
          © {new Date().getFullYear()} Все права защищены
        </div>
      </Container>
    </footer>
  );
}
