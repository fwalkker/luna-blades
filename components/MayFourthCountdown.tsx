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
    <div className="inline-flex flex-col items-center gap-2 rounded-full border border-(--color-blue)/35 bg-(--color-ink-2)/85 px-4 py-2 md:flex-row md:gap-4">
      <span className="flex items-center gap-2">
        <span
          className={`size-2 shrink-0 rounded-full bg-(--color-blue) ${live ? "" : "animate-pulse"}`}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-(--color-blue) md:text-[12px]">
          {live ? "Sale live · May the 4th" : "May 4 · 30% off"}
        </span>
      </span>
      <span className="hidden h-4 w-px bg-(--color-blue)/30 md:block" />
      <span className="flex items-baseline gap-2 font-mono tabular-nums text-[14px] text-(--color-bone) md:text-[17px]">
        <Seg n={d} unit="d" />
        <Sep />
        <Seg n={h} unit="h" />
        <Sep />
        <Seg n={m} unit="m" />
        <Sep />
        <Seg n={s} unit="s" />
      </span>
    </div>
  );
}

function Seg({ n, unit }: { n: number | null; unit: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span>{n === null ? "--" : String(n).padStart(2, "0")}</span>
      <span className="text-[11px] uppercase tracking-[0.14em] text-(--color-muted)">{unit}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-(--color-blue)/40">·</span>;
}
