import ProductCard from "./ProductCard";

type Item = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  priceFrom: number;
  thumb: { url: string; alt: string } | null;
  sizes: string[];
  colors: string[];
};

export default function ProductGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}