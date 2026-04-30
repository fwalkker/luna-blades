import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="text-center">
        <p className="eyebrow">404 · Out of stock in this dimension</p>
        <h1 className="h-display mx-auto mt-5 max-w-[16ch] text-[56px] leading-[0.95] md:text-[80px]">
          That saber<br />
          <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>doesn't exist here.</span>
        </h1>
        <Link
          href="/"
          className="mt-10 inline-block border-b border-(--color-amber) pb-1 font-mono text-[12px] uppercase tracking-[0.26em] text-(--color-amber)"
        >
          Back to the rack →
        </Link>
      </div>
    </div>
  );
}
