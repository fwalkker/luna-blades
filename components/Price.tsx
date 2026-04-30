"use client";

import { useEffect, useState } from "react";
import { useCurrency, formatPrice } from "@/lib/currency";
import { money, moneyPrecise } from "@/lib/format";

/**
 * Price renderer that converts a USD amount to the active currency.
 *
 * Hydration safety: zustand-persisted state is only available client-side,
 * so on first server render we fall back to USD via lib/format. Once the
 * client mounts we swap to the user's selected currency.
 */
export default function Price({
  amount,
  precise,
  className,
}: {
  amount: number;
  precise?: boolean;
  className?: string;
}) {
  const code = useCurrency((s) => s.code);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const text = hydrated
    ? formatPrice(amount, code, { precise })
    : precise
      ? moneyPrecise(amount)
      : money(amount);

  return <span className={className}>{text}</span>;
}
