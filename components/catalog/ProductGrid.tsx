import ProductCard from "./ProductCard";

type Props = {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    category: string | null;
    priceFrom: number;
    previewImages: { url: string; alt: string }[];
    colorSwatches: { name: string; hex: string | null }[];
  }>;
};

export default function ProductGrid({ items }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
