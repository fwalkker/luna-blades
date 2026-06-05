import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import Price from "@/components/Price";

export const metadata = {
  title: "New to lightsabers? Start here — Luna Blades",
  description:
    "A plain-English guide for first-time buyers: what these sabers actually are, which version to get, whether they're kid-safe, and what shows up in the box.",
};

const STEPS: { n: string; q: string; a: string }[] = [
  {
    n: "01",
    q: "What is this, exactly?",
    a: "A real metal lightsaber. The handle is machined aluminum with weight in the hand — not a hollow plastic toy. The blade is a thick polycarbonate tube that lights up edge to edge, makes hum, swing, and clash sounds, and runs off a rechargeable battery. Switch it on and it looks and sounds like the ones from the movies.",
  },
  {
    n: "02",
    q: "Which version should I get?",
    a: "For most people — and almost anyone buying for a kid — the Standard (Baselit) is the one. It lights up, makes the swing and clash sounds, and is the tougher of the two. The Premium (Xenopixel) adds extra effects and more color options, and is aimed at serious collectors. When in doubt, get the Baselit.",
  },
  {
    n: "03",
    q: "Is it safe for kids?",
    a: "Yes, with normal supervision. The blade is dueling-grade polycarbonate — the same material as police riot shields — so it takes hits without shattering. We recommend ages 12+ for full duels; younger kids love the lights and sounds and can hold it safely while an adult keeps an eye on the swinging. The sound can also be muted with the handle button for quieter homes.",
  },
  {
    n: "04",
    q: "Does it need batteries or charging?",
    a: "No disposable batteries, ever. It arrives charged and ready to light up out of the box. When it runs low, it recharges over USB-C in about 90 minutes using the included charger.",
  },
  {
    n: "05",
    q: "What shows up in the box?",
    a: "The saber in a foam-cut case, the detachable blade, a USB-C charger, and the small Allen key for setup. Setup is one quick step: slide the blade into the handle, tighten it with the included key, give it a charge, and you're done. No app, no pairing, no extra parts to buy.",
  },
  {
    n: "06",
    q: "Can I change the color?",
    a: "Yes — cycle through 12 colors with the handle button, no app needed. The blade also detaches, so you can swap it or pack the saber back into its case.",
  },
];

export default async function GiftGuidePage() {
  const product = await getProduct("luna-obi-se");

  return (
    <article>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-(--color-hairline) px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <p className="eyebrow text-(--color-blue)">Start here</p>
          <h1 className="h-display mt-5 max-w-[18ch] text-[44px] leading-[0.95] md:text-[80px]">
            New to lightsabers?
            <span className="block text-(--color-blue)">Read this first.</span>
          </h1>
          <p className="mt-7 max-w-[60ch] text-[15px] leading-relaxed text-(--color-bone-soft) md:text-[18px]">
            You don&apos;t need to know anything about <em>Star Wars</em> to buy a great one.
            This is a short, no-jargon walkthrough — what these sabers actually are, which
            version to pick, whether they&apos;re safe for kids, and exactly what arrives in the
            box. Five minutes and you&apos;ll know precisely what to order.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section className="border-b border-(--color-hairline) bg-(--color-ink-2) px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1230px]">
          <div className="grid gap-px overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-hairline-strong) md:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-(--color-ink-2) p-7 md:p-9">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-blue)">
                  {s.n}
                </p>
                <h2 className="font-display mt-4 text-[22px] uppercase leading-tight tracking-tight md:text-[26px]">
                  {s.q}
                </h2>
                <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-(--color-bone-soft) md:text-[15px]">
                  {s.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PICK */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1230px]">
          <header className="text-center">
            <p className="eyebrow">The easy choice</p>
            <h2 className="h-display mx-auto mt-4 max-w-[20ch] text-[36px] leading-[0.95] md:text-[56px]">
              Most gift-buyers pick
              <span className="block text-(--color-blue)">this one.</span>
            </h2>
          </header>

          {product && (
            <div className="mx-auto mt-12 grid max-w-[920px] items-center gap-8 rounded-lg border border-(--color-hairline-strong) bg-(--color-ink-2) p-6 md:grid-cols-[1fr_1.2fr] md:gap-12 md:p-10">
              <Link
                href={`/products/${product.handle}`}
                className="relative block aspect-square overflow-hidden rounded-lg border border-(--color-hairline) bg-(--color-ink)"
              >
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain p-6"
                  />
                )}
              </Link>
              <div>
                <h3 className="font-display text-[26px] uppercase leading-[1] tracking-tight md:text-[34px]">
                  {product.title}
                </h3>
                {product.tagline && (
                  <p className="mt-3 max-w-[44ch] text-[14px] leading-relaxed text-(--color-bone-soft) md:text-[15px]">
                    {product.tagline}
                  </p>
                )}
                <div className="mt-5 flex items-baseline gap-3">
                  <Price
                    amount={product.price}
                    className="font-display text-[26px] tabular-nums text-(--color-blue)"
                  />
                  <span className="text-[13px] text-(--color-muted)">
                    Get the Standard (Baselit) — most versatile, and the right call for a gift.
                  </span>
                </div>
                <Link
                  href={`/products/${product.handle}`}
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-(--color-blue) px-7 py-4 font-display text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-(--color-blue-soft)"
                >
                  See the saber →
                </Link>
              </div>
            </div>
          )}

          <p className="mx-auto mt-10 max-w-[56ch] text-center text-[13px] leading-relaxed text-(--color-muted)">
            Still deciding? Browse{" "}
            <Link href="/collections/originals" className="text-(--color-bone-soft) underline-offset-2 hover:text-(--color-bone) hover:underline">
              every saber
            </Link>{" "}
            or read the{" "}
            <Link href="/products/luna-obi-se#reviews" className="text-(--color-bone-soft) underline-offset-2 hover:text-(--color-bone) hover:underline">
              reviews
            </Link>{" "}
            from people who&apos;ve bought one.
          </p>
        </div>
      </section>
    </article>
  );
}
