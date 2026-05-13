import { notFound } from "next/navigation";
import { getAllProducts, getProduct, pickRelated } from "@/lib/products";
import PDPHero from "@/components/PDPHero";
import FeatureTriplet from "@/components/FeatureTriplet";
import BladeComparison from "@/components/BladeComparison";
import VideoReviews from "@/components/VideoReviews";
import BigFeatureBlocks from "@/components/BigFeatureBlocks";
import ReviewsBoard from "@/components/ReviewsBoard";
import FAQ from "@/components/FAQ";
import RelatedSabers from "@/components/RelatedSabers";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  return {
    title: `${product.title} — Luna Blades`,
    description: product.story,
    openGraph: {
      title: product.title,
      description: product.tagline,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([getProduct(handle), getAllProducts()]);
  if (!product) notFound();

  const related = pickRelated(allProducts, product.handle, 4);

  return (
    <article>
      <PDPHero product={product} />
      <BladeComparison />
      <VideoReviews />
      <FeatureTriplet />
      <BigFeatureBlocks />
      <ReviewsBoard />
      <FAQ />
      <RelatedSabers related={related} />
    </article>
  );
}
