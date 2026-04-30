"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/lib/cart-store";

export default function Nav() {
  const { items, open } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <nav className="sticky top-0 z-50 border-b border-(--color-hairline) bg-(--color-ink-2)">
      <div className="mx-auto grid h-[88px] max-w-[1230px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-8">
        {/* LEFT — primary nav */}
        <div className="hidden items-center gap-7 md:flex">
          <Link href="/" className="nav-link">Sabers</Link>
          <Link href="/collections/originals" className="nav-link">Originals</Link>
          <Link href="/collections/replicas" className="nav-link">Replicas</Link>
          <Link href="/pages/operation-guides" className="nav-link">Guides</Link>
          <Link href="/pages/brand" className="nav-link">Brand</Link>
        </div>
        <button onClick={() => {}} className="md:hidden text-(--color-bone)" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* CENTER — logo */}
        <Link href="/" className="flex items-center justify-center text-(--color-bone)">
          <Logo height={60} />
        </Link>

        {/* RIGHT — utilities */}
        <div className="flex items-center justify-end gap-5">
          <Link
            href="/pages/reviews"
            className="hidden text-[11px] uppercase tracking-[0.22em] text-(--color-bone-soft) transition hover:text-(--color-bone) lg:inline"
          >
            Reviews
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden text-(--color-bone-soft) transition hover:text-(--color-bone) md:inline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <button
            onClick={open}
            className="group relative flex items-center gap-2 text-(--color-bone-soft) transition hover:text-(--color-bone)"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 7h14l-1.5 12a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="text-[11px] tabular-nums uppercase tracking-[0.18em]">
              ({count.toString().padStart(2, "0")})
            </span>
          </button>
        </div>
      </div>

      {/* Tiny utility nav-link styling via tw arbitrary class */}
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
  );
}
