import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CAPI_TOKEN = process.env.META_CAPI_TOKEN;
const GRAPH_VERSION = "v21.0";

type EventBody = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
  fbp?: string;
  fbc?: string;
  user_data?: { email?: string; phone?: string };
};

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? undefined;
}

export async function POST(req: Request) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return NextResponse.json({ skipped: "capi-not-configured" }, { status: 200 });
  }

  const body = (await req.json()) as EventBody;
  if (!body.event_name || !body.event_id) {
    return NextResponse.json({ error: "event_name and event_id are required" }, { status: 400 });
  }

  const user_data: Record<string, unknown> = {
    client_user_agent: req.headers.get("user-agent") ?? undefined,
    client_ip_address: clientIp(req),
  };
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;
  if (body.user_data?.email) user_data.em = [sha256(body.user_data.email)];
  if (body.user_data?.phone) user_data.ph = [sha256(body.user_data.phone.replace(/\D/g, ""))];

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: "website",
        user_data,
        custom_data: body.custom_data ?? {},
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json({ error: "capi-rejected", detail }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
