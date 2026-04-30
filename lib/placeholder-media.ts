/**
 * Shared placeholder media pools.
 *
 * Customer-submitted photos live in /public/reviews/ — used for ReviewsBoard
 * gallery and per-review thumbnails. Other sections (video review covers,
 * BigFeatureBlocks, StoryFeature) currently use a static Shopify CDN pool as
 * placeholders until real workshop / lifestyle media exists. Replace these
 * URLs with your own assets when ready.
 */

const POOL: string[] = [
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0462.webp?v=1774369965",
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0484.webp?v=1774369965",
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0538.webp?v=1774369966",
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0477.webp?v=1774369965",
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0489.webp?v=1774369965",
  "https://cdn.shopify.com/s/files/1/0762/3465/3884/files/GD_0473.webp?v=1774369965",
];

function fill(pool: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(pool[i % pool.length]);
  return out;
}

export const CUSTOMER_REVIEW_PHOTOS: string[] = [
  ...Array.from({ length: 21 }, (_, i) => `/reviews/review-${String(i + 1).padStart(2, "0")}.jpg`),
  ...Array.from({ length: 19 }, (_, i) => `/reviews/review-${String(i + 22).padStart(2, "0")}.jpeg`),
];

export const REVIEW_GALLERY_PHOTOS: string[] = [
  CUSTOMER_REVIEW_PHOTOS[0],
  CUSTOMER_REVIEW_PHOTOS[6],
  CUSTOMER_REVIEW_PHOTOS[12],
  CUSTOMER_REVIEW_PHOTOS[18],
  CUSTOMER_REVIEW_PHOTOS[24],
  CUSTOMER_REVIEW_PHOTOS[30],
  CUSTOMER_REVIEW_PHOTOS[36],
];

export function getReviewPhotos(reviewIndex: number, count = 4): string[] {
  const start = (reviewIndex * count) % CUSTOMER_REVIEW_PHOTOS.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(CUSTOMER_REVIEW_PHOTOS[(start + i) % CUSTOMER_REVIEW_PHOTOS.length]);
  }
  return out;
}

export const REVIEW_ITEM_PHOTOS: string[] = getReviewPhotos(0, 4);

export const VIDEO_REVIEW_COVERS: string[] = fill(POOL, 5);
export const BIG_FEATURE_MEDIA: string[] = fill(POOL, 3);
export const STORY_TILES: string[] = fill(POOL, 3);
