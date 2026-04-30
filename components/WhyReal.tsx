export default function WhyReal() {
  const cards = [
    {
      n: "i",
      t: "Real metal in the hand.",
      d: "T6 aircraft aluminum hilt with a brass choke point. It has weight. It feels like a tool, not a toy.",
    },
    {
      n: "ii",
      t: "A blade that can take a hit.",
      d: "Polycarbonate the same grade police use for riot shields. Drop it, swing it, knock it against another saber — it's fine.",
    },
    {
      n: "iii",
      t: "Sound that earns the lights.",
      d: "Motion-reactive audio over a 3W hi-fi speaker. Twelve colors, ten sound fonts, all controlled from your phone.",
    },
  ];
  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-14 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">For the gift-giver, mostly</p>
            <h2 className="h-display mt-3 text-[44px] leading-[0.92] md:text-[72px]">
              How you can tell<br />
              <span className="text-(--color-blue)">it's the real thing.</span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[14px] text-(--color-muted) md:text-right">
            Three quick checks. If a saber doesn't pass all three, it's a costume prop.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg bg-(--color-hairline-strong) md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.n} className="relative bg-(--color-ink) p-8 md:p-10">
              <span className="font-mono text-[12px] tracking-[0.22em] text-(--color-blue)">
                {c.n.toUpperCase()}
              </span>
              <h3 className="font-display mt-5 text-[24px] uppercase leading-[1.05] tracking-tight md:text-[28px]">{c.t}</h3>
              <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-(--color-bone-soft)">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
