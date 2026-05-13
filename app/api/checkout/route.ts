import { NextResponse } from "next/server";
import {
  shopifyConfigured,
  shopifyFetch,
  Q_PRODUCT_VARIANT_BY_HANDLE,
  M_CART_CREATE,
  type CartLineInput,
} from "@/lib/shopify";

type Body = {
  items: { variantId?: string; handle?: string; qty: number }[];
};

/**
 * Creates a Shopify cart from local cart lines and returns the hosted
 * checkoutUrl. Lines that already carry a Shopify variantId (sabers chosen
 * via the PDP) skip the lookup; lines that only have a handle (legacy items
 * or accessories) get resolved to their first variant.
 *
 * Lines whose variantId starts with "accessory:" are local-only stand-ins
 * and are dropped from the Shopify checkout payload.
 */
export async function POST(req: Request) {
  if (!shopifyConfigured) {
    return NextResponse.json(
      { error: "Shopify not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.local." },
      { status: 501 }
    );
  }

  const body = (await req.json()) as Body;
  if (!body.items?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

  const lines: CartLineInput[] = [];

  for (const it of body.items) {
    if (it.variantId && it.variantId.startsWith("gid://shopify/ProductVariant/")) {
      lines.push({ merchandiseId: it.variantId, quantity: it.qty });
      continue;
    }
    if (it.variantId && it.variantId.startsWith("accessory:")) {
      // Local-only accessory; not a Shopify product. Skip from checkout.
      continue;
    }
    if (!it.handle) continue;

    const data = await shopifyFetch<{
      product: { variants: { edges: { node: { id: string } }[] } } | null;
    }>(Q_PRODUCT_VARIANT_BY_HANDLE, { handle: it.handle });
    const variantId = data.product?.variants.edges[0]?.node.id;
    if (!variantId) {
      return NextResponse.json({ error: `Variant not found for ${it.handle}` }, { status: 404 });
    }
    lines.push({ merchandiseId: variantId, quantity: it.qty });
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: "No checkout-eligible items in cart" }, { status: 400 });
  }

  const cart = await shopifyFetch<{
    cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(M_CART_CREATE, { lines });

  if (!cart.cartCreate.cart) {
    return NextResponse.json(
      { error: cart.cartCreate.userErrors.map((e) => e.message).join(", ") || "Cart creation failed" },
      { status: 500 }
    );
  }

  // Shopify's Storefront API still returns lunablades.com (the apex) as the
  // checkout host even though shop.lunablades.com is primary — the apex is
  // a Shopify-registered domain and stays in the connected-domains list.
  // Rewrite to the host that actually resolves to Shopify's checkout.
  const url = new URL(cart.cartCreate.cart.checkoutUrl);
  if (url.hostname === "lunablades.com" || url.hostname === "www.lunablades.com") {
    url.hostname = "shop.lunablades.com";
  }
  return NextResponse.json({ checkoutUrl: url.toString() });
}
