"use client";

import { useEffect, useRef } from "react";

/**
 * Lightspeed scroll effect.
 * Wheel/scroll/touch motion bumps a 0..1 intensity value that decays linearly.
 * The streak overlay's opacity and scale react via CSS variable.
 */
export default function Lightspeed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let intensity = 0;
    let raf = 0;
    let lastY = window.scrollY;

    function bump(target: number) {
      // Take the higher of current intensity and incoming target
      const next = Math.min(1, target);
      if (next > intensity) intensity = next;
    }

    function tick() {
      // Linear decay — fully decays from 1 to 0 in ~25 frames (~400ms)
      intensity = Math.max(0, intensity - 0.04);
      const el = ref.current;
      if (el) el.style.setProperty("--ls-intensity", intensity.toFixed(3));
      raf = requestAnimationFrame(tick);
    }

    function onScroll() {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      // Bump proportionally to scroll delta
      bump(Math.min(0.95, dy / 90));
    }

    function onWheel(e: WheelEvent) {
      // A normal wheel notch is ~100. A flick can fire many in a row.
      bump(Math.min(0.95, Math.abs(e.deltaY) / 240));
    }

    let lastTouchY: number | null = null;
    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0]?.clientY ?? null;
    }
    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0]?.clientY;
      if (y == null || lastTouchY == null) return;
      const dy = Math.abs(y - lastTouchY);
      lastTouchY = y;
      bump(Math.min(0.95, dy / 60));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="lightspeed pointer-events-none fixed inset-0 z-[3]"
    />
  );
}
