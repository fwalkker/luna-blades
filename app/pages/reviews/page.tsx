import Reviews from "@/components/Reviews";

export const metadata = {
  title: "Reviews — Luna Blades",
  description: "What real owners say. 4.9★ across 2,800+ verified reviews.",
};

const STATS = [
  { v: "4.9", l: "average star rating" },
  { v: "2,847", l: "verified reviews" },
  { v: "94%", l: "would gift again" },
  { v: "12,400+", l: "duelists" },
];

const PRESS = [
  "“The honest lightsaber.” — The Verge",
  "“Best dueling saber under $300.” — Wired Gear",
  "“The one I'd actually buy a kid.” — Dad Reviewed",
];

export default function ReviewsPage() {
  return (
    <article>
      <section className="border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px] text-center">
          <p className="eyebrow">Reviews &amp; testimonials</p>
          <h1 className="h-display mx-auto mt-5 max-w-[18ch] text-[48px] leading-[0.95] md:text-[88px]">
            What people actually say
            <span className="block text-(--color-blue)">about owning one.</span>
          </h1>

          <div className="mx-auto mt-12 grid max-w-[1100px] grid-cols-2 gap-px overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-hairline-strong) md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="bg-(--color-ink-2) p-7">
                <p className="font-display text-[34px] leading-none text-(--color-bone) md:text-[44px]">{s.v}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1230px]">
          <p className="eyebrow text-center">Press</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-hairline-strong) md:grid-cols-3">
            {PRESS.map((p, i) => (
              <blockquote key={i} className="bg-(--color-ink-2) p-8 text-[15px] leading-relaxed text-(--color-bone-soft) md:p-10">
                {p}
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
