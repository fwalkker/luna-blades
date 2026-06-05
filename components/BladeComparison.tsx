/**
 * Saber comparison — Disney prop vs Baselit (recommended) vs Xenopixel (premium FX).
 */
export default function BladeComparison() {
  return (
    <section id="compare" className="scroll-mt-20 border-t border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1230px]">
        <header className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">
            Plate ⁄ 005 · Choose your blade
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-[22ch] text-[44px] uppercase leading-[0.95] tracking-tight md:text-[64px]">
            Compare<br />
            <span className="text-(--color-blue)">Models</span>
          </h2>
        </header>

        <p className="mx-auto mt-8 max-w-[60ch] text-center text-[15px] leading-relaxed text-(--color-bone-soft)">
          Buying for a kid? Get the <span className="text-(--color-blue)">Baselit ($129)</span>. It lights up, makes the swing and clash sounds, and is the tougher of the two. The Xenopixel is a premium upgrade with extra effects, aimed at collectors.
        </p>

        <ComparisonTable />

        <p className="mx-auto mt-6 max-w-[60ch] text-center text-[12px] leading-relaxed text-(--color-muted)">
          Disney sabers look the part, but aren't built to be swung or dropped.
        </p>
      </div>
    </section>
  );
}

type Mark = "yes" | "no" | "partial";

const COMPARISON_ROWS: { title: string; sub: string; disney: Mark; durablade: Mark; xenopixel: Mark }[] = [
  { title: "Real metal hilt",                          sub: "Aircraft aluminum, anodized",                                          disney: "no",      durablade: "yes",     xenopixel: "yes" },
  { title: "Tough, dueling-grade blade",               sub: "3mm polycarbonate, the same material used in police riot shields",     disney: "no",      durablade: "yes",     xenopixel: "yes" },
  { title: "Survives heavy duels",                     sub: "No fragile electronics in the blade",                                  disney: "yes",     durablade: "yes",     xenopixel: "partial" },
  { title: "Special blade effects",                    sub: "flickering, color-shifting, and animated lighting",                    disney: "no",      durablade: "no",      xenopixel: "yes" },
  { title: "34 effect modes and any color you want",   sub: "",                                                                     disney: "no",      durablade: "no",      xenopixel: "yes" },
  { title: "All-day battery (6 hr+)",                  sub: "USB-C, fast recharge",                                                 disney: "no",      durablade: "yes",     xenopixel: "partial" },
  { title: "Realistic sound",                          sub: "hum, swing, and clash sounds that react as you move it (10 sound packs)", disney: "partial", durablade: "yes",     xenopixel: "yes" },
];

function ComparisonTable() {
  return (
    <div className="mx-auto mt-12 max-w-[920px] overflow-hidden rounded-lg border border-white/15 bg-white/[0.04]">
      {/* Header band — slightly raised */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-white/15 bg-white/[0.06]">
        <div />
        <div className="px-2 py-4 text-center md:px-4">
          <p className="font-display text-[14px] tracking-tight text-(--color-bone) md:text-[16px]">Disney</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-(--color-muted)">Display prop only</p>
        </div>
        <div className="bg-[rgba(35,90,151,0.18)] px-2 py-4 text-center md:px-4">
          <p className="font-display text-[14px] tracking-tight text-(--color-bone) md:text-[16px]">Baselit</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-(--color-blue)" style={{ filter: "brightness(1.6)" }}>Recommended</p>
        </div>
        <div className="px-2 py-4 text-center md:px-4">
          <p className="font-display text-[14px] tracking-tight text-(--color-bone) md:text-[16px]">Xenopixel</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-amber-400">Premium FX</p>
        </div>
      </div>

      {COMPARISON_ROWS.map((row, i) => (
        <div
          key={row.title}
          className={`grid grid-cols-[1.4fr_1fr_1fr_1fr] ${
            i > 0 ? "border-t border-white/10" : ""
          }`}
        >
          <div className="px-4 py-4 md:px-6 md:py-5">
            <p className="text-[13px] font-semibold text-(--color-bone) md:text-[14px]">{row.title}</p>
            {row.sub && <p className="mt-0.5 text-[11px] text-(--color-bone-soft) md:text-[12px]">{row.sub}</p>}
          </div>
          <div className="flex items-center justify-center px-2 py-4 md:py-5">
            <MarkIcon mark={row.disney} />
          </div>
          <div className="flex items-center justify-center bg-[rgba(35,90,151,0.18)] px-2 py-4 md:py-5">
            <MarkIcon mark={row.durablade} highlight />
          </div>
          <div className="flex items-center justify-center px-2 py-4 md:py-5">
            <MarkIcon mark={row.xenopixel} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MarkIcon({ mark, highlight }: { mark: Mark; highlight?: boolean }) {
  if (mark === "yes") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className={highlight ? "text-sky-300" : "text-(--color-bone)"}
      >
        <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (mark === "no") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-(--color-muted-2)">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-(--color-muted)">
      <path d="M4 12c2-3 4-3 6 0s4 3 6 0s4-3 4-3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
