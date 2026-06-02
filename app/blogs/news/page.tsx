import Link from "next/link";

export const metadata = { title: "Journal — Luna Blades" };

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
          <div className="rounded-lg border border-(--color-hairline) bg-(--color-ink-2) px-8 py-20 text-center md:py-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-(--color-blue)">
              Coming soon
            </p>
            <h2 className="font-display mx-auto mt-6 max-w-[22ch] text-[28px] uppercase leading-[1] tracking-tight md:text-[42px]">
              First posts are being written.
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-[14px] leading-relaxed text-(--color-bone-soft) md:text-[15px]">
              Buyer guides, electronics explainers, and behind-the-bench notes from the workshop. Drop us a line if there's something you'd like us to write about first.
            </p>
            <Link href="/pages/contact" className="btn btn-primary mt-9">Request a topic</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
