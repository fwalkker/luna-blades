import { SPECS } from "@/lib/products";

export default function SpecsTable({ hiltVariant }: { hiltVariant?: string }) {
  const rows: { label: string; value: string }[] = [
    ...SPECS.map((s) => ({ label: s.label, value: s.value })),
  ];
  if (hiltVariant) rows.splice(1, 0, { label: "Hilt geometry", value: hiltVariant });

  return (
    <section className="px-5 py-28 md:px-9">
      <div className="mx-auto grid max-w-[1340px] gap-12 md:grid-cols-[280px_1fr]">
        <div>
          <p className="eyebrow">Plate ⁄ 003</p>
          <h2 className="h-display mt-3 text-[44px] leading-[0.92] md:text-[58px]">
            Spec<br />
            <span style={{ fontStyle: "italic", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>sheet</span>
          </h2>
          <p className="mt-5 max-w-[28ch] text-[13px] text-(--color-muted)">
            What's actually in the box, in plain language. No marketing-speak.
          </p>
        </div>

        <div className="border-t border-(--color-hairline-strong)">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="grid grid-cols-[140px_1fr] items-baseline gap-6 border-b border-(--color-hairline) py-5 md:grid-cols-[200px_1fr]"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
                <span className="text-(--color-muted-2) tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-3">{r.label}</span>
              </span>
              <span className="font-display text-[18px] tracking-tight md:text-[20px]">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
