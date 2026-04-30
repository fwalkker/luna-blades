type Review = { name: string; loc: string; rating: number; quote: string };

const REVIEWS: Review[] = [
  {
    name: "Marcus T.",
    loc: "Portland, OR",
    rating: 5,
    quote:
      "I was dead set on dropping $400 on a saber for my birthday and ended up here instead. Six months in, this thing has tanked easily a hundred duels and looks brand new.",
  },
  {
    name: "Sarah R.",
    loc: "Bought as a gift",
    rating: 5,
    quote:
      "Got this for my fiancé who's been into Star Wars since he was a kid. He cried a little. The packaging alone made me feel like I picked the right thing.",
  },
  {
    name: "Devin K.",
    loc: "Austin, TX",
    rating: 5,
    quote:
      "I've owned three sabers from other brands. This is the first one where the hum actually sounds right and the colors don't look like a $20 toy.",
  },
  {
    name: "Olivia P.",
    loc: "Christmas gift",
    rating: 5,
    quote:
      "I know nothing about lightsabers. The site explained everything I needed. My nephew said it was the best gift he's ever gotten — and I look like a hero.",
  },
];

export default function Reviews() {
  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-14 flex items-end justify-between border-b border-(--color-hairline) pb-5">
          <div>
            <p className="eyebrow">Plate ⁄ 005</p>
            <h2 className="h-display mt-3 text-[44px] md:text-[64px]">
              <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>Said</span> by people<br />
              who own one.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-display text-[44px] leading-none">4.9</div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">avg from 124 reviews</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <article
              key={r.name}
              className={`relative rounded-lg border border-(--color-hairline) bg-(--color-ink-2) p-7 md:p-9 ${i === 0 ? "md:row-span-2" : ""}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-[3px] text-(--color-amber)">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-(--color-muted-2)">
                  Verified · {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className={`font-display text-[19px] leading-[1.45] text-(--color-bone-soft) ${i === 0 ? "md:text-[24px]" : ""}`}>
                "{r.quote}"
              </p>
              <footer className="mt-7 flex items-baseline gap-3">
                <span className="font-display text-[15px] tracking-tight">{r.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">— {r.loc}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Star() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2 14.6 8.6 22 9.3l-5.5 5 1.7 7.4L12 17.9 5.8 21.7l1.7-7.4-5.5-5 7.4-.7Z" />
    </svg>
  );
}
