const FAQS = [
  {
    q: "Is this a real metal saber, or a costume prop?",
    a: "Real metal. The hilt is T6 aircraft aluminum — the same alloy used in plane fuselages — machined and anodized in our shop. It has weight in the hand. The blade is dueling-grade polycarbonate, not the thin plastic you find on costume props.",
  },
  {
    q: "Will it actually take a hit, or do I need to baby it?",
    a: "It will take a hit. Polycarbonate is what police riot shields are made from. People duel with these for years. If you somehow break a blade, replacement blades are $25 and ship in 48h.",
  },
  {
    q: "How does it charge? How long does it last?",
    a: "USB-C, fully recharges in about 90 minutes, runs ~5 hours of use on a charge. The battery is rated for 1,000+ cycles and is replaceable.",
  },
  {
    q: "Can my kid use it?",
    a: "Yes. Recommended for ages 12+ for full duels. Younger kids love the lights and sounds and can hold it safely — just supervise the swinging.",
  },
  {
    q: "How fast is shipping?",
    a: "We ship from California, weekdays only. Most US orders arrive in 3–5 business days. Free shipping over $99, and we'll text you tracking the moment it leaves the building.",
  },
];

export default function FAQ() {
  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto grid max-w-[1340px] gap-12 md:grid-cols-[280px_1fr]">
        <div>
          <p className="eyebrow">Plate ⁄ 007</p>
          <h2 className="h-display mt-3 text-[44px] leading-[0.92] md:text-[58px]">
            What people<br />
            <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>actually ask.</span>
          </h2>
        </div>

        <div className="border-t border-(--color-hairline-strong)">
          {FAQS.map((f, i) => (
            <details key={i} className="group border-b border-(--color-hairline)">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 transition hover:text-(--color-bone) text-(--color-bone-soft)">
                <span className="flex items-baseline gap-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] tabular-nums text-(--color-muted-2)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[20px] leading-tight tracking-tight md:text-[22px]">{f.q}</span>
                </span>
                <svg className="chev shrink-0 transition-transform duration-300" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1" />
                </svg>
              </summary>
              <p className="max-w-[68ch] pb-7 pl-[44px] text-[15px] leading-relaxed text-(--color-bone-soft)">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
