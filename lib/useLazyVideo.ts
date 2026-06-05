"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Defers a video's download until its container scrolls within ~300px of the
 * viewport. Gate a <video>'s `src` on the returned `shouldLoad` flag so heavy
 * clips stay off the initial page load — they only download once the visitor
 * actually scrolls toward them.
 *
 * Why this exists: the PDP's review + feature sections sit below the fold but
 * autoplayed every clip on load, forcing ~43 MB of video onto first paint. On
 * mobile/cellular ad traffic that crushed the landing-page-view rate (Android
 * was loading at ~37% vs ~60% on iPhone).
 */
export function useLazyVideo<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoad) return;

    // Fallback: if IntersectionObserver is unavailable, load eagerly so a tile
    // is never permanently stuck on its poster.
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldLoad]);

  return { containerRef, shouldLoad };
}
