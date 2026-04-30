"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { SPECS } from "@/lib/products";

type TabKey = "description" | "specs" | "shipping" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "specs", label: "Specifications" },
  { key: "shipping", label: "Shipping" },
  { key: "reviews", label: "Reviews" },
];

export default function PDPTabs({ product, hiltVariant }: { product: Product; hiltVariant?: string }) {
  const [tab, setTab] = useState<TabKey>("description");

  return (
    <section className="border-b border-(--color-hairline) bg-(--color-ink-2) px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1230px]">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 border-b border-(--color-hairline) md:gap-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-[12px] uppercase tracking-[0.22em] transition md:px-6 md:py-4 md:text-[13px] ${
                tab === t.key
                  ? "text-(--color-bone)"
                  : "text-(--color-muted) hover:text-(--color-bone-soft)"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-(--color-blue)" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-10 md:pt-12">
          {tab === "description" && <DescriptionPanel product={product} />}
          {tab === "specs" && <SpecsPanel hiltVariant={hiltVariant} />}
          {tab === "shipping" && <ShippingPanel />}
          {tab === "reviews" && <ReviewsPanel />}
        </div>
      </div>
    </section>
  );
}

function DescriptionPanel({ product }: { product: Product }) {
  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-14">
      <div className="max-w-[64ch] space-y-5 text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[16px]">
        <p>{product.story}</p>
        <p>
          The hilt is machined from a single billet of T6 aircraft aluminum, anodized in matte black, with a brass choke point that adds weight where you need it. The emitter is recessed and threaded — the blade locks in with a quarter-turn and won't loosen mid-strike.
        </p>
        <p>
          Inside the hilt: a 3W hi-fi speaker, a motion sensor for clash and swing detection, an addressable LED strip running the full length of the blade, and a USB-C charge port hidden under the pommel. Twelve colors and ten sound fonts are configurable from the app.
        </p>
        <p>
          Ships in a foam-cut presentation case with a written quick-start. If you ever crack a blade, send us a photo — we'll mail you a replacement, on us.
        </p>
      </div>
      <aside className="rounded-lg border border-(--color-hairline) bg-(--color-ink) p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">In the box</p>
        <ul className="mt-4 space-y-2.5 text-[14px] text-(--color-bone-soft)">
          {[
            `1× ${product.title} hilt`,
            "1× polycarbonate blade (chosen length)",
            "1× USB-C cable",
            "1× foam-cut presentation case",
            "1× quick-start card",
            "1× lifetime blade-replacement card",
          ].map((line) => (
            <li key={line} className="flex items-baseline gap-3">
              <span className="text-(--color-blue)">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function SpecsPanel({ hiltVariant }: { hiltVariant?: string }) {
  const rows = [...SPECS] as { label: string; value: string }[];
  if (hiltVariant) rows.splice(1, 0, { label: "Hilt geometry", value: hiltVariant });
  return (
    <div className="grid gap-10 md:grid-cols-[280px_1fr]">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">Plate ⁄ technical</p>
        <h3 className="font-display mt-3 text-[28px] uppercase tracking-tight md:text-[34px]">Spec sheet</h3>
        <p className="mt-4 max-w-[28ch] text-[13px] text-(--color-muted)">
          What's actually in the box, in plain language.
        </p>
      </div>
      <dl className="border-t border-(--color-hairline-strong)">
        {rows.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[140px_1fr] items-baseline gap-6 border-b border-(--color-hairline) py-4 md:grid-cols-[200px_1fr]">
            <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
              <span className="text-(--color-muted-2) tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="ml-3">{r.label}</span>
            </dt>
            <dd className="font-display text-[16px] tracking-tight md:text-[18px]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ShippingPanel() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[
        { h: "Free worldwide", b: "We pay shipping on every order over $99 — tracked and insured to most countries in 5–9 business days." },
        { h: "Ships in 48 hours", b: "Every order is hand-packed at our Long Beach workshop, weekdays only. You'll get a tracking link the moment it leaves." },
        { h: "30-day returns", b: "Don't love it? Send it back, even if the case has been opened. Refund hits the same card within a week." },
      ].map((c) => (
        <article key={c.h} className="rounded-lg border border-(--color-hairline) bg-(--color-ink) p-6">
          <h3 className="font-display text-[18px] uppercase tracking-tight">{c.h}</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-(--color-bone-soft)">{c.b}</p>
        </article>
      ))}
    </div>
  );
}

function ReviewsPanel() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-6 border-b border-(--color-hairline) pb-6">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[44px] leading-none">4.9</span>
          <span className="flex gap-[3px] text-(--color-blue)">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
              </svg>
            ))}
          </span>
        </div>
        <span className="text-[13px] text-(--color-bone-soft)">based on 124 verified reviews</span>
      </div>
      <p className="mt-6 max-w-[60ch] text-[14px] text-(--color-muted)">
        Click the Reviews section further down the page to read the long ones.
      </p>
    </div>
  );
}
