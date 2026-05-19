"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShopifyCookies } from "@shopify/hydrogen-react";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsBootstrap() {
  // Setting domain to the parent (.lunablades.com) scopes _shopify_y /
  // _shopify_s so they're sent to shop.lunablades.com too — that's how
  // storefront sessions stitch to checkout sessions in Shopify Analytics.
  useShopifyCookies({
    hasUserConsent: true,
    domain: ".lunablades.com",
    checkoutDomain: "shop.lunablades.com",
  });

  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
