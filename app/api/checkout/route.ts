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

  // Resolve all items in parallel — handle-only lookups previously ran
  // sequentially, costing one Shopify round-trip per item.
  let resolved: (CartLineInput | null)[];
  try {
    resolved = await Promise.all(
      body.items.map(async (it): Promise<CartLineInput | null> => {
        if (it.variantId && it.variantId.startsWith("gid://shopify/ProductVariant/")) {
          return { merchandiseId: it.variantId, quantity: it.qty };
        }
        if (it.variantId && it.variantId.startsWith("accessory:")) {
          // Local-only accessory; not a Shopify product. Skip from checkout.
          return null;
        }
        if (!it.handle) return null;

        const data = await shopifyFetch<{
          product: { variants: { edges: { node: { id: string } }[] } } | null;
        }>(Q_PRODUCT_VARIANT_BY_HANDLE, { handle: it.handle });
        const variantId = data.product?.variants.edges[0]?.node.id;
        if (!variantId) {
          throw new Error(`Variant not found for ${it.handle}`);
        }
        return { merchandiseId: variantId, quantity: it.qty };
      })
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to resolve cart items";
    return NextResponse.json({ error: msg }, { status: 404 });
  }

  const lines: CartLineInput[] = resolved.filter(
    (l): l is CartLineInput => l !== null
  );

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

  // Route checkout through shop.lunablades.com (the current primary host).
  // ShopifyCookiePrimer in app/layout.tsx pre-fetches shop.lunablades.com on
  // first page load so visitors arrive at the cart URL already carrying the
  // _shopify_y cookie that Shopify needs to resolve the cart token.
  const url = new URL(cart.cartCreate.cart.checkoutUrl);
  if (url.hostname === "lunablades.com" || url.hostname === "www.lunablades.com") {
    url.hostname = "shop.lunablades.com";
  }
  return NextResponse.json({ checkoutUrl: url.toString() });
}
