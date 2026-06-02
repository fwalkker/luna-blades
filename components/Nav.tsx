"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import CurrencyPicker from "./CurrencyPicker";

const MOBILE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections/originals", label: "Sabers" },
  { href: "/pages/operation-guides", label: "Guides" },
  { href: "/pages/brand", label: "Brand" },
  { href: "/products/luna-obi-se#reviews", label: "Reviews" },
];

export default function Nav() {
  const { items, open } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-(--color-hairline) bg-(--color-ink-2)">
        <div className="mx-auto grid h-[72px] max-w-[1230px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[88px] md:gap-4 md:px-8">
          {/* LEFT — primary nav (desktop) / hamburger (mobile) */}
          <div className="hidden items-center gap-7 md:flex">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/collections/originals" className="nav-link">Sabers</Link>
            <Link href="/pages/operation-guides" className="nav-link">Guides</Link>
            <Link href="/pages/brand" className="nav-link">Brand</Link>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="-ml-2 grid size-10 place-items-center text-(--color-bone) md:hidden"
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          {/* CENTER — logo */}
          <Link href="/" className="flex items-center justify-center text-(--color-bone)">
            <Logo height={48} />
          </Link>

          {/* RIGHT — utilities */}
          <div className="flex items-center justify-end gap-3 md:gap-4">
            <Link
              href="/products/luna-obi-se#reviews"
              className="hidden text-[11px] uppercase tracking-[0.22em] text-(--color-bone-soft) transition hover:text-(--color-bone) lg:inline"
            >
              Reviews
            </Link>
            <CurrencyPicker />
            <button
              onClick={open}
              className="group relative inline-flex items-center text-(--color-bone-soft) transition hover:text-(--color-bone)"
              aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 7h14l-1.5 12a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-(--color-blue) px-1 py-[1px] font-mono text-[10px] font-bold leading-none tabular-nums text-white shadow-[0_0_0_2px_var(--color-ink-2)]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <style>{`
          .nav-link {
            font-size: 12px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--color-bone-soft);
            transition: color .18s ease;
          }
          .nav-link:hover { color: var(--color-bone); }
        `}</style>
      </nav>

      {/* Mobile menu drawer */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Menu"
        className={`fixed left-0 top-0 z-[81] flex h-[100dvh] w-full max-w-[340px] flex-col border-r border-(--color-hairline) bg-(--color-ink-2) transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-(--color-hairline) px-5 py-5">
          <Logo height={36} />
          <button
            onClick={() => setMenuOpen(false)}
            className="text-(--color-bone-soft) transition hover:text-(--color-bone)"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {MOBILE_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-4 py-4 font-display text-[18px] uppercase tracking-tight text-(--color-bone) transition hover:bg-(--color-ink)"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-(--color-hairline) px-5 py-4 text-[11px] uppercase tracking-[0.22em] text-(--color-muted)">
          Free worldwide shipping
        </div>
      </aside>
    </>
  );
}
