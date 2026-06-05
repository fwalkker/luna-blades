import {
  shopifyFetch,
  Q_PRODUCT_BY_HANDLE,
  Q_PRODUCTS_LIST,
  type ShopifyProduct,
  type ShopifyProductSummary,
} from "./shopify";

export type BladeColor = "blue" | "red" | "green" | "purple" | "amber" | "white" | "rose";

export type Variant = {
  id: string;
  title: string;
  available: boolean;
  quantityAvailable: number;
  price: number;
  compareAt: number | null;
  selectedOptions: { name: string; value: string }[];
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id?: string;
  variantId?: string;
  handle: string;
  title: string;
  tagline: string;
  blade: BladeColor;
  price: number;
  compareAt: number | null;
  images: string[];
  hilt: "single" | "double" | "crossguard" | "curved" | "nunchaku";
  story: string;
  available: boolean;
  variants: Variant[];
  options: ProductOption[];
};

/**
 * Saber catalog allowlist (website display only — does not touch Shopify).
 * Only products whose handle is listed here render on the site; every other
 * product is hidden from collections, related, FBT, the homepage, and 404s on
 * its direct PDP URL. The products still exist in Shopify.
 */
const VISIBLE_HANDLES = new Set<string>([
  "luna-sailor-moon-saber",
  "luna-ani-iii-hero",
  "luna-obi-se",
]);

function isVisible(handle: string): boolean {
  return VISIBLE_HANDLES.has(handle);
}

const SHARED_SPECS = [
  { label: "Hilt", value: "T6 Aircraft Aluminum" },
  { label: "Blade", value: 'Polycarbonate, 36" × 7/8"' },
  { label: "Charging", value: "USB-C, rechargeable cell" },
  { label: "Speaker", value: "3W, 4–8Ω hi-fi" },
  { label: "Sound fonts", value: "10+, motion-reactive" },
  { label: "Colors", value: "12 preset colors" },
] as const;

export const SPECS = SHARED_SPECS;

/* ============== Shopify → Product mapping ============== */

const BLADE_COLORS: BladeColor[] = ["blue", "red", "green", "purple", "amber", "white", "rose"];
const HILT_KINDS: Product["hilt"][] = ["single", "double", "crossguard", "curved", "nunchaku"];

function tagValue(tags: string[], prefix: string): string | undefined {
  return tags.find((t) => t.toLowerCase().startsWith(`${prefix}:`))?.split(":")[1]?.trim().toLowerCase();
}

function extractTagline(p: { description: string; tags: string[] }): string {
  const fromTag = tagValue(p.tags, "tagline");
  if (fromTag) return fromTag;
  return p.description.split(/\r?\n/)[0]?.trim() || "";
}

function extractBlade(p: { tags: string[]; title: string }): BladeColor {
  const fromTag = tagValue(p.tags, "blade");
  if (fromTag && (BLADE_COLORS as string[]).includes(fromTag)) return fromTag as BladeColor;

  const t = p.title.toLowerCase();
  if (/dark\s*saber|white|chrome/.test(t)) return "white";
  if (/maul|kylo|sith|red|crimson/.test(t)) return "red";
  if (/green|yoda|luke\s*rotj|qui\s*gon/.test(t)) return "green";
  if (/purple|mace|nunchaku/.test(t)) return "purple";
  if (/amber|gold|yellow/.test(t)) return "amber";
  if (/sailor\s*moon|rose|pink/.test(t)) return "rose";
  return "blue";
}

function extractHilt(p: { tags: string[]; title: string }): Product["hilt"] {
  const fromTag = tagValue(p.tags, "hilt");
  if (fromTag && (HILT_KINDS as string[]).includes(fromTag)) return fromTag as Product["hilt"];

  const t = p.title.toLowerCase();
  if (/double|dual|staff|maul/.test(t)) return "double";
  if (/cross\s*guard|crossguard|kylo|three\s*blades/.test(t)) return "crossguard";
  if (/curved|dooku/.test(t)) return "curved";
  if (/nunchaku|chain/.test(t)) return "nunchaku";
  return "single";
}

function num(s: string | undefined | null): number {
  if (!s) return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function mapFullProduct(p: ShopifyProduct): Product {
  const variants: Variant[] = p.variants.edges.map((e) => {
    const v = e.node;
    const vp = num(v.price.amount);
    const vc = num(v.compareAtPrice?.amount);
    return {
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      quantityAvailable: v.quantityAvailable ?? 0,
      price: vp,
      compareAt: vc > vp ? vc : null,
      selectedOptions: v.selectedOptions,
    };
  });

  const firstVariant = variants[0];
  const price = firstVariant?.price ?? num(p.priceRange.minVariantPrice.amount);
  const compareAt =
    firstVariant?.compareAt ??
    (num(p.compareAtPriceRange.minVariantPrice.amount) > price
      ? num(p.compareAtPriceRange.minVariantPrice.amount)
      : null);
  const images = p.images.edges.map((e) => e.node.url).filter(Boolean);

  return {
    id: p.id,
    variantId: firstVariant?.id,
    handle: p.handle,
    title: p.title,
    tagline: extractTagline(p),
    blade: extractBlade(p),
    hilt: extractHilt(p),
    price,
    compareAt,
    images: images.length ? images : p.featuredImage?.url ? [p.featuredImage.url] : [],
    story: p.description || "",
    available: p.availableForSale,
    variants,
    options: p.options.map((o) => ({ name: o.name, values: o.values })),
  };
}

function mapSummary(p: ShopifyProductSummary): Product {
  const firstVariant = p.variants.edges[0]?.node;
  const price = num(p.priceRange.minVariantPrice.amount);
  const compareRaw = num(p.compareAtPriceRange.minVariantPrice.amount);
  const compareAt = compareRaw > price ? compareRaw : null;
  const images = p.images.edges.map((e) => e.node.url).filter(Boolean);

  return {
    id: p.id,
    variantId: firstVariant?.id,
    handle: p.handle,
    title: p.title,
    tagline: extractTagline(p),
    blade: extractBlade(p),
    hilt: extractHilt(p),
    price,
    compareAt,
    images: images.length ? images : p.featuredImage?.url ? [p.featuredImage.url] : [],
    story: p.description || "",
    available: p.availableForSale,
    variants: [],
    options: [],
  };
}

/* ============== Public fetchers ============== */

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
      Q_PRODUCT_BY_HANDLE,
      { handle },
      { tags: [`product:${handle}`, "products"] }
    );
    if (!data.product) return undefined;
    if (!isVisible(data.product.handle)) return undefined;
    return mapFullProduct(data.product);
  } catch (err) {
    console.error(`[getProduct(${handle})]`, err);
    return undefined;
  }
}

export async function getAllProducts(limit = 50): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductSummary }[] } }>(
      Q_PRODUCTS_LIST,
      { first: limit, query: null },
      { tags: ["products"] }
    );
    return data.products.edges
      .map((e) => mapSummary(e.node))
      .filter((p) => isVisible(p.handle));
  } catch (err) {
    console.error("[getAllProducts]", err);
    return [];
  }
}

/* ============== Accessories — static for now ============== */

export type Accessory = {
  id: string;
  title: string;
  blurb: string;
  price: number;
  compareAt: number | null;
  emoji: string;
};

export const ACCESSORIES: Accessory[] = [
  {
    id: "gift-case",
    title: "Foam-cut presentation case",
    blurb: "Hand-stamped, ships sealed.",
    price: 29,
    compareAt: 49,
    emoji: "▦",
  },
  {
    id: "extra-blade",
    title: "Spare polycarbonate blade",
    blurb: '36", duel-rated. One in the case, one on standby.',
    price: 25,
    compareAt: 39,
    emoji: "│",
  },
  {
    id: "blade-plug",
    title: "Brass blade plug",
    blurb: "For when the blade's off and you want to display the hilt.",
    price: 19,
    compareAt: 29,
    emoji: "◉",
  },
  {
    id: "charging-dock",
    title: "Magnetic charging dock",
    blurb: "Drop the hilt on, walk away. USB-C in.",
    price: 39,
    compareAt: 59,
    emoji: "⊡",
  },
];

export function getAccessory(id: string): Accessory | undefined {
  return ACCESSORIES.find((a) => a.id === id);
}

/* ============== Color helpers ============== */

export function bladeHex(c: BladeColor): string {
  switch (c) {
    case "blue": return "#5BB8FF";
    case "red": return "#FF5050";
    case "green": return "#5BE39A";
    case "purple": return "#C58BFF";
    case "amber": return "#FFC44A";
    case "white": return "#F0F4FF";
    case "rose": return "#FF8FB8";
  }
}

export function bladeGlow(c: BladeColor): string {
  switch (c) {
    case "blue": return "rgba(91,184,255,0.55)";
    case "red": return "rgba(255,80,80,0.55)";
    case "green": return "rgba(91,227,154,0.55)";
    case "purple": return "rgba(197,139,255,0.55)";
    case "amber": return "rgba(255,196,74,0.55)";
    case "white": return "rgba(240,244,255,0.5)";
    case "rose": return "rgba(255,143,184,0.55)";
  }
}

/* ============== Pick related products ============== */

export function pickRelated(all: Product[], currentHandle: string, count = 4): Product[] {
  const others = all.filter((p) => p.handle !== currentHandle);
  if (others.length === 0) return [];

  const current = all.find((p) => p.handle === currentHandle);
  const sortedByPriceClose = current
    ? [...others].sort((a, b) => Math.abs(a.price - current.price) - Math.abs(b.price - current.price))
    : others;

  const seenColors = new Set<string>();
  const related: Product[] = [];
  for (const p of sortedByPriceClose) {
    if (related.length >= count) break;
    if (seenColors.has(p.blade)) continue;
    seenColors.add(p.blade);
    related.push(p);
  }
  while (related.length < count) {
    const next = sortedByPriceClose.find((p) => !related.includes(p));
    if (!next) break;
    related.push(next);
  }
  return related;
}
