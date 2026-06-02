import Link from "next/link";

export const metadata = {
  title: "Operation guides — Luna Blades",
  description:
    "How to power on, change colors, swap sound fonts, charge, and care for your Luna Blade.",
};

const GUIDES = [
  {
    slug: "duraBlade-1-button",
    name: "Luna DuraBlade — 1 Button",
    blurb: "Single-button control for combat models. Power, ignite, color, font, mute.",
    chapters: 7,
  },
  {
    slug: "duraBlade-2-button",
    name: "Luna DuraBlade — 2 Button",
    blurb: "Aux button adds gesture-mute, force-push effect, and font-swap shortcuts.",
    chapters: 9,
  },
  {
    slug: "pixel-1-button",
    name: "Luna Pixel — 1 Button",
    blurb: "For pixel-strip blades. Includes ignite/extend animations and blaster blocks.",
    chapters: 8,
  },
  {
    slug: "pixel-2-button",
    name: "Luna Pixel — 2 Button",
    blurb: "Full pixel control: scrolling effects, color profiles, deep menu, app sync.",
    chapters: 11,
  },
];

export default function GuidesPage() {
  return (
    <article>
      <section className="border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <p className="eyebrow">Manuals · Plate ⁄ 02</p>
          <h1 className="h-display mt-5 text-[48px] leading-[0.95] md:text-[88px]">
            Operation
            <span className="block text-(--color-blue)">guides.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
            Pick the guide that matches your saber. Each one walks through every button, light, sound, and gesture in plain English. No diagrams from the bridge of a star destroyer — just numbered steps.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1230px] gap-4 md:grid-cols-2">
          {GUIDES.map((g, i) => (
            <Link
              key={g.slug}
              href="/pages/contact"
              className="group relative flex flex-col rounded-lg border border-(--color-hairline) bg-(--color-ink-2) p-7 transition hover:border-(--color-hairline-strong) md:p-10"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-muted)">
                Manual {String(i + 1).padStart(2, "0")} · {g.chapters} chapters
              </span>
              <h2 className="font-display mt-5 text-[24px] uppercase tracking-tight md:text-[30px]">{g.name}</h2>
              <p className="mt-4 max-w-[40ch] text-[14px] leading-relaxed text-(--color-bone-soft)">{g.blurb}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-(--color-blue) transition group-hover:gap-3">
                Ask us about it <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1230px] text-center">
          <h2 className="h-display text-[36px] md:text-[56px]">
            Still stuck?
            <span className="block text-(--color-blue)">Write to a human.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-[15px] text-(--color-bone-soft)">
            Most messages get a reply inside 24 hours. We answer mail Monday–Friday from California.
          </p>
          <Link href="/pages/contact" className="btn btn-primary mt-8">Contact us</Link>
        </div>
      </section>
    </article>
  );
}
