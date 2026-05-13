/**
 * Durablade vs Xenopixel — picks for the customer who's choosing between
 * "looks stunning, lasts forever" and "every effect under the sun."
 * We push Durablade as the default — it sells better and breaks less.
 */
export default function BladeComparison() {
  return (
    <section className="border-t border-(--color-hairline) px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1230px]">
        <header className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">
            Plate ⁄ 005 · Choose your blade
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-[22ch] text-[44px] uppercase leading-[0.95] tracking-tight md:text-[64px]">
            Two blades.<br />
            <span className="text-(--color-blue)">Pick your light.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[58ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
            Every Luna hilt accepts either blade. One is the workhorse — a deep,
            even glow that survives anything you throw at it. The other is a
            scrolling, pixel-perfect light show. Most people pick the first.
          </p>
        </header>

        {/* Two cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
          <DurabladeCard />
          <XenopixelCard />
        </div>

        {/* Spec comparison table */}
        <div className="mt-16 overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink-2)">
          <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr] border-b border-(--color-hairline) bg-(--color-ink) px-5 py-4 text-[11px] uppercase tracking-[0.22em] md:px-8">
            <span className="text-(--color-muted)">Spec</span>
            <span className="text-(--color-blue)">Durablade</span>
            <span className="text-(--color-bone-soft)">Xenopixel</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.label}
              className={`grid grid-cols-[1.2fr_1.4fr_1.4fr] gap-3 px-5 py-4 text-[13px] leading-snug md:px-8 md:text-[14px] ${
                i < ROWS.length - 1 ? "border-b border-(--color-hairline)" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">
                {r.label}
              </span>
              <span className="text-(--color-bone)">{r.durablade}</span>
              <span className="text-(--color-bone-soft)">{r.xenopixel}</span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[60ch] text-center text-[14px] leading-relaxed text-(--color-bone-soft) md:text-[15px]">
          Not sure? Get the <span className="text-(--color-blue)">Durablade</span>.
          It's the one we ship to first-time owners, kids, and anyone who plans to
          actually swing it. You can always add a Xenopixel blade later — they're
          swappable in under a minute.
        </p>
      </div>
    </section>
  );
}

/* ============ Cards ============ */

function DurabladeCard() {
  return (
    <article className="relative overflow-hidden rounded-lg border border-(--color-blue)/45 bg-(--color-ink-2) p-7 md:p-10">
      {/* glow wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-(--color-blue)/15 to-transparent"
      />

      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--color-blue)">
          Series A · Durablade
        </p>
        <span className="rounded-full border border-(--color-blue)/60 bg-(--color-blue)/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-(--color-blue)">
          Recommended
        </span>
      </div>

      <h3 className="font-display relative mt-6 text-[32px] uppercase leading-[0.95] tracking-tight text-(--color-bone) md:text-[40px]">
        Stunning glow.<br />
        <span className="text-(--color-blue)">Built like a crowbar.</span>
      </h3>

      <span className="relative mt-5 block h-px w-[70%] max-w-[320px] bg-(--color-blue)/50" />

      <p className="relative mt-6 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone)">
        A high-output 10W LED in the hilt fires up through the blade — clean,
        deep, even light from emitter to tip. No electronics inside the blade
        itself, so it shrugs off heavy strikes that would chew through a pixel
        strip.
      </p>

      <ul className="relative mt-6 space-y-2 text-[14px] text-(--color-bone-soft)">
        <Bullet>Twelve colors, switchable in-hilt</Bullet>
        <Bullet>Flash-on-clash, smooth ignition, ten sound fonts</Bullet>
        <Bullet>~6 hours of duel time per charge</Bullet>
        <Bullet>Replacement blades from $25, ships same day</Bullet>
      </ul>

      <p className="relative mt-7 text-[12px] uppercase tracking-[0.22em] text-(--color-blue)">
        For duelists, kids, daily carry.
      </p>
    </article>
  );
}

function XenopixelCard() {
  return (
    <article className="relative overflow-hidden rounded-lg border border-(--color-hairline-strong) bg-(--color-ink) p-7 md:p-10">
      {/* rainbow shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,80,80,0.18) 0%, rgba(255,196,74,0.14) 25%, rgba(91,227,154,0.14) 50%, rgba(91,184,255,0.16) 75%, rgba(197,139,255,0.14) 100%, transparent)",
        }}
      />

      <div className="relative flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--color-bone-soft)">
          Series B · Xenopixel
        </p>
        <span className="rounded-full border border-(--color-hairline-strong) bg-(--color-ink-2) px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-(--color-muted)">
          For the obsessed
        </span>
      </div>

      <h3 className="font-display relative mt-6 text-[32px] uppercase leading-[0.95] tracking-tight text-(--color-bone) md:text-[40px]">
        Every effect.<br />
        <span className="text-(--color-bone-soft)">Per-pixel chaos.</span>
      </h3>

      <span className="relative mt-5 block h-px w-[70%] max-w-[320px] bg-(--color-hairline-strong)" />

      <p className="relative mt-6 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone-soft)">
        A 144-LED pixel strip runs the full length of the blade. Each pixel is
        independently addressable — that's how you get blaster bolts, fire
        blade, scrolling rainbows, and unstable flicker. It's the most insane
        light show we make.
      </p>

      <ul className="relative mt-6 space-y-2 text-[14px] text-(--color-bone-soft)">
        <Bullet muted>34 effect modes, 16M color picker</Bullet>
        <Bullet muted>Blaster bolts, ghost, melt, lockup, unstable</Bullet>
        <Bullet muted>~3 hours of duel time per charge</Bullet>
        <Bullet muted>Heavier blade — treat the strip with care</Bullet>
      </ul>

      <p className="relative mt-7 text-[12px] uppercase tracking-[0.22em] text-(--color-muted)">
        For content, conventions, full FX.
      </p>
    </article>
  );
}

function Bullet({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className={`mt-2 inline-block h-1 w-3 flex-shrink-0 ${
          muted ? "bg-(--color-muted)" : "bg-(--color-blue)"
        }`}
      />
      <span>{children}</span>
    </li>
  );
}

/* ============ Spec rows ============ */

const ROWS = [
  { label: "LED tech",     durablade: "In-hilt 10W high-output array",        xenopixel: "144-LED pixel strip, full length" },
  { label: "Look",         durablade: "Even, deep glow — emitter to tip",     xenopixel: "Per-pixel animation, scrolling FX" },
  { label: "Effects",      durablade: "Clean ignition, flash on clash",       xenopixel: "Blaster bolts, fire, unstable, scroll" },
  { label: "Colors",       durablade: "12 preset colors",                     xenopixel: "16M, scriptable per pixel" },
  { label: "Durability",   durablade: "Tank — no electronics in the blade",   xenopixel: "Strong, but baby the strip" },
  { label: "Battery",      durablade: "~6 hours of duel time",                xenopixel: "~3 hours of duel time" },
  { label: "Blade weight", durablade: "Lighter, faster swing",                xenopixel: "+90g, weightier feel" },
  { label: "Replacement",  durablade: "$25, ships same day",                  xenopixel: "$95, ships in 48h" },
  { label: "Best for",     durablade: "Duelists, kids, daily use",            xenopixel: "Show-offs, creators, full FX" },
];
