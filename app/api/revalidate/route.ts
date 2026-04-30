import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "node:crypto";

export const runtime = "nodejs";

/**
 * Shopify webhook receiver. Configure in Shopify admin:
 *   Settings → Notifications → Webhooks → Create webhook
 *   Topic:   Product update / Product delete / Inventory level update
 *   Format:  JSON
 *   URL:     https://yourdomain.com/api/revalidate
 *
 * Set the same secret in env (SHOPIFY_REVALIDATE_SECRET) AND in Shopify's
 * webhook signing key field (Settings → Notifications → Webhook signing key).
 *
 * On each delivery we verify the HMAC, then bust the relevant cache tags so
 * the next page request rebuilds with fresh Shopify data.
 */

const SECRET = process.env.SHOPIFY_REVALIDATE_SECRET;

function verifyHmac(rawBody: string, signature: string | null): boolean {
  if (!SECRET || !signature) return false;
  const computed = crypto.createHmac("sha256", SECRET).update(rawBody, "utf8").digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!SECRET) {
    return NextResponse.json({ error: "SHOPIFY_REVALIDATE_SECRET not set" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic") ?? "";

  if (!verifyHmac(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { handle?: string; product_id?: number | string } = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // ignore — some topics ship empty bodies
  }

  // Always bust the global products tag so collection grids refresh.
  revalidateTag("products");

  // Bust the per-product tag if the payload included a handle.
  if (payload.handle) {
    revalidateTag(`product:${payload.handle}`);
  }

  return NextResponse.json({ ok: true, topic, handle: payload.handle ?? null });
}
