"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, Variant } from "@/lib/products";
import { bladeHex, SPECS } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { QTY_TIERS, getBundleDiscount } from "@/lib/bundle-tiers";
import { trackProductView, trackAddToCart } from "@/lib/analytics";
import MediaModal from "./MediaModal";
import Price from "./Price";

type TabKey = "details" | "specs" | "uses" | "care";

const TABS: { key: TabKey; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "specs", label: "Specs" },
  { key: "uses", label: "Uses" },
  { key: "care", label: "Care" },
];

function findVariant(variants: Variant[], selected: Record<string, string>): Variant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every((so) => selected[so.name] === so.value)
  );
}

function defaultSelection(product: Product): Record<string, string> {
  const out: Record<string, string> = {};
  for (const opt of product.options) out[opt.name] = opt.values[0];
  return out;
}

function isDefaultTitleOnly(product: Product): boolean {
  return (
    product.options.length === 0 ||
    (product.options.length === 1 &&
      product.options[0].name === "Title" &&
      product.options[0].values.length === 1 &&
      product.options[0].values[0] === "Default Title")
  );
}

export default function PDPHero({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const hex = bladeHex(product.blade);

  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>(() => defaultSelection(product));
  const [qty, setQty] = useState<number>(1);
  const [tab, setTab] = useState<TabKey>("details");
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const variant = useMemo(() => {
    return findVariant(product.variants, selected) ?? product.variants[0];
  }, [product.variants, selected]);

  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAt ?? product.compareAt;
  const onSale = compareAt && compareAt > price;
  const available = variant?.available ?? product.available;
  const showOptions = !isDefaultTitleOnly(product);

  // Bundle math — display only. Real money applied via Shopify automatic discounts.
  const baseTotal = price * qty;
  const bundleDiscount = getBundleDiscount(qty);
  const finalTotal = Math.max(0, baseTotal - bundleDiscount);

  useEffect(() => {
    trackProductView({ handle: product.handle, title: product.title, price });
  }, [product.handle, product.title, price]);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show sticky when the main CTA has scrolled ABOVE the viewport.
        // If it's below (user hasn't scrolled to it yet), keep sticky hidden.
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        setShowSticky(scrolledPast);
      },
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleAdd() {
    if (!variant) return;
    const variantSuffix =
      variant.title && variant.title !== "Default Title" ? ` — ${variant.title}` : "";
    add({
      variantId: variant.id,
      handle: product.handle,
      title: `${product.title}${variantSuffix}`,
      price,
      image: product.images[0],
      blade: hex,
      kind: "saber",
      qty,
    });
    openCart();
    trackAddToCart({ handle: product.handle, title: product.title, price, qty });
  }

  return (
    <section className="border-b border-(--color-hairline) px-5 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20">
      <div className="mx-auto grid w-full min-w-0 max-w-[1230px] grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <Gallery images={product.images} title={product.title} onZoom={setZoomSrc} />

        <div className="space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">Luna Blades</p>
            <h1 className="font-display mt-3 text-[32px] uppercase leading-[1] tracking-tight md:text-[40px]">
              {product.title}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <Price
                amount={price}
                className="font-display text-[24px] tabular-nums text-(--color-blue)"
              />
              {onSale && (
                <>
                  <span className="font-mono text-[14px] tabular-nums text-(--color-muted) line-through">
                    <Price amount={compareAt!} precise />
                  </span>
                  <span className="rounded-full border border-(--color-blue) bg-(--color-blue)/15 px-2.5 py-[2px] text-[10px] font-semibold uppercase tracking-[0.18em] text-(--color-blue)">
                    Save {Math.round(((compareAt! - price) / compareAt!) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[13px]">
              <span className="flex gap-[2px] text-(--color-blue)">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </span>
              <Link
                href="#reviews"
                className="text-(--color-bone-soft) underline-offset-2 hover:text-(--color-bone) hover:underline"
              >
                4.9 based on 400+ Reviews
              </Link>
            </div>
          </div>

          {/* CARD 1 — variant + qty + CTA */}
          <div className="rounded-lg border border-(--color-hairline-strong) bg-(--color-ink-2) p-5 md:p-6">
            {product.tagline && (
              <p className="text-[13px] leading-relaxed text-(--color-bone-soft) md:text-[14px]">
                {product.tagline}
              </p>
            )}

            {showOptions && (
              <>
                {product.tagline && <Divider />}
                <div className="space-y-5">
                  {product.options.map((opt) => (
                    <div key={opt.name}>
                      <div className="flex items-center gap-2">
                        <Label>
                          {opt.name}:&nbsp;
                          <span className="font-semibold text-(--color-bone)">{selected[opt.name]}</span>
                        </Label>
                        {/internals|blade/i.test(opt.name) && (
                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById("compare")?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            aria-label="Compare blade options"
                            className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full border border-(--color-bone-soft) text-[9px] font-semibold leading-none text-(--color-bone-soft) transition hover:border-(--color-blue) hover:text-(--color-blue)"
                          >
                            i
                          </button>
                        )}
                      </div>
                      <div
                        className={`mt-3 grid gap-3 ${
                          opt.values.length <= 2
                            ? "grid-cols-2"
                            : opt.values.length === 3
                              ? "grid-cols-3"
                              : "grid-cols-2 sm:grid-cols-4"
                        }`}
                      >
                        {opt.values.map((value) => {
                          const isSelected = selected[opt.name] === value;
                          // Test if this value combined with other current selections yields an available variant
                          const probe = { ...selected, [opt.name]: value };
                          const probeVariant = findVariant(product.variants, probe);
                          const valueAvailable = probeVariant?.available ?? false;
                          const probePrice = probeVariant?.price;
                          const probeCompare = probeVariant?.compareAt;
                          const probeOnSale = probeCompare && probePrice && probeCompare > probePrice;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setSelected({ ...selected, [opt.name]: value })}
                              disabled={!valueAvailable && !isSelected}
                              className={`group relative rounded-lg border-2 px-4 py-4 text-left transition ${
                                isSelected
                                  ? "border-(--color-blue) bg-(--color-blue)/15 ring-2 ring-(--color-blue)/40"
                                  : valueAvailable
                                    ? "border-(--color-hairline) bg-(--color-ink) hover:border-(--color-hairline-strong)"
                                    : "cursor-not-allowed border-(--color-hairline) bg-(--color-ink) opacity-40"
                              }`}
                            >
                              <p className="font-display text-[15px] uppercase tracking-tight text-(--color-bone) md:text-[16px]">
                                {value}
                              </p>
                              {probePrice !== undefined && (
                                <div className="mt-1 flex items-baseline gap-2">
                                  <Price
                                    amount={probePrice}
                                    className="font-mono text-[12px] tabular-nums text-(--color-bone)"
                                  />
                                  {probeOnSale && (
                                    <span className="font-mono text-[10px] tabular-nums text-(--color-muted) line-through">
                                      <Price amount={probeCompare!} />
                                    </span>
                                  )}
                                </div>
                              )}
                              {!valueAvailable && (
                                <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-(--color-muted)">
                                  Sold out
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Divider />

            {/* Quantity tiers */}
            <Label>Quantity</Label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {QTY_TIERS.map((t) => {
                const isSelected = qty === t.qty;
                return (
                  <button
                    key={t.qty}
                    type="button"
                    onClick={() => setQty(t.qty)}
                    className={`group overflow-hidden rounded-lg border-2 text-center transition ${
                      isSelected
                        ? "border-(--color-blue) ring-2 ring-(--color-blue)/40"
                        : "border-(--color-hairline) hover:border-(--color-hairline-strong)"
                    }`}
                  >
                    <div
                      className={`px-1 py-1 text-[8.5px] font-semibold uppercase leading-tight tracking-[0.05em] ${
                        isSelected
                          ? "bg-(--color-blue)/30 text-(--color-bone)"
                          : "bg-(--color-ink) text-(--color-bone-soft)"
                      }`}
                    >
                      {t.freeShipping && <span className="block">Free Shipping</span>}
                      {t.discountAmount > 0 ? `$${t.discountAmount} OFF` : " "}
                    </div>
                    <div
                      className={`py-3 ${
                        isSelected ? "bg-(--color-blue) text-white" : "bg-(--color-ink-2) text-(--color-bone)"
                      }`}
                    >
                      <p className="font-display text-[26px] leading-none">{t.qty}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.15em] opacity-90">{t.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-(--color-muted)">
              {available
                ? variant && variant.quantityAvailable > 0 && variant.quantityAvailable <= 10
                  ? `Only ${variant.quantityAvailable} left · ships in 48h`
                  : "In stock · ships in 48h · bundle savings applied at checkout"
                : "Out of stock"}
            </p>

            {/* CTA */}
            <button
              ref={ctaRef}
              type="button"
              onClick={handleAdd}
              disabled={!available || !variant}
              className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full bg-(--color-blue) px-6 py-5 font-display text-[14px] uppercase tracking-[0.18em] text-white transition hover:bg-(--color-blue-soft) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{available ? "Add to cart" : "Sold out"}</span>
              {available && (
                <>
                  <span className="opacity-50">—</span>
                  {bundleDiscount > 0 && (
                    <span className="font-mono text-[12px] tabular-nums opacity-70 line-through">
                      <Price amount={baseTotal} precise />
                    </span>
                  )}
                  <Price amount={finalTotal} precise className="tabular-nums" />
                </>
              )}
            </button>

            {available && bundleDiscount > 0 ? (
              <p className="mt-3 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-(--color-bone)">
                You save <Price amount={bundleDiscount} /> · bundle deal
              </p>
            ) : (
              <p className="mt-3 text-center text-[11px] text-(--color-muted)">
                Lifetime blade replacement
              </p>
            )}
          </div>

          {/* CARD 2 — inline tabs */}
          <div className="rounded-lg border border-(--color-hairline-strong) bg-(--color-ink-2)">
            <div className="grid grid-cols-4 border-b border-(--color-hairline)">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative px-2 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition md:text-[12px] ${
                    tab === t.key ? "text-(--color-bone)" : "text-(--color-muted) hover:text-(--color-bone-soft)"
                  }`}
                >
                  {t.label}
                  {tab === t.key && (
                    <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-(--color-blue)" />
                  )}
                </button>
              ))}
            </div>
            <div className="px-5 py-5 md:px-6 md:py-6">
              {tab === "details" && <DetailsPanel product={product} />}
              {tab === "specs" && <SpecsPanel />}
              {tab === "uses" && <UsesPanel />}
              {tab === "care" && <CarePanel />}
            </div>
          </div>
        </div>
      </div>

      <MediaModal
        open={zoomSrc !== null}
        onClose={() => setZoomSrc(null)}
        image={zoomSrc || undefined}
      />

      {/* Sticky add-to-cart — appears when the main CTA scrolls out of view.
          Mobile: full-width bottom bar. Desktop: floating card bottom-right. */}
      <div
        className={`fixed inset-x-3 bottom-3 z-40 transform transition-all duration-300 ease-out md:inset-x-auto md:bottom-4 md:right-4 md:w-[min(620px,calc(100vw-2rem))] ${
          showSticky
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-(--color-hairline-strong) bg-(--color-ink-2)/95 p-2.5 shadow-2xl backdrop-blur-md md:gap-4 md:p-3">
          {product.images[0] && (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-(--color-hairline) bg-(--color-ink) md:h-20 md:w-20">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="80px"
                className="object-contain p-1 md:p-1.5"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted) md:block">
              Luna Blades
            </p>
            <p className="truncate font-display text-[14px] uppercase leading-tight tracking-tight text-(--color-bone) md:mt-0.5 md:text-[20px]">
              {product.title}
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2 md:mt-1">
              <Price
                amount={finalTotal}
                className="font-display text-[15px] tabular-nums text-(--color-blue) md:text-[16px]"
              />
              {bundleDiscount > 0 && (
                <span className="font-mono text-[11px] tabular-nums text-(--color-muted) line-through md:text-[12px]">
                  <Price amount={baseTotal} />
                </span>
              )}
              {bundleDiscount > 0 && (
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-(--color-blue) md:text-[11px]">
                  Save <Price amount={bundleDiscount} />
                </span>
              )}
            </div>
            <div className="mt-1.5 hidden flex-wrap items-center gap-1.5 md:flex">
              <span className="inline-block rounded-full border border-(--color-blue)/50 bg-(--color-blue)/15 px-2.5 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-(--color-bone)">
                Qty {qty}
              </span>
              {variant && variant.title && variant.title !== "Default Title" && (
                <span className="inline-block rounded-full bg-(--color-blue) px-2.5 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                  {variant.title}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!available || !variant}
            className="shrink-0 rounded-full bg-(--color-blue) px-4 py-3 font-display text-[12px] uppercase tracking-[0.16em] text-white transition hover:bg-(--color-blue-soft) disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-4 md:text-[13px]"
          >
            <span className="md:hidden">{available ? "Add" : "Sold out"}</span>
            <span className="hidden md:inline">{available ? "Add to cart" : "Sold out"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============== Inline tab panels ============== */

function DetailsPanel({ product }: { product: Product }) {
  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-(--color-bone-soft)">
      {product.story ? (
        product.story.split(/\r?\n\r?\n/).map((para, i) => (
          <p key={i}>{para}</p>
        ))
      ) : (
        <p>No description yet — add one in Shopify admin.</p>
      )}
    </div>
  );
}

function SpecsPanel() {
  return (
    <dl className="space-y-2.5 text-[13px]">
      {SPECS.map((r) => (
        <div key={r.label} className="grid grid-cols-[110px_1fr] gap-3 border-b border-(--color-hairline) pb-2.5">
          <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">
            {r.label}
          </dt>
          <dd className="text-(--color-bone-soft)">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function UsesPanel() {
  return (
    <ul className="space-y-3 text-[13px] leading-relaxed text-(--color-bone-soft)">
      {[
        ["Dueling", "Polycarbonate blades, clash-tuned audio. Take it to the park."],
        ["Display", "Foam-cut case included. Mount the hilt, plug the blade port."],
        ["Cosplay", "Twelve colors, motion sounds, instant ignite. Reads on camera."],
        ["Gifting", "Ships sealed with a hand-stamped quick-start card."],
      ].map(([h, b]) => (
        <li key={h}>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-bone)">{h}</p>
          <p className="mt-0.5">{b}</p>
        </li>
      ))}
    </ul>
  );
}

function CarePanel() {
  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-(--color-bone-soft)">
      <p>Built to be used — but a little care goes a long way.</p>
      <ul className="space-y-2 pl-1">
        {[
          'Wipe blade and hilt with a microfiber cloth after dueling',
          "Charge with the included USB-C cable, never overcharge overnight",
          "Lifetime emitter swap — covered for the original buyer",
          "Cracked a blade? Send a photo, we mail a replacement",
        ].map((line) => (
          <li key={line} className="flex items-baseline gap-2.5">
            <span className="text-(--color-blue)">▸</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============== Atoms ============== */

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.22em] text-(--color-bone-soft) ${className}`}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-5 border-t border-dashed border-(--color-hairline)" />;
}

/* ============== Gallery ============== */

function Gallery({
  images,
  title,
  onZoom,
}: {
  images: string[];
  title: string;
  onZoom: (src: string) => void;
}) {
  const [hero, ...rest] = images;
  const swiperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goTo(i: number) {
    const el = swiperRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  function handleScroll() {
    const el = swiperRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== activeIndex) setActiveIndex(i);
  }

  return (
    <>
      {/* Mobile: swipe carousel + thumbnail strip (inset within section padding,
          no negative margins so nothing can blow out the page width). */}
      <div className="md:hidden">
        <div
          ref={swiperRef}
          onScroll={handleScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <div key={src + i} className="w-full shrink-0 snap-center">
              <Tile
                src={src}
                title={title}
                index={i}
                total={images.length}
                onZoom={onZoom}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex w-full gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                className={`relative aspect-square w-[64px] shrink-0 overflow-hidden rounded-md border-2 transition ${
                  activeIndex === i
                    ? "border-(--color-blue) opacity-100"
                    : "border-(--color-hairline) opacity-55 hover:opacity-90"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: hero + 2-col grid */}
      <div className="hidden space-y-4 md:block">
        {hero && (
          <Tile src={hero} title={title} index={0} total={images.length} onZoom={onZoom} priority />
        )}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {rest.map((src, i) => (
              <Tile
                key={src + i}
                src={src}
                title={title}
                index={i + 1}
                total={images.length}
                onZoom={onZoom}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Tile({
  src,
  title,
  index,
  total,
  onZoom,
  priority,
}: {
  src: string;
  title: string;
  index: number;
  total: number;
  onZoom: (src: string) => void;
  priority?: boolean;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2)">
      <Image
        src={src}
        alt={`${title} — view ${index + 1}`}
        fill
        priority={priority}
        sizes={priority ? "(max-width: 768px) 100vw, 48vw" : "(max-width: 768px) 50vw, 24vw"}
        className="object-contain p-6 transition group-hover:scale-[1.02]"
        loading={priority || index < 2 ? "eager" : "lazy"}
      />
      <button
        onClick={() => onZoom(src)}
        aria-label="Zoom image"
        className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
        </svg>
        Zoom
      </button>
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-[3px] font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ============== Icons ============== */

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8s-3-4-5-4a2 2 0 0 0 0 4M12 8s3-4 5-4a2 2 0 0 1 0 4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 8h14l-1.2 12.2a1.6 1.6 0 0 1-1.6 1.4H7.8a1.6 1.6 0 0 1-1.6-1.4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
