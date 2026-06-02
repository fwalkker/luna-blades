"use client";

import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  ShopifySalesChannel,
} from "@shopify/hydrogen-react";
import posthog from "posthog-js";

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
// Headless storefront ID from Shopify Admin → Sales channels → Headless.
// Without this, hydrogen-react sends hydrogenSubchannelId="0" and Shopify
// Analytics drops storefront sessions into an unattributed bucket that the
// Admin dashboard doesn't surface.
const STOREFRONT_ID = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ID;
const CHECKOUT_DOMAIN = "shop.lunablades.com";
const DEFAULT_CURRENCY = "CAD";

type FbqWindow = Window & {
  fbq?: (
    track: "track",
    event: string,
    params?: Record<string, unknown>,
    extra?: { eventID: string }
  ) => void;
  gtag?: (...args: unknown[]) => void;
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

/**
 * Stable per-visitor ID stored in a first-party cookie. Sent to CAPI as
 * external_id so Meta can thread events when _fbp/_fbc are blocked
 * (iOS Private Relay, Brave, uBlock). Cookie is scoped to .lunablades.com
 * so checkout pages also see it; 2-year expiry; Secure; SameSite=Lax.
 */
function ensureVisitorId(): string {
  if (typeof document === "undefined") return "";
  const existing = readCookie("_lb_uid");
  if (existing) return existing;
  const id = uuid();
  document.cookie = `_lb_uid=${id}; Path=/; Domain=.lunablades.com; Max-Age=63072000; Secure; SameSite=Lax`;
  return id;
}

async function sendCapi(event_name: string, event_id: string, custom_data: Record<string, unknown>) {
  try {
    const res = await fetch("/api/meta/event", {
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
        external_id: ensureVisitorId(),
      }),
    });
    if (!res.ok) {
      console.warn("[meta capi]", event_name, res.status, await res.text());
    }
  } catch (e) {
    console.warn("[meta capi]", event_name, e);
  }
}

function fbqTrack(event: string, params: Record<string, unknown>, event_id: string) {
  const w = window as FbqWindow;
  if (!w.fbq) return;
  w.fbq("track", event, params, { eventID: event_id });
}

function gtagTrack(event: string, params: Record<string, unknown>) {
  const w = window as FbqWindow;
  if (!w.gtag) return;
  w.gtag("event", event, params);
}

function shopifyBase() {
  return {
    ...getClientBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOP_GID,
    storefrontId: STOREFRONT_ID,
    currency: DEFAULT_CURRENCY,
    // Per Shopify community feedback, `hydrogen` is the channel type that
    // actually routes events into Admin Analytics — `headless` accepts the
    // monorail POST but the events don't surface in Live View or reports.
    shopifySalesChannel: ShopifySalesChannel.hydrogen,
  } as const;
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  const event_id = uuid();
  fbqTrack("PageView", {}, event_id);
  sendCapi("PageView", event_id, {});
  // GA4 init runs with send_page_view:false so SPA route changes don't
  // double-fire — every pageview (including the first) goes through here.
  gtagTrack("page_view", {
    page_path: window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
  // PostHog $pageview is captured by PostHogPageView in PostHogProvider.tsx
  // on pathname change, so we don't fire it here.
  if (!SHOP_ID) return;
  sendShopifyAnalytics(
    { eventName: AnalyticsEventName.PAGE_VIEW, payload: shopifyBase() },
    CHECKOUT_DOMAIN
  );
}

export function trackProductView(p: ProductEventInput) {
  if (typeof window === "undefined") return;
  const event_id = uuid();
  const currency = p.currency ?? "USD";
  const params = {
    content_ids: [p.handle],
    content_name: p.title,
    content_type: "product",
    value: p.price,
    currency,
  };
  fbqTrack("ViewContent", params, event_id);
  sendCapi("ViewContent", event_id, params);
  gtagTrack("view_item", {
    currency,
    value: p.price,
    items: [{ item_id: p.handle, item_name: p.title, price: p.price, quantity: 1 }],
  });
  posthog.capture("product_viewed", {
    product_handle: p.handle,
    product_name: p.title,
    price: p.price,
    currency,
  });
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
  const currency = p.currency ?? "USD";
  const value = p.price * p.qty;
  const params = {
    content_ids: [p.handle],
    content_name: p.title,
    value,
    currency,
  };
  fbqTrack("AddToCart", params, event_id);
  sendCapi("AddToCart", event_id, params);
  gtagTrack("add_to_cart", {
    currency,
    value,
    items: [{ item_id: p.handle, item_name: p.title, price: p.price, quantity: p.qty }],
  });
  posthog.capture("product_added_to_cart", {
    product_handle: p.handle,
    product_name: p.title,
    price: p.price,
    quantity: p.qty,
    value,
    currency,
  });
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

