export default function TrustStrip() {
  const items = [
    { k: "01", t: "Ships in 48h", d: "From California, every weekday" },
    { k: "02", t: "Free over $99", d: "Tracked, insured, no fuss" },
    { k: "03", t: "30-day returns", d: "Even on opened cases" },
    { k: "04", t: "1-year warranty", d: "Hilt and electronics" },
  ];
  return (
    <section className="border-y border-(--color-hairline) bg-(--color-ink-2)">
      <div className="mx-auto grid max-w-[1340px] grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.k}
            className={`flex items-center gap-4 px-5 py-6 md:px-7 ${
              i < items.length - 1 ? "md:border-r border-(--color-hairline)" : ""
            } ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} border-(--color-hairline)`}
          >
            <span className="font-mono text-[11px] tabular-nums text-(--color-amber)">{it.k}</span>
            <div>
              <p className="font-display text-[16px] tracking-tight">{it.t}</p>
              <p className="text-[12px] text-(--color-muted)">{it.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
