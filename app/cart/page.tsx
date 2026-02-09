import CartClient from "../../components/cart/CartClient";

export const runtime = "nodejs";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Корзина</h1>
        <div className="mt-6">
          <CartClient />
        </div>
      </div>
    </main>
  );
}
