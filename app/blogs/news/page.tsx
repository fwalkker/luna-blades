import Link from "next/link";

export const metadata = { title: "Journal — Luna Blades" };

const POSTS = [
  {
    slug: "what-is-a-pixel-saber",
    title: "What is a pixel saber, really?",
    blurb: "An honest explainer for anyone who's stared at a $400 listing and wondered what they were paying for.",
    date: "March 2026",
    minutes: 6,
  },
  {
    slug: "duraBlade-vs-pixel",
    title: "DuraBlade vs Pixel — which one's right for you?",
    blurb: "Two electronics platforms. Different price tiers. Different reasons to pick each. Here's the simple version.",
    date: "February 2026",
    minutes: 4,
  },
  {
    slug: "first-saber-checklist",
    title: "The first-saber checklist (for gift-givers who don't know what to ask)",
    blurb: "Six questions to answer before you buy. None of them require knowing anything about the franchise.",
    date: "January 2026",
    minutes: 5,
  },
];

export default function JournalPage() {
  return (
    <article>
      <section className="border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <p className="eyebrow">Journal · what we've been writing</p>
          <h1 className="h-display mt-5 text-[48px] leading-[0.95] md:text-[88px]">
            Field
            <span className="block text-(--color-blue)">notes.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[17px]">
            We write when we have something to say. Mostly explainers for first-time buyers and behind-the-scenes from the workshop.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1230px]">
          <div className="grid gap-px overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-hairline-strong) md:grid-cols-3">
            {POSTS.map((p) => (
              <Link
                key={p.slug}
                href={`/blogs/news/${p.slug}`}
                className="group flex flex-col bg-(--color-ink-2) p-8 transition hover:bg-(--color-ink) md:p-10"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--color-blue)">
                  {p.date} · {p.minutes} min
                </span>
                <h2 className="font-display mt-5 text-[22px] leading-[1.1] uppercase tracking-tight md:text-[26px]">{p.title}</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-(--color-bone-soft)">{p.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-(--color-bone-soft) transition group-hover:gap-3 group-hover:text-(--color-bone)">
                  Read article <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
