/**
 * Primes the Shopify session cookie (_shopify_y) on the visitor's browser by
 * making an image request to shop.lunablades.com. Shopify responds with
 * Set-Cookie scoped to domain=lunablades.com (covers apex + all subdomains),
 * which Shopify needs in order to resolve cart-token URLs at the subdomain
 * after the apex was moved off Shopify to Vercel.
 *
 * Returns a promise that resolves when the cookie is set, the request errors,
 * or a 2s timeout fires — whichever comes first. Safe to call repeatedly:
 * resolves immediately if the cookie is already present.
 *
 * Used in two places:
 *  - app/layout.tsx fires it on first page load (optimistic prefetch)
 *  - the checkout button awaits it before navigating (race-proof guarantee)
 */
function hasShopifyCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("_shopify_y=");
}

export function primeShopifyCookie(timeoutMs = 2000): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (hasShopifyCookie()) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    const img = new Image();
    img.onload = () => {
      clearTimeout(timer);
      finish();
    };
    img.onerror = () => {
      clearTimeout(timer);
      finish();
    };
    img.src = "https://shop.lunablades.com/?_p=" + Date.now();
  });
}
