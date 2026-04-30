/**
 * Quantity-based bundle discount tiers shown across the site.
 *
 * IMPORTANT: these labels and amounts are FRONTEND DISPLAY ONLY. The actual
 * money math at checkout comes from matching Shopify Automatic Discounts
 * (Discounts → Create automatic discount → "Amount off products"). Keep these
 * values in sync with whatever's configured in Shopify admin.
 */

export type QtyTier = {
  qty: number;
  sublabel: string;
  discountAmount: number;
  freeShipping: boolean;
};

export const QTY_TIERS: readonly QtyTier[] = [
  { qty: 1, sublabel: "Saber",  discountAmount: 0,   freeShipping: false },
  { qty: 2, sublabel: "Sabers", discountAmount: 40,  freeShipping: true },
  { qty: 3, sublabel: "Sabers", discountAmount: 80,  freeShipping: true },
  { qty: 4, sublabel: "Sabers", discountAmount: 160, freeShipping: true },
] as const;

/**
 * Returns the dollar-amount discount that applies for a given saber count.
 * Picks the largest tier whose threshold is ≤ qty so 5+ sabers still get
 * the top tier's discount.
 */
export function getBundleDiscount(qty: number): number {
  let best = 0;
  for (const tier of QTY_TIERS) {
    if (tier.qty <= qty && tier.discountAmount > best) {
      best = tier.discountAmount;
    }
  }
  return best;
}
