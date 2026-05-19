"use client";

import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  ShopifySalesChannel,
} from "@shopify/hydrogen-react";

/**
 * Storefront analytics — Meta Pixel (browser) + Meta CAPI (server mirror) +
 * Shopify (via @shopify/hydrogen-react). Every Meta event gets a shared
 * event_id so Meta dedupes the pixel + CAPI side, otherwise a tracked
 * Purchase would show up twice.
 *
 * Shopify side runs through hydrogen-react's sendShopifyAnalytics so we don't
 * own the monorail schema. Cookies are managed by useShopifyCookies in
 * AnalyticsBootstrap with domain=".lunablades.com" so the same _shopify_y
 * gets sent to shop.lunablades.com — that's what stitches storefront sessions
 * to checkout sessions in Shopify Analytics.
 */

const SHOP_ID = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
const SHOP_GID = SHOP_ID ? `gid://shopify/Shop/${SHOP_ID}` : "";
const CHECKOUT_DOMAIN = "shop.lunablades.com";
const DEFAULT_CURRENCY = "CAD";

type FbqWindow = Window & {
  fbq?: (
    track: "track",
    event: string,
    params?: Record<string, unknown>,
    extra?: { eventID: string }
  ) => void;
};

type ProductEventInput = {
  handle: string;
  title: string;
  price: number;
  currency?: string;
  productGid?: string;
};

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function sendCapi(event_name: string, event_id: string, custom_data: Record<string, unknown>) {
  try {
    await fetch("/api/meta/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_name,
        event_id,
        event_source_url: window.location.href,
        custom_data,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      }),
    });
  } catch {
    // CAPI failures are not user-visible; the browser pixel still fired.
  }
}

function fbqTrack(event: string, params: Record<string, unknown>, event_id: string) {
  const w = window as FbqWindow;
  if (!w.fbq) return;
  w.fbq("track", event, params, { eventID: event_id });
}

function shopifyBase() {
  return {
    ...getClientBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOP_GID,
    currency: DEFAULT_CURRENCY,
    shopifySalesChannel: ShopifySalesChannel.headless,
  } as const;
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  const event_id = uuid();
  fbqTrack("PageView", {}, event_id);
  sendCapi("PageView", event_id, {});
  if (!SHOP_ID) return;
  sendShopifyAnalytics(
    { eventName: AnalyticsEventName.PAGE_VIEW, payload: shopifyBase() },
    CHECKOUT_DOMAIN
  );
}

export function trackProductView(p: ProductEventInput) {
  if (typeof window === "undefined") return;
  const event_id = uuid();
  const params = {
    content_ids: [p.handle],
    content_name: p.title,
    content_type: "product",
    value: p.price,
    currency: p.currency ?? "USD",
  };
  fbqTrack("ViewContent", params, event_id);
  sendCapi("ViewContent", event_id, params);
  if (!SHOP_ID) return;
  sendShopifyAnalytics(
    {
      eventName: AnalyticsEventName.PRODUCT_VIEW,
      payload: {
        ...shopifyBase(),
        products: [
          {
            productGid: p.productGid ?? `gid://shopify/Product/${p.handle}`,
            name: p.title,
            brand: "Luna Blades",
            price: String(p.price),
            quantity: 1,
          },
        ],
      },
    },
    CHECKOUT_DOMAIN
  );
}

export function trackAddToCart(p: ProductEventInput & { qty: number }) {
  if (typeof window === "undefined") return;
  const event_id = uuid();
  const params = {
    content_ids: [p.handle],
    content_name: p.title,
    value: p.price * p.qty,
    currency: p.currency ?? "USD",
  };
  fbqTrack("AddToCart", params, event_id);
  sendCapi("AddToCart", event_id, params);
  if (!SHOP_ID) return;
  sendShopifyAnalytics(
    {
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload: {
        ...shopifyBase(),
        cartId: readCookie("cart") ?? "",
        products: [
          {
            productGid: p.productGid ?? `gid://shopify/Product/${p.handle}`,
            name: p.title,
            brand: "Luna Blades",
            price: String(p.price),
            quantity: p.qty,
          },
        ],
      },
    },
    CHECKOUT_DOMAIN
  );
}

