import Link from "next/link";

/**
 * Centered banner CTA — single big H2 + a button.
 */
export default function BannerCTA() {
  return (
    <section className="border-y border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1100px] text-center">
        <h2 className="font-display mx-auto max-w-[18ch] text-[36px] uppercase leading-[0.95] tracking-tight md:text-[56px]">
          Pair any saber, save 20%
        </h2>
        <p className="mx-auto mt-5 max-w-[42ch] text-[15px] text-(--color-bone-soft)">
          Pick any second saber from the rack at checkout. The discount applies automatically.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">Browse all 13</Link>
        </div>
      </div>
    </section>
  );
}
