"use client";

import { useEffect, useState } from "react";

// Sale begins May 4, 2026 at 00:00 local time. Edit this if the campaign window shifts.
const TARGET = new Date("2026-05-04T00:00:00").getTime();

export default function MayFourthCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setMs(Math.max(0, TARGET - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const live = ms !== null && ms === 0;
  const d = ms === null ? null : Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = ms === null ? null : Math.floor((ms / (1000 * 60 * 60)) % 24);
  const m = ms === null ? null : Math.floor((ms / (1000 * 60)) % 60);
  const s = ms === null ? null : Math.floor((ms / 1000) % 60);

  return (
    <div className="inline-flex items-baseline gap-3 font-mono tabular-nums text-(--color-bone) md:gap-5">
      <Seg n={d} unit="d" />
      <Sep />
      <Seg n={h} unit="h" />
      <Sep />
      <Seg n={m} unit="m" />
      <Sep />
      <Seg n={s} unit="s" live={live} />
    </div>
  );
}

function Seg({ n, unit, live }: { n: number | null; unit: string; live?: boolean }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display text-[28px] leading-none tracking-tight md:text-[44px]">
        {n === null ? "--" : String(n).padStart(2, "0")}
      </span>
      <span className="text-[12px] uppercase tracking-[0.18em] text-(--color-muted) md:text-[14px]">
        {unit}
      </span>
    </span>
  );
}

function Sep() {
  return <span className="font-display text-[24px] leading-none text-(--color-blue)/50 md:text-[36px]">:</span>;
}
