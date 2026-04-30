const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-10";

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

type GqlResponse<T> = { data?: T; errors?: { message: string }[] };

type ShopifyFetchOpts = {
  tags?: string[];
  revalidate?: number | false;
  cache?: RequestCache;
};

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: ShopifyFetchOpts = {}
): Promise<T> {
  if (!shopifyConfigured) {
    throw new Error(
      "Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.local."
    );
  }

  const init: RequestInit & { next?: { tags?: string[]; revalidate?: number | false } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (opts.cache) {
    init.cache = opts.cache;
  } else {
    init.next = {
      tags: opts.tags,
      revalidate: opts.revalidate ?? 86400,
    };
  }

  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, init);
  if (!res.ok) throw new Error(`Shopify API ${res.status}`);
  const json = (await res.json()) as GqlResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  return json.data as T;
}

/* ===================== Queries ===================== */

export const Q_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      tags
      productType
      availableForSale
      featuredImage { url altText width height }
      images(first: 12) {
        edges { node { url altText width height } }
      }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      options { id name values }
    }
  }
`;

export const Q_PRODUCTS_LIST = /* GraphQL */ `
  query ProductsList($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          productType
          availableForSale
          featuredImage { url altText width height }
          images(first: 4) { edges { node { url altText width height } } }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) {
            edges { node { id availableForSale } }
          }
        }
      }
    }
  }
`;

export const Q_PRODUCT_VARIANT_BY_HANDLE = /* GraphQL */ `
  query ProductVariant($handle: String!) {
    product(handle: $handle) {
      id
      title
      variants(first: 1) {
        edges { node { id title price { amount currencyCode } } }
      }
    }
  }
`;

/* ===================== Mutations ===================== */

export const M_CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl totalQuantity }
      userErrors { message }
    }
  }
`;

export type CartLineInput = { merchandiseId: string; quantity: number };

/* ===================== Types ===================== */

type Money = { amount: string; currencyCode: string };
type ImgEdge = { node: { url: string; altText: string | null; width?: number; height?: number } };

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  productType: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: ImgEdge[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  variants: { edges: { node: ShopifyVariant }[] };
  options: { id: string; name: string; values: string[] }[];
};

export type ShopifyProductSummary = {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  productType: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: ImgEdge[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  variants: { edges: { node: { id: string; availableForSale: boolean } }[] };
};
