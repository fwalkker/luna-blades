import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { money } from "@/lib/format";

export default function ProductCard({ product, idx }: { product: Product; idx: number }) {
  const onSale = product.compareAt && product.compareAt > product.price;
  const pct = onSale ? Math.round(((product.compareAt! - product.price) / product.compareAt!) * 100) : 0;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative block overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2) transition hover:border-(--color-hairline-strong)"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-(--color-ink-2)">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted-2)">
          № {String(idx + 1).padStart(2, "0")}
        </span>
        {onSale && (
          <span className="absolute right-3 top-3 rounded-full bg-(--color-amber) px-[10px] py-[5px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-ink)">
            −{pct}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto] items-end gap-3 px-5 pb-5 pt-5 md:px-6 md:pb-6">
        <div>
          <h3 className="font-display text-[22px] leading-[1.05] tracking-tight md:text-[24px]">{product.title}</h3>
          <p className="mt-1 font-display text-[14px] italic text-(--color-muted)">{product.tagline}</p>
        </div>
        <div className="text-right">
          <span className="font-display text-[24px] tabular-nums leading-none text-(--color-amber)">{money(product.price)}</span>
          {onSale && (
            <p className="mt-1 font-mono text-[11px] tabular-nums text-(--color-muted) line-through">
              {money(product.compareAt!)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
