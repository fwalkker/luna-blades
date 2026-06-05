# Takeover Notes — Obi-Wan PDP Copy Overhaul

**Date:** 2026-06-05
**Goal:** Rework the Luna Obi-Wan product page (and supporting nav/guide) toward a gift-buyer / parent audience, per the copy spec.

---

## What changed (code — live in this branch)

| File | Change |
|------|--------|
| `components/PDPHero.tsx` | Added "Comes fully assembled…" reassurance line near the price. Added version sublabels ("Most versatile" / "For serious collectors") under the variant buttons — matched on the variant **value** via regex so they survive the Shopify rename. **Replaced** the Details/Specs/Uses/Care tab card with a 4-question accordion (version / blade color / out of the box / shipping). Removed the now-dead tab code + unused `SPECS` import. |
| `components/BladeComparison.tsx` | Moved the recommendation line to the **top** with new "Buying for a kid? Get the Baselit ($129)…" copy. Updated row copy (Special blade effects, 34 effect modes, Realistic sound, Tough dueling-grade blade). Disney column → "Display prop only" + footnote. Column header "Durablade" → "Baselit". |
| `components/BigFeatureBlocks.tsx` | Rewrote all three feature rows (durability / comfort-balance / "hours of fun") and relabeled badges (Durability / Comfort / Fun). |
| `components/FAQ.tsx` | Reordered: "Can my kid use it?" is now Q1, "Is this a real metal saber…" Q2. Added 3 FAQs (mute the sound / batteries-charging / arrive-in-time). |
| `components/RelatedSabers.tsx` | Heading → "Not sure which to pick? Most gift-buyers choose the Luna Obi-Wan Kenobi Lightsaber." |
| `app/products/[handle]/page.tsx` | Cross-sell now filtered to **in-stock** sabers (falls back to all if none in stock) — kills the wall of "Sold out" tiles. |
| `components/Nav.tsx` | Added beginner link: "New to lightsabers? Start here" (mobile) / "New to lightsabers?" in accent blue (desktop). |
| `app/pages/gift-guide/page.tsx` | **New** `/pages/gift-guide` route — a zero-to-purchase walkthrough for non-fans, ending in a CTA to the Obi-Wan saber. |

> ⚠️ `app/page.tsx` and `lib/products.ts` were already modified in the working tree **before** this session (not my edits). They're included in the same commit because they were uncommitted; review them separately if unsure.

---

## TODO — Shopify admin (cannot be done from code)

This storefront uses the **read-only Storefront API**, so product data must be edited in Shopify admin. The code already anticipates the new names.

- [ ] **Title:** `Luna OBI SE` → `Luna Obi-Wan Kenobi Lightsaber`
  - ⚠️ Do **not** change the URL handle (`luna-obi-se`) — it's hardcoded in nav/links. If you must, add a Shopify URL redirect.
- [ ] **Description (first line = the on-page lead):** replace with
  *"A real metal lightsaber with a light-up blade, realistic sound effects, and a rechargeable battery — ready to light up out of the box. A replica of the saber carried by Obi-Wan Kenobi, and a birthday or holiday gift kids actually keep."*
- [ ] **Option name:** `Internals` → `Choose your version` (renders as "Choose your version:")
- [ ] **Variant values:** `DuraBlade` → `Standard (Baselit)`, `Xenopixel` → `Premium (Xenopixel)`

---

## Run / verify locally

```bash
npm run dev      # http://localhost:3000
```

Verified 200 + correct copy on `/`, `/products/luna-obi-se`, `/pages/gift-guide`.

**Gotcha:** don't start two `next dev` instances against the same `.next` dir — the second crashes on a Windows file lock and corrupts `routes-manifest.json`, which makes every route 500. Fix = stop all node dev processes, delete/move `.next`, restart. (A corrupted copy from this session is parked in `trash/.next-corrupt`, gitignored.)

---

## Open follow-ups (optional)

- Comparison table header is now "Baselit"; the `COMPARISON_ROWS` internal keys are still `durablade`/`xenopixel` (cosmetic, no user impact).
- `shopify-theme/` and `shopify-support-reply.txt` are untracked and were left out of this commit.
