import Link from "next/link";
import Image from "next/image";

type Props = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  category: string;
  title: string;
  priceRub: number;
  tall?: boolean; // для больших карточек
};

function formatRub(v: number) {
  return `₽ ${v.toLocaleString("ru-RU")}`;
}

export default function ProductCard({
  href,
  imageSrc,
  imageAlt,
  category,
  title,
  priceRub,
  tall,
}: Props) {
  return (
    <Link
      href={href}
      className={
        tall
          ? "group overflow-hidden rounded-2xl bg-black/5"
          : "group"
      }
    >
      <div className={tall ? "" : "overflow-hidden rounded-2xl bg-black/5"}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1200}
          height={1200}
          className={
            tall
              ? "h-[320px] w-full object-cover transition group-hover:scale-[1.02] md:h-[360px]"
              : "h-[260px] w-full object-cover transition group-hover:scale-[1.02]"
          }
          priority={false}
        />
      </div>

      {tall ? (
        <div className="px-4 py-4">
          <div className="text-xs text-black/40">{category}</div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-black/70">{title}</span>
            <span className="text-black/60">{formatRub(priceRub)}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 text-xs text-black/40">{category}</div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-black/70">{title}</span>
            <span className="text-black/60">{formatRub(priceRub)}</span>
          </div>
        </>
      )}
    </Link>
  );
}
