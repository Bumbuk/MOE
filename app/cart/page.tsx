import CartClient from "../../components/cart/CartClient";

export const runtime = "nodejs";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <CartClient />
    </main>
  );
}
