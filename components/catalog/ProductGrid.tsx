import ProductCard from "./ProductCard";

type Props = {
  items: Array<{
    id: string;
    title: string;
    slug: string;
    category: string | null;
    priceFrom: number;
    thumb: { url: string; alt: string } | null;
    sizes: string[];
    colors: string[];
  }>;
};

export default function ProductGrid({ items }: Props) {
  return (
    // Используем более крупную сетку: на маленьких экранах одна колонка,
    // на средних – две, на больших – три. Это увеличивает ширину карточек и
    // уменьшает «дёрганье» при наведении и скролле.
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
