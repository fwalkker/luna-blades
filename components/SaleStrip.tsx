/**
 * Top scrolling promo strip — thin, dark, white text.
 * Mirrors the SWA pattern of a marquee announcement bar above the nav.
 */
export default function SaleStrip() {
  const segments = [
    "Free worldwide shipping",
    "·",
    "30-day returns",
    "·",
    "Lifetime blade replacement",
    "·",
    "Buy one, save on the second",
    "·",
  ];
  return (
    <div className="relative z-[60] overflow-hidden border-b border-(--color-hairline) bg-(--color-ink-2)">
      <div className="marquee-track flex w-max items-center whitespace-nowrap py-[8px]">
        {Array.from({ length: 4 }).map((_, k) => (
          <span key={k} className="flex items-center">
            {segments.map((s, i) => (
              <span
                key={`${k}-${i}`}
                className={`px-5 text-[11px] uppercase tracking-[0.22em] text-(--color-bone) ${
                  s === "·" ? "opacity-40" : ""
                }`}
              >
                {s}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
