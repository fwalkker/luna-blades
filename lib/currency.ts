"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Currency configuration.
 *
 * Rates are USD-relative (multiply a USD amount by `rate` to get the local
 * currency amount). These are HARDCODED display approximations — for accurate
 * production pricing, configure Shopify Markets and query products with the
 * Storefront API's `@inContext(country: ...)` directive so Shopify computes
 * real prices per region.
 */
export type CurrencyCode = "USD" | "CAD" | "EUR" | "GBP" | "AUD" | "JPY";

export type CurrencyConfig = {
  code: CurrencyCode;
  symbol: string;
  /** Path to a circle-cropped SVG flag in /public/flags/ */
  flag: string;
  rate: number;
  /** Decimal places to render (JPY has 0). */
  digits: 0 | 2;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", flag: "/flags/us.svg", rate: 1, digits: 2 },
  CAD: { code: "CAD", symbol: "$", flag: "/flags/ca.svg", rate: 1.37, digits: 2 },
  EUR: { code: "EUR", symbol: "€", flag: "/flags/eu.svg", rate: 0.92, digits: 2 },
  GBP: { code: "GBP", symbol: "£", flag: "/flags/gb.svg", rate: 0.79, digits: 2 },
  AUD: { code: "AUD", symbol: "$", flag: "/flags/au.svg", rate: 1.52, digits: 2 },
  JPY: { code: "JPY", symbol: "¥", flag: "/flags/jp.svg", rate: 149, digits: 0 },
};

type CurrencyState = {
  code: CurrencyCode;
  setCode: (code: CurrencyCode) => void;
};

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      code: "USD",
      setCode: (code) => set({ code }),
    }),
    { name: "luna-currency", version: 1 }
  )
);

/**
 * Convert a USD amount to the given currency and format it for display.
 * Uses Intl.NumberFormat so symbols and grouping match locale conventions.
 */
export function formatPrice(
  usdAmount: number,
  code: CurrencyCode,
  opts: { precise?: boolean } = {}
): string {
  const c = CURRENCIES[code];
  const converted = usdAmount * c.rate;
  const digits = opts.precise ? c.digits : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c.code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(converted);
}
