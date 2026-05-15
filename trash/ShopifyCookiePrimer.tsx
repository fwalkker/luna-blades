"use client";

import { useEffect } from "react";
import { primeShopifyCookie } from "@/lib/shopify-cookie-primer";

/**
 * Fires the Shopify cookie primer on first page load. The checkout button
 * separately awaits the same primer for race-fast users who click before
 * this useEffect's network round-trip completes.
 */
export default function ShopifyCookiePrimer() {
  useEffect(() => {
    primeShopifyCookie();
  }, []);
  return null;
}
