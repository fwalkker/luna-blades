import { notFound } from "next/navigation";
import { getAllProducts, type Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const COLLECTIONS: Record<string, { title: string; sub: string; filter: (p: Product) => boolean }> = {
  originals: {
    title: "Sabers",
    sub: "Every blade we make.",
    filter: () => true,
  },
  combat: {
    title: "Combat-rated",
    sub: "Reinforced blade walls, stronger emitters, dueling-grade everything.",
    filter: (p) => /combat|battle/i.test(p.handle) || true,
  },
  accessories: {
    title: "Accessories",
    sub: "Display stands, hardcases, blade plugs, replacement blades.",
    filter: () => false,
  },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COLLECTIONS[slug];
  if (!c) return {};
  return { title: `${c.title} — Luna Blades`, description: c.sub };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COLLECTIONS[slug];
  if (!c) notFound();

  const all = await getAllProducts();
  const items = all.filter(c.filter);

  return (
    <article>
      <section className="border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <p className="eyebrow">Collection · {slug}</p>
          <h1 className="h-display mt-5 text-[48px] leading-[0.95] md:text-[88px]">
            {c.title.split(" ")[0]}
            <span className="block text-(--color-blue)">{c.title.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">{c.sub}</p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1230px]">
          {items.length === 0 ? (
            <p className="text-center text-[14px] text-(--color-muted)">Coming soon.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.handle} product={p} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
