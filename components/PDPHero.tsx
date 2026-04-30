"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product, Variant } from "@/lib/products";
import { bladeHex, SPECS } from "@/lib/products";
import { money, moneyPrecise } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import MediaModal from "./MediaModal";

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

  const variant = useMemo(() => {
    return findVariant(product.variants, selected) ?? product.variants[0];
  }, [product.variants, selected]);

  const price = variant?.price ?? product.price;
  const compareAt = variant?.compareAt ?? product.compareAt;
  const onSale = compareAt && compareAt > price;
  const available = variant?.available ?? product.available;
  const showOptions = !isDefaultTitleOnly(product);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent", {
        content_ids: [product.handle],
        content_name: product.title,
        content_type: "product",
        value: price,
        currency: "USD",
      });
    }
  }, [product.handle, product.title, price]);

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
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_ids: [product.handle],
        content_name: product.title,
        value: price * qty,
        currency: "USD",
      });
    }
  }

  return (
    <section className="border-b border-(--color-hairline) px-5 pt-8 pb-16 md:px-8 md:pt-10 md:pb-20">
      <div className="mx-auto grid max-w-[1230px] gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <Gallery images={product.images} title={product.title} onZoom={setZoomSrc} />

        <div className="space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">Luna Blades</p>
            <h1 className="font-display mt-3 text-[32px] uppercase leading-[1] tracking-tight md:text-[40px]">
              {product.title}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-[24px] tabular-nums text-(--color-blue)">
                {money(price)}
              </span>
              {onSale && (
                <>
                  <span className="font-mono text-[14px] tabular-nums text-(--color-muted) line-through">
                    {moneyPrecise(compareAt!)}
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
                4.9 based on 4,448 Reviews
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
                      <Label>
                        {opt.name}:&nbsp;
                        <span className="font-semibold text-(--color-bone)">{selected[opt.name]}</span>
                      </Label>
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

            {/* Quantity */}
            <Label>Quantity</Label>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-full border border-(--color-hairline-strong)">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-(--color-bone-soft) transition hover:text-(--color-bone)"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[44px] text-center font-display text-[16px] tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 text-(--color-bone-soft) transition hover:text-(--color-bone)"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-[12px] text-(--color-muted)">
                {available
                  ? variant && variant.quantityAvailable > 0 && variant.quantityAvailable <= 10
                    ? `Only ${variant.quantityAvailable} left · ships in 48h`
                    : "In stock · ships in 48h"
                  : "Out of stock"}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!available || !variant}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-(--color-blue) px-6 py-5 font-display text-[14px] uppercase tracking-[0.18em] text-white transition hover:bg-(--color-blue-soft) disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{available ? "Add to cart" : "Sold out"}</span>
              {available && (
                <>
                  <span className="opacity-50">—</span>
                  <span className="tabular-nums">{moneyPrecise(price * qty)}</span>
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-(--color-muted)">
              Free 30-day returns · Lifetime blade replacement
            </p>
          </div>

          {/* CARD 2 — gift callout */}
          <div className="flex items-center gap-4 rounded-lg border border-(--color-hairline-strong) bg-(--color-ink-2) px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-(--color-blue)/40 bg-(--color-blue)/10 text-(--color-blue)">
              <GiftIcon />
            </span>
            <p className="text-[13px] leading-relaxed text-(--color-bone-soft)">
              Buying multiple gifts? Send to multiple addresses{" "}
              <Link
                href="/pages/multi-gift"
                className="font-semibold text-(--color-blue) underline-offset-2 hover:underline"
              >
                here
              </Link>
              .
            </p>
          </div>

          {/* CARD 3 — inline tabs */}
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
  return (
    <div className="space-y-3 md:space-y-4">
      {hero && (
        <Tile src={hero} title={title} index={0} total={images.length} onZoom={onZoom} priority />
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
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
