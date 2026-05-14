"use client";

import { useEffect } from "react";

/**
 * Primes the Shopify session cookie (_shopify_y) on the visitor's browser
 * by making an image request to shop.lunablades.com. Shopify sets the
 * cookie with domain=lunablades.com, so it scopes to the apex + all
 * subdomains. Once primed, the visitor's later navigation to
 * shop.lunablades.com/cart/c/{token} carries the cookie and Shopify can
 * resolve the cart token. Without it, cookieless first-time visitors hit
 * a 404 on the cart URL.
 *
 * Runs once per page load. Skips if the cookie is already present.
 * Uses Image() instead of fetch() because it avoids the CORS preflight
 * and reliably processes Set-Cookie headers on any response status.
 */
export default function ShopifyCookiePrimer() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.cookie.includes("_shopify_y=")) return;
    const img = new Image();
    img.src = "https://shop.lunablades.com/?_p=" + Date.now();
  }, []);
  return null;
}
