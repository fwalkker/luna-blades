"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES, useCurrency, type CurrencyCode } from "@/lib/currency";

export default function CurrencyPicker() {
  const code = useCurrency((s) => s.code);
  const setCode = useCurrency((s) => s.setCode);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Default to USD until hydrated to keep server + client markup matching
  const active = hydrated ? CURRENCIES[code] : CURRENCIES.USD;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${active.code}`}
        className="inline-flex items-center gap-2 text-(--color-bone-soft) transition hover:text-(--color-bone)"
      >
        <img
          src={active.flag}
          alt={`${active.code} flag`}
          width={24}
          height={24}
          className="block size-6 rounded-full"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-(--color-bone)">
          {active.code} {active.symbol}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select currency"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[180px] overflow-hidden rounded-lg border border-(--color-hairline-strong) bg-(--color-ink-2) shadow-2xl"
        >
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => {
            const cfg = CURRENCIES[c];
            const selected = c === active.code;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    setCode(c);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                    selected
                      ? "bg-(--color-blue)/15 text-(--color-bone)"
                      : "text-(--color-bone-soft) hover:bg-(--color-ink) hover:text-(--color-bone)"
                  }`}
                >
                  <img
                    src={cfg.flag}
                    alt=""
                    width={20}
                    height={20}
                    className="block size-5 rounded-full"
                  />
                  <span className="flex-1 font-mono text-[12px] uppercase tracking-[0.14em]">
                    {cfg.code}
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-(--color-muted)">
                    {cfg.symbol}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
