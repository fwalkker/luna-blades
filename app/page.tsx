import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TrustStrip from "@/components/TrustStrip";
import GiftCallout from "@/components/GiftCallout";
import FAQ from "@/components/FAQ";

export default async function HomePage() {
  const products = await getAllProducts();
  const hero =
    products.find((p) => p.handle === "luna-obi-se") ?? products[0];
  const featured = products.slice(0, 6);

  return (
    <>
      <HomeHero />
      <FeaturedRow featured={featured} />
      <DuelingFeature hero={hero} />
      <Catalog products={products} />
      <Retention featured={featured} />
      <BundleBanner />
      <DurabilityBlock />
      <TrustStrip />
      <GiftCallout />
      <FAQ />
    </>
  );
}

/* =====================================================
   1. Hero — crossed sabers framing a centered headline
   ===================================================== */
function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-(--color-hairline)">
      {/* Stage: taller now that the sabers are larger. Blade tips intentionally
          run off the top edge (clipped) for a more cinematic frame. */}
      <div className="relative flex min-h-[640px] flex-col items-center justify-center px-5 py-10 md:min-h-[880px] md:px-8 md:py-16">
        {/* Soft radial glow tint behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, rgba(35,90,151,0.32), rgba(35,90,151,0.06) 55%, transparent 75%)",
          }}
        />

        {/* LEFT saber — blue. Handle pivot anchored to the LEFT side wall at ~60% from top.
            Box bottom-center is the rotation pivot (= where the handle of the saber sits).
            Box width/2 + extra is shifted off-screen to the left so the handle bleeds out. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 z-10 -translate-x-1/2 rotate-[45deg] origin-bottom"
          style={{
            bottom: "38%",
            width: "clamp(150px, 38vw, 580px)",
            height: "clamp(440px, 115vw, 1560px)",
            marginLeft: "-2vw",
          }}
        >
          <Image
            src="/saber-blue.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 26vw, 240px"
            className="object-contain object-bottom ignite"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* RIGHT saber — red. Mirror of the left: handle pivot at the RIGHT side wall. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 z-10 translate-x-1/2 -rotate-[45deg] origin-bottom"
          style={{
            bottom: "38%",
            width: "clamp(150px, 38vw, 580px)",
            height: "clamp(440px, 115vw, 1560px)",
            marginRight: "-2vw",
          }}
        >
          <Image
            src="/saber-red.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 26vw, 240px"
            className="object-contain object-bottom ignite"
            style={{ animationDelay: "550ms" }}
          />
        </div>

        {/* Centered text package — sits in the gap between the two saber handles
            at mid-height (the widest part of the in-between space). */}
        <div className="relative z-20 flex w-full max-w-[720px] flex-col items-center text-center">
          <h1 className="h-display rise rise-2 mt-4 text-[40px] leading-[0.92] md:mt-5 md:text-[112px] md:leading-[0.9]">
            Premium Sabers.
            <br />
            <span className="text-(--color-blue)">Actually Accessible.</span>
          </h1>

          <p className="rise rise-3 mt-5 max-w-[42ch] text-[14px] leading-[1.6] text-(--color-bone-soft) md:mt-7 md:text-[19px]">
            Aluminum hilts. Polycarbonate dueling blades. Motion-reactive sound. Explore our saber collection.
          </p>

          <div className="rise rise-4 mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="#catalog" className="btn btn-primary">Shop now</Link>
          </div>

          <div className="rise rise-4 mt-8 flex items-center gap-3 text-[12px] text-(--color-muted)">
            <span className="flex gap-[1px] text-(--color-blue)">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
                </svg>
              ))}
            </span>
            <span className="font-mono uppercase tracking-[0.22em]">4.9 · 12,400+ duelists</span>
          </div>
        </div>
      </div>

      {/* Marquee strip — value props */}
      <div className="relative overflow-hidden border-t border-(--color-hairline) py-5">
        <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap font-display text-[22px] uppercase tracking-[-0.01em] text-(--color-bone-soft) md:gap-16 md:text-[28px]">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center gap-12 md:gap-16">
              <span>Hand-finished hilts</span><Dot />
              <span>Pixel-strip blades</span><Dot />
              <span>USB-C charging</span><Dot />
              <span>Ten sound fonts</span><Dot />
              <span>Twelve colors</span><Dot />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="text-(--color-blue)">·</span>;
}

/* =====================================================
   2. Featured row — 4 sabers horizontal cards
   ===================================================== */
function FeaturedRow({ featured }: { featured: Product[] }) {
  return (
    <section className="px-5 py-20 md:px-8">
      <div className="mx-auto max-w-[1230px]">
        <header className="mb-10 grid items-end gap-6 border-b border-(--color-hairline) pb-5 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Plate ⁄ 01 — Featured</p>
            <h2 className="h-display mt-3 text-[36px] md:text-[56px]">In the spotlight</h2>
          </div>
          <Link href="#catalog" className="text-[12px] uppercase tracking-[0.22em] text-(--color-bone-soft) hover:text-(--color-bone)">
            See all →
          </Link>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((p, i) => (
            <ProductCard key={p.handle} product={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   3. Designed-for-dueling feature block
   ===================================================== */
function DuelingFeature({ hero }: { hero: Product | undefined }) {
  return (
    <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1230px] items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Built to take a hit</p>
          <h2 className="h-display mt-4 text-[40px] leading-[0.95] md:text-[68px]">
            Designed
            <br />
            for dueling.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone-soft)">
            Every blade is a <strong className="text-(--color-bone)">3mm polycarbonate tube</strong> — the same grade police use for riot shields. <strong className="text-(--color-bone)">Reinforced wall, deeper threading, stronger emitter mount.</strong>
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-[12px] uppercase tracking-[0.2em] text-(--color-muted)">
            <Stat label="Blade wall" value='3mm' />
            <Stat label="Drop tested" value='8 ft' />
            <Stat label="Strike rating" value='∞' />
          </div>
        </div>
        {hero?.images[0] && (
          <div className="relative aspect-[5/4] overflow-hidden rounded-lg border border-(--color-hairline)">
            <Image
              src={hero.images[0]}
              alt="Combat blade"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-10"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-[26px] tracking-tight text-(--color-bone)">{value}</p>
      <p className="mt-1 text-[10px] tracking-[0.22em] text-(--color-muted)">{label}</p>
    </div>
  );
}

/* =====================================================
   4. Full catalog grid
   ===================================================== */
function Catalog({ products }: { products: Product[] }) {
  return (
    <section id="catalog" className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1230px]">
        <header className="mb-12 grid items-end gap-6 border-b border-(--color-hairline) pb-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Plate ⁄ 02 — The rack</p>
            <h2 className="h-display mt-3 text-[44px] leading-[0.95] md:text-[76px]">
              {products.length === 0 ? "Coming soon" : `${products.length} saber${products.length === 1 ? "" : "s"}`}
            </h2>
          </div>
          <p className="max-w-[28ch] text-[14px] text-(--color-muted) md:text-right">
            Pick one. Or write to us — we'll help you pick the right one for whoever's getting it.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-center text-[14px] text-(--color-muted)">
            No products published yet. Add some in Shopify and they'll show up here.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.handle} product={p} idx={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   5. Customer-retention proof block
   ===================================================== */
function Retention({ featured }: { featured: Product[] }) {
  return (
    <section className="px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1230px] text-center">
        <p className="eyebrow">Word of mouth, mostly</p>
        <h2 className="h-display mx-auto mt-4 max-w-[14ch] text-[44px] leading-[0.95] md:text-[80px]">
          81% come back for a second saber.
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-[15px] text-(--color-bone-soft)">
          Not for repairs. They come back because the quality holds up — and they want a second one to match.
        </p>
        {featured.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 gap-4 md:grid-cols-4">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.handle} product={p} idx={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   6. Bundle banner (centered hero ATC)
   ===================================================== */
function BundleBanner() {
  return (
    <section className="relative overflow-hidden border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-28 md:px-8 md:py-36">
      <div className="relative mx-auto max-w-[1100px] text-center">
        <p className="eyebrow text-(--color-blue)">The Twin-Blade Bundle</p>
        <h2 className="h-display mx-auto mt-5 max-w-[18ch] text-[52px] leading-[0.95] md:text-[110px]">
          Save when you buy
          <br />
          multiple sabers.
        </h2>
        <p className="mx-auto mt-6 max-w-[42ch] text-[15px] text-(--color-bone-soft)">
          Because you can't really duel with one. Pick any pair from the collection and save an extra $20 per saber.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="#catalog" className="btn btn-primary">Shop now</Link>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   7. Durability assurance — 3-up dark cards
   ===================================================== */
function DurabilityBlock() {
  const cards = [
    { k: "01", t: "Built for the long fight", d: "Every blade ships with our reinforced DuraBlade wall. Heavy strikes, no cracking, no dimples." },
    { k: "02", t: "Lifetime blade replacement", d: "Crack a blade? Send a photo. We'll mail you a new one — once a year, on us." },
    { k: "03", t: "Loved by 12,400+ duelists", d: "Rated 4.9★ across 400+ verified reviews. Read the long ones. Read the angry ones." },
  ];
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1230px]">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.k} className="rounded-lg border border-(--color-hairline) bg-(--color-ink-2) p-8 md:p-10">
              <span className="font-mono text-[10px] tracking-[0.22em] text-(--color-blue)">{c.k}</span>
              <h3 className="font-display mt-5 text-[22px] uppercase tracking-tight md:text-[26px]">{c.t}</h3>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-(--color-bone-soft)">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
